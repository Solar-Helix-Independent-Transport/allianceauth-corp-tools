# Standard Library
import datetime
from unittest.mock import MagicMock, call, patch

# Third Party
from aiopenapi3.errors import RequestError
from celery import shared_task
from celery.exceptions import Retry
from celery_once import AlreadyQueued
from httpx import RequestError as httpx_RequestError

# Django
from django.core.cache import cache
from django.db.utils import IntegrityError
from django.test import TestCase
from django.utils import timezone

# Alliance Auth
from esi.exceptions import ESIBucketLimitException, HTTPClientError, HTTPServerError

# AA Example App
from corptools.models import EveName
from corptools.tasks.rate_limiting import TaskBucketLimitException, TaskRateLimitBucket
from corptools.tasks.utils import (
    chunks,
    clear_error_flag,
    enqueue_next_task,
    esi_error_retry,
    get_error_count_flag,
    get_error_flag,
    no_fail_chain,
    rate_limited_task,
    set_error_flag,
)


def _mock_task(retries=0):
    task = MagicMock()
    task.request.retries = retries
    task.retry.side_effect = Retry()
    return task


@shared_task(bind=True, name="corptools.tests.integrity_error_task")
@esi_error_retry
def _integrity_error_task(self):
    raise IntegrityError("fk constraint")


@shared_task(bind=True, name="corptools.tests.integrity_error_task_force_refresh")
@esi_error_retry
def _integrity_error_task_with_force_refresh(self, force_refresh=False):
    raise IntegrityError("fk constraint")


class TestCacheFlagHelpers(TestCase):
    def setUp(self):
        cache.clear()

    def test_get_error_count_flag_returns_false_when_not_set(self):
        self.assertFalse(get_error_count_flag())

    def test_set_error_flag_puts_future_datetime_in_cache(self):
        set_error_flag(60)
        flag = get_error_flag()
        self.assertGreater(flag, timezone.now())

    def test_clear_error_flag_removes_the_entry(self):
        set_error_flag(60)
        clear_error_flag()
        # After clearing, get_error_flag() returns timezone.now() (default),
        # which is not > timezone.now(), so the guard won't fire.
        flag = get_error_flag()
        self.assertLessEqual(flag, timezone.now())


class TestChunks(TestCase):
    def test_list_split_into_correct_chunks(self):
        result = list(chunks([1, 2, 3, 4, 5], 2))
        self.assertEqual(result, [[1, 2], [3, 4], [5]])

    def test_empty_list_returns_nothing(self):
        result = list(chunks([], 2))
        self.assertEqual(result, [])

    def test_chunk_size_larger_than_list_returns_one_chunk(self):
        result = list(chunks([1, 2, 3], 10))
        self.assertEqual(result, [[1, 2, 3]])

    def test_queryset_chunked(self):
        EveName.objects.create(eve_id=1, name="A", category="character")
        EveName.objects.create(eve_id=2, name="B", category="character")
        EveName.objects.create(eve_id=3, name="C", category="character")
        qs = EveName.objects.all()
        result = list(chunks(qs, 2))
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0].count(), 2)
        self.assertEqual(result[1].count(), 1)


class TestEnqueueNextTask(TestCase):
    @patch("corptools.tasks.utils.signature")
    def test_enqueues_first_task_and_attaches_remaining_chain(self, mock_sig_cls):
        mock_sig = MagicMock()
        mock_sig.kwargs = {}
        mock_sig_cls.return_value = mock_sig

        enqueue_next_task(["task1", "task2", "task3"])

        mock_sig_cls.assert_called_once_with("task1")
        mock_sig.apply_async.assert_called_once()
        # remaining chain is passed via kwargs update
        self.assertEqual(mock_sig.kwargs["chain"], ["task2", "task3"])

    @patch("corptools.tasks.utils.signature")
    def test_skips_already_queued_and_enqueues_next(self, mock_sig_cls):
        sig1 = MagicMock()
        sig1.kwargs = {}
        sig1.apply_async.side_effect = AlreadyQueued(10)

        sig2 = MagicMock()
        sig2.kwargs = {}

        mock_sig_cls.side_effect = [sig1, sig2]

        enqueue_next_task(["task1", "task2"])

        self.assertEqual(sig1.apply_async.call_count, 1)
        self.assertEqual(sig2.apply_async.call_count, 1)

    @patch("corptools.tasks.utils.signature")
    def test_empty_chain_does_nothing(self, mock_sig_cls):
        enqueue_next_task([])
        mock_sig_cls.assert_not_called()


