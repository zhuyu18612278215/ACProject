#coding=utf-8
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy as lazy_
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth import login,authenticate
from account.models import NewUser,Account_Group
from device.models import Device,Device_probe,Probe_group
from django.contrib.auth.decorators import login_required
import models
import json
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.http import HttpResponse,HttpResponseRedirect
from forms import ImageForm
from django.utils import timezone
import datetime
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
import time
import pytz
import urllib2
import hashlib
from ouilist import ouiarr
from django.contrib.auth.hashers import check_password
from django.contrib.auth import update_session_auth_hash
import sys
sys.path.append("DataQuery")
import DataQuery
import Public_function
from system.models import Setting,Page_limit,Oem_limit
import re
import urllib2
from django.core.mail import get_connection
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives,EmailMessage
from django.utils import translation
import hashlib
import os
import urllib
import threading
from auditdevice.models import AuditDevice,AuditDevice_group
# Create your views here.
import commands
import base64
from pyDes import *
import psutil
from ap.tasks import taskForChangeCountryCode

UPGD_FN = ''
DOWN_PRO = ''
CANCEL = False
UNIQUE_SIGN = ''
ERROR_EVENT = {'sign':'','error':''}

Des_Key = "bzwl^&*("
Des_IV = "salt#&@!"

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



@login_required
def support(request):
    admin_error = {"error_type":'',"error_msg":''}
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        admin_error = Public_function.judgment_admin_pwd(request)
    admin_error_json = json.dumps(admin_error)
    plimit = get_plimit()
    return render(request,'support.html',{'admin_error_json':admin_error_json,'admin_error':admin_error,'plimit':plimit})

@login_required
def mac_search(request):
    mac = request.GET.get('mac')
    m = get_oui_from_mac_address(mac).upper()
    if len(m) < 6:
        errors = _(u'MAC地址不合法')
        mm = ''
        info = ''
    else:
        try:
            info = ouiarr[m]
        except Exception as e:
            print e
            info = 'Unknown Corporation'
        errors = ''
        mm = m[0:2] + '-' + m[2:4] + '-' + m[4:6]
    md = {'info':info,'mac':mm,'errors':errors}
    return JsonResponse(md)

def get_oui_from_mac_address(mac):
    mac3 = mac.replace('-', '').replace(':','')
    return mac3[0:6]


@login_required
def system_account(request):
    user = NewUser.objects.get(id = request.user.id)
    error = {"error_type":'',"error_msg":''}
    userqueryset = {}
    admin_error = {"error_type":'',"error_msg":''}
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        admin_error = Public_function.judgment_admin_pwd(request)
    admin_error_json = json.dumps(admin_error)
    try:
        if request.session.get('error_dict') != None:
            error = request.session.get('error_dict')
        # print errors
        del request.session['error_dict']
    except Exception as e:
        pass
    error_json = json.dumps(error)
    if request.user.administrator_permission == 0:
        userqueryset = NewUser.objects.exclude(administrator_permission = 0)
    if request.user.administrator_permission in [4,5,6]:
        userqueryset = NewUser.objects.exclude(administrator_permission = 0).exclude(username = request.user.username).filter(administrator_permission__lt = request.user.administrator_permission)
    if request.user.administrator_permission in [2,3] and request.user.groupname != "":
        userqueryset = NewUser.objects.exclude(administrator_permission = 0).exclude(username = request.user.username).filter(administrator_permission__lt = request.user.administrator_permission).filter(groupname = request.user.groupname).exclude(group_status = 4).exclude(group_status = 5)
    if request.user.administrator_permission == 1 and request.user.groupname != "" and request.user.group_status in [4,5]:
        userqueryset = NewUser.objects.filter(username = request.user.username)
    if request.user.administrator_permission == 1 and request.user.groupname == "" and request.user.group_status  == 6:
        userqueryset = NewUser.objects.filter(username = request.user.username)
    plimit = get_plimit()
    return render(request,'system-account.html',{'userqueryset':userqueryset,'myaccount':user,'error':error,"error_json":error_json,'admin_error_json':admin_error_json,'admin_error':admin_error,'plimit':plimit})

@login_required
def create_user(request):
    if request.method == "POST":
        error = {"error_type":'failed',"error_msg":_(u"创建失败")}
        if request.user.administrator_permission == 0 or request.user.administrator_permission == 6 or request.user.administrator_permission == 5:
            administrator_permission = int(request.POST.get('administrator_permission'))
            language = request.POST.get('language')
            username = request.POST.get('username')
            password = request.POST.get('password')
            two_password = request.POST.get('two_password')
            if request.POST.get('email_alert') == "on":
                email_alert = 1
            else:
                email_alert = 0
            email = request.POST.get('email')
            admin_password = request.POST.get('admin_password')
            if len(NewUser.objects.filter(username = username)) == 0:
                if password == two_password:
                    if len(NewUser.objects.exclude(email = '').filter(email = email)) == 0:
                        if check_password(admin_password,NewUser.objects.get(id = request.user.id).password):
                            user = NewUser()
                            user.username = username
                            user.set_password(password)
                            user.administrator_permission = administrator_permission
                            user.email = email
                            user.email_alert = email_alert
                            user.language = language
                            user.groupname = 'admin'
                            user.group_status = 1
                            try:
                                user.save()
                                error = {"error_type":'success',"error_msg":_(u"创建成功")}
                            except Exception as e:
                                print e
                                error = {"error_type":'failed',"error_msg":_(u"创建失败")}
                        else:
                            error = {"error_type":'failed',"error_msg":_(u"管理员密码错误")}
                    else:
                        error = {"error_type":'failed',"error_msg":_(u"邮箱已存在")}
                else:
                    error = {"error_type":'failed',"error_msg":_(u"两次密码不一致")}
            else:
                error = {"error_type":'failed',"error_msg":_(u"用户名已存在")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"您不是管理员")}
        # request.session['error_dict'] = error
    return JsonResponse(error,safe = False)

