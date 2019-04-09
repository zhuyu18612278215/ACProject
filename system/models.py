#coding=utf-8
from django.db import models

# Create your models here.
class Setting(models.Model):
    """
    Description: Model Description
    """
    SIGN = models.IntegerField(u'SIGN',unique=True)
    VERSION_SERVER_URL = models.CharField(u'VERSION_SERVER_URL',max_length = 512,default = 'http://115.28.241.216:81/',blank=True)
    SYSTEM_VERSION_SERVER_URL = models.CharField(u'SYSTEM_VERSION_SERVER_URL',max_length = 512,default = 'http://115.28.241.216:81/',blank=True)
    EMAIL_HOST = models.CharField(u'EMAIL_HOST',max_length = 512,default = '',blank=True)
    EMAIL_HOST_USER = models.CharField(u'EMAIL_HOST_USER',max_length = 512,default = '',blank=True)
    EMAIL_HOST_PASSWORD = models.CharField(u'EMAIL_HOST_PASSWORD',max_length = 512,default = '',blank=True)
    EMAIL_PORT = models.IntegerField(u'EMAIL_PORT',default = 0,)
    EMAIL_USE_SSL = models.BooleanField(u'EMAIL_USE_SSL',default = False,)
    DEFAULT_FROM_EMAIL = models.CharField(u'DEFAULT_FROM_EMAIL',max_length = 512,default = '',blank=True)

    ap_auto_accept = models.CharField(u'ap_auto_accept',max_length=32,default="",blank=True)
    probe_auto_accept = models.CharField(u'probe_auto_accept',max_length=32,default="",blank=True)
    nonoperate_auto_accept = models.CharField(u'nonoperate_auto_accept',max_length=32,default="",blank=True)

    countryCode = models.CharField(max_length=32, default = 'CN')
    timezoneCode = models.CharField(max_length=32, default = 'Asia/Hong_Kong')
    class Meta:
        pass


class Page_limit(models.Model):
    """
    Description: Model Description
    """
    ap_index =models.CharField(max_length=64,default = "0")
    probe_index =models.CharField(max_length=64,default = "0")
    nonoperate_index =models.CharField(max_length=64,default = "0")
    ap_page =models.CharField(max_length=64,default = "0")
    probe_page =models.CharField(max_length=64,default = "0")
    nonoperate_page =models.CharField(max_length=64,default = "0")
    audit_dev_page =models.CharField(max_length=64,default = "0")


    class Meta:
        pass

class Oem_limit(models.Model):
    """
    Description: Model Description
    """
    oem_type = models.CharField(max_length=64,default = "")

    #add new oem option
    acUpdateAddressOption = models.CharField(max_length=32, default = "Free")
    acUpdateSwitchOption = models.CharField(max_length=32, default = "Auto")
    specialOEMOption = models.CharField(max_length=32, default = '')
    logoDisplay = models.CharField(max_length=32, default = 'hide')
    useLogoCustomization = models.CharField(max_length=32, default = 'false')
    logoCustomization = models.CharField(max_length=128, default = '')
    customUIOption = models.CharField(max_length=32, default = 'Default')
    customUIMainColor = models.CharField(max_length=64, default = '')
    customUISecondaryColor = models.CharField(max_length=64, default = '')
    systemFirstLevelPageControl = models.CharField(max_length=32, default = 'show')
    supportFirstLevelPageControl = models.CharField(max_length=32, default = 'show')

    guestCommonOptionControl = models.CharField(max_length=32, default = 'show')
    guestAccountOptionControl = models.CharField(max_length=32, default = 'show')
    guestSMSOptionControl = models.CharField(max_length=32, default = 'show')
    guestWXOptionControl = models.CharField(max_length=32, default = 'show')
    guestCardOptionControl = models.CharField(max_length=32, default = 'show')
    guestCustomizeOptionControl = models.CharField(max_length=32, default = 'show')

    userDefaultLanguage = models.CharField(max_length=32, default = '')
    accountSystemControl = models.CharField(max_length=32,default = 'show')

    class Meta:
        pass
