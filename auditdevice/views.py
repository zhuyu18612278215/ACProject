#coding=utf-8
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy as lazy_
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth import login,authenticate
from account.models import NewUser,Account_Group
from ap.models import Device_ap,Ap_user_policy_config_extend
from django.contrib.auth.decorators import login_required
import models
import json
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.http import HttpResponse,HttpResponseRedirect
# from forms import
from django.utils import timezone
import datetime
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
import time
import pytz
import urllib2
import hashlib
import re
# Create your views here.
import sys
sys.path.append("DataQuery")
import DataQuery
import os
import os.path
from system.models import Setting,Page_limit,Oem_limit
from django.core.files import File
import Public_function
import logging
import MySQLdb
from django.utils.timezone import is_naive, make_aware, utc, is_aware
from django.db.models import Q
from django.db import connection
from models import AuditDevice,AuditDevice_group
import redis
rt = redis.Redis(host='localhost', port=6379, db=9)
ar = redis.Redis(host='localhost', port=6379, db=8)
# Create your views here.

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



def upgrade_file_list():
    django_settings = Setting.objects.get(SIGN = 1)
    try:
        # url = "http://115.28.241.216:81/version/byz/"
        url = django_settings.VERSION_SERVER_URL+"version/audit/"
        website = urllib2.urlopen(url)

        html = website.read()

        links = re.findall('href="(.*)">audit', html)
        # print links
        a = []
        for i in links:
            if i[-4:] == '.pkg':
                if 'kernel' in i or 'rootfs' in i:
                    pass
                else:
                    a.append(i)
        # print a,123123312
        return a
    except Exception as e:
        return False

def library_upgrade_file_list():
    django_settings = Setting.objects.get(SIGN = 1)
    try:
        # url = "http://115.28.241.216:81/version/byz/"
        url = django_settings.VERSION_SERVER_URL+"version/audit/"
        website = urllib2.urlopen(url)

        html = website.read()

        links = re.findall('href="(.*)">sigmatch', html)
        # print links
        a = []
        for i in links:
            if i[-4:] == '.dat':
                a.append(i)
        # print a,123123312
        return a
    except Exception as e:
        return False

# def upgrade_file(dev_type,fl):
#     r = dev_type_change(dev_type)
#     result = ''
#     # print r
#     if r == False or fl == False:
#         pass
#     else:
#         for i in fl:
#             if i == r :
#                 result = i
#         if result != "":
#             return result

#     return False

def version_find_new(dev_type,flist):
    fl = []
    if flist == [] or flist == False:
        return False
    else:
        for i in flist:
            if dev_type in i:
                fl.append(i)
        if fl == []:
            return False
        else:
            return sorted(fl,reverse = True)[0]

# def dev_type_change(dev_type):
#     try:
#         f = open('./statics/upgrade/device_upgrade_dict.info','r')
#         try:
#             data = json.load(f,'utf-8')
#             # print data[dev_type],13221132213321
#             return data[dev_type]
#         except Exception as e:
#             return False
#         finally:
#             f.close()
#     except Exception as e:
#         return False



def compare_ver(file1,ver1):
    if file1 == False:
        return False
    # print str(file1) != str(ver1),type(file1),file1,ver1
    return file1 > str(ver1)

def library_version_find_new(flist):
    if flist == []:
        return False
    else:
        return sorted(flist,reverse = True)[0]



@login_required
def audit_device_list(request):
    global ugfl
    DataQuery.ugfl = upgrade_file_list()
    global lugfl
    DataQuery.lugfl = library_upgrade_file_list()
    print DataQuery.lugfl,12321321
    errors = ''
    try:
        errors = request.session.get('error_message')
        # print errors
        del request.session['error_message']
    except Exception as e:
        pass
    errors_json = json.dumps(errors)
    admin_error = {"error_type":'',"error_msg":''}
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        admin_error = Public_function.judgment_admin_pwd(request)
    admin_error_json = json.dumps(admin_error)

    plimit = get_plimit()
    return render(request,'audit_dl.html',{'errors_json':errors_json,'errors':errors,'admin_error_json':admin_error_json,'admin_error':admin_error,'plimit':plimit})

