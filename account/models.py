#coding=utf-8
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Create your models here.
class NewUser(AbstractUser):
    administrator_permission = models.IntegerField(u"管理权限",default=0)
    # 6->admin 5->本地admin 4->本地user 3-> 注册superadmin 2->注册admin 1->普通用户以及未申请或未通过加入组的用户
    email_alert = models.IntegerField(u"邮箱提醒",default=0)
    language = models.CharField(u"语言",max_length = 64,default = "zh")
    note = models.CharField(u"记录",max_length=255,default = "",blank=True,null=True)
    # last_login_time = models.DateTimeField(u"最后登录时间",default = timezone.now)
    # django 拥有 last_login 属性
    last_login_ip = models.GenericIPAddressField(u"最后登录ip",default = "0.0.0.0")
    country = models.CharField(u"国家",max_length=64,default="",blank=True,null=True)
    company = models.CharField(u"公司/单位",max_length=256,default="",blank=True,null=True)
    headpic = models.ImageField(u"头像",upload_to='photos/%Y/%m/%d',max_length=256,default=u"photos/headimg.png",blank=True,null=True)
    groupname = models.CharField(u"管理域名",default="",max_length=128,blank=True,null=True)
    group_status = models.IntegerField(u"组状态",default=0,blank=True,null=True)
    # 0->未分组 1->已分组 2->申请为普通 3->申请为管理员 4->邀请为普通 5->邀请为管理员 6->拒绝
    tell = models.CharField(max_length=32, default = '',blank = True)
    def __unicode__(self):
        return self.username

class Reg_User(models.Model):
    """
    Description: Model Description
    """
    user = models.OneToOneField(NewUser,primary_key=True)
    token = models.CharField(max_length = 128,default="",blank=True,null=True)
    token_exptime = models.DateTimeField(default = timezone.now,blank=True,null=True)
    status = models.IntegerField(u"激活状态",default = 0,blank=True,null=True)
    regtime = models.DateTimeField(default = timezone.now,blank=True,null=True)
    regfrom = models.GenericIPAddressField(default = "0.0.0.0",blank=True,null=True)
    def __unicode__(self):
        return self.user

class Account_Group(models.Model):
    """
    Description: Model Description
    """
    groupname = models.CharField(u"管理域名",unique=True,default="",max_length=128,blank=True)
    issue_config_switch = models.CharField(u"issue_config_switch",default = "on",max_length = 32,blank=True)

    ap_auto_update = models.CharField(u'ap_auto_update',max_length=32,default="",blank=True)
    probe_auto_update = models.CharField(u'probe_auto_update',max_length=32,default="",blank=True)
    nonoperate_auto_update = models.CharField(u'nonoperate_auto_update',max_length=32,default="",blank=True)
    def __unicode__(self):
        return self.groupname


class Auto_Update_Rule(models.Model):
    """
    Description: Model Description
    """
    groupname = models.CharField(u"管理域名",default="",max_length=128,blank=True)
    support_mode = models.CharField(u'mode',max_length = 64,default = '',blank = True)
    rule = models.CharField(u'rule', max_length=64,default = '[]',blank = True)

    class Meta:
        unique_together = ('groupname','support_mode')