class TestEsiErrorRetry(TestCase):
    def setUp(self):
        cache.clear()

    def test_success_path_returns_result(self):
        @esi_error_retry
        def my_func(self):
            return "ok"

        result = my_func(_mock_task(), )
        self.assertEqual(result, "ok")

    def test_preserves_function_name(self):
        @esi_error_retry
        def named_func(self):
            pass

        self.assertEqual(named_func.__name__, "named_func")

    @patch("corptools.tasks.utils.get_error_flag")
    def test_error_flag_active_causes_retry(self, mock_flag):
        mock_flag.return_value = timezone.now() + datetime.timedelta(seconds=60)

        @esi_error_retry
        def my_func(self):
            return "ok"

        task = _mock_task()
        with self.assertRaises(Retry):
            my_func(task)
        task.retry.assert_called_with(countdown=61)

    def test_esi_bucket_limit_retries_with_reset_value(self):
        exc = ESIBucketLimitException(MagicMock(), reset=30)

        @esi_error_retry
        def my_func(self):
            raise exc

        task = _mock_task()
        with self.assertRaises(Retry):
            my_func(task)
        task.retry.assert_called_with(countdown=30)

    def test_http_420_sets_error_flag_and_retries(self):
        @esi_error_retry
        def my_func(self):
            raise HTTPClientError(420, {}, MagicMock())

        task = _mock_task()
        with self.assertRaises(Retry):
            my_func(task)
        task.retry.assert_called_with(countdown=61)
        # flag should now be in the future
        self.assertGreater(get_error_flag(), timezone.now())

    def test_http_429_sets_error_flag_and_retries(self):
        @esi_error_retry
        def my_func(self):
            raise HTTPClientError(429, {}, MagicMock())

        task = _mock_task()
        with self.assertRaises(Retry):
            my_func(task)
        task.retry.assert_called_with(countdown=61)

    def test_http_4xx_non_rate_limit_reraises_without_retry(self):
        @esi_error_retry
        def my_func(self):
            raise HTTPClientError(404, {}, MagicMock())

        task = _mock_task()
        with self.assertRaises(HTTPClientError):
            my_func(task)
        task.retry.assert_not_called()

    def test_http_server_error_non_rate_limit_reraises_without_retry(self):
        @esi_error_retry
        def my_func(self):
            raise HTTPServerError(500, {}, MagicMock())

        task = _mock_task()
        with self.assertRaises(HTTPServerError):
            my_func(task)
        task.retry.assert_not_called()

    def test_aiopenapi_request_error_retries_after_300s(self):
        @esi_error_retry
        def my_func(self):
            raise RequestError(None, None, None, None)

        task = _mock_task()
        with self.assertRaises(Retry):
            my_func(task)
        task.retry.assert_called_with(countdown=300)

    def test_httpx_request_error_retries_after_300s(self):
        @esi_error_retry
        def my_func(self):
            raise httpx_RequestError("connection failed")

        task = _mock_task()
        with self.assertRaises(Retry):
            my_func(task)
        task.retry.assert_called_with(countdown=300)

    def test_os_error_reraises_without_retry(self):
        @esi_error_retry
        def my_func(self):
            raise OSError("bravado error")

        task = _mock_task()
        with self.assertRaises(OSError):
            my_func(task)
        task.retry.assert_not_called()

    @patch("corptools.tasks.utils.check_for_sde_updates")
    def test_integrity_error_retries_when_under_limit(self, mock_sde):
        @esi_error_retry
        def my_func(self):
            raise IntegrityError("missing SDE row")

        task = _mock_task(retries=0)
        with self.assertRaises(Retry):
            my_func(task)
        mock_sde.apply_async.assert_called_once_with(priority=1)
        task.retry.assert_called_with(countdown=90)

    @patch("corptools.tasks.utils.check_for_sde_updates")
    def test_integrity_error_retries_with_force_refresh_when_param_present(self, mock_sde):
        @esi_error_retry
        def my_func(self, force_refresh=False):
            raise IntegrityError("missing SDE row")

        task = _mock_task(retries=0)
        with self.assertRaises(Retry):
            my_func(task)
        task.retry.assert_called_with(
            countdown=90, kwargs={"force_refresh": True})

    @patch("corptools.tasks.utils.check_for_sde_updates")
    def test_integrity_error_reraises_when_retry_limit_reached(self, mock_sde):
        @esi_error_retry
        def my_func(self):
            raise IntegrityError("missing SDE row")

        task = _mock_task(retries=3)
        with self.assertRaises(IntegrityError):
            my_func(task)
        task.retry.assert_not_called()


class TestNoFailChain(TestCase):
    @patch("corptools.tasks.utils.enqueue_next_task")
    def test_success_enqueues_chain_and_returns_result(self, mock_enqueue):
        @no_fail_chain
        def my_func(**kwargs):
            return "done"

        result = my_func(chain=["t1", "t2"])
        self.assertEqual(result, "done")
        mock_enqueue.assert_called_once_with(["t1", "t2"])

    @patch("corptools.tasks.utils.enqueue_next_task")
    def test_exception_enqueues_chain_then_reraises(self, mock_enqueue):
        @no_fail_chain
        def my_func(**kwargs):
            raise ValueError("oops")

        with self.assertRaises(ValueError):
            my_func(chain=["t1"])
        mock_enqueue.assert_called_once_with(["t1"])

    @patch("corptools.tasks.utils.enqueue_next_task")
    def test_retry_exception_does_not_enqueue_chain(self, mock_enqueue):
        @no_fail_chain
        def my_func(**kwargs):
            raise Retry()

        with self.assertRaises(Retry):
            my_func(chain=["t1"])
        mock_enqueue.assert_not_called()

    @patch("corptools.tasks.utils.enqueue_next_task")
    def test_no_chain_kwarg_does_not_fail(self, mock_enqueue):
        @no_fail_chain
        def my_func(**kwargs):
            return "ok"

        result = my_func()
        self.assertEqual(result, "ok")
        mock_enqueue.assert_called_once_with([])

    def test_preserves_function_name(self):
        @no_fail_chain
        def named_func(**kwargs):
            pass

        self.assertEqual(named_func.__name__, "named_func")