@login_required
def ad_already_access_ajax(request):
    # print 2131231,request.GET
    draw = int(request.GET.get('draw'))
    start = int(request.GET.get('start'))
    length = int(request.GET.get('length'))
    order_id = request.GET.get('order[0][column]')
    order = request.GET.get('columns['+order_id+'][data]')
    if request.GET.get('order[0][dir]') == 'asc':
        order_type = ''
    elif request.GET.get('order[0][dir]') == 'desc':
        order_type = '-'

    if order == 'state':
        order = 'last_heart_time'
    search_value_old = request.GET.get('search[value]')
    search_value = search_value_old
    # search_value = ''
    # for s in search_value_old:
    #     if s>= u"\u4e00" and s<= u"\u9fa5":
    #         pass
    #     else:
    #         search_value = search_value + s

    print search_value,3131231
    if request.user.administrator_permission >= 4 or request.user.administrator_permission == 0 :
        recordsTotal = AuditDevice.objects.all().count()
        if search_value == '':
            recordsFiltered = recordsTotal
            already_access_list = AuditDevice.objects.all().order_by(order_type+order)[start:start+length]
        else:
            print re.match(r'[\u4e00 -\u9fa5]+',search_value) == None,909090909
            if re.match(r'[\u4e00 -\u9fa5]+',search_value) == None :
                if search_value in [u'退服',u'离线',u'超时',u'在线']:
                    sv = {
                        u'在线':'online',
                        u'超时':'time out',
                        u'离线':'offline',
                        u'退服':'retired',
                    }
                    already_access_list = models.AuditDevice.objects.order_by(order_type+order).filter(Q(state__icontains=sv[search_value])|Q(name__contains=search_value))[start:start+length]
                    recordsFiltered = models.AuditDevice.objects.order_by(order_type+order).filter(Q(state__icontains=sv[search_value])|Q(name__contains=search_value)).count()
                else:
                    already_access_list = models.AuditDevice.objects.order_by(order_type+order).filter(Q(state__contains=search_value)|Q(name__contains=search_value))[start:start+length]
                    recordsFiltered = models.AuditDevice.objects.order_by(order_type+order).filter(Q(state__contains=search_value)|Q(name__contains=search_value)).count()
            else:
                already_access_list = models.AuditDevice.objects.order_by(order_type+order).filter(Q(state__icontains=search_value)|Q(name__icontains=search_value)|Q(lastip__icontains=search_value)|Q(version__icontains=search_value)|Q(model__icontains=search_value)|Q(library_version__icontains=search_value)|Q(mac__icontains=search_value)|Q(mac__icontains=''.join(search_value.split(':')))|Q(mac__icontains=''.join(search_value.split('-'))))[start:start+length]
                recordsFiltered = models.AuditDevice.objects.order_by(order_type+order).filter(Q(state__icontains=search_value)|Q(name__icontains=search_value)|Q(lastip__icontains=search_value)|Q(library_version__icontains=search_value)|Q(version__icontains=search_value)|Q(model__icontains=search_value)|Q(mac__icontains=search_value)|Q(mac__icontains=''.join(search_value.split(':')))|Q(mac__icontains=''.join(search_value.split('-')))).count()
    elif request.user.administrator_permission < 4 and request.user.administrator_permission != 0 and request.user.group_status == 1:
        recordsTotal = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).count()
        if search_value == '':
            recordsFiltered = recordsTotal
            already_access_list = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).order_by(order_type+order)[start:start+length]
        else:
            if re.match(r'[\u4e00 -\u9fa5]+',search_value) == None :
                if search_value in [u'退服',u'离线',u'超时',u'在线']:
                    sv = {
                        u'在线':'online',
                        u'超时':'time out',
                        u'离线':'offline',
                        u'退服':'retired',
                    }
                    already_access_list = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).order_by(order_type+order).filter(Q(state__icontains=sv[search_value])|Q(name__contains=search_value))[start:start+length]
                    recordsFiltered = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).order_by(order_type+order).filter(Q(state__icontains=sv[search_value])|Q(name__contains=search_value)).count()
                else:
                    already_access_list = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).order_by(order_type+order).filter(Q(state__contains=search_value)|Q(name__contains=search_value))[start:start+length]
                    recordsFiltered = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).order_by(order_type+order).filter(Q(state__contains=search_value)|Q(name__contains=search_value)).count()
            else:
                already_access_list = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).order_by(order_type+order).filter(Q(state__icontains=search_value)|Q(name__icontains=search_value)|Q(lastip__icontains=search_value)|Q(version__icontains=search_value)|Q(library_version__icontains=search_value)|Q(model__icontains=search_value)|Q(mac__icontains=search_value)|Q(mac__icontains=''.join(search_value.split(':')))|Q(mac__icontains=''.join(search_value.split('-'))))[start:start+length]
                recordsFiltered = models.AuditDevice.objects.filter(Q(account_group_name = request.user.groupname)).order_by(order_type+order).filter(Q(state__icontains=search_value)|Q(name__icontains=search_value)|Q(lastip__icontains=search_value)|Q(version__icontains=search_value)|Q(library_version__icontains=search_value)|Q(model__icontains=search_value)|Q(mac__icontains=search_value)|Q(mac__icontains=''.join(search_value.split(':')))|Q(mac__icontains=''.join(search_value.split('-')))).count()

    DataQuery.DQUpdateAccessed("probe", already_access_list)
    timenow = timezone.now()

    ret = {'draw':draw,'recordsTotal':recordsTotal,'recordsFiltered':recordsFiltered,'data':[]}
    for al in already_access_list:
        # if type(al.last_heart_time) == unicode:
        #     a = int(time.mktime(time.localtime(time.time()))) - int(al.last_heart_time)
        #     # print a
        #     # print al.last_heart_time
        #     # al.last_heart_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(al.last_heart_time)))
        #     al.last_heart_time = datetime.datetime.utcfromtimestamp(float(al.last_heart_time))
        #     #print al.last_heart_time
        # else:
        a = int((timenow - al.last_heart_time).total_seconds())

        al.last_heart_time = timezone.localtime(al.last_heart_time).strftime("%Y-%m-%d %H:%M:%S")

        al.upgrade_button = ''
        rss = al.reboot_sign.split(",")
        if rss[0] != '0' and rss[0] != '':
            if rss[0] == '1':
                al.state = _(u"重启")
            elif rss[0] == '2':
                al.state = _(u"升级")
        else:
            if a >= 86400:
                al.state = _(u"退服")
            elif a >= 3600:
                al.state = _(u"离线")
            elif a >= 900 :
                al.state = _(u"超时")
            elif a < 900:
                al.state = _(u"在线")
        try:
            xx = models.AuditDevice_group.objects.get(pk = int(al.group_id))
        except Exception as e:
            xx = False
        if xx != False and xx.auto_update == "on" :
            al.upgrade_button = False
            al.upgrade_version = ''
            al.library_upgrade_button = False
            al.library_upgrade_version = ''
        else:
            try:
                # '.'.join(version_find_new(al.own_model,DataQuery.ugfl)[:-4].split('.')[1:])
                if compare_ver('.'.join(version_find_new(al.own_model,DataQuery.ugfl)[:-4].split('.')[1:]),al.version) == True:
                    al.upgrade_button = True
                    al.upgrade_version = version_find_new(al.own_model,DataQuery.ugfl)
            except Exception as e:
                print e
                al.upgrade_button = False
                al.upgrade_version = ''

            try:
                lv = library_version_find_new(DataQuery.lugfl)
                if compare_ver(''.join(re.findall("[0-9]",lv[:-4])),al.library_version) == True:
                    al.library_upgrade_button = True
                    al.library_upgrade_version = lv
            except Exception as e:
                print e
                al.library_upgrade_button = False
                al.library_upgrade_version = ''

        aall = model_to_dict(al)
        ret['data'].append(aall)

    return JsonResponse(ret,safe = False)

