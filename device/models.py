#coding=utf-8
from django.db import models
from django.utils import timezone
import json
# Create your models here.


class Device(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    name = models.CharField(u'名称',max_length = 128,default = '',blank=True)
    model = models.CharField(u'oem型号',max_length = 64,default = '',blank=True)
    own_model = models.CharField(u'型号',max_length = 64,default = '',blank=True)
    sn = models.CharField(u'序列号',max_length = 128,default = '',blank = True)
    lastip = models.GenericIPAddressField(u"最后使用ip",default = "0.0.0.0",blank=True,null = True)
    privateip = models.GenericIPAddressField(u"私网ip",default = "0.0.0.0",blank=True,null = True)
    version = models.CharField(u'版本号',max_length = 128,default = '',blank = True)
    last_heart_time = models.DateTimeField(u'最后心跳',blank=True,default = timezone.now)
    # upload = models.CharField(u'上传数据',max_length = 128,default = '0',blank = True)
    # download = models.CharField(u'下载数据',max_length = 128,default = '0',blank = True)
    upload = models.BigIntegerField(u'上传数据',default = 0)
    download = models.BigIntegerField(u'下载数据',default = 0)
    up_pkts = models.CharField(u'上传数据包',max_length = 128,default = '0',blank = True)
    down_pkts = models.CharField(u'下载数据包',max_length = 128,default = '0',blank = True)
    state = models.CharField(u'状态',max_length = 32,default = '',blank = True)
    vpn = models.CharField(u'vpn',max_length = 32,default = 'off',blank = True)
    vpnip = models.CharField(u'vpnip',max_length = 32,default = '',blank = True)
    upgrade_button = models.CharField(u'升级开关',max_length = 32,default = '',blank=True)
    reboot_sign = models.CharField(u'reboot开关',max_length = 32,default = '0',blank=True)
    upgrade_version = models.CharField(u'升级版本号',max_length = 128,default = '',blank = True)
    group_id = models.IntegerField(u'group_id',default = 0,blank = True)
    account_group_name = models.CharField(u'account_group_name',max_length = 128,default="",blank = True)
    support_mode = models.CharField(u'mode',max_length = 64,default = '',blank = True)
    locateState = models.CharField(u'locateState', max_length=32,default = 'off')
    #1->ap 2->probe 3->feijing
    def __unicode__(self):
        return self.mac

class Device_probe(models.Model):
    """
    Description: Model Description
    """
    device = models.OneToOneField(Device,primary_key=True,default = "")
    # mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    # name = models.CharField(u'名称',max_length = 128,default = '',blank=True)
    # model = models.CharField(u'oem型号',max_length = 64,default = '',blank=True)
    # own_model = models.CharField(u'型号',max_length = 64,default = '',blank=True)
    # sn = models.CharField(u'序列号',max_length = 128,default = '',blank = True)
    # lastip = models.GenericIPAddressField(u"最后使用ip",default = "0.0.0.0",blank=True,null = True)
    # privateip = models.GenericIPAddressField(u"私网ip",default = "0.0.0.0",blank=True,null = True)
    currstanum = models.IntegerField(u'当前用户数',default = 0,blank = True)
    totalstanum = models.IntegerField(u'总用户数',default = 0,blank = True)
    currhotnum = models.IntegerField(u'当前热点数',default = 0,blank = True)
    totalhotnum = models.IntegerField(u'总热点数',default = 0,blank = True)
    placecode = models.CharField(u'场所编码',max_length = 64,default = '',blank=True)
    devicecode = models.CharField(u'设备编码',max_length = 64,default = '',blank=True,unique=True)
    manufacturer = models.CharField(u'审计厂商',max_length = 128,default = '',blank=True)
    manufacturer_ip = models.CharField(u'审计后台ip',max_length = 256,default = '',blank=True)
    # version = models.CharField(u'版本号',max_length = 128,default = '',blank = True)
    # last_heart_time = models.DateTimeField(u'最后心跳',blank=True,default = timezone.now)
    # upload = models.CharField(u'上传数据',max_length = 128,default = '0',blank = True)
    # download = models.CharField(u'下载数据',max_length = 128,default = '0',blank = True)
    # state = models.CharField(u'状态',max_length = 32,default = '',blank = True)
    # vpn = models.CharField(u'vpn',max_length = 32,default = 'off',blank = True)
    # vpnip = models.CharField(u'vpnip',max_length = 32,default = '',blank = True)
    # upgrade_button = models.CharField(u'升级开关',max_length = 32,default = '',blank=True)
    # reboot_sign = models.CharField(u'reboot开关',max_length = 32,default = '0',blank=True)
    # upgrade_version = models.CharField(u'升级版本号',max_length = 128,default = '',blank = True)
    # group_id = models.IntegerField(u'group_id',default = 0,blank = True)
    # account_group_name = models.CharField(u'account_group_name',max_length = 128,default="",blank = True)




class Probe_config(models.Model):
    mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    ac_address = models.CharField(u'ac',max_length = 64,default = '',blank = True)
    log_address = models.CharField(u'log',max_length = 64,default = '',blank = True)
    ip_model = models.CharField(u'ip_model',max_length = 32,default = '',blank = True)
    ip_address = models.CharField(u'ip',max_length = 64,default = '',blank = True)
    subnet_mask = models.CharField(u'subnet_mask',max_length = 64,default = '',blank = True)
    gateway = models.CharField(u'subnet_mask',max_length = 64,default = '',blank = True)
    preferred_dns = models.CharField(u'preferred_dns',max_length = 64,default = '',blank = True)
    alternative_dns = models.CharField(u'alternative_dns',max_length = 64,default = '',blank = True)
    preferred_ntp = models.CharField(u'preferred_ntp',max_length = 64,default = '',blank = True)
    alternative_ntp = models.CharField(u'alternative_ntp',max_length = 64,default = '',blank = True)
    def __unicode__(self):
        return self.mac

class Probe_audit_basic_status(models.Model):
    mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    audit_corp = models.CharField(u'audit_corp',max_length = 64,default = '',blank = True)
    ftp_name = models.CharField(u'ftp_name',max_length = 64,default = '',blank = True)
    ftp_passwd = models.CharField(u'ftp_passwd',max_length = 64,default = '',blank = True)
    ftp_port = models.CharField(u'ftp_port',max_length = 64,default = '',blank = True)
    audit_ip = models.CharField(u'audit_ip',max_length = 64,default = '',blank = True)
    audit_port = models.CharField(u'audit_port',max_length = 64,default = '',blank = True)
    location_encode = models.CharField(u'location_encode',max_length = 64,default = '',blank = True)
    device_encode = models.CharField(u'device_encode',max_length = 64,default = '',blank = True)
    longitude = models.CharField(u'longitude',max_length = 64,default = '',blank = True)
    latitude = models.CharField(u'latitude',max_length = 64,default = '',blank = True)
    ssid = models.CharField(u'ssid',max_length = 512,default = json.dumps(''),blank = True,null= True )
    def __unicode__(self):
        return self.mac

class Probe_audit_dev_status(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    collection_radius = models.CharField(u'collection_radius',max_length = 64,default = '',blank = True)
    collection_equipment_type = models.CharField(u'equipment_type',max_length = 64,default = '',blank = True)
    collection_equipment_name = models.CharField(u'equipment_name',max_length = 128,default = '',blank = True)
    collection_equipment_address = models.CharField(u'equipment_address',max_length = 128,default = '',blank = True)
    security_software_orgcode = models.CharField(u'software_orgcode',max_length = 64,default = '',blank = True)
    security_software_orgname = models.CharField(u'software_orgname',max_length = 128,default = '',blank = True)
    security_software_address = models.CharField(u'software_address',max_length = 128,default = '',blank = True)
    contactor = models.CharField(u'contactor',max_length = 64,default = '',blank = True)
    contactor_tel = models.CharField(u'contactor_tel',max_length = 64,default = '',blank = True)
    contactor_mail = models.CharField(u'contactor_mail',max_length = 64,default = '',blank = True)
    def __unicode__(self):
        return self.mac

class Probe_audit_place_status(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    place_name = models.CharField(u'place_name',max_length = 128,default = '',blank = True)
    site_address = models.CharField(u'site_address',max_length = 128,default = '',blank = True)
    netsite_type = models.CharField(u'netsite_type',max_length = 64,default = '',blank = True)
    bussiness_nature = models.CharField(u'bussiness_nature',max_length = 64,default = '',blank = True)
    law_principal_name = models.CharField(u'law_principal_name',max_length = 64,default = '',blank = True)
    law_principal_certificate_type = models.CharField(u'certificate_type',max_length = 64,default = '',blank = True)
    law_principal_certificate_id = models.CharField(u'certificate_id',max_length = 64,default = '',blank = True)
    relationship_account = models.CharField(u'relationship_account',max_length = 64,default = '',blank = True)
    start_time = models.CharField(u'start_time',max_length = 64,default = '',blank = True)
    end_time = models.CharField(u'end_time',max_length = 64,default = '',blank = True)
    site_type = models.CharField(u'site_type',max_length = 64,default = '',blank = True)
    police_station_code = models.CharField(u'police_station_code',max_length = 64,default = '',blank = True)
    policeName = models.CharField(max_length=128, default = '',blank = True)
    districtCode = models.CharField(max_length=32, default = '',blank = True)
    def __unicode__(self):
        return self.mac


class Probe_event(models.Model):
    """
    Description: Model Description
    """
    event_time = models.DateTimeField(u'event_time',blank=True,default = timezone.now)
    event = models.CharField(u'event',max_length = 128,default  = '',blank = True)
    msg = models.CharField(u'msg',max_length = 255,default  = '',blank = True)
    admin_username = models.CharField(u'admin_username',max_length = 128,default  = '',blank = True)
    probe_mac = models.CharField(u'probe_mac',max_length = 128,default  = '',blank = True)


    def __unicode__(self):
        return self.event

# AP_WAS_AUTO_ADMITED,
# AP_ADMITED_BY_ADMIN,
# AP_FORGOTEN_BY_ADMIN,
# AP_RESTARTED_BY_ADMIN,
# AP_BLOCKED_BY_ADMIN,
# AP_UNBLOCKED_BY_ADMIN,
# AP_START_REMOTE_CONNECT_BY_ADMIN,
# AP_STOP_REMOTE_CONNECT_BY_ADMIN,
# AP_START_REMOTE_CONNECT_BY_ADMIN_FAILED
# AP_UPGRADE_BY_ADMIN_TO_VERSION,

class Probe_group(models.Model):
    """
    Description: Model Description
    """
    #basic
    group_name = models.CharField(u'group_name',max_length = 128,default="")
    account_group_name = models.CharField(u'account_group_name',max_length = 128,default="",)
    group_type = models.CharField(u'group_type',max_length = 32,default="0")
    #1->ap,2->probe,3->feijing

    #count
    device_count = models.IntegerField(u'device_count',default = 0,blank = True)


    #audit
    audit_corp = models.CharField(u'audit_corp',max_length = 64,default = '',blank = True)
    ftp_name = models.CharField(u'ftp_name',max_length = 64,default = '',blank = True)
    ftp_passwd = models.CharField(u'ftp_passwd',max_length = 64,default = '',blank = True)
    ftp_port = models.CharField(u'ftp_port',max_length = 64,default = '',blank = True)
    audit_ip = models.CharField(u'audit_ip',max_length = 64,default = '',blank = True)
    audit_port = models.CharField(u'audit_port',max_length = 64,default = '',blank = True)
    location_encode = models.CharField(u'location_encode',max_length = 64,default = '',blank = True)
    device_encode = models.CharField(u'device_encode',max_length = 64,default = '',blank = True)
    longitude = models.CharField(u'longitude',max_length = 64,default = '',blank = True)
    latitude = models.CharField(u'latitude',max_length = 64,default = '',blank = True)

    collection_radius = models.CharField(u'collection_radius',max_length = 64,default = '',blank = True)
    collection_equipment_type = models.CharField(u'equipment_type',max_length = 64,default = '',blank = True)
    collection_equipment_name = models.CharField(u'equipment_name',max_length = 128,default = '',blank = True)
    collection_equipment_address = models.CharField(u'equipment_address',max_length = 128,default = '',blank = True)
    security_software_orgcode = models.CharField(u'software_orgcode',max_length = 64,default = '',blank = True)
    security_software_orgname = models.CharField(u'software_orgname',max_length = 128,default = '',blank = True)
    security_software_address = models.CharField(u'software_address',max_length = 128,default = '',blank = True)
    contactor = models.CharField(u'contactor',max_length = 64,default = '',blank = True)
    contactor_tel = models.CharField(u'contactor_tel',max_length = 64,default = '',blank = True)
    contactor_mail = models.CharField(u'contactor_mail',max_length = 64,default = '',blank = True)

    place_name = models.CharField(u'place_name',max_length = 128,default = '',blank = True)
    site_address = models.CharField(u'site_address',max_length = 128,default = '',blank = True)
    netsite_type = models.CharField(u'netsite_type',max_length = 64,default = '',blank = True)
    bussiness_nature = models.CharField(u'bussiness_nature',max_length = 64,default = '',blank = True)
    law_principal_name = models.CharField(u'law_principal_name',max_length = 64,default = '',blank = True)
    law_principal_certificate_type = models.CharField(u'certificate_type',max_length = 64,default = '',blank = True)
    law_principal_certificate_id = models.CharField(u'certificate_id',max_length = 64,default = '',blank = True)
    relationship_account = models.CharField(u'relationship_account',max_length = 64,default = '',blank = True)
    start_time = models.CharField(u'start_time',max_length = 64,default = '',blank = True)
    end_time = models.CharField(u'end_time',max_length = 64,default = '',blank = True)

    #xinghan v1.10
    site_type = models.CharField(u'site_type',max_length = 64,default = '',blank = True)
    police_station_code = models.CharField(u'police_station_code',max_length = 64,default = '',blank = True)

    #wlan
    wlan_count = models.CharField(u'wlan_count',max_length = 32,default = '0/0',blank = True)

    #probe_wlan
    ssid = models.CharField(u'ssid',max_length = 512,default = json.dumps(''),blank = True )
    def __unicode__(self):
        return self.group_name,self.account_group_name,self.group_type

    class Meta:
        unique_together = ("group_name", "account_group_name","group_type")
