#coding=utf-8
from django.core.urlresolvers import reverse
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth import login,authenticate
from account.models import NewUser,Account_Group
from device.models import Device,Device_probe,Probe_config,Probe_audit_basic_status,Probe_audit_dev_status,Probe_audit_place_status,Probe_group
from django.contrib.auth.decorators import login_required
import models
from captcha.models import CaptchaStore
from captcha.helpers import captcha_image_url
import json
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.http import HttpResponse,HttpResponseRedirect
from forms import LoginForm,RegisterForm
from django.utils import timezone
import datetime
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy as lazy_
from DevCloud import settings
# Create your views here.
from django.utils import translation
from device.views import state_check
# Create your views here.
import sys
sys.path.append("DataQuery")
import DataQuery
import Public_function
from itsdangerous import URLSafeTimedSerializer as utsr
import base64
import re
from django.conf import settings as django_settings_py
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives,EmailMessage
from django.contrib.auth.hashers import check_password
from system.models import Setting,Page_limit,Oem_limit
from django.core.mail import get_connection
import random
from django.db.models import Q
from auditdevice.models import AuditDevice,AuditDevice_group



class Token:
    def __init__(self, security_key):
        self.security_key = security_key
        self.salt = base64.encodestring(security_key)
    def generate_validate_token(self, username):
        serializer = utsr(self.security_key)
        return serializer.dumps(username, self.salt)
    def confirm_validate_token(self, token, expiration=43200):
        serializer = utsr(self.security_key)
        return serializer.loads(token, salt=self.salt, max_age=expiration)
    # def remove_validate_token(self, token):
    #     serializer = utsr(self.security_key)
    #     print serializer.loads(token, salt=self.salt)
        # return serializer.loads(token, salt=self.salt)

token_confirm = Token(django_settings_py.SECRET_KEY)    # 定义为全局变量


def getLanguage(request):
    language = ''
    if 'zh' in request.META['HTTP_ACCEPT_LANGUAGE'].split(';')[0]:
        language = 'zh'
    else:
        language = 'en'
    if Oem_limit.objects.filter(pk = 1).exists():
        oem = Oem_limit.objects.get(pk = 1)
        if oem.userDefaultLanguage != '':
            language = oem.userDefaultLanguage
    return language

def judgment_admin(language):

    if not NewUser.objects.filter(username = "admin").exists():
        user = NewUser()
        user.username = "admin"
        user.set_password("admin")
        user.email = ""
        user.email_alert = 1
        user.language = language
        user.administrator_permission = 6
        user.groupname = 'admin'
        user.group_status = 1
        user.save()
    if not Probe_group.objects.filter(Q(group_name = "DefaultGroup")&Q(account_group_name = "admin")&Q(group_type = "2")).exists():
        pg = Probe_group()
        pg.group_name = "DefaultGroup"
        pg.account_group_name = "admin"
        pg.group_type = '2'
        pg.save()
    if not Probe_group.objects.filter(Q(group_name = "DefaultGroup")&Q(account_group_name = "admin")&Q(group_type = "1")).exists():
        ap = Probe_group()
        ap.group_name = "DefaultGroup"
        ap.account_group_name = "admin"
        ap.group_type = '1'
        ap.save()
    if not Probe_group.objects.filter(Q(group_name = "DefaultGroup")&Q(account_group_name = "admin")&Q(group_type = "3")).exists():
        ap = Probe_group()
        ap.group_name = "DefaultGroup"
        ap.account_group_name = "admin"
        ap.group_type = '3'
        ap.save()
    if not AuditDevice_group.objects.filter(Q(group_name = "DefaultGroup")&Q(account_group_name = "admin")).exists():
        ap = AuditDevice_group()
        ap.group_name = "DefaultGroup"
        ap.account_group_name = "admin"
        ap.save()
    if not Setting.objects.filter(SIGN = 1).exists():
        s = Setting()
        s.SIGN = 1
        s.save()
    if not Account_Group.objects.filter(groupname = 'admin').exists():
        ag = Account_Group()
        ag.groupname = 'admin'
        ag.save()
    if not Page_limit.objects.filter(pk = 1).exists():
        p = Page_limit()
        p.id = 1
        # qingdao version
        # p.ap_index = '0'
        # p.probe_index = '1'
        # p.nonoperate_index = '0'
        # p.ap_page = '0'
        # p.probe_page = '1'
        # p.nonoperate_page = '0'
        # p.audit_dev_page = '0'
        #
        # jiangsu version
        # p.ap_index = '1'
        # p.probe_index = '0'
        # p.nonoperate_index = '0'
        # p.ap_page = '1'
        # p.probe_page = '0'
        # p.nonoperate_page = '0'
        # p.audit_dev_page = '0'
        #
        # # feijing version
        # p.ap_index = '0'
        # p.probe_index = '0'
        # p.nonoperate_index = '1'
        # p.ap_page = '0'
        # p.probe_page = '0'
        # p.nonoperate_page = '1'
        # p.audit_dev_page = '0'
        # test version
        p.ap_index = '1'
        p.probe_index = '1'
        p.nonoperate_index = '1'
        p.ap_page = '1'
        p.probe_page = '1'
        p.nonoperate_page = '1'
        p.audit_dev_page = '0'

        p.save()
    if not Oem_limit.objects.filter(pk = 1).exists():
        oem = Oem_limit()
        oem.id = 1
        # qingdao version
        # oem.oem_type = "qingdao"
        # test version
        oem.oem_type = ""
        oem.save()
    return 1


