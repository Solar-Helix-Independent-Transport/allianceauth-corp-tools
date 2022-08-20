import colorsys
import random

from django import template

register = template.Library()


@register.simple_tag
def random_bright_colour():
    h, s, l = random.random(), 1.0, 0.4
    r, g, b = [int(256*i) for i in colorsys.hls_to_rgb(h, l, s)]
    return '#%02X%02X%02X' % (r, g, b)
