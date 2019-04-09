#coding=utf-8
from django.db import models
from django.utils import timezone

# Create your models here.
class AuditDevice(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    name = models.CharField(u'名称',max_length = 128,default = '',blank=True,null=True)
    model = models.CharField(u'oem型号',max_length = 64,default = '',blank=True,null=True)
    own_model = models.CharField(u'型号',max_length = 64,default = '',blank=True,null=True)
    sn = models.CharField(u'序列号',max_length = 128,default = '',blank = True,null = True)
    lastip = models.GenericIPAddressField(u"最后使用ip",default = "0.0.0.0",blank=True,null=True)
    privateip = models.GenericIPAddressField(u"私网ip",default = "0.0.0.0",blank=True,null=True)
    version = models.CharField(u'版本号',max_length = 128,default = '',blank = True,null=True)
    last_heart_time = models.DateTimeField(u'最后心跳',blank=True,null=True,default = timezone.now)
    upload = models.CharField(u'上传数据',max_length = 128,default = '0',blank = True,null = True)
    download = models.CharField(u'下载数据',max_length = 128,default = '0',blank = True,null = True)
    up_pkts = models.CharField(u'上传数据包',max_length = 128,default = '0',blank = True,null = True)
    down_pkts = models.CharField(u'下载数据包',max_length = 128,default = '0',blank = True,null = True)
    state = models.CharField(u'状态',max_length = 32,default = '',blank = True,null = True)
    # vpn = models.CharField(u'vpn',max_length = 32,default = 'off',blank = True,null = True)
    # vpnip = models.CharField(u'vpnip',max_length = 32,default = '',blank = True,null = True)
    upgrade_button = models.CharField(u'升级开关',max_length = 32,default = '',blank=True,null = True)
    reboot_sign = models.CharField(u'reboot开关',max_length = 32,default = '0',blank=True,null = True)
    upgrade_version = models.CharField(u'升级版本号',max_length = 128,default = '',blank = True,null=True)
    library_version = models.CharField(u'library_version',max_length = 128,default = "",blank = True,null= True)
    library_upgrade_button = models.CharField(u'library升级开关',max_length = 32,default = '',blank=True,null = True)
    library_upgrade_version = models.CharField(u'library升级版本号',max_length = 128,default = '',blank = True,null=True)
    group_id = models.IntegerField(u'group_id',default = 0,blank = True,null = True)
    account_group_name = models.CharField(u'account_group_name',max_length = 128,default="",blank = True,null=True)
    # support_mode = models.CharField(u'mode',max_length = 64,default = '',blank = True,null=True)
    #1->ap 2->probe 3->feijing
    def __unicode__(self):
        return self.mac

class AuditDevice_group(models.Model):
    """
    Description: Model Description
    """
    #basic
    group_name = models.CharField(u'group_name',max_length = 128,default="")
    account_group_name = models.CharField(u'account_group_name',max_length = 128,default="",)
    # group_type = models.CharField(u'group_type',max_length = 32,default="0")
    #1->ap,2->probe,3->feijing
    role = models.CharField(u'role',max_length = 128,default = "")
    #count
    device_count = models.IntegerField(u'device_count',default = 0,blank = True)
    auto_update = models.CharField(u'auto_update',max_length = 32,default = "off")
    # library_auto_update = models.CharField(u'library_auto_update',max_length = 32,default = "off")

    def __unicode__(self):
        return self.group_name

    class Meta:
        unique_together = ("group_name", "account_group_name")