def get_plimit():
    if Page_limit.objects.filter(pk = 1).exists():
        plimit = model_to_dict(Page_limit.objects.get(pk = 1))
    else:
        plimit = Public_function.page_limit_dict
    return plimit

def get_oemlimit():
    if Oem_limit.objects.filter(pk = 1).exists():
        oemlimit = model_to_dict(Oem_limit.objects.get(pk = 1))
    else:
        oemlimit = Public_function.oem_limit_dict
    return oemlimit

def login(request):
    language = getLanguage(request)
    ju = judgment_admin(language)
    if not request.session.get('userDefaultLanguage'):
        translation.activate(language)
        request.session[translation.LANGUAGE_SESSION_KEY] = language
        request.session['userDefaultLanguage'] = language
    errors = ""
    hashkey = CaptchaStore.generate_key()
    imgage_url = captcha_image_url(hashkey)
    try:
        if request.META.has_key('HTTP_X_FORWARDED_FOR'):
            ip =  request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
    except :
        ip = '0.0.0.0'

    if request.method == 'POST':
        Lform = LoginForm(request.POST)
        # Validate the form: the captcha field will automatically
        # check the input
        if Lform.is_valid():
            human = True
            username = request.POST.get('username',)
            password = request.POST.get('password',)
            user = auth.authenticate(username=username,password=password)
            if user is not None :
                if user.is_active:
                    auth.login(request,user)
                    new = NewUser.objects.get(username = username)
                    # new.last_login_time = timezone.localtime(timezone.now())
                    new.last_login_ip = ip
                    new.save(update_fields=['last_login_ip'])
                    user_language = new.language
                    translation.activate(user_language)
                    request.session[translation.LANGUAGE_SESSION_KEY] = user_language
                    request.session['unique_sign'] = username+";"+timezone.localtime(timezone.now()).strftime("%Y-%m-%d %H:%M:%S")+";"+str(ip)+";"+str(random.random())
                    # if new.administrator_permission == 1 and new.group_status == 0:
                    specialOEMOption = ''
                    if Oem_limit.objects.filter(pk = 1).exists():
                        oemSetting = Oem_limit.objects.get(pk = 1)
                        specialOEMOption = oemSetting.specialOEMOption
                    if new.group_status != 1:
                        return HttpResponseRedirect(reverse('system.views.system_account',args = []))
                    elif specialOEMOption == 'byzoroXinyang' and str(new.administrator_permission) == '4':
                        return HttpResponseRedirect(reverse('nonoperate.views.nonoperateByzoroXinyangList',args = []))
                    else:
                        if Page_limit.objects.filter(pk = 1).exists():
                            pl = Page_limit.objects.get(pk = 1)
                            pl_sign1 = pl.ap_index
                            pl_sign2 = pl.probe_index
                            pl_sign3 = pl.nonoperate_index
                        else:
                            pl_sign1 = '0'
                            pl_sign2 = '0'
                            pl_sign3 = '1'
                        if pl_sign1 == "1":
                            return HttpResponseRedirect(reverse('ap.views.ap_index',args = []))
                        elif pl_sign2 == '1':
                            return HttpResponseRedirect(reverse('account.views.index',args = []))
                        else:
                            return HttpResponseRedirect(reverse('nonoperate.views.nonoperate_index',args = []))
                else:
                    # errors =  _(u"账户尚未激活")
                    return render(request,'reSendCheckMail.html',{'username':username})
            else:
                errors =  _(u"用户名或密码错误")
        else:
            errors = _(u"验证码错误")

    return render(request,'page-login.html',{'errors':errors,'hashkey':hashkey,'imgage_url':imgage_url})