@login_required
def user_del(request):
    username = request.GET.get('username')
    user = NewUser.objects.get(username = username)
    try:
        if user.administrator_permission == 3:
            Account_Group.objects.filter(groupname = user.groupname).delete()
            pa = Probe_group.objects.get(account_group_name = 'admin',group_name = 'DefaultGroup',group_type = '2').pk
            a = Device.objects.filter(account_group_name = user.groupname,support_mode = '2')
            Device.objects.filter(account_group_name = user.groupname,support_mode = '2').update(group_id = pa,account_group_name = 'admin')
            pb = Probe_group.objects.get(account_group_name = 'admin',group_name = 'DefaultGroup',group_type = '1').pk
            b = Device.objects.filter(account_group_name = user.groupname,support_mode = '1')
            Device.objects.filter(account_group_name = user.groupname,support_mode = '1').update(group_id = pb,account_group_name = 'admin')
            pau = AuditDevice_group.objects.get(account_group_name = 'admin',group_name = 'DefaultGroup').pk
            au = AuditDevice.objects.filter(account_group_name = user.groupname)
            AuditDevice.objects.filter(account_group_name = user.groupname).update(group_id = pau,account_group_name = 'admin')

            pn = Probe_group.objects.get(account_group_name = 'admin',group_name = 'DefaultGroup',group_type = '3').pk
            n = Device.objects.filter(account_group_name = user.groupname,support_mode = '3')
            Device.objects.filter(account_group_name = user.groupname,support_mode = '3').update(group_id = pn,account_group_name = 'admin')

            for i in a:
                #audit config str

                astr = '{"audit":{'
                print i.mac

                # dev = model_to_dict(models.Probe_audit_dev_status.objects.get(mac = mac))
                dev = audit_setting_compare(i.mac,1,"dev")
                dev.pop('mac')
                dev.pop('id')
                DataQuery.DQClearNullValeForDict(dev)
                dstr = json.dumps(dev, sort_keys=True, ensure_ascii=False)
                dstr = dstr.replace(" ", '')
                #print dstr
                astr = astr + '"device":' + dstr + ','

                # place = model_to_dict(models.Probe_audit_place_status.objects.get(mac = mac))
                place = audit_setting_compare(i.mac,1,"place")
                place.pop('mac')
                place.pop('id')
                DataQuery.DQClearNullValeForDict(place)
                pstr = json.dumps(place, sort_keys=True, ensure_ascii=False)
                pstr = pstr.replace(" ", '')
                #print pstr
                astr = astr + '"site":' + pstr + ','

                # basic = model_to_dict(models.Probe_audit_basic_status.objects.get(mac = mac))
                basic = audit_setting_compare(i.mac,1,"basic")
                basic.pop('mac')
                basic.pop('id')
                DataQuery.DQClearNullValeForDict(basic)
                bstr = json.dumps(basic, sort_keys=True, ensure_ascii=False)
                bstr = bstr.replace(" ", '')
                #print bstr
                astr = astr + '"system":' + bstr + "}}"

                # print "ZZZZZZZZZZ"
                # print type(astr.encode("utf-8"))
                DataQuery.DQSetUpdateConfig("audit", i.mac, astr.encode("utf-8"))

                # print astr
                #basic = model_to_dict(models.Probe_audit_basic_status.objects.get(mac = mac))
                #dev = model_to_dict(models.Probe_audit_dev_status.objects.get(mac = mac))
                #place = model_to_dict(models.Probe_audit_place_status.objects.get(mac = mac))

            Probe_group.objects.filter(account_group_name = user.groupname).delete()
            AuditDevice_group.objects.filter(account_group_name = user.groupname).delete()
            NewUser.objects.filter(groupname = user.groupname).update(groupname = '',group_status = 0)

        user.delete()
        error = {"error_type":'success',"error_msg":_(u"删除成功")}
    except Exception as e:
        error = {"error_type":'failed',"error_msg":_(u"删除失败")}

    request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def create_area(request):
    if request.method == "POST":
        groupname = request.user.username
        if len(Account_Group.objects.filter(groupname = groupname)) == 0:
            if int(request.user.administrator_permission) == 1 and request.user.groupname == "":
                group = Account_Group()
                group.groupname = groupname
                user = NewUser.objects.get(username = request.user.username)
                user.groupname = groupname
                user.group_status = 1
                user.administrator_permission = 3

                aud_gp = AuditDevice_group()
                aud_gp.group_name = groupname
                aud_gp.account_group_name = groupname

                probe_group = Probe_group()
                probe_group.group_name = groupname
                probe_group.account_group_name = groupname
                probe_group.group_type = '2'
                ap_group = Probe_group()
                ap_group.group_name = groupname
                ap_group.account_group_name = groupname
                ap_group.group_type = '1'
                nonoperate_group = Probe_group()
                nonoperate_group.group_name = groupname
                nonoperate_group.account_group_name = groupname
                nonoperate_group.group_type = '3'
                try:
                    group.save()
                    user.save()
                    probe_group.save()
                    ap_group.save()
                    aud_gp.save()
                    nonoperate_group.save()
                    error = {"error_type":'success',"error_msg":_(u"创建成功")}
                except Exception as e:
                    error = {"error_type":'failed',"error_msg":_(u"创建失败")}
            else:
                error = {"error_type":'failed',"error_msg":_(u"不符合创建要求")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"管理域已存在")}
        request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def add_area(request):
    if request.method == "POST":
        name = request.POST.get('name')
        administrator_permission = int(request.POST.get('administrator_permission'))
        if len(Account_Group.objects.filter(groupname = name)) != 0:
            if int(request.user.administrator_permission) == 1 and request.user.groupname == "":
                user = NewUser.objects.get(username = request.user.username)
                user.groupname = name
                if administrator_permission == 1:
                    user.group_status = 2
                elif administrator_permission == 2:
                    user.group_status = 3
                try:
                    user.save()
                    error = {"error_type":'success',"error_msg":_(u"加入成功")}
                except Exception as e:
                    error = {"error_type":'failed',"error_msg":_(u"加入失败")}
            else:
                error = {"error_type":'failed',"error_msg":_(u"不符合加入要求")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"管理域不存在")}
        request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def invite_user(request):
    if request.method == "POST":
        name = request.POST.get('name')
        administrator_permission = int(request.POST.get('administrator_permission'))
        if len(NewUser.objects.filter(username = name)) != 0:
            if NewUser.objects.get(username = name).administrator_permission == 1 and NewUser.objects.get(username = name).groupname == '' and NewUser.objects.get(username = name).group_status == 0:
                user = NewUser.objects.get(username = name)
                user.groupname = request.user.groupname
                if administrator_permission == 2:
                    user.group_status = 5
                elif administrator_permission == 1:
                    user.group_status = 4
                try:
                    user.save()
                    error = {"error_type":'success',"error_msg":_(u"邀请成功")}
                except Exception as e:
                    error = {"error_type":'failed',"error_msg":_(u"邀请失败")}
            else:
                error = {"error_type":'failed',"error_msg":_(u"不符合邀请要求")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"用户不存在")}
        request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def agree(request):
    username = request.GET.get('username')
    user = NewUser.objects.get(username = username)
    if user.group_status == 2 or user.group_status == 4:
        user.administrator_permission = 1
        user.group_status = 1
    if user.group_status == 3 or user.group_status == 5:
        user.administrator_permission = 2
        user.group_status = 1
    try:
        user.save()
        error = {"error_type":'success',"error_msg":_(u"操作成功")}
    except Exception as e:
        error = {"error_type":'failed',"error_msg":_(u"操作失败")}
    request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def refuse(request):
    username = request.GET.get('username')
    user = NewUser.objects.get(username = username)
    user.administrator_permission = 1
    user.group_status = 6
    user.groupname = ''
    try:
        user.save()
        error = {"error_type":'success',"error_msg":_(u"操作成功")}
    except Exception as e:
        error = {"error_type":'failed',"error_msg":_(u"操作失败")}
    request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def group_user_move(request):
    username = request.GET.get('username')
    user = NewUser.objects.get(username = username)
    user.administrator_permission = 1
    user.group_status = 0
    user.groupname = ''
    try:
        user.save()
        error = {"error_type":'success',"error_msg":_(u"操作成功")}
    except Exception as e:
        error = {"error_type":'failed',"error_msg":_(u"操作失败")}
    request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def user_modify(request):
    username = request.GET.get('username')
    user = NewUser.objects.get(username = username)
    data = {
        'id':user.id,
        'administrator_permission':user.administrator_permission,
        'language':user.language,
        'username':user.username,
        'email_alert':user.email_alert,
        'email':user.email,
    }
    return JsonResponse(data,safe = False)