@login_required
def auditdevice_detail(request):
    r_mac = request.GET.get('mac')
    al = models.AuditDevice.objects.get(mac = r_mac)
    name = al.name

    # data = {'mac':r_mac,'sn':'','model':'','version':'','library_version':'','ip':'','running_time':'','name':name,'last_time':'','cpu':'','memory':'','flash':''}
    # DataQuery.DQUpdateAccessedDev('probe', r_mac, data)
    data = {'mac':r_mac,'sn':al.sn,'model':al.model,'version':al.version,'library_version':al.library_version,'ip':al.lastip,'running_time':'30000','name':name,'last_time':al.last_heart_time,'cpu':'20%','memory':'30%','flash':'40%','upload':al.upload,'download':al.download}

    return JsonResponse(data)

@login_required
def auditdevice_reboot(request):
    errors = ''
    r_mac = request.POST.get('mac')
    data = {'action':'reboot','mac':r_mac}
    #执行动作
    try:
        #在此调用函数
        DataQuery.DQProcess(data)
        errors = _(u'执行成功！')
        # event = {
        #     'event_time' : timezone.now(),
        #     'event' : 'PROBE_RESTARTED_BY_ADMIN',
        #     'msg' : 'Probe['+r_mac+'] was restarted by Admin['+request.user.username+']',
        #     'admin_username' : request.user.username,
        #     'probe_mac' : r_mac,
        # }
        try:
            nu = AuditDevice.objects.get(mac = r_mac)
            nu.reboot_sign = '1'+','+str(int(time.mktime(datetime.datetime.now().timetuple())))
            nu.save()
        except Exception as e:
            print e
        # try:
        #     # DataQuery.LOGGING_INIT()
        #     # logging.info('Probe['+r_mac+'] was restarted by Admin['+request.user.username+']')
        #     # logging.info('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')
        #     # print 'Probe['+r_mac+'] was restarted by Admin['+request.user.username+']'
        #     probe_event_save(event)
        # except Exception as e:
        #     print e
    except Exception as e:
        print e
        errors = _(u'执行失败！')
    return JsonResponse(errors,safe=False)


