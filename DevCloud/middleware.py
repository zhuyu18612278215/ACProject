#coding=utf-8

import pytz

from django.utils import timezone
from system.models import Setting

class TimezoneMiddleware(object):
    def process_request(self, request):
        djangoTimezone = request.session.get('djangoTimezone')
        timezoneCode = 'Asia/Hong_Kong'
        currentTimeCode = timezone.get_current_timezone_name()
        if Setting.objects.filter(SIGN = 1).exists():
            django_settings = Setting.objects.get(SIGN = 1)
            timezoneCode = django_settings.timezoneCode
        if not ((djangoTimezone) and (djangoTimezone == timezoneCode == currentTimeCode)):
          request.session['djangoTimezone'] = timezoneCode
          timezone.activate(pytz.timezone(timezoneCode))
        # print timezoneCode
        # print djangoTimezone
        # print timezone.get_current_timezone_name()