@login_required
def change_user(request):
    if request.method == "POST":
        error = {"error_type":'failed',"error_msg":_(u"修改失败")}
        if request.user.administrator_permission == 0 or request.user.administrator_permission == 6 or request.user.administrator_permission == 5:
            administrator_permission = int(request.POST.get('administrator_permission'))
            language = request.POST.get('language')
            username = request.POST.get('username')
            password = request.POST.get('password')
            two_password = request.POST.get('two_password')
            user_id = request.POST.get('id')
            if request.POST.get('email_alert') == "on":
                email_alert = 1
            else:
                email_alert = 0
            email = request.POST.get('email')
            admin_password = request.POST.get('admin_password')
            if len(NewUser.objects.exclude(id = user_id).filter(username = username)) == 0:
                if password == two_password:
                    if len(NewUser.objects.exclude(id = user_id).exclude(email = '').filter(email = email)) == 0:
                        if check_password(admin_password,NewUser.objects.get(id = request.user.id).password):
                            user = NewUser.objects.get(id = user_id)
                            user.username = username
                            if password != '':
                                user.set_password(password)
                            user.administrator_permission = administrator_permission
                            user.email = email
                            user.email_alert = email_alert
                            user.language = language
                            try:
                                user.save()
                                error = {"error_type":'success',"error_msg":_(u"修改成功")}
                            except Exception as e:
                                print e
                                error = {"error_type":'failed',"error_msg":_(u"修改失败")}
                        else:
                            error = {"error_type":'failed',"error_msg":_(u"管理员密码错误")}
                    else:
                        error = {"error_type":'failed',"error_msg":_(u"邮箱已存在")}
                else:
                    error = {"error_type":'failed',"error_msg":_(u"两次密码不一致")}
            else:
                error = {"error_type":'failed',"error_msg":_(u"用户名已存在")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"您不是管理员")}
        # request.session['error_dict'] = error
    return JsonResponse(error,safe = False)

@login_required
def change_reg(request):
    if request.method == "POST":
        if request.user.administrator_permission == 3:
            administrator_permission = int(request.POST.get('administrator_permission'))
            username = request.POST.get('username')
            user_id = request.POST.get('id')

            user = NewUser.objects.get(id = user_id)
            user.administrator_permission = administrator_permission
            if user is not None:
                user.save()
                error = {"error_type":'success',"error_msg":_(u"修改成功")}

        else:
            error = {"error_type":'failed',"error_msg":_(u"您不是管理员")}
        request.session['error_dict'] = error
    return redirect('/system/account/')

@login_required
def language_save(request):
    if request.method == 'POST':
        language = (request.POST.get('language')).lower()
        u = (NewUser.objects.get(id = request.user.id).language).lower()
        if u != language:
            ul = NewUser.objects.get(id = request.user.id)
            ul.language = language
            ul.save()
            translation.activate(language)
            request.session[translation.LANGUAGE_SESSION_KEY] = language
        return JsonResponse(str(NewUser.objects.get(id = request.user.id).language),safe = False)


@login_required
def basic_change(request):
    if request.method == "POST":
        form = ImageForm(request.POST,request.FILES)
        email = request.POST.get("email")
        company = request.POST.get("company")
        tell = request.POST.get("tell")
        if len(NewUser.objects.exclude(id = request.user.id).filter(email = email)) == 0:
            if form.is_valid() or request.POST.get('headpic') == '':
                user = NewUser.objects.get(id = request.user.id)
                user.email = email
                user.company = company
                user.tell = tell
                if form.is_valid():
                    user.headpic = form.cleaned_data['headpic']
                try:
                    user.save()
                    error = {"error_type":'success',"error_msg":_(u"修改成功")}
                except Exception as e:
                    print e
                    error = {"error_type":'failed',"error_msg":_(u"修改失败")}
            else:
                error = {"error_type":'failed',"error_msg":_(u"图片不符合要求")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"邮箱已存在")}

        request.session['error_dict'] = error
    return redirect('/system/account/')


@login_required
def passwd_change(request):
    if request.method == "POST":
        old_passwd = request.POST.get("old_passwd")
        new_passwd = request.POST.get("new_passwd")
        again_passwd = request.POST.get("again_passwd")
        error = {"error_type":'',"error_msg":_(u"修改失败")}
        if check_password(old_passwd,NewUser.objects.get(id = request.user.id).password):
            if new_passwd == again_passwd:
                user = NewUser.objects.get(id = request.user.id)
                user.set_password(new_passwd)
                try:
                    user.save()
                    update_session_auth_hash(request,user)
                    error = {"error_type":'success',"error_msg":_(u"修改成功")}
                except Exception as e:
                    print e
                    error = {"error_type":'failed',"error_msg":_(u"修改失败")}
            else:
                error = {"error_type":'failed',"error_msg":_(u"两次密码不一致")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"原密码错误")}

        # request.session['error_dict'] = error
    return JsonResponse(error,safe = False)


@login_required
def system_service(request):
    admin_error = {"error_type":'',"error_msg":''}
    error = {"error_type":'',"error_msg":''}
    pro = 0
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        admin_error = Public_function.judgment_admin_pwd(request)
    admin_error_json = json.dumps(admin_error)
    try:
        if request.session.get('error_dict') != None:
            error = request.session.get('error_dict')
        # print errors
        del request.session['error_dict']
    except Exception as e:
        pass
    error_json = json.dumps(error)
    try:

        global UNIQUE_SIGN,DOWN_PRO,ERROR_EVENT
        #print ERROR_EVENT,111111111111111111111,UNIQUE_SIGN
        if request.session['unique_sign'] == UNIQUE_SIGN:
            #print 3213123213212123321
            pro = DOWN_PRO
    except Exception as e:
        print 3333333333333
        print e

    plimit = get_plimit()
    return render(request,'system-service.html',{'admin_error_json':admin_error_json,'admin_error':admin_error,'error':error,"error_json":error_json,"pro":pro,'plimit':plimit})

# psutil.cpu_percent(0.5)
# mem = psutil.virtual_memory()
# round(float(mem.used) / float(mem.total) * 100, 1)
# round(float(mem.cached) / float(mem.total) * 100, 1)
# disk=psutil.disk_usage('/')
# round(float(disk.used) / float(disk.total) * 100, 1)
# DataQuery.DQGetServerResponseTime()

@login_required
def system_status(request):
    admin_error = {"error_type":'',"error_msg":''}
    error = {"error_type":'',"error_msg":''}
    pro = 0
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        admin_error = Public_function.judgment_admin_pwd(request)
    admin_error_json = json.dumps(admin_error)
    try:
        if request.session.get('error_dict') != None:
            error = request.session.get('error_dict')
        # print errors
        del request.session['error_dict']
    except Exception as e:
        pass
    error_json = json.dumps(error)
    try:

        global UNIQUE_SIGN,DOWN_PRO,ERROR_EVENT
        #print ERROR_EVENT,111111111111111111111,UNIQUE_SIGN
        if request.session['unique_sign'] == UNIQUE_SIGN:
            #print 3213123213212123321
            pro = DOWN_PRO
    except Exception as e:
        print 3333333333333
        print e

    plimit = get_plimit()
    return render(request,'system-status.html',{'admin_error_json':admin_error_json,'admin_error':admin_error,'error':error,"error_json":error_json,"pro":pro,'plimit':plimit})


def system_status_ajax(request):
    data = {"cpuused":1, "memerused":1, "diskused":1, "cachedused":1, "restime":1}
    if request.GET.get('type') == '1':
        try:
            mem = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            cpuused = psutil.cpu_percent(0.3)
            if cpuused == 0:
                data['cpuused'] = 1
            else:
                data['cpuused'] = cpuused
            data['memerused'] = round(float(mem.total - mem.free) / float(mem.total) * 100, 1)
            data['diskused'] = round(float(disk.used) / float(disk.total) * 100, 1)
            data['cachedused'] = round(float(mem.cached) / float(mem.total) * 100, 1)
            data['restime'] = DataQuery.DQGetServerResponseTime()
        except Exception as e:
            print e
        return JsonResponse(data, safe = False)

@login_required
def device_version_address(request):
    if request.method == "POST":
        django_settings = Setting.objects.get(SIGN = 1)
        version_service_address = request.POST.get("version_service_address")
        try:
            django_settings.VERSION_SERVER_URL = version_service_address
            django_settings.save()
            error = {"error_type":'success',"error_msg":_(u"修改成功")}
        except Exception as e:
            print e
            error = {"error_type":'failed',"error_msg":_(u"修改失败")}

        request.session['error_dict'] = error
    return redirect('/system/system_service/')