def _mock_celery_task(name="corptools.my_task", retries=2):
    task = MagicMock()
    task.name = name
    task.request.retries = retries
    task.retry.return_value = "retried"
    return task


class TestRateLimitedTask(TestCase):
    @patch("corptools.tasks.utils.rate_limiter")
    def test_success_path_calls_func_and_returns_result(self, mock_limiter):
        mock_limiter.check_bucket.return_value = None  # no exception

        @rate_limited_task(rate="10/m")
        def my_task(self, corp_id):
            return f"done-{corp_id}"

        task = _mock_celery_task()
        result = my_task(task, 42)
        self.assertEqual(result, "done-42")

    @patch("corptools.tasks.utils.rate_limiter")
    def test_rate_limited_decrements_retries_and_calls_task_retry(self, mock_limiter):
        bucket = TaskRateLimitBucket("key", 10, 60)
        mock_limiter.check_bucket.side_effect = TaskBucketLimitException(
            bucket, reset=15)

        @rate_limited_task(rate="10/m")
        def my_task(self, corp_id):
            return "done"

        task = _mock_celery_task(retries=3)
        result = my_task(task, 99)

        self.assertEqual(result, "retried")
        self.assertEqual(task.request.retries, 2)  # decremented by 1
        task.retry.assert_called_once_with(countdown=15)

    @patch("corptools.tasks.utils.rate_limiter")
    def test_rate_limited_uses_reset_from_exception(self, mock_limiter):
        bucket = TaskRateLimitBucket("key", 5, 30)
        mock_limiter.check_bucket.side_effect = TaskBucketLimitException(
            bucket, reset=7)

        @rate_limited_task(rate="5/30s")
        def my_task(self):
            return "done"

        task = _mock_celery_task()
        my_task(task)
        task.retry.assert_called_once_with(countdown=7)

    @patch("corptools.tasks.utils.rate_limiter")
    def test_keys_none_uses_full_task_signature_for_bucket_key(self, mock_limiter):
        mock_limiter.check_bucket.return_value = None

        @rate_limited_task(rate="10/m", keys=None)
        def my_task(self, corp_id, char_id):
            return "done"

        task = _mock_celery_task(name="corptools.my_task")
        my_task(task, 1, 2)

        called_bucket = mock_limiter.check_bucket.call_args[0][0]
        # key includes task name only (no restriction)
        self.assertIn("corptools.my_task", called_bucket.slug)

    @patch("corptools.tasks.utils.rate_limiter")
    def test_keys_list_restricts_bucket_key_to_named_args(self, mock_limiter):
        mock_limiter.check_bucket.return_value = None

        @rate_limited_task(rate="10/m", keys=["corp_id"])
        def my_task(self, corp_id, char_id):
            return "done"

        task = _mock_celery_task(name="corptools.my_task")
        my_task(task, 10, 99)

        called_bucket = mock_limiter.check_bucket.call_args[0][0]
        self.assertIn("corp_id-10", called_bucket.slug)
        self.assertNotIn("char_id", called_bucket.slug)

    @patch("corptools.tasks.utils.rate_limiter")
    def test_preserves_function_name(self, mock_limiter):
        @rate_limited_task(rate="10/m")
        def named_task(self):
            pass

        self.assertEqual(named_task.__name__, "named_task")


class TestEsiErrorRetryIntegrityErrorRealTask(TestCase):
    """
    Regression tests using a real bound Celery task so self.request.retries
    is a genuine Celery attribute. The old bug accessed self.retries, which
    doesn't exist on real tasks and raises AttributeError.
    """

    @patch("corptools.tasks.utils.check_for_sde_updates")
    def test_integrity_error_retries_then_raises(self, mock_sde):
        # In eager mode retry() re-runs the task immediately with retries incremented.
        # Our guard stops at retries==3, so the task runs 4 times total and the
        # final IntegrityError propagates as the task result.
        result = _integrity_error_task.apply()
        self.assertTrue(result.failed())
        self.assertIsInstance(result.result, IntegrityError)
        self.assertEqual(mock_sde.apply_async.call_count, 4)

    @patch("corptools.tasks.utils.check_for_sde_updates")
    def test_integrity_error_passes_force_refresh_on_retry(self, mock_sde):
        result = _integrity_error_task_with_force_refresh.apply()
        self.assertTrue(result.failed())
        self.assertIsInstance(result.result, IntegrityError)
        # Every retry call should have included force_refresh=True in kwargs.
        for c in mock_sde.apply_async.call_args_list:
            self.assertEqual(c, call(priority=1))