def refresh_captcha(request):
    to_json_response = dict()
    to_json_response['status'] = 1
    to_json_response['new_cptch_key'] = CaptchaStore.generate_key()
    to_json_response['new_cptch_image'] = captcha_image_url(to_json_response['new_cptch_key'])
    # print to_json_response
    return JsonResponse(to_json_response)

@login_required
def logout(request):
    if request.session.get('userDefaultLanguage'):
        del request.session['userDefaultLanguage']
    auth.logout(request)
    return HttpResponseRedirect("/")

def register(request):
    # language = getLanguage(request)
    # translation.activate(language)
    # request.session[translation.LANGUAGE_SESSION_KEY] = language
    django_settings = Setting.objects.get(SIGN = 1)
    try:
        if request.META.has_key('HTTP_X_FORWARDED_FOR'):
            ip =  request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
    except :
        ip = '0.0.0.0'
    errors = ""
    if request.method ==  "POST":
        Rform = RegisterForm(request.POST)
        if Rform.is_valid():
            rform = Rform.cleaned_data
            username = rform.get('username')
            password = rform.get('password',)
            passwordconfirm = rform.get('passwordconfirm',)
            email = rform.get('email',)
            language = rform.get('language',)
            if password != passwordconfirm:
                errors = _(u"密码不一致！")
            if NewUser.objects.filter(username = username).exists():
                errors = _(u"用户名存在！")
            if NewUser.objects.filter(email = email).exists():
                errors = _(u"邮箱已存在")
            if len(errors) == 0:
                user = NewUser()
                user.username = username
                user.set_password(password)
                user.administrator_permission = 1
                user.email = email
                user.email_alert = 0
                user.note = ""
                user.language = language
                user.is_active = False
                # user.last_login_time = timezone.localtime(timezone.now())
                user.last_login_ip = ip
                if user is not None:
                    user.save()
                    errors = _(u"注册成功,邮件激活后方可登录,邮件有效期12小时")
                    token = token_confirm.generate_validate_token(username)
                    if django_settings_py.DOMAIN !="":
                        domain = django_settings_py.DOMAIN
                    else:
                        domain = request.get_host()
                    # message = "\n".join([_(u"欢迎注册成为我们的用户"),_(u"请访问以下链接,完成验证"),"<a>"+'/'.join([django_settings_py.DOMAIN,'activate',token])+"</a>"])
                    message = "<p>" + _(u'欢迎注册成为我们的用户') + "</p><p>" + _(u'请访问以下链接,完成验证') + "</p><p><a href='"+ domain + "/activate/" + token + "'>" + domain + "/activate/" + token +"</a></p>"
                    sub = _(u'注册用户验证')
                    #发送email
                    try:
                        backend = get_connection(host = django_settings.EMAIL_HOST,port = django_settings.EMAIL_PORT,username = django_settings.EMAIL_HOST_USER,password = django_settings.EMAIL_HOST_PASSWORD,use_ssl = django_settings.EMAIL_USE_SSL)
                        msg = EmailMessage(sub, message, django_settings.EMAIL_HOST_USER, [email],connection = backend)
                        msg.content_subtype = "html"
                        msg.send()
                        # send_mail(_(u'注册用户验证'), message, django_settings.EMAIL_HOST_USER, [email], fail_silently=False)
                    except Exception as e:
                        errors = _(u"邮件发送失败,请联系管理员")
                    return render(request,'page-register.html',{'errors':errors})
        else:
            errors = _(u'用户信息不符合要求！')

    return render(request,'page-register.html',{'errors':errors})