def django_settings_ajax(request):
    s = model_to_dict(Setting.objects.get(SIGN = 1))
    return JsonResponse(s)

@login_required
def email_address(request):
    if request.method == "POST":
        django_settings = Setting.objects.get(SIGN = 1)
        email_service_address = request.POST.get("email_service_address")
        ssl = request.POST.get("ssl")
        email_port = request.POST.get("email_port")
        sender_address = request.POST.get("sender_address")
        sender_password = request.POST.get("sender_password")
        if email_port.isdigit():
            email_port = int(email_port)
            if ssl == "on":
                ssl = True
            else:
                ssl = False
            try:
                django_settings.EMAIL_HOST = email_service_address
                django_settings.EMAIL_HOST_USER = sender_address
                django_settings.EMAIL_HOST_PASSWORD = sender_password
                django_settings.EMAIL_PORT = email_port
                django_settings.EMAIL_USE_SSL = ssl
                django_settings.save()

                error = {"error_type":'success',"error_msg":_(u"修改成功")}
            except Exception as e:
                print e
                error = {"error_type":'failed',"error_msg":_(u"修改失败")}
        else:
            error = {"error_type":'failed',"error_msg":_(u"端口号必须为数字")}
        request.session['error_dict'] = error
    return redirect('/system/system_service/')

def test_email(request):
    errors = ''
    if request.method == "POST":
        email_service_address = request.POST.get('email_service_address')
        if request.POST.get('ssl') == 'true':
            ssl = True
        elif request.POST.get('ssl') == 'flase':
            ssl = False
        print ssl
        email_port = int(request.POST.get('email_port'))
        sender_address = request.POST.get('sender_address')
        sender_password = request.POST.get('sender_password')
        send_to = request.POST.get('send_to')

        message = "<p>" + _(u'邮件服务器测试') + "</p>"
        sub = _(u'邮件服务器测试')
        #发送email
        try:
            backend = get_connection(host = email_service_address,port = email_port,username = sender_address,password = sender_password,use_ssl = ssl)
            msg = EmailMessage(sub, message, sender_address, [send_to],connection = backend)
            print sub,message,sender_address,send_to,backend
            msg.content_subtype = "html"
            print msg.content_subtype
            msg.send()
            errors = _(u"邮件发送成功")
        except Exception as e:
            print e
            errors = _(u"邮件发送失败")
        return JsonResponse({'errors':errors},safe = False)

def system_version_ajax(request):
    version = {'version':'','SYSTEM_VERSION_SERVER_URL':'','new_version':''}

    if request.GET.get('type') == '1':
        if Setting.objects.filter(SIGN = 1).exists():
            django_settings = Setting.objects.get(SIGN = 1)
            version['SYSTEM_VERSION_SERVER_URL'] = django_settings.SYSTEM_VERSION_SERVER_URL
            try:
                f = open('./statics/upgrade/wyun_version.info','r')
                data = f.read()
                version['version'] = ''.join(re.findall("(\d\.\d+\.\d+\.\w\d+)",data[:-4]))
                version['new_version'] = find_system_version(version['version'])
            except Exception as e:
                print e
            finally:
                f.close()
        return JsonResponse(version,safe = False)
    if request.GET.get('type') == '2':
        url = request.POST.get('url')
        if Setting.objects.filter(SIGN = 1).exists():
            django_settings = Setting.objects.get(SIGN = 1)
        else:
            django_settings = Setting()
            django_settings.SIGN = 1

        django_settings.SYSTEM_VERSION_SERVER_URL = url
        django_settings.save()
        try:
            f = open('./statics/upgrade/wyun_version.info','r')
            data = f.read()
            version['version'] = ''.join(re.findall("(\d\.\d+\.\d+\.\w\d+)",data[:-4]))
            version['SYSTEM_VERSION_SERVER_URL'] = url
            version['new_version'] = find_system_version(version['version'])
        except Exception as e:
            print e
        finally:
            f.close()
        return JsonResponse(version,safe = False)


def find_system_version(version):
    url = newGetUrl('SYSTEM_VERSION_SERVER_URL')
    website = urllib2.urlopen(url,timeout = 1)
    html = website.read()
    links = re.findall('href="(.*)">wityun', html)
    links.sort(reverse = True)
    if len(links) != 0:
        new_version = ''.join(re.findall("(\d\.\d+\.\d+\.\w\d+)",links[0][:-4]))
        if new_version > version:
            return new_version
        else:
            return ''
    else:
        return ''



def upgrade_ajax(request):
    a = 0
    error = ''
    url = newGetUrl('SYSTEM_VERSION_SERVER_URL')
    global UPGD_FN,UNIQUE_SIGN,ERROR_EVENT
    UPGD_FN = ''
    if os.path.exists("./statics/upgrade/upgrade.lock") and request.session['unique_sign'] != UNIQUE_SIGN:
        error = _(u'正在升级中')
    else:
        #print UNIQUE_SIGN,1111111,request.session['unique_sign']
        if request.session['unique_sign'] != UNIQUE_SIGN:
            os.system("touch ./statics/upgrade/upgrade.lock")
            os.system("rm  ./statics/upgrade/upgrade.bin")
            os.system("rm  ./statics/upgrade/was_version")

            try:
                website = urllib2.urlopen(url)
                html = website.read()
                version = re.findall('href="(.*)">wityun', html)
                message = re.findall('href="(.*)">was', html)
            except Exception as e:
                print e
                version = []
                message = []
                os.system("rm ./statics/upgrade/upgrade.lock ")
            version.sort(reverse = True)

            if len(version) != 0 and len(message) != 0:
                new_version = version[0]
                new_message = message[0]
                try:
                    global DOWN_PRO
                    UPGD_FN = new_version
                    DOWN_PRO = ''
                    urllib.urlretrieve(url+new_message,"./statics/upgrade/"+new_message)
                    # urllib.urlretrieve(url+new_version,"./statics/upgrade/"+new_version,Schedule)
                    ERROR_EVENT = {'sign':'','error':''}
                    UNIQUE_SIGN = request.session['unique_sign']
                    download_file(url+new_version,"./statics/upgrade/"+new_version,Schedule)
                    m = open("./statics/upgrade/"+new_message)
                    try:
                        for i in m.readlines():
                            if "md5" in i :
                                g = i.split(' ')[0].split(':')[1]
                        g2 = get_md5("./statics/upgrade/"+new_version)
                        if g == g2:
                            a = 1
                        else:
                            a = 0
                            error = _(u'版本校验失败')
                            os.system("rm  ./statics/upgrade/"+new_version)
                            os.system("rm  ./statics/upgrade/"+new_message)
                    except Exception as e:
                        print e
                        error = _(u'版本校验失败')
                    finally:
                        m.close()
                except Exception as e:
                    print e
                    error = _(u'下载失败')
                if error != '':
                    os.system("rm ./statics/upgrade/upgrade.lock")
            if a == 1 and error == '':
                os.system("chmod 777 ./statics/upgrade/"+new_version)
                os.system("mv ./statics/upgrade/"+new_version+" ./statics/upgrade/upgrade.bin" )
                os.system("rm ./statics/upgrade/upgrade.lock ")
                os.system("touch /opt/venv/update")
            ERROR_EVENT = {'sign':'1','error':error}
            # print ERROR_EVENT
        else:
            #print 23232323232
            while 1:
                if ERROR_EVENT['sign'] == '1':
                    error  = ERROR_EVENT['error']
                    ERROR_EVENT = {'sign':'','error':''}
                    break
        UPGD_FN = ''
        try:
            UNIQUE_SIGN = ''
        except Exception as e:
            print e


    return JsonResponse({'error':error})

