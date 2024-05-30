import colorsys
import random

from django import template

register = template.Library()


@register.simple_tag
def random_bright_colour():
    _h, _s, _l = random.random(), 1.0, 0.4
    r, g, b = (int(256 * i) for i in colorsys.hls_to_rgb(_h, _l, _s))
    return f'#{r:02X}{g:02X}{b:02X}'
