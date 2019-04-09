#coding=utf-8
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy as lazy_

from django import template
from django.utils.timezone import is_naive, make_aware, utc, is_aware

register = template.Library()

@register.filter
def name_mac(value):
    return value[-6:]


@register.filter
def date_filter(value):
    try:
        if is_naive(value):
            value = make_aware(value, utc)
        elif is_aware(value):
            pass
    except Exception as e:
        print e
    return value

@register.filter
def sec_to_hour(value):
    try:
        if value != '' and value != 0:
            a = int(value)
            b = a/(24*3600)
            c = a%(24*3600)/3600
            d = a%(24*3600)%3600/60
            e = a%(24*3600)%3600%60
            if b == 0 and c == 0 and d == 0:
                return "%ds"%(e)
            elif b == 0 and c == 0:
                return "%dm %ds"%(d,e)
            elif b == 0:
                return "%dh %dm %ds"%(c,d,e)
            else:
                return "%dd %dh %dm %ds"%(b,c,d,e)
        else:
            return value
    except Exception as e:
        print e
        return value



@register.filter
def user_type_filter(value):
    ut = {
        0:_(u"网站管理员"),
        6:_(u"超级管理员"),
        5:_(u"管理员"),
        4:_(u"本地用户"),
        3:_(u"超级用户"),
        2:_(u"管理用户"),
        1:_(u"普通用户"),
    }
    return  ut[value]


@register.filter
def locatation_status(value):
    lgs = {
        0:_(u"未分组"),
        1:_(u"已分组"),
        2:_(u"待同意"),
        3:_(u"待同意"),
        4:_(u"待同意"),
        5:_(u"待同意"),
        6:_(u"未分组"),
    }
    return  lgs[value]

@register.filter
def register_status(value):
    rgs = {
        0:_(u"未分组"),
        1:_(u"已分组"),
        2:_(u"申请成为普通用户"),
        3:_(u"申请成为管理员"),
        4:_(u"邀请成为普通用户"),
        5:_(u"邀请成为管理员"),
        6:_(u"已拒绝"),
    }
    return  rgs[value]