def active_user(request, token):
    try:
        username = token_confirm.confirm_validate_token(token)
    except:
        errors = _(u"验证链接已过期，请重新验证")
        return render(request,'page-register.html',{'errors':errors})
    try:
        user = NewUser.objects.get(username=username)
    except Exception as e:
        errors = _(u"您所验证的用户不存在，请重新注册")
        return render(request,'page-register.html',{'errors':errors})
    user.is_active = True
    user.save()
    errors = _(u"验证成功")
    return render(request,'page-register.html',{'errors':errors})

@login_required
def index(request):
    admin_error = {"error_type":'',"error_msg":''}
    p_all = ''
    onldevs = 0
    ofldevs = 0
    p_list = []
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        admin_error = Public_function.judgment_admin_pwd(request)
    admin_error_json = json.dumps(admin_error)

    dev_online_time = timezone.now() - datetime.timedelta(minutes = 15)
    if request.user.administrator_permission >= 4 or request.user.administrator_permission == 0 :
        p_all = Device.objects.filter(support_mode = '2')
        p_list = [i.mac for i in p_all]
        onldevs = Device.objects.filter(Q(support_mode = 2) & Q(last_heart_time__gte = dev_online_time)).count()
        ofldevs = Device.objects.filter(Q(support_mode = 2) & Q(last_heart_time__lt = dev_online_time)).count()
    elif request.user.administrator_permission < 4 and request.user.administrator_permission != 0 and request.user.group_status == 1:
        p_all = Device.objects.filter(Q(account_group_name = request.user.groupname)&Q(support_mode = '2'))
        p_list = [i.mac for i in p_all]
        onldevs = Device.objects.filter(Q(account_group_name = request.user.groupname)&Q(support_mode = 2) & Q(last_heart_time__gte = dev_online_time)).count()
        ofldevs = Device.objects.filter(Q(account_group_name = request.user.groupname)&Q(support_mode = 2) & Q(last_heart_time__lt = dev_online_time)).count()
        ##########xuyaoxiugai##################

    threeg = 0
    car = 0
    other = 0
    for p in p_all:
        j = judge_sn(p.sn,6,2)
        if j == '3g' or j == '4g':
            threeg += 1
        elif j == 'other':
            other += 1
        elif j == 'car':
            car += 1

    # ofldevs = threeg + other + car - int(onldevs)
    probe = {'online':onldevs,'offline':ofldevs,'3g':str(threeg),'car':str(car),'other':str(other)}

    plimit = get_plimit()

    oemlimit = get_oemlimit()
    return render(request,'index.html',{'probe':probe,'admin_error_json':admin_error_json,'admin_error':admin_error,'plimit':plimit,'oemlimit':oemlimit})

def judge_sn(sn,num,add):
    if sn[:6] == '010107':
        return 'car'
    else:
        if sn[int(num):int(num)+int(add)] == '3G' or sn[int(num):int(num)+int(add)] == '3T':
            return '3g'
        elif sn[int(num):int(num)+int(add)] == '4G' or sn[int(num):int(num)+int(add)] == '4T':
            return '4g'
        else:
            return 'other'


