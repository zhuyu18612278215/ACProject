#coding=utf-8
from django.db import models
from django.utils import timezone
from device.models import Device,Probe_group
from account.models import Account_Group
from system.models import Setting
# Create your models here.

class Device_ap(models.Model):
    """
    Description: Model Description
    """
    device = models.OneToOneField(Device,primary_key=True)
    # mac = models.CharField(u'MAC',max_length = 32,default = '',unique=True)
    # name = models.CharField(u'名称',max_length = 128,default = '',blank=True)
    # model = models.CharField(u'oem型号',max_length = 64,default = '',blank=True)
    # own_model = models.CharField(u'型号',max_length = 64,default = '',blank=True)
    # sn = models.CharField(u'序列号',max_length = 128,default = '',blank = True)
    # lastip = models.GenericIPAddressField(u"最后使用ip",default = "0.0.0.0",blank=True)
    # privateip = models.GenericIPAddressField(u"私网ip",default = "0.0.0.0",blank=True)
    apusernum = models.IntegerField(u'当前用户数',default = 0,blank = True)
    guestsnum = models.IntegerField(u'来宾数量',default = 0,blank = True)


    radios_type = models.CharField(u'射频类型',max_length = 128,default = '0',blank = True)
    radios_2_channel = models.CharField(u'2g信道',max_length = 32,default = 'auto',blank = True)
    radios_2_ht = models.CharField(u'2ght',max_length = 32,default = '20',blank = True)
    radios_2_power = models.CharField(u'2gpower',max_length = 32,default = 'auto',blank = True)
    radios_2_com = models.CharField(u'2gcom',max_length = 32,default = 'auto',blank = True)
    radios_5_channel = models.CharField(u'5g信道',max_length = 32,default = 'auto',blank = True)
    radios_5_ht = models.CharField(u'5ght',max_length = 32,default = '20',blank = True)
    radios_5_power = models.CharField(u'5gpower',max_length = 32,default = 'auto',blank = True)
    radios_5_com = models.CharField(u'5gcom',max_length = 32,default = 'auto',blank = True)
    radios_2_currstanum = models.IntegerField(u'2g当前用户数',default = 0,blank = True)
    radios_2_guestsnum = models.IntegerField(u'2g来宾数量',default = 0,blank = True)
    radios_5_currstanum = models.IntegerField(u'5g当前用户数',default = 0,blank = True)
    radios_5_guestsnum = models.IntegerField(u'5g来宾数量',default = 0,blank = True)

    # version = models.CharField(u'版本号',max_length = 128,default = '',blank = True)
    # last_heart_time = models.DateTimeField(u'最后心跳',blank=True,default = timezone.now)

    # upload = models.CharField(u'上传数据',max_length = 128,default = '0',blank = True)
    # download = models.CharField(u'下载数据',max_length = 128,default = '0',blank = True)
    # up_pkts = models.CharField(u'上传数据包',max_length = 128,default = '0',blank = True)
    # down_pkts = models.CharField(u'下载数据包',max_length = 128,default = '0',blank = True)

    # state = models.CharField(u'状态',max_length = 32,default = '',blank = True)
    # vpn = models.CharField(u'vpn',max_length = 32,default = 'off',blank = True)
    # vpnip = models.CharField(u'vpnip',max_length = 32,default = '',blank = True)
    # upgrade_button = models.CharField(u'升级开关',max_length = 32,default = '',blank=True)
    # reboot_sign = models.CharField(u'reboot开关',max_length = 32,default = '0',blank=True)
    # upgrade_version = models.CharField(u'升级版本号',max_length = 128,default = '',blank = True)
    # group_id = models.IntegerField(u'group_id',default = 0,blank = True)
    # account_group_name = models.CharField(u'account_group_name',max_length = 128,default="",blank = True)
    def __unicode__(self):
        return self.mac

class AP_event(models.Model):
    """
    Description: Model Description
    """
    event_time = models.DateTimeField(u'event_time',blank=True,default = timezone.now)
    event = models.CharField(u'event',max_length = 128,default  = '',blank = True)
    msg = models.CharField(u'msg',max_length = 255,default  = '',blank = True)
    admin_username = models.CharField(u'admin_username',max_length = 128,default  = '',blank = True)
    ap_mac = models.CharField(u'ap_mac',max_length = 128,default  = '',blank = True)


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
class Group_gpon(models.Model):
    """
    Description: Model Description
    """
    group = models.OneToOneField(Probe_group)
    update_link = models.CharField(u'update_link',max_length=64,default="",blank=True)
    update_file = models.CharField(u'update_file',max_length=64,default="",blank=True)

