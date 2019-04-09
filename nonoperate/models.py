#coding=utf-8
from django.db import models
from django.utils import timezone
from device.models import Device,Probe_group
from account.models import Account_Group
from system.models import Setting

# Create your models here.



class NONOPERATE_event(models.Model):
    """
    Description: Model Description
    """
    event_time = models.DateTimeField(u'event_time',blank=True,null=True,default = timezone.now)
    event = models.CharField(u'event',max_length = 128,default  = '',blank = True,null = True)
    msg = models.CharField(u'msg',max_length = 255,default  = '',blank = True,null = True)
    admin_username = models.CharField(u'admin_username',max_length = 128,default  = '',blank = True,null = True)
    ap_mac = models.CharField(u'ap_mac',max_length = 128,default  = '',blank = True,null = True)


    def __unicode__(self):
        return self.event