@login_required
def auditdevice_update(request):
    django_settings = Setting.objects.get(SIGN = 1)
    errors = ''
    r_mac = request.POST.get('mac')
    al = AuditDevice.objects.get(mac = r_mac)
    #data = {'action':'upgrade','mac':r_mac, 'param':'http://115.28.241.216/img/witfios3.01.03.r191710.bin'}
    u = version_find_new(al.own_model,DataQuery.ugfl)
    if u == False:
        errors = _(u'没有此型号对应的版本文件')
    else:
        # data = {'action':'upgrade','mac':r_mac,'param':django_settings.VERSION_SERVER_URL+"version/audit/"+u,'version':'.'.join(version_find_new(al.own_model,DataQuery.ugfl)[:-4].split('.')[1:])}

        #执行动作
        try:
            #在此调用函数
            # DataQuery.DQProcess(data)
            x = AddCmd2Redis(r_mac,u,al.library_version,'201',django_settings.VERSION_SERVER_URL+"version/audit/"+u)
            if x:
                errors = _(u'执行成功！')
                if u != False:
                    try:
                        nu = AuditDevice.objects.get(mac = r_mac)
                        nu.reboot_sign = '2'+','+str(int(time.mktime(datetime.datetime.now().timetuple())))
                        nu.save()
                    except Exception as e:
                        print e
            else:
                errors = _(u'执行失败！')

        except Exception as e:
            print e
            errors = _(u'执行失败！')
    return JsonResponse(errors,safe=False)

def AddCmd2Redis(apMac, version, sgversion, code, url):
    print "ALALALALXXXXXXXXXXXXXXX"

    cmdStr = ""
    # '0;123456;102001;301;http://115.28.241.216:81/version/audit/sigmatch.102001.dat;'
    cmdStr = "0;%s;%s;%s;%s;" % (version, sgversion, code, url)
    print cmdStr

    print "ALALALALXXXXXXXXXXXXXXX"
    try:
        ar.lpush(apMac, cmdStr)
        return True
    except:
        return False

@login_required
def auditdevice_del(request):
    errors = ''
    r_mac = request.POST.get('mac')
    # data = {'action':'del','mac':r_mac}
    #执行动作
    try:
        #在此调用函数
        models.AuditDevice.objects.get(mac = r_mac).delete()
        removeDevsInfoFromRedis(r_mac)
        errors = _(u'执行成功！')
    except Exception as e:
        print e
        errors = _(u'执行失败！')
    return JsonResponse(errors,safe = False)

def removeDevsInfoFromRedis(apMac):
    ai = rt.hget('apInfo', apMac)
    if ai:
        rt.hdel('apInfo', apMac)
    else:
        pass