class Setting_gpon(models.Model):
    """
    Description: Model Description
    """
    setting = models.OneToOneField(Setting)
    update_link = models.CharField(u'update_link',max_length=64,default="",blank=True)
    update_file = models.CharField(u'update_file',max_length=64,default="",blank=True)


class Group_wlan(models.Model):
    """
    Description: Model Description
    """
    group_id = models.ForeignKey(Probe_group)
    wlan_id = models.CharField(u'wlan_id',max_length = 32,default  = '0',blank = True)
    wlan_ssid = models.CharField(u'wlan_ssid',max_length = 128,default  = '',blank = True)
    wlan_service = models.CharField(u'wlan_service',max_length = 32,default  = 'off',blank = True)
    sec_type = models.CharField(u'sec_type',max_length = 32,default  = '',blank = True)
    encry_type = models.CharField(u'encry_type',max_length = 32,default  = '',blank = True)
    passphrase = models.CharField(u'passphrase',max_length = 64,default  = '',blank = True)
    guest_enabled = models.CharField(u'guest_enabled',max_length = 32,default  = 'off',blank = True)
    vlan_enabled = models.CharField(u'vlan_enabled',max_length = 32,default  = 'off',blank = True)
    vlan = models.CharField(u'vlan',max_length = 32,default  = '0',blank = True)
    hidden_ssid = models.CharField(u'hidden_ssid',max_length = 32,default  = 'off',blank = True)
    # wpa_mode = models.CharField(u'wpa_mode',max_length = 32,default  = '',blank = True)
    upload_speed = models.CharField(u'upload_speed',max_length = 32,default  = '',blank = True)
    download_speed = models.CharField(u'download_speed',max_length = 32,default  = '',blank = True)
    radios_enable = models.CharField(u'radios_enable',max_length = 32,default  = 'both',blank = True)


    auth_type = models.CharField(u'auth_type',max_length = 32,default  = '',blank = True)
    wechat_appid = models.CharField(u'wechat_appid',max_length = 128,default  = '',blank = True)
    wechat_appkey = models.CharField(u'wechat_appkey',max_length = 128,default  = '',blank = True)
    wechat_shopid = models.CharField(u'wechat_shopid',max_length = 128,default  = '',blank = True)
    wechat_secretkey = models.CharField(u'wechat_secretkey',max_length = 128,default  = '',blank = True)
    wechat_forcefollow = models.CharField(u'wechat_forcefollow',max_length = 128,default  = '',blank = True)
    auth_server_hostname = models.CharField(u'auth_server_hostname',max_length = 128,default  = '',blank = True)
    auth_server_loginurl = models.CharField(u'auth_server_loginurl',max_length = 128,default  = '',blank = True)
    auth_server_portalurl = models.CharField(u'auth_server_portalurl',max_length = 128,default  = '',blank = True)

    eapIP = models.CharField(default='', max_length=64,blank=True)
    eapPort = models.CharField(default='', max_length=32,blank=True)



    def __unicode__(self):
        return self.group_id,self.wlan_id


class Device_wlan(models.Model):
    """
    Description: Model Description
    """
    device = models.ForeignKey(Device)
    wlan_id = models.CharField(u'wlan_id',max_length = 32,default  = '0',blank = True)
    wlan_ssid = models.CharField(u'wlan_ssid',max_length = 128,default  = '',blank = True)
    wlan_service = models.CharField(u'wlan_service',max_length = 32,default  = 'on',blank = True)
    passphrase = models.CharField(u'passphrase',max_length = 64,default  = '',blank = True)
    vlan_enabled = models.CharField(u'vlan_enabled',max_length = 32,default  = 'off',blank = True)
    vlan = models.CharField(u'vlan',max_length = 32,default  = '0',blank = True)
    upload_speed = models.CharField(u'upload_speed',max_length = 32,default  = '',blank = True)
    download_speed = models.CharField(u'download_speed',max_length = 32,default  = '',blank = True)
    radios_enable = models.CharField(u'radios_enable',max_length = 32,default  = 'both',blank = True)


    def __unicode__(self):
        return self.device,self.wlan_ssid