def sort_type_change(request):
    sort_type = request.GET.get('type')
    top = []
    p_list = []
    if request.user.administrator_permission >= 4 or request.user.administrator_permission == 0 :
        p_list = [i.mac for i in Device.objects.filter(support_mode = '2')]
    elif request.user.administrator_permission < 4 and request.user.administrator_permission != 0 and request.user.group_status == 1:
        # p_all = Device.objects.filter(account_group_name = request.user.groupname)
        p_list = [i.mac for i in Device.objects.filter(Q(account_group_name = request.user.groupname)&Q(support_mode = '2'))]
        ##########xuyaoxiugai##################
    if sort_type == '1':
        # top1 = {'mac':'a4e6b1300005','hour':'1h30min22s'}
        # top2 = {'mac':'fcad0f0344b1','hour':'1h30min25s'}
        # top = [top1,top2]
        top = DataQuery.DQGetTopItem("all", "onlinetime", p_list)

    elif sort_type == '2':
        # top2 = {'mac':'a4e6b1300005','upload':'11111mb'}
        # top1 = {'mac':'fcad0f0344b1','upload':'111121mb'}
        # top = [top1,top2]
        top = DataQuery.DQGetTopItem("all", "upload", p_list)

    try:
        for t in top:
            name = ''
            state = ''
            name = Device.objects.get(mac = t['mac']).name
            state = state_check(t['mac'])
            if name == '':
                name = Device.objects.get(mac = t['mac']).model+ '_' + t['mac'][6:12]
            t['name'] = name
            t['state'] = state
    except Exception as e:
        print e

    return JsonResponse(top,safe = False)

def chartajax(request):
    net_type = request.GET.get('type')
    p_list = []
    data = {
        'type':'3G',
        'mac':[],
        'upload':[],
        'download':[],
        'name':[],
    }
    if net_type == '3g':
        data = {
        'type':'3G',
        'mac':[],
        'upload':[],
        'download':[],
        'name':[],
    }
    elif net_type == '4g':
        data = {
        'type':'4G',
        'mac':[],
        'upload':[],
        'download':[],
        'name':[],
    }
    elif net_type == 'car':
        data = {
        'type':_(u'车载'),
        'mac':[],
        'upload':[],
        'download':[],
        'name':[],
    }
    elif net_type == 'normal':
        data = {
        'type':_(u'普通'),
        'mac':[],
        'upload':[],
        'download':[],
        'name':[],
    }
    if request.user.administrator_permission >= 4 or request.user.administrator_permission == 0 :
        p_list = [i.mac for i in Device.objects.filter(support_mode = '2')]
    elif request.user.administrator_permission < 4 and request.user.administrator_permission != 0 and request.user.group_status == 1:
        # p_all = Device.objects.filter(account_group_name = request.user.groupname)
        p_list = [i.mac for i in Device.objects.filter(Q(account_group_name = request.user.groupname)&Q(support_mode = '2'))]
        ##########xuyaoxiugai##################
    DataQuery.DQGetTopItemByDtype(data, net_type, p_list)


    try:
        for t in data['mac']:
            name = ''
            name = Device.objects.get(mac = t).name
            if name == '':
                name = Device.objects.get(mac = t).model+ '_' + t[6:12]
            #print 11111
            #print name
            #print 22222
            data['name'].append(name)
    except Exception as e:
        print e

    #print json.dumps(data)
    return JsonResponse(data)

def check_mac(mac):
    try:
        d = Device.objects.get(mac = mac)
        result = True
    except Exception as e:
        result = False

    return result

