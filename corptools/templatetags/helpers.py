from django import template
from django.template.defaultfilters import stringfilter
from django.template.defaulttags import register
from django.utils.safestring import mark_safe

from .. import app_settings as app_sett


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
    except Exception:
        return slugged


@register.simple_tag()
def app_setting():
    return app_sett


@register.simple_tag()
def app_name():
    return app_sett.CORPTOOLS_APP_NAME


@register.filter(name='level')
def skill_level(active, trained):
    alt_text = "Level %d" % active
    omega_dif = trained - active
    full = '<span class="fas fa-circle"></span> '
    alpha = '<span class="fas fa-circle text-danger"></span> '
    empty = '<span class="far fa-circle"></span> '

    return mark_safe(f'<div role="text" aria-label="{alt_text}">{full * active}{alpha * omega_dif}{empty * (5-(active + omega_dif))}</div>')


@register.filter()
def standing_span(standing):
    if standing > 0:
        if standing <= 5:
            return mark_safe(f'<span class="label label-info">{standing}</span>')
        else:
            return mark_safe(f'<span class="label label-primary">{standing}</span>')
    elif standing < 0:
        if standing >= -5:
            return mark_safe(f'<spam class="label label-warning">{standing}</span>')
        else:
            return mark_safe(f'<span class="label label-danger">{standing}</span>')
    else:
        return mark_safe(f'<span class="label label-default">{standing}</span>')


@register.filter
@stringfilter
def template_exists(value):
    try:
        template.loader.get_template(value)
        return True
    except template.TemplateDoesNotExist:
        return False