class User_policy_config(models.Model):
    """
    Description: Model Description
    """
    domainname = models.OneToOneField(Account_Group)

    dual_max_user = models.IntegerField(u'dual_max_user',default = 128,blank = True)
    single_max_user = models.IntegerField(u'single_max_user',default = 64,blank = True)
    rssi_threshold = models.IntegerField(u'rssi_threshold',default = -95,blank = True)
    access_policy = models.IntegerField(u'access_policy',default = 0,blank = True)
    load_balance = models.IntegerField(u'load_balance',default = 0,blank = True)
    reject_max = models.IntegerField(u'reject_max',default = 3,blank = True)
    rssi_max = models.IntegerField(u'rssi_max',default = 0,blank = True)
    l2_isolation = models.IntegerField(u'l2_isolation',default = 0,blank = True)
    # rssi_min
    band_steering = models.IntegerField(u'band_steering',default = 0,blank = True)
    thredhold_5g = models.IntegerField(u'thredhold_5g',default = 0,blank = True)
    thredhold_5g_rssi = models.IntegerField(u'thredhold_5g_rssi',default = 0,blank = True)
    roaming_policy = models.IntegerField(u'roaming_policy',default = 0,blank = True)
    roaming_assoc_rssi = models.IntegerField(u'roaming_assoc_rssi',default = 0,blank = True)
    roaming_unassoc_rssi = models.IntegerField(u'roaming_unassoc_rssi',default = 0,blank = True)

    timestamp = models.DateTimeField(u'timestamp',blank=True,default = timezone.now)

    def __unicode__(self):
        return self.domainname

class Ap_user_policy_config_extend(models.Model):
    """
    Description: Model Description
    """
    device = models.OneToOneField(Device)
    max_user = models.IntegerField(u'max_user',default = 128,blank = True)
    # single_max_user = models.IntegerField(u'single_max_user',default = -1,blank = True)

    def __unicode__(self):
        return self.device


class Guest_policy(models.Model):
    """
    Description: Model Description
    """
    domainname = models.OneToOneField(Account_Group)
    simpleauth = models.CharField(u'simpleauth',max_length = 32,default = "false",blank=True)
    bypass = models.CharField(u'bypass',max_length = 32,default = "false",blank=True)
    wechatallowed = models.CharField(u'wechatallowed',max_length = 32,default = "false",blank=True)
    auth_validate_timeout = models.CharField(u'auth_validate_timeout',max_length = 32,default = "43200",blank=True)
    client_timeout = models.CharField(u'client_timeout',max_length = 32,default = "2880",blank=True)
    auth_server = models.CharField(u'auth_server',max_length = 1024,default = "",blank=True)
    white_list = models.CharField(u'white_list',max_length = 1024,default = "[]",blank=True)
    trusted_mac_list = models.CharField(u'trusted_mac_list',max_length = 1024,default = "[]",blank=True)

    def __unicode__(self):
        return self.domainname

class ApBlackList(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'mac',max_length = 64,default="",unique=True)
    support_mode = models.CharField(u'mode',max_length = 64,default = '',blank = True)
    #1->ap 2->probe 3->feijing
class Customer(models.Model):
    """
    Description: Model Description
    """
    ip = models.GenericIPAddressField(u'ip',default = "")
    wlanid = models.IntegerField(u'wlanid',default = 0,)
    mac = models.CharField(u'mac',max_length=64,unique = True,default = "")
    ap = models.CharField(u'ap',max_length=64,default = "",blank=True)
    vap = models.CharField(u'vap',max_length=64,default = "",blank=True)
    radioid = models.IntegerField(u'radioid',default = 0,)

    devmodel = models.CharField(u'devmodel',max_length=128,default = "",blank=True)
    devtype = models.CharField(u'devtype',max_length=64,default = "",blank=True)
    ostype = models.CharField(u'ostype',max_length=64,default = "",blank=True)
    cputype = models.CharField(u'ostype',max_length=64,default = "",blank=True)
    signal = models.IntegerField(u'signal',default = 0,)

    portal_enable = models.BooleanField(u'portal_enable',default = False)
    portal_type = models.CharField(u'portal_type', max_length=64,default = "",blank=True)
    portal_state = models.CharField(u'portal_state',max_length=64, default = "",blank=True)

    tx_wifirate = models.IntegerField(u'tx_wifirate',default = 0,)
    tx_retr = models.IntegerField(u'tx_retr',default = 0,)
    tx_bytes = models.BigIntegerField(u'tx_bytes',default = 0,)
    tx_rate = models.IntegerField(u'tx_rate',default = 0,)

    rx_wifirate = models.IntegerField(u'rx_wifirate',default = 0,)
    rx_retr = models.IntegerField(u'rx_retr',default = 0,)
    rx_bytes = models.BigIntegerField(u'rx_bytes',default = 0,)
    rx_rate = models.IntegerField(u'rx_rate',default = 0,)

    packetloss = models.IntegerField(u'packetloss',default = 0)
    delaytime = models.IntegerField(u'delaytime',default = 0)
    uptime = models.IntegerField(u'uptime',default = 0)
    livetime = models.IntegerField(u'livetime',default = 0)
    hostname = models.CharField(u'hostname',max_length=128, default = "",blank=True)
    down_package = models.IntegerField(u'down_package',default = 0)
    up_package = models.IntegerField(u'up_package',default = 0)

    last_heart_time = models.IntegerField(u'last_heart_time',default = 0)
    online_sign = models.CharField(u'online_sign',max_length=32, default = "online",blank=True)

    uphone = models.CharField(u'uphone',max_length=32,default = "",blank=True)
    channel = models.CharField(u'channel',max_length=10,default="",blank=True)