def warningajax(request):
    warning_type = request.GET.get('type')
    top = []
    p_list = []
    if request.user.administrator_permission >= 4 or request.user.administrator_permission == 0 :
        p_list = [i.mac for i in Device.objects.filter(support_mode = '2')]
    elif request.user.administrator_permission < 4 and request.user.administrator_permission != 0 and request.user.group_status == 1:
        # p_all = Device.objects.filter(account_group_name = request.user.groupname)
        p_list = [i.mac for i in Device.objects.filter(Q(account_group_name = request.user.groupname)&Q(support_mode = '2'))]
        ##########xuyaoxiugai##################
    if warning_type == 'cpu':
        # top1 = {'mac':'a4e6b1300005','type':'CPU','num':'90%','name':'','ip':'192.168.1.79:36401','version':'3.04.16.171100','time':'2017-04-26 18:12:39'}
        # top2 = {'mac':'fcad0f0344b1','type':'CPU','num':'90%','name':'','ip':'192.168.1.79:36401','version':'3.04.16.171100','time':'2017-04-26 18:12:39'}
        # top = [top1,top2]
        top = DataQuery.DQGetWarnByDtype('CPU', p_list)
    elif warning_type == 'flash':
        # top1 = {'mac':'a4e6b1300005','type':'FLASH','num':'90%','name':'','ip':'192.168.1.79:36401','version':'3.04.16.171100','time':'2017-04-26 18:12:39'}
        # top2 = {'mac':'fcad0f0344b1','type':'FLASH','num':'90%','name':'','ip':'192.168.1.79:36401','version':'3.04.16.171100','time':'2017-04-26 18:12:39'}
        # top = [top1,top2]
        top = DataQuery.DQGetWarnByDtype('FLASH', p_list)
    elif warning_type == 'memory':
        # top1 = {'mac':'a4e6b1300005','type':'MEMORY','num':'90%','name':'','ip':'192.168.1.79:36401','version':'3.04.16.171100','time':'2017-04-26 18:12:39'}
        # top2 = {'mac':'fcad0f0344b1','type':'MEMORY','num':'90%','name':'','ip':'192.168.1.79:36401','version':'3.04.16.171100','time':'2017-04-26 18:12:39'}
        # top = [top1,top2]
        top = DataQuery.DQGetWarnByDtype('MEMORY', p_list)

    try:
        for t in top:
            name = ''
            state = ''
            name = Device.objects.get(mac = t['mac']).name
            state = state_check(t['mac'])
            if name == '':
                name = Device.objects.get(mac = t['mac']).model+ '_' + t['mac'][6:12]
            t['name'] = name
            t['state'] = state
    except Exception as e:
        print e
    return JsonResponse(top,safe = False)



def reSendCheckMail(request):
    username = request.POST.get('username')
    django_settings = Setting.objects.get(SIGN = 1)
    error = {
        'type':'fail',
        'info':''
    }
    if NewUser.objects.filter(username = username).exists():
        user = NewUser.objects.get(username = username)

        error['info'] = _(u"邮件发送成功")
        error['type'] = 'success'
        token = token_confirm.generate_validate_token(username)
        if django_settings_py.DOMAIN !="":
            domain = django_settings_py.DOMAIN
        else:
            domain = request.get_host()
        # message = "\n".join([_(u"欢迎注册成为我们的用户"),_(u"请访问以下链接,完成验证"),"<a>"+'/'.join([django_settings_py.DOMAIN,'activate',token])+"</a>"])
        message = "<p>" + _(u'欢迎注册成为我们的用户') + "</p><p>" + _(u'请访问以下链接,完成验证') + "</p><p><a href='"+ domain + "/activate/" + token + "'>" + domain + "/activate/" + token +"</a></p>"
        sub = _(u'注册用户验证')
        #发送email
        try:
            backend = get_connection(host = django_settings.EMAIL_HOST,port = django_settings.EMAIL_PORT,username = django_settings.EMAIL_HOST_USER,password = django_settings.EMAIL_HOST_PASSWORD,use_ssl = django_settings.EMAIL_USE_SSL)
            msg = EmailMessage(sub, message, django_settings.EMAIL_HOST_USER, [user.email],connection = backend)
            msg.content_subtype = "html"
            msg.send()
            # send_mail(_(u'注册用户验证'), message, django_settings.EMAIL_HOST_USER, [email], fail_silently=False)
        except Exception as e:
            error['info'] = _(u"邮件发送失败,请联系管理员")
            error['type'] = 'fail'
    else:
        error['info'] = _(u"用户名不存在！")
        error['type'] = 'fail'

    return JsonResponse(error,safe = False)
