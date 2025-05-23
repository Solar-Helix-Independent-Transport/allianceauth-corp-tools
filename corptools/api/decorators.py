from functools import wraps


def cache_page_data(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        out = f(*args, **kwargs)
        return out
    return decorator