def auditdevice_library_update(request):
    django_settings = Setting.objects.get(SIGN = 1)
    errors = ''
    r_mac = request.POST.get('mac')
    #data = {'action':'upgrade','mac':r_mac, 'param':'http://115.28.241.216/img/witfios3.01.03.r191710.bin'}
    al = AuditDevice.objects.get(mac = r_mac)
    u = library_version_find_new(DataQuery.lugfl)
    if u == False:
        errors = _(u'没有对应的版本文件')
    else:
        # data = {'action':'library_upgrade','mac':r_mac,'param':django_settings.VERSION_SERVER_URL+"version/audit/"+u,'versin':''.join(re.findall("[0-9\.]",u[:-4]))}
        #执行动作
        try:
            #在此调用函数
            # DataQuery.DQProcess(data)
            x = AddCmd2Redis(r_mac,al.version,al.library_version,'301',django_settings.VERSION_SERVER_URL+"version/audit/"+u)
            if x:
                errors = _(u'执行成功！')
                if u != False:
                    try:
                        nu = AuditDevice.objects.get(mac = r_mac)
                        nu.reboot_sign = '2'+','+str(int(time.mktime(datetime.datetime.now().timetuple())))
                        nu.save()
                    except Exception as e:
                        print e
            else:
                errors = _(u'执行失败！')

        except Exception as e:
            print e
            errors = _(u'执行失败！')
    return JsonResponse(errors,safe=False)

@login_required
def auditdevice_group(request):
    admin_error = {"error_type":'',"error_msg":''}
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        admin_error = Public_function.judgment_admin_pwd(request)
    admin_error_json = json.dumps(admin_error)

    error = {"error_type":'',"error_msg":''}
    try:
        if request.session.get('error_dict') != None:
            error = request.session.get('error_dict')
        # print errors
        del request.session['error_dict']
    except Exception as e:
        pass
    error_json = json.dumps(error)
    group = ''
    if request.user.administrator_permission == 0 or request.user.administrator_permission >= 4:
        group = AuditDevice_group.objects.all()
    elif request.user.administrator_permission < 4 and request.user.group_status == 1:
        group = AuditDevice_group.objects.filter(account_group_name = request.user.groupname)
    for i in group:
        if i.group_name == "DefaultGroup" and i.account_group_name == "admin" :
            i.device_count = AuditDevice.objects.filter(Q(account_group_name = i.account_group_name,group_id = i.pk) |Q(account_group_name = '',group_id = 0)).count()
        else:
            i.device_count = AuditDevice.objects.filter(group_id = i.id).filter(account_group_name = i.account_group_name).count()

    accountgp_list = Account_Group.objects.all().order_by('groupname')
    plimit = get_plimit()
    return render(request,'audit_group.html',{'admin_error_json':admin_error_json,'admin_error':admin_error,'group':group,'error':error,"error_json":error_json,"accountgp_list":accountgp_list,'plimit':plimit})

@login_required
def auditdevice_add_ajax(request):
    device = {'data':[]}
    if request.user.administrator_permission == 6 or request.user.administrator_permission == 5 or request.user.administrator_permission == 0:
        a = AuditDevice_group.objects.get(group_name = 'DefaultGroup',account_group_name = 'admin',)
        device_quaryset = AuditDevice.objects.filter(Q(account_group_name = '') | Q(account_group_name = 'admin')).filter(Q(group_id = 0) | Q(group_id = a.pk))
    if request.user.administrator_permission == 3 or request.user.administrator_permission == 2 :
        a = AuditDevice_group.objects.get(group_name = request.user.username,account_group_name = request.user.username)
        device_quaryset = AuditDevice.objects.filter(account_group_name = request.user.username).filter(Q(group_id = 0) | Q(group_id = a.pk))
    if device_quaryset.count() != 0:
        for i in device_quaryset:
            if i.name != '':
                name = i.name
            else:
                name = i.model + '_' + i.mac[-6:]
            mac = i.mac.upper()[:2] + '-' + i.mac.upper()[2:4] + '-' + i.mac.upper()[4:6] + '-' + i.mac.upper()[6:8] + '-' + i.mac.upper()[8:10] + '-' + i.mac.upper()[10:12]
            device['data'].append({'name':name,'mac':mac,'action':''})
    return JsonResponse(device,safe = False)

