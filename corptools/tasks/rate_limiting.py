# Third Party
import six
from redis.exceptions import LockNotOwnedError

# Django
from django.core.cache import cache

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from esi.rate_limiting import interval_to_seconds

logger = get_extension_logger(__name__)


def force_string(kwargs):
    if isinstance(kwargs, dict):
        return {
            force_string(key): force_string(value) for key, value in six.iteritems(kwargs)
        }
    elif isinstance(kwargs, list):
        return [force_string(element) for element in kwargs]
    return kwargs


def kwargs_to_list(kwargs):
    """
    Turns {'a': 1, 'b': 2} into ["a-1", "b-2"]
    """
    kwargs_list = []
    # Kwargs are sorted in alphabetic order by their keys.
    # Taken from http://www.saltycrane.com/blog/2007/09/how-to-sort-python-dictionary-by-keys/
    for k, v in sorted(six.iteritems(kwargs), key=lambda kv: str(kv[0])):
        kwargs_list.append(str(k) + '-' + str(force_string(v)))
    return kwargs_list


def task_bucket_slug_key(task, kwargs, restrict_to=None):
    """
    Turns a list the name of the task, the kwargs and allowed keys
    into a redis key.
    """
    keys: list[str] = [str(task)]
    if restrict_to is not None:
        restrict_kwargs = {key: kwargs[key] for key in restrict_to}
        keys += kwargs_to_list(restrict_kwargs)
    key = "_".join(keys)
    return key


def limit_to_rate(rate_limit):
    """convert things like 100/15m or 10/s to a delay in seconds"""
    lim = rate_limit.split("/")
    if len(lim[1]) < 2:
        secs = interval_to_seconds(f"1{lim[1]}")
    else:
        secs = interval_to_seconds(lim[1])
    return secs/int(lim[0])


class TaskBucketLimitException(Exception):
    def __init__(self, bucket, reset):
        self.bucket = bucket
        self.reset = reset
        super().__init__(
            f"Task Bucket Limit Exceeded: {bucket} - Retry after {reset} seconds")


class TaskRateLimitBucket:
    def __init__(self, slug, limit, window):
        self.slug = slug
        self.limit = limit
        self.window = window
        self.ttl = window/limit

    @classmethod
    def from_rate(cls, slug, rate_string):
        limit, window = rate_string.split("/")
        window_seconds = interval_to_seconds(window)
        return cls(slug, int(limit), window_seconds)

    def __str__(self):
        return f"Rate Limit: {self.slug} - {self.limit} in {self.window}Seconds"


class TaskRateLimiter:
    def _slug_to_key(self, slug) -> str:
        return f"task:bucket:{slug}"

    def _slug_to_lock(self, slug) -> str:
        return f"lock:bucket:{slug}"

    def get_bucket(self, bucket: TaskRateLimitBucket) -> int:
        return cache.ttl(
            self._slug_to_key(bucket.slug)
        )

    def set_bucket(self, bucket: TaskRateLimitBucket) -> None:
        cache.set(
            self._slug_to_key(bucket.slug),
            bucket.slug,
            timeout=bucket.ttl
        )

    def check_bucket(self, bucket: TaskRateLimitBucket) -> None:
        try:
            with cache.lock(self._slug_to_lock(bucket.slug), timeout=bucket.ttl):
                timeout = self.get_bucket(bucket)
                if timeout > 0:
                    raise TaskBucketLimitException(bucket, timeout)
                self.set_bucket(bucket)
        except LockNotOwnedError:
            # took longer than lock time this is fine.
            pass
        return


rate_limiter = TaskRateLimiter()