def Schedule(a,b,c):
    '''''
    a:已经下载的数据块
    b:数据块的大小
    c:远程文件的大小
    '''
    per = 100.0 * a * b / c
    if per > 100 :
        per = 100
    # print '%.2f' % per
    global DOWN_PRO
    DOWN_PRO = float('%.2f' % per)


def get_md5(file_path):
    md5 = None
    if os.path.isfile(file_path):
        f = open(file_path,'rb')
        md5_obj = hashlib.md5()
        md5_obj.update(f.read())
        hash_code = md5_obj.hexdigest()
        f.close()
        md5 = str(hash_code).lower()
    return md5

def local_upload(request):
    a = 0
    error = ''
    if os.path.exists("./statics/upgrade/upgrade.lock"):
        error = _(u'正在升级中')
    else:
        os.system("touch ./statics/upgrade/upgrade.lock")
        os.system("rm  ./statics/upgrade/upgrade.bin")
        os.system("rm  ./statics/upgrade/was_version")

        if request.method == "POST":    # 请求方法为POST时，进行处理
            upfile =request.FILES.get("file", None)    # 获取上传的文件，如果没有文件，则默认为None
            if not upfile:
                error = _(u"没有选择文件")
            else:
                try:
                    destination = open("./statics/upgrade/"+upfile.name,'wb+')    # 打开特定的文件进行二进制的写操作
                    try:
                        for chunk in upfile.chunks():      # 分块写入文件
                            destination.write(chunk)
                    except Exception as e:
                        print e
                        error = _(u"上传文件错误")
                    finally:
                        destination.close()
                except Exception as e:
                    print e
                    error = _(u"上传文件错误")


                if error == '':
                    try:
                        os.system("tar -xvf ./statics/upgrade/"+upfile.name+" -C"+"./statics/upgrade/")
                        try:
                            m = open("./statics/upgrade/was_version")
                            try:
                                for i in m.readlines():
                                    if "md5" in i :
                                        g = i.split(' ')
                                        g1 = g[0].split(':')[1]
                                g2 = get_md5("./statics/upgrade/"+g[2].strip())
                                if g1 == g2:
                                    a = 1
                                else:
                                    a = 0
                                    error = _(u'版本校验失败')
                                    os.system("rm  ./statics/upgrade/"+"was_version")
                                    # os.system("rm  ./statics/upgrade/"+g[2][:-1])
                                    os.system("rm  ./statics/upgrade/"+g[2])
                            except Exception as e:
                                print e
                                error = _(u'版本校验失败')
                            finally:
                                m.close()
                        except Exception as e:
                            print e
                            error = _(u"上传文件错误")
                    except Exception as e:
                        print e
                        error = _(u"文件解压失败")
                    if a == 1 and error == '':
                        try:
                            os.system("rm  ./statics/upgrade/"+upfile.name)
                            command_mod = "chmod 777 ./statics/upgrade/"+g[2]
                            command_mv = "mv ./statics/upgrade/"+g[2].strip()+" ./statics/upgrade/upgrade.bin"
                            # print 'command',command_mod,command_mv
                            os.system(command_mod)
                            os.system(command_mv)
                            os.system("rm ./statics/upgrade/upgrade.lock ")
                            os.system("touch /opt/venv/update")


                            # os.system("rm  ./statics/upgrade/"+"was_version")
                            # os.system("rm  ./statics/upgrade/"+g[2][:-1])
                            # os.system("rm  ./statics/upgrade/"+upfile.name)
                        except Exception as e:
                            print e
                            error = _(u"升级失败")
                            os.system("rm  ./statics/upgrade/"+upfile.name)
                    else:
                        os.system("rm  ./statics/upgrade/"+upfile.name)
            if error != '':
                os.system("rm ./statics/upgrade/upgrade.lock")
    return JsonResponse({'error':error})


def upgrade_cancel_ajax(request):
    error = ''
    try:
        global UPGD_FN
        os.system("rm ./statics/upgrade/upgrade.lock")
        os.system("rm  ./statics/upgrade/"+UPGD_FN)
        os.system("rm  ./statics/upgrade/"+"was_version")
    except Exception as e:
        print e
        error = _(u'删除失败')
        UPGD_FN = ''
    global DOWN_PRO,CANCEL,UNIQUE_SIGN
    DOWN_PRO = ''
    CANCEL = True
    try:
        UNIQUE_SIGN = ''
    except Exception as e:
        print e
    return JsonResponse({'error':error},safe = False)

def upgrade_down_pro_ajax(request):
    global DOWN_PRO
    return JsonResponse({'DOWN_PRO':DOWN_PRO},safe = False)


def download_file(url,file_name,reporthook=None):
    u = urllib2.urlopen(url)
    f = open(file_name, 'wb')
    try:
        global CANCEL,DOWN_PRO
        meta = u.info()
        size = int(meta.getheaders("Content-Length")[0])
        blocknum = 0
        read = 0
        bs = 8192
        if reporthook:
            reporthook(blocknum, bs, size)
        while True:
            block = u.read(bs)
            if not block:
                break
            if CANCEL:
                CANCEL = False
                DOWN_PRO = 0
                break
            read += len(block)
            f.write(block)
            blocknum += 1
            if reporthook:
                reporthook(blocknum, bs, size)
    finally:
        f.close()
    return 1

@login_required
def issue_config_switch_ajax(request):
    ret = {'data':[]}
    for i in Account_Group.objects.all():
        ret['data'].append(model_to_dict(i))
    return JsonResponse(ret,safe = False)

@login_required
def issue_config_switch_set(request):
    ag_id = int(request.GET.get('id'))
    act = request.GET.get('act')
    error = ''
    try:
        ag = Account_Group.objects.get(pk = ag_id)
        ag.issue_config_switch = act
        ag.save()
        error = _(u'修改成功！')
    except Exception as e:
        print e
        error = _(u'修改失败！')

    return JsonResponse(error,safe = False)

def file_md5(f):
    md5 = hashlib.md5()
    sign = 0
    try:
        file = open(f,'rb')
        while True:
            data = file.read(8192)
            if not data:
                break
            md5.update(data)
    except Exception as e:
        print e
        sign = 1
    finally:
        file.close()
    if sign == 0:
        return md5.hexdigest()
    else:
        return False


@login_required
def exportconf(request):
    error = {'sign':'','msg':''}
    data = ""
    tm = datetime.datetime.now().strftime('%Y-%m-%d_%H:%M:%S')
    k = {}
    try:
        if os.path.exists("./statics/backup"):
            pass
        else:
            os.makedirs("./statics/backup")
        f = open('./statics/upgrade/wyun_version.info','r')
        try:
            data = f.read()[:-4]
        except Exception as e:
            print e
        finally:
            f.close()
        name = '%s_%s_backup.tar.gz.des3'%(data,tm)
        user = commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep user|head -1|awk '{print $3;}'")[1]
        passwd =  commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep password|head -1|awk '{print $3;}'")[1]
        os.system(('mysqldump -u %s -p%s DevCloudDB > ./statics/backup/backup.sql')%(user,passwd))
        sql_md5 = file_md5("./statics/backup/backup.sql")
        if sql_md5 :
            k['sql'] = sql_md5
        else:
            error['sign'] = 'False'
            error['msg'] = 'sql_md5_false'
            return JsonResponse(error,safe = False)

        os.system('cp -r ./media  ./statics/backup/')
        os.system('cp -r ./statics/portal-master  ./statics/backup/')
        os.system('tar -cf ./statics/backup/bag.tar ./statics/backup/media/ ./statics/backup/portal-master/')
        os.system("rm -r ./statics/backup/media ./statics/backup/portal-master")
        bag_md5 = file_md5("./statics/backup/bag.tar")
        if bag_md5 :
            k['bag'] = bag_md5
        else:
            error['sign'] = 'False'
            error['msg'] = 'bag_md5_false'
            return JsonResponse(error,safe = False)

        d = des(Des_Key, CBC, Des_IV, pad=None, padmode=PAD_PKCS5)
        bes = base64.b64encode(d.encrypt(json.dumps(k)))
        try:
            fp = open('./statics/backup/check.py','w')
            fp.write(bes)
        except Exception as e:
            print e
        finally:
            fp.close()
        os.system(("tar -czf - ./statics/backup/ |openssl des3 -salt -k citrus | dd of=./statics/download/%s")%(name))
        os.system("rm -r ./statics/backup")
        error['sign'] = 'True'
        error['msg'] = name
    except Exception as e:
        print e
        error['sign'] = 'False'
        error['msg'] = e
    return JsonResponse(error,safe = False)