def get_role_list(request):
    role_type = request.GET.get('role_type')
    gp_id = request.GET.get('id')
    if role_type == '1':
        rl = ['audit1','audit2','audit3','audit4']
        if gp_id == None:
            gp = AuditDevice_group.objects.all()
        else:
            gp = AuditDevice_group.objects.exclude(pk = gp_id)
        for i in gp:
            role = i.role.split(',')
            if role == ['']:
                pass
            else:
                if role[1] in rl:
                    rl.remove(role[1])
        print rl,gp_id
        return JsonResponse(rl,safe = False)


@login_required
def add_audit_device_group_ajax(request):
    error = {"error_type":'',"error_msg":""}
    if request.method == "POST":
        add_group_device_list = json.loads(request.POST.get('add_group_device_list'))
        groupname = add_group_device_list['groupname']
        role_type = add_group_device_list['role_type']
        role = add_group_device_list['role']
        mac = add_group_device_list['mac']
        apply_for = add_group_device_list['apply_for']
        if AuditDevice_group.objects.filter(account_group_name = apply_for).filter(group_name = groupname).exists():
            error = {"error_type":'failed',"error_msg":_(u"该组已存在")}
        else:
            try:
                pg = AuditDevice_group()
                pg.group_name = groupname
                pg.account_group_name = apply_for
                pg.role = role_type + "," + role
                pg.save()
                pgid = AuditDevice_group.objects.get(account_group_name = apply_for,group_name = groupname).pk
                for i in mac:
                    m = change_mac(i)
                    AuditDevice.objects.filter(mac = m).update(group_id = pgid,account_group_name = apply_for)

                error = {"error_type":'success',"error_msg":_(u"添加成功")}
            except Exception as e:
                print e
                error = {"error_type":'failed',"error_msg":_(u"添加失败")}
        if error['error_type'] == "success":
            request.session['error_dict'] = error
        return JsonResponse(error,safe = False)

def change_mac(mac):
    return ''.join(mac.lower().split('-'))

@login_required
def audit_device_group_del(request):
    group_id = request.GET.get('group_id')
    pg = AuditDevice_group.objects.get(pk = group_id)
    try:
        default_pg = AuditDevice_group.objects.get(account_group_name = 'admin',group_name = "DefaultGroup")
        a = AuditDevice.objects.filter(group_id = pg.pk)
        AuditDevice.objects.filter(group_id = pg.pk).update(group_id = default_pg.pk)
        pg.delete()
        error = {"error_type":'success',"error_msg":_(u"删除成功")}
    except Exception as e:
        print e
        error = {"error_type":'failed',"error_msg":_(u"删除失败")}

    request.session['error_dict'] = error
    return redirect('/audit-device/auditdevice_group/')

@login_required
def add_audit_device_ajax(request):
    group_id = request.GET.get("group_id")
    pg = AuditDevice_group.objects.get(pk = group_id)
    device = {'data':[]}
    if request.user.administrator_permission == 0 or request.user.administrator_permission >= 4:
        dpg = AuditDevice_group.objects.get(group_name = "DefaultGroup" ,account_group_name = "admin")
        if pg.group_name == "DefaultGroup" and pg.account_group_name == "admin":
            device_quaryset = ""
        else:
            device_quaryset = AuditDevice.objects.filter(Q(account_group_name = '')|Q(account_group_name = 'admin') , Q(group_id = dpg.pk)|Q(group_id = 0))

    if device_quaryset != "":
        if device_quaryset.count() != 0:
            for i in device_quaryset:
                if i.name != '':
                    name = i.name
                else:
                    name = i.model + '_' + i.mac[-6:]
                mac = i.mac.upper()[:2] + '-' + i.mac.upper()[2:4] + '-' + i.mac.upper()[4:6] + '-' + i.mac.upper()[6:8] + '-' + i.mac.upper()[8:10] + '-' + i.mac.upper()[10:12]
                if pg.group_name == "DefaultGroup" and pg.account_group_name == "admin":
                    device['data'].append({'name':name,'mac':mac,'action':'','sign':'off'})
                else:
                    device['data'].append({'name':name,'mac':mac,'action':'','sign':'on'})
    return JsonResponse(device,safe = False)

