import time

from bravado.exception import HTTPNotModified

from django.core.cache import cache

from allianceauth.services.hooks import get_extension_logger

MAX_ETAG_LIFE = 60 * 60 * 24 * 7  # 7 Days

logger = get_extension_logger(__name__)


class NotModifiedError(Exception):
    pass


def get_etag_key(operation):
    return "etag-" + operation._cache_key()


def get_etag_header(operation):
    return cache.get(get_etag_key(operation), False)


def del_etag_header(operation):
    return cache.delete(get_etag_key(operation), False)


def inject_etag_header(operation):
    etag = get_etag_header(operation)
    logger.debug(
        f"ETag: get_etag {operation.operation.operation_id} - {stringify_params(operation)} - etag:{etag}")
    if etag:
        operation.future.request.headers["If-None-Match"] = etag


def rem_etag_header(operation):
    logger.debug(
        f"ETag: rem_etag {operation.operation.operation_id} - {stringify_params(operation)}")
    if "If-None-Match" in operation.future.request.headers:
        del operation.future.request.headers["If-None-Match"]


def set_etag_header(operation, headers):
    etag_key = get_etag_key(operation)
    etag = headers.headers.get('ETag', None)
    if etag is not None:
        result = cache.set(etag_key, etag, MAX_ETAG_LIFE)
        logger.debug(
            f"ETag: set_etag {operation.operation.operation_id} - {stringify_params(operation)} - etag:{etag} - stored:{result}")


def stringify_params(operation):
    out = []
    for p, v in operation.future.request.params.items():
        out.append(f"{p}: {v}")
    return ", ".join(out)


def etag_results(operation, token, force_refresh=False, disable_verification=False):
    _start_tm = time.perf_counter()
    results = list()
    # override to always get the raw response for expiry header

    operation.request_config.also_return_response = True

    try:
        logger.debug(
            f"ETAG Validate Pre: {operation.operation.swagger_spec.config['validate_responses']}")
    except Exception:
        logger.warning(
            "Pre operation.operation.swagger_spec.config['validate_responses'] not checkable")

    if disable_verification:
        operation.operation.swagger_spec.config["validate_responses"] = False
    else:
        operation.operation.swagger_spec.config["validate_responses"] = True

    try:
        logger.debug(
            f"ETAG Validate Override: {operation.operation.swagger_spec.config['validate_responses']}")
    except Exception:
        logger.warning(
            "Override operation.operation.swagger_spec.config['validate_responses'] not checkable")

    if token:
        operation.future.request.headers["Authorization"] = "Bearer " + \
            token.valid_access_token()

    # Global try to enforce validation reset after we are done regardless of outcome here.
    try:
        if "page" in operation.operation.params:
            logger.debug(
                f"ETag: Pages Start {operation.operation.operation_id} - {stringify_params(operation)}")
            current_page = 1
            total_pages = 1
            etags_incomplete = False

            # loop all pages and add data to output array
            while current_page <= total_pages:
                _pg_tm = time.perf_counter()
                operation.future.request.params["page"] = current_page
                # will use cache if applicable
                try:
                    if not etags_incomplete and not force_refresh:
                        logger.debug(
                            f"ETag: Injecting Header {operation.operation.operation_id} - {stringify_params(operation)}")
                        inject_etag_header(operation)
                    else:
                        logger.debug(
                            f"ETag: Removing Header {operation.operation.operation_id} F:{force_refresh} Ei:{etags_incomplete} - {stringify_params(operation)}")
                        rem_etag_header(operation)

                    result, headers = operation.result()
                    total_pages = int(headers.headers['X-Pages'])
                    logger.warning(get_etag_header(operation))
                    logger.warning(headers.headers.get('ETag'))

                    if get_etag_header(operation) == headers.headers.get('ETag') and not force_refresh and not etags_incomplete:
                        # if django esi is returning our cache check it manualy.
                        raise NotModifiedError()

                    if force_refresh:
                        logger.debug(
                            f"ETag: Removing Etag {operation.operation.operation_id} F:{force_refresh} - {stringify_params(operation)}")
                        del_etag_header(operation)
                    else:
                        logger.debug(
                            f"ETag: Saving Etag {operation.operation.operation_id} F:{force_refresh} - {stringify_params(operation)}")
                        set_etag_header(operation, headers)

                    # append to results list to be seamless to the client
                    results += result
                    current_page += 1

                    if not etags_incomplete and not force_refresh:
                        logger.debug(
                            f"ETag: No Etag {operation.operation.operation_id} - {stringify_params(operation)}")
                        current_page = 1  # reset to page 1 and fetch everything
                        results = list()
                        etags_incomplete = True

                except (HTTPNotModified) as e:  # etag is match from ESI
                    logger.debug(
                        f"ETag: HTTPNotModified Hit ETag {operation.operation.operation_id} Ei:{etags_incomplete} - {stringify_params(operation)} - P:{e.response.headers['X-Pages']}")
                    total_pages = int(e.response.headers['X-Pages'])

                    if not etags_incomplete:
                        current_page += 1
                    else:
                        current_page = 1  # reset to page 1 and fetch everything, we should not get here
                        results = list()

                except NotModifiedError:  # etag is match in cache
                    logger.debug(
                        f"ESI_TIME: PAGE {time.perf_counter() - _pg_tm} {operation.operation.operation_id} {stringify_params(operation)}")
                    total_pages = int(headers.headers['X-Pages'])

                    if not etags_incomplete:
                        current_page += 1
                    else:
                        current_page = 1  # reset to page 1 and fetch everything, we should not get here
                        results = list()

                logger.debug(
                    f"ETag: No Etag {operation.operation.operation_id} - {stringify_params(operation)}")

            if not etags_incomplete and not force_refresh:
                raise NotModifiedError()

        else:  # it doesn't so just return as usual
            if not force_refresh:
                inject_etag_header(operation)
            try:
                results, headers = operation.result()
            except HTTPNotModified as e:
                logger.debug(
                    f"ETag: HTTPNotModified Hit ETag {operation.operation.operation_id} - {stringify_params(operation)}")
                set_etag_header(operation, e.response)
                raise NotModifiedError()

            if get_etag_header(operation) == headers.headers.get('ETag') and not force_refresh:
                # etag is match in cache
                logger.debug(
                    f"ETag: result Cache Hit ETag {operation.operation.operation_id} - {stringify_params(operation)}")
                set_etag_header(operation, headers)
                raise NotModifiedError()

            if force_refresh:
                logger.debug(
                    f"ETag: Removing Etag {operation.operation.operation_id} F:{force_refresh} - {stringify_params(operation)}")
                del_etag_header(operation)
            else:
                logger.debug(
                    f"ETag: Saving Etag {operation.operation.operation_id} F:{force_refresh} - {stringify_params(operation)}")
                set_etag_header(operation, headers)
    except Exception:
        # Re-raise everything
        raise
    finally:
        # reset the validation.
        if not disable_verification:
            operation.operation.swagger_spec.config["validate_responses"] = True
        try:
            logger.debug(
                f"ETAG Validate Post: {operation.operation.swagger_spec.config['validate_responses']}")
        except Exception:
            logger.warning(
                "Post operation.operation.swagger_spec.config['validate_responses'] not checkable")

    logger.debug(
        f"ESI_TIME: OVERALL {time.perf_counter() - _start_tm} {operation.operation.operation_id} {stringify_params(operation)}")
    return results