@login_required
def importconf(request):
    upfile =request.FILES.get("file", None)    # 获取上传的文件，如果没有文件，则默认为None
    error = ""
    v = {}
    if not upfile:
        error = _(u"没有选择文件")
    elif upfile.name[-18:] != "backup.tar.gz.des3":
        error = _(u"文件不合法")
    else:
        try:
            if os.path.exists("./statics/upload/"+ request.user.groupname):
                pass
            else:
                os.makedirs("./statics/upload/"+ request.user.groupname)

            destination = open("./statics/upload/"+ request.user.groupname +"/"+upfile.name,'wb+')    # 打开特定的文件进行二进制的写操作
            try:
                for chunk in upfile.chunks():      # 分块写入文件
                    destination.write(chunk)
            except Exception as e:
                print e
                error = _(u"文件写入失败")
            finally:
                destination.close()
        except Exception as e:
            print e
            error = _(u"上传文件失败")

        if error == "":
            try:
                os.system(("dd if=./statics/upload/%s/%s |openssl des3 -d -k citrus|tar -zxf - -C ./statics/upload/")%(request.user.groupname,upfile.name))
            except Exception as e:
                print e
                error = _(u"文件不合法")
                os.system("rm -r " + " ./statics/upload/"+ request.user.groupname +"/"+upfile.name)
            if os.path.exists("./statics/upload/statics/backup") and error == "":
                try:
                    try:
                        fp = open('./statics/upload/statics/backup/check.py','r')
                        bes = fp.read()
                    except Exception as e:
                        print e
                        os.system("rm -r ./statics/upload/statics/backup")
                        bes = {}
                    finally:
                        fp.close()
                    d = des(Des_Key, CBC, Des_IV, pad=None, padmode=PAD_PKCS5)
                    k = json.loads(d.decrypt(base64.b64decode(bes)))
                    sql_md5 = file_md5("./statics/upload/statics/backup/backup.sql")
                    if sql_md5 :
                        v['sql'] = sql_md5
                    else:
                        error = _(u"md5校验失败")
                        os.system("rm -r ./statics/upload/statics/backup")
                        return JsonResponse(error,safe = False)

                    bag_md5 = file_md5("./statics/upload/statics/backup/bag.tar")
                    if bag_md5 :
                        v['bag'] = bag_md5
                    else:
                        error = _(u"md5校验失败")
                        os.system("rm -r ./statics/upload/statics/backup")
                        return JsonResponse(error,safe = False)
                    if k == v :
                        os.system('tar -xf ./statics/upload/statics/backup/bag.tar -C ./statics/upload/statics/backup/')
                        os.system("cp -r ./statics/upload/statics/backup/statics/backup/media ./")
                        os.system("cp -r ./statics/upload/statics/backup/statics/backup/portal-master ./statics/")
                        user = commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep user|head -1|awk '{print $3;}'")[1]
                        passwd =  commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep password|head -1|awk '{print $3;}'")[1]
                        os.system(('mysql -u %s -p%s DevCloudDB < ./statics/upload/statics/backup/backup.sql')%(user,passwd))

                        ll = Device.objects.all()
                        for i in ll:
                            DataQuery.DQimportdev(i.mac)
                        os.system("rm -r ./statics/upload/statics")
                        error = _(u'配置恢复成功')
                    else:
                        error = _(u"md5校验失败")
                        os.system("rm -r ./statics/upload/statics/backup")
                        return JsonResponse(error,safe = False)
                except Exception as e:
                    print e
                    error = _(u'配置恢复失败')
                    os.system("rm -r ./statics/upload/statics")
    return JsonResponse(error,safe = False)

@login_required
def exportsysset(request):
    error = {'sign':'','msg':''}
    data = ""
    tm = datetime.datetime.now().strftime('%Y-%m-%d_%H:%M:%S')
    k = {}
    try:
        if os.path.exists("./statics/sysseting"):
            pass
        else:
            os.makedirs("./statics/sysseting")
        f = open('./statics/upgrade/wyun_version.info','r')
        try:
            data = f.read()[:-4]
        except Exception as e:
            print e
        finally:
            f.close()
        name = '%s_%s_sysseting.tar.gz.des3'%(data,tm)
        user = commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep user|head -1|awk '{print $3;}'")[1]
        passwd =  commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep password|head -1|awk '{print $3;}'")[1]

        # os.system(('mysqldump -u %s -p%s DevCloudDB account_newuser account_reg_user account_account_group ap_ap_user_policy_config_extend ap_device_ap ap_device_wlan ap_group_wlan ap_user_policy_config ap_guest_policy auditdevice_auditdevice auditdevice_auditdevice_group device_device device_device_probe device_probe_config device_probe_audit_basic_status device_probe_audit_dev_status device_probe_audit_place_status device_probe_group system_setting > ./statics/sysseting/backup.sql')%(user,passwd))
        os.system(('mysqldump -u %s -p%s DevCloudDB account_account_group account_newuser account_newuser_groups account_newuser_user_permission account_reg_user ap_ap_event ap_ap_user_policy_config_extend ap_apblacklist ap_customer ap_customer_black_list ap_customer_black_white_switch ap_customer_history ap_customer_name ap_customer_white_list ap_device_ap ap_device_wlan ap_gpon ap_group_gpon ap_group_wlan ap_guest_policy ap_setting_gpon ap_user_policy_config auditdevice_auditdevice auditdevice_auditdevice_group auth_group auth_group_permissions auth_permission device_device device_device_probe device_probe_audit_basic_status device_probe_audit_dev_status device_probe_audit_place_status device_probe_config device_probe_event device_probe_group nonoperate_nonoperate_event system_oem_limit system_page_limit system_setting > ./statics/sysseting/backup.sql')%(user,passwd))

        sql_md5 = file_md5("./statics/sysseting/backup.sql")
        if sql_md5 :
            k['sql'] = sql_md5
        else:
            error['sign'] = 'False'
            error['msg'] = 'sql_md5_false'
            return JsonResponse(error,safe = False)

        os.system('cp -r ./media  ./statics/sysseting/')
        os.system('cp -r ./statics/portal-master  ./statics/sysseting/')
        os.system('tar -cf ./statics/sysseting/bag.tar ./statics/sysseting/media/ ./statics/sysseting/portal-master/')
        os.system("rm -r ./statics/sysseting/media ./statics/sysseting/portal-master")
        bag_md5 = file_md5("./statics/sysseting/bag.tar")
        if bag_md5 :
            k['bag'] = bag_md5
        else:
            error['sign'] = 'False'
            error['msg'] = 'bag_md5_false'
            return JsonResponse(error,safe = False)

        d = des(Des_Key, CBC, Des_IV, pad=None, padmode=PAD_PKCS5)
        bes = base64.b64encode(d.encrypt(json.dumps(k)))
        try:
            fp = open('./statics/sysseting/check.py','w')
            fp.write(bes)
        except Exception as e:
            print e
        finally:
            fp.close()
        os.system(("tar -czf - ./statics/sysseting/ |openssl des3 -salt -k citrus | dd of=./statics/download/%s")%(name))
        os.system("rm -r ./statics/sysseting")
        error['sign'] = 'True'
        error['msg'] = name
    except Exception as e:
        print e
        error['sign'] = 'False'
        error['msg'] = e
    return JsonResponse(error,safe = False)