@login_required
def remove_audit_device_ajax(request):
    group_id = request.GET.get("group_id")
    pg = AuditDevice_group.objects.get(pk = group_id)
    device = {'data':[]}
    if pg.group_name == "DefaultGroup" and pg.account_group_name == "admin":
        device_quaryset = AuditDevice.objects.filter(Q(account_group_name = pg.account_group_name,group_id = pg.pk) |Q(account_group_name = '',group_id = 0))
    else:
        device_quaryset = AuditDevice.objects.filter(account_group_name = pg.account_group_name,group_id = pg.pk)
    if device_quaryset.count() != 0:
        for i in device_quaryset:
            if i.name != '':
                name = i.name
            else:
                name = i.model + '_' + i.mac[-6:]
            mac = i.mac.upper()[:2] + '-' + i.mac.upper()[2:4] + '-' + i.mac.upper()[4:6] + '-' + i.mac.upper()[6:8] + '-' + i.mac.upper()[8:10] + '-' + i.mac.upper()[10:12]

            if pg.group_name == "DefaultGroup" and pg.account_group_name == "admin":
                device['data'].append({'name':name,'mac':mac,'action':'','sign':'off','administrator_permission':request.user.administrator_permission})
            else:
                device['data'].append({'name':name,'mac':mac,'action':'','sign':'on','administrator_permission':request.user.administrator_permission})
    return JsonResponse(device,safe = False)

def get_audit_group(request):
    gp_id = request.GET.get('id')
    gp = AuditDevice_group.objects.get(pk = gp_id)
    return JsonResponse(model_to_dict(gp),safe = False)



@login_required
def modify_aduit_device_group_ajax(request):
    error = {"error_type":'',"error_msg":""}
    if request.method == "POST":
        modify_device = json.loads(request.POST.get('modify_device'))
        group_id = int(modify_device['id'])
        groupname = modify_device['groupname']
        area_name = modify_device['area_name']
        remove_device_mac = modify_device['remove_device_mac']
        add_device_mac = modify_device['add_device_mac']
        setting = modify_device['setting']

        if AuditDevice_group.objects.exclude(pk = group_id).filter(Q(account_group_name = area_name) & Q(group_name = groupname)).exists():
            error = {"error_type":'failed',"error_msg":_(u"组名已存在")}
        else:
            try:
                pg = AuditDevice_group.objects.get(pk = group_id , account_group_name = area_name)
                pg.group_name = groupname
                # pg.account_group_name = setting['apply']
                pg.role = setting['role_type'] + ',' + setting['role']
                pg.save()

                if remove_device_mac == {}:
                    pass
                else:
                    if pg.account_group_name == "admin" or pg.group_name == pg.account_group_name:
                        pgid = AuditDevice_group.objects.get(account_group_name = "admin",group_name = "DefaultGroup").pk
                        for i in remove_device_mac:
                            m = change_mac(i)
                            AuditDevice.objects.filter(mac = m).update(group_id = pgid,account_group_name = "admin")
                    else:
                        pgid = AuditDevice_group.objects.get(account_group_name = pg.account_group_name,group_name = pg.account_group_name).pk
                        for i in remove_device_mac:
                            m = change_mac(i)
                            AuditDevice.objects.filter(mac = m).update(group_id = pgid)
                if add_device_mac == {}:
                    pass
                else:
                    for i in add_device_mac:
                        m = change_mac(i)
                        p = AuditDevice.objects.get(mac = m).group_id
                        AuditDevice.objects.filter(mac = m).update(group_id = pg.pk,account_group_name = pg.account_group_name)
                error = {"error_type":'success',"error_msg":_(u"编辑成功")}
            except Exception as e:
                print e
                error = {"error_type":'failed',"error_msg":_(u"编辑失败")}
        if error['error_type'] == "success":
            request.session['error_dict'] = error
        return JsonResponse(error,safe = False)

def audit_device_auto_update(request):
    gp_id = request.POST.get('gp_id')
    value = request.POST.get('value')
    error = ''
    try:
        gp = AuditDevice_group.objects.get(pk = int(gp_id))
        gp.auto_update = value
        gp.save()
        if value == 'on':
            error = _(u'自动升级已开启')
        else:
            error = _(u'自动升级已关闭')
    except Exception as e:
        print e
        error = _(u'操作失败')
    return JsonResponse(error,safe = False)

