from functools import wraps


def cache_page_data(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        print(f)
        out = f(*args, **kwargs)
        print(out)
        return out
    return decorator