@login_required
def importsysset(request):
    upfile =request.FILES.get("file", None)    # 获取上传的文件，如果没有文件，则默认为None
    error = ""
    v = {}
    if not upfile:
        error = _(u"没有选择文件")
    elif upfile.name[-21:] != "sysseting.tar.gz.des3":
        error = _(u"文件不合法")
    else:
        try:
            if os.path.exists("./statics/upload/"+ request.user.groupname):
                pass
            else:
                os.makedirs("./statics/upload/"+ request.user.groupname)

            destination = open("./statics/upload/"+ request.user.groupname +"/"+upfile.name,'wb+')    # 打开特定的文件进行二进制的写操作
            try:
                for chunk in upfile.chunks():      # 分块写入文件
                    destination.write(chunk)
            except Exception as e:
                print e
                error = _(u"文件写入失败")
            finally:
                destination.close()
        except Exception as e:
            print e
            error = _(u"上传文件失败")

        if error == "":
            try:
                os.system(("dd if=./statics/upload/%s/%s |openssl des3 -d -k citrus|tar -zxf - -C ./statics/upload/")%(request.user.groupname,upfile.name))
            except Exception as e:
                print e
                error = _(u"文件不合法")
                os.system("rm -r " + " ./statics/upload/"+ request.user.groupname +"/"+upfile.name)
            if os.path.exists("./statics/upload/statics/sysseting") and error == "":
                try:
                    try:
                        fp = open('./statics/upload/statics/sysseting/check.py','r')
                        bes = fp.read()
                    except Exception as e:
                        print e
                        os.system("rm -r ./statics/upload/statics/sysseting")
                        bes = {}
                    finally:
                        fp.close()
                    d = des(Des_Key, CBC, Des_IV, pad=None, padmode=PAD_PKCS5)
                    k = json.loads(d.decrypt(base64.b64decode(bes)))
                    sql_md5 = file_md5("./statics/upload/statics/sysseting/backup.sql")
                    if sql_md5 :
                        v['sql'] = sql_md5
                    else:
                        error = _(u"md5校验失败")
                        os.system("rm -r ./statics/upload/statics/sysseting")
                        return JsonResponse(error,safe = False)

                    bag_md5 = file_md5("./statics/upload/statics/sysseting/bag.tar")
                    if bag_md5 :
                        v['bag'] = bag_md5
                    else:
                        error = _(u"md5校验失败")
                        os.system("rm -r ./statics/upload/statics/sysseting")
                        return JsonResponse(error,safe = False)
                    if k == v :
                        os.system('tar -xf ./statics/upload/statics/sysseting/bag.tar -C ./statics/upload/statics/sysseting/')
                        os.system("cp -r ./statics/upload/statics/sysseting/statics/sysseting/media ./")
                        os.system("cp -r ./statics/upload/statics/sysseting/statics/sysseting/portal-master ./statics/")
                        user = commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep user|head -1|awk '{print $3;}'")[1]
                        passwd =  commands.getstatusoutput("cat /etc/mysql/debian.cnf |grep password|head -1|awk '{print $3;}'")[1]
                        os.system(('mysql -u %s -p%s DevCloudDB < ./statics/upload/statics/sysseting/backup.sql')%(user,passwd))
                        #调用脚本
                        ll = Device.objects.all()
                        for i in ll:
                            DataQuery.DQimportdev(i.mac)
                        os.system("rm -r ./statics/upload/statics")
                        error = _(u'配置恢复成功')
                    else:
                        error = _(u"md5校验失败")
                        os.system("rm -r ./statics/upload/statics/backup")
                        return JsonResponse(error,safe = False)
                except Exception as e:
                    print e
                    error = _(u'配置恢复失败')
                    os.system("rm -r ./statics/upload/statics")
    return JsonResponse(error,safe = False)


#new func  by zhuyu 2018.12

def newGetUrl(urlType):
    if urlType == 'SYSTEM_VERSION_SERVER_URL':
        django_settings = Setting.objects.get(SIGN = 1)
        if django_settings.SYSTEM_VERSION_SERVER_URL[-1] == '/':
            url = "{}version/wyun/".format(django_settings.SYSTEM_VERSION_SERVER_URL)
        else:
            url = "{}/version/wyun/".format(django_settings.SYSTEM_VERSION_SERVER_URL)
    return url


def oemSettingPage(request):

    return render(request,'OEMSettingPage.html')

