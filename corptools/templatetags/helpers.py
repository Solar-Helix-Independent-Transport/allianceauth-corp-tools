from django.utils.safestring import mark_safe
from django.template.defaulttags import register

@register.filter(name='addclass')
def addclass(value, arg):
    return value.as_widget(attrs={'class': arg})

@register.filter(name='subtract')
def subtract(value, arg):
    return value - arg

@register.filter(name='deslug')
def deslug(slugged):
    try:
        return slugged.replace('_', ' ')
    except:
        return slugged