class Customer_history(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'mac',max_length=64,default = "")
    online_sign = models.CharField(u'online_sign',max_length=32, default = "",blank=True)
    up = models.BigIntegerField(u'up',default = 0)
    down = models.BigIntegerField(u'down',default = 0)
    last_heart_time = models.IntegerField(u'last_heart_time',default = 0)
    uptime = models.IntegerField(u'uptime',default = 0)
    class Meta:
        pass

class Customer_name(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(max_length=32, default = "",unique = True)
    name = models.CharField(max_length=64, default = "")

    class Meta:
        pass

class Gpon(models.Model):
    """
    Description: Model Description
    """
    ap_mac = models.CharField(u'ap_mac',max_length=32,default="",unique = True)
    gpon_state = models.CharField(u'gpon_state',max_length=64,default="",blank=True)
    off_reason = models.CharField(u'off_reason',max_length=64,default="",blank=True)
    gpon_sn = models.CharField(u'gpon_sn',max_length=64,default="",blank=True)
    gpon_pwd = models.CharField(u'gpon_pwd',max_length=64,default="",blank=True)
    los_status = models.CharField(u'los_status',max_length=64,default="",blank=True)
    tx_power = models.CharField(u'tx_power',max_length=64,default="",blank=True)
    rx_power = models.CharField(u'rx_power',max_length=64,default="",blank=True)
    temperature = models.CharField(u'temperature',max_length=64,default="",blank=True)
    supply_voltage = models.CharField(u'supply_voltage',max_length=64,default="",blank=True)
    txbias_current = models.CharField(u'txbias_current',max_length=64,default="",blank=True)
    onu_state = models.CharField(u'onu_state',max_length=64,default="",blank=True)
    phy_status = models.CharField(u'phy_status',max_length=64,default="",blank=True)
    traffic_status = models.CharField(u'traffic_status',max_length=64,default="",blank=True)
    manufacturer = models.CharField(u'manufacturer',max_length=64,default="",blank=True)
    manufacturer_oui = models.CharField(u'manufacturer_oui',max_length=64,default="",blank=True)
    operator_id = models.CharField(u'operator_id',max_length=64,default="",blank=True)
    model_name = models.CharField(u'model_name',max_length=64,default="",blank=True)
    customer_hwversion = models.CharField(u'customer_hwversion',max_length=64,default="",blank=True)
    customer_swversion = models.CharField(u'customer_swversion',max_length=64,default="",blank=True)

    update_link = models.CharField(u'update_link',max_length=64,default="",blank=True)
    update_file = models.CharField(u'update_file',max_length=64,default="",blank=True)


class Customer_black_list(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'mac',max_length = 64,default="")
    groupname = models.CharField(u"管理域名",default="",max_length=128,blank=True)

    class Meta:
        pass


class Customer_white_list(models.Model):
    """
    Description: Model Description
    """
    mac = models.CharField(u'mac',max_length = 64,default="")
    groupname = models.CharField(u"管理域名",default="",max_length=128,blank=True)

    class Meta:
        pass

class Customer_black_white_switch(models.Model):
    """
    Description: Model Description
    """
    groupname = models.CharField(u"管理域名",default="",max_length=128,blank=True,unique = True)
    switch = models.CharField(u'black/white switch', default = "" ,max_length=50,blank=True)

    class Meta:
        pass

class Timing_Policy(models.Model):
    groupname = models.CharField(u"管理域名",default="",max_length=128,blank=True,unique = True)
    gpon_light_switch = models.CharField(u'gpon_light_switch', default = "off" ,max_length=30,blank=True)
    gpon_timer = models.CharField(u'gpon_timer',default="", max_length=512,blank=True)

    class Meta:
        pass

    def __str__(self):
        pass