def oemSettingApi(request):
    if request.method == 'GET':
        oemSetting = {
            'oem_type':'',
            'acUpdateAddressOption':'Free',
            'acUpdateSwitchOption':'Auto',
            'specialOEMOption':'',
            'logoDisplay':'hide',
            'logoCustomization':'',
            'useLogoCustomization':'false',
            'customUIOption':'Default',
            'customUIMainColor':'',
            'customUISecondaryColor':'',
            'showAPPage':'show',
            'showProbePage':'show',
            'showNonPage':'show',
            'systemFirstLevelPageControl':'show',
            'supportFirstLevelPageControl':'show',
            'guestCommonOptionControl':'show',
            'guestAccountOptionControl':'show',
            'guestSMSOptionControl':'show',
            'guestWXOptionControl':'show',
            'guestCardOptionControl':'show',
            'guestCustomizeOptionControl':'show',
            'userDefaultLanguage':'',
            'accountSystemControl':'show',
        }
        if Oem_limit.objects.filter(pk = 1).exists():
            oemSetting = model_to_dict(Oem_limit.objects.get(pk = 1))
        if Setting.objects.filter(pk = 1).exists():
            serverSetting = Setting.objects.get(pk = 1)
            oemSetting['acUpdateAddress'] = serverSetting.SYSTEM_VERSION_SERVER_URL
        else:
            oemSetting['acUpdateAddress'] = ''
        if Page_limit.objects.filter(pk = 1).exists():
            page = Page_limit.objects.get(pk = 1)
            if page.ap_index == '1' or page.ap_page == '1':
                oemSetting['showAPPage'] = 'show'
            else:
                oemSetting['showAPPage'] = 'hide'
            if page.probe_index == '1' or page.probe_page == '1':
                oemSetting['showProbePage'] = 'show'
            else:
                oemSetting['showProbePage'] = 'hide'
            if page.nonoperate_index == '1' or page.nonoperate_page == '1':
                oemSetting['showNonPage'] = 'show'
            else:
                oemSetting['showNonPage'] = 'hide'
        else:
            oemSetting['showAPPage'] = 'show'
            oemSetting['showProbePage'] = 'show'
            oemSetting['showNonPage'] = 'show'

        return JsonResponse(oemSetting,safe = False)

    if request.method == 'POST':
        # print request.POST
        # oemSetting = json.loads(request.POST.get('oemSetting'))
        # print oemSetting
        oemSetting = {}
        oemSetting['acUpdateAddressOption'] = request.POST.get('acUpdateAddressOption') or 'Free'
        oemSetting['acUpdateSwitchOption'] = request.POST.get('acUpdateSwitchOption') or 'Auto'
        oemSetting['specialOEMOption'] = request.POST.get('specialOEMOption') or ''
        oemSetting['logoDisplay'] = request.POST.get('logoDisplay') or 'hide'
        oemSetting['acUpdateAddress'] = request.POST.get('acUpdateAddress') or ''
        oemSetting['useLogoCustomization'] = request.POST.get('useLogoCustomization') or 'false'
        logoCustomization = request.FILES.get('logoCustomization',None)
        oemSetting['customUIOption'] = request.POST.get('customUIOption') or 'Default'
        oemSetting['customUIMainColor'] = request.POST.get('customUIMainColor') or ''
        oemSetting['customUISecondaryColor'] = request.POST.get('customUISecondaryColor') or ''

        oemSetting['showAPPage'] = request.POST.get('showAPPage') or 'show'
        oemSetting['showProbePage'] = request.POST.get('showProbePage') or 'show'
        oemSetting['showNonPage'] = request.POST.get('showNonPage') or 'show'
        oemSetting['systemFirstLevelPageControl'] = request.POST.get('systemFirstLevelPageControl') or 'show'
        oemSetting['supportFirstLevelPageControl'] = request.POST.get('supportFirstLevelPageControl') or 'show'

        oemSetting['guestCommonOptionControl'] = request.POST.get('guestCommonOptionControl') or 'show'
        oemSetting['guestAccountOptionControl'] = request.POST.get('guestAccountOptionControl') or 'show'
        oemSetting['guestSMSOptionControl'] = request.POST.get('guestSMSOptionControl') or 'show'
        oemSetting['guestWXOptionControl'] = request.POST.get('guestWXOptionControl') or 'show'
        oemSetting['guestCardOptionControl'] = request.POST.get('guestCardOptionControl') or 'show'
        oemSetting['guestCustomizeOptionControl'] = request.POST.get('guestCustomizeOptionControl') or 'show'
        oemSetting['userDefaultLanguage'] = request.POST.get('userDefaultLanguage') or ''
        oemSetting['accountSystemControl'] = request.POST.get('accountSystemControl') or 'show'
        # print logoCustomization
        if oemSetting:
            try:
                if Oem_limit.objects.filter(pk = 1).exists():
                    oem = Oem_limit.objects.get(pk = 1)
                else:
                    oem = Oem_limit()
                    oem.pk = 1

                oem.acUpdateAddressOption = oemSetting['acUpdateAddressOption']
                oem.acUpdateSwitchOption = oemSetting['acUpdateSwitchOption']
                oem.specialOEMOption = oemSetting['specialOEMOption']
                oem.logoDisplay = oemSetting['logoDisplay']
                oem.useLogoCustomization = oemSetting['useLogoCustomization']
                oem.customUIOption = oemSetting['customUIOption']
                oem.systemFirstLevelPageControl = oemSetting['systemFirstLevelPageControl']
                oem.supportFirstLevelPageControl = oemSetting['supportFirstLevelPageControl']

                oem.guestCommonOptionControl = oemSetting['guestCommonOptionControl']
                oem.guestAccountOptionControl = oemSetting['guestAccountOptionControl']
                oem.guestSMSOptionControl = oemSetting['guestSMSOptionControl']
                oem.guestWXOptionControl = oemSetting['guestWXOptionControl']
                oem.guestCardOptionControl = oemSetting['guestCardOptionControl']
                oem.guestCustomizeOptionControl = oemSetting['guestCustomizeOptionControl']
                oem.userDefaultLanguage = oemSetting['userDefaultLanguage']
                oem.accountSystemControl = oemSetting['accountSystemControl']

                if oemSetting['customUIOption'] == 'Assign':
                    oem.customUIMainColor = oemSetting['customUIMainColor']
                    oem.customUISecondaryColor = oemSetting['customUISecondaryColor']

                if logoCustomization:
                    try:
                        destination = open("./statics/main/media/images/logoCustomization{name}".format(name = logoCustomization.name),'wb+')    # 打开特定的文件进行二进制的写操作
                        for chunk in logoCustomization.chunks():      # 分块写入文件
                                destination.write(chunk)

                        oem.logoCustomization = "/static/main/media/images/logoCustomization{name}".format(name = logoCustomization.name)
                    except Exception as e:
                        raise e
                    finally:
                        destination.close()

                oem.save()

                if oemSetting['acUpdateAddressOption'] == 'Assign':
                    if Setting.objects.filter(SIGN = 1).exists():
                        serverSetting = Setting.objects.get(SIGN = 1)
                    else:
                        serverSetting = Setting()
                        serverSetting.SIGN = 1
                    serverSetting.SYSTEM_VERSION_SERVER_URL = oemSetting['acUpdateAddress']
                    serverSetting.save()

                if Page_limit.objects.filter(pk = 1).exists():
                    page = Page_limit.objects.get(pk = 1)
                else:
                    page = Page_limit()
                    page.pk = 1
                    page.audit_dev_page = '0'

                if oemSetting['showAPPage'] == 'show':
                    page.ap_index = '1'
                    page.ap_page = '1'
                else:
                    page.ap_index = '0'
                    page.ap_page = '0'
                if oemSetting['showProbePage'] == 'show':
                    page.probe_index = '1'
                    page.probe_page = '1'
                else:
                    page.probe_index = '0'
                    page.probe_page = '0'
                if oemSetting['showNonPage'] == 'show':
                    page.nonoperate_index = '1'
                    page.nonoperate_page = '1'
                else:
                    page.nonoperate_index = '0'
                    page.nonoperate_page = '0'
                page.save()

                return JsonResponse({'status':'success'},safe = False)

            except Exception as e:
                print '*********oem save***********'
                print e
                print '*********oem save***********'
                return JsonResponse({'status':'failed'},safe = False)


def produceUpdateURL(request):
    url = newGetUrl('SYSTEM_VERSION_SERVER_URL')
    try:
        website = urllib2.urlopen(url)
        html = website.read()
        # version = re.findall('href="(.*)">wityun', html)
        message = re.findall('href="(.*)">.*.tar', html)
        # print version
        # print '*************'
        # print message
        # version.sort(reverse = True)
        message.sort(reverse = True)
        if len(message) != 0:
            # new_version = version[0]
            new_message = message[0]
            data = {
                'status':'success',
                'url':url+new_message,
            }
            return JsonResponse(data,safe = False)
    except Exception as e:
        print e
    data = {
        'status':'failed',
        'url':'',
    }
    return JsonResponse(data,safe = False)


def countryCodeApi(request):
    django_settings = Setting.objects.get(SIGN = 1)
    if request.method == "POST":
        countryCode = request.POST.get("countryCode")
        try:
            django_settings.countryCode = countryCode
            django_settings.save()
            data = {"status":'success',"message":_(u"修改成功")}
            taskForChangeCountryCode.delay()
        except Exception as e:
            print e
            data = {"status":'failed',"message":_(u"修改失败")}
    if request.method == "GET":
        if django_settings.countryCode:
            countryCode = django_settings.countryCode
        else:
            countryCode = 'CN'
        data = {'countryCode':countryCode}

    return JsonResponse(data,safe = False)



def timezoneCodeApi(request):
    django_settings = Setting.objects.get(SIGN = 1)
    if request.method == "POST":
        timezoneCode = request.POST.get("timezoneCode")
        try:
            django_settings.timezoneCode = timezoneCode
            django_settings.save()
            data = {"status":'success',"message":_(u"修改成功")}
        except Exception as e:
            print e
            data = {"status":'failed',"message":_(u"修改失败")}
    if request.method == "GET":
        if django_settings.timezoneCode:
            timezoneCode = django_settings.timezoneCode
        else:
            timezoneCode = 'Asia/Hong_Kong'
        data = {'timezoneCode':timezoneCode}

    return JsonResponse(data,safe = False)
