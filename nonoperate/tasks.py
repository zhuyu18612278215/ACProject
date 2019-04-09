#coding:utf-8
from DevCloud.celery import app
from celery.decorators import task
import sys
sys.path.append("DataQuery")
import DataQuery
from device.models import Device,Probe_config,Probe_audit_basic_status,Probe_audit_dev_status,Probe_audit_place_status,Probe_event,Probe_group
import json
from django.forms.models import model_to_dict
from ap.models import Device_ap,AP_event,Group_wlan,Device_wlan,User_policy_config,Guest_policy,ApBlackList,Gpon,Group_gpon,Setting_gpon,Customer,Customer_name,Customer_black_list,Customer_history,Customer_white_list,Customer_black_white_switch,Timing_Policy
from ap.default_settions import user_policy_config,guest_policy_config
from account.models import NewUser,Account_Group
import Public_function
from django.db.models import Q
import collections


reload(sys)
sys.setdefaultencoding('utf-8')


def create_wireless_json(i):
    if i.model == "KL0001" or i.model == "TPY3101-HR":
        pass
    else:
        m = change_mac(i.mac)
        data_str = set_wlan_str(m)
        DataQuery.DQSetUpdateConfig('wireless',m,data_str)




@app.task
def task_for_nonoperate_del_wlan(group_id_id):
    dev = Device.objects.filter(group_id = group_id_id)
    for i in dev:
        create_wireless_json(i)
        # m = change_mac(i.mac)
        # data_str = set_wlan_str(m)
        # DataQuery.DQSetUpdateConfig('wireless',m,data_str)

@app.task
def task_for_modify_nonoperate_group_ajax(pk):
    for i in Device.objects.filter(support_mode = '3').filter(group_id = pk):
        create_wireless_json(i)

        m = change_mac(i.mac)
        astr = audit_str(m)
        DataQuery.DQSetUpdateConfig("audit", m, astr.encode("utf-8"))

        # #audit config str
        # data_str = set_wlan_str(m)
        # DataQuery.DQSetUpdateConfig('wireless',m,data_str)

@app.task
def task_for_add_wlan_ajax(group_id):
    for i in Device.objects.filter(group_id = group_id):
        create_wireless_json(i)
        # m = change_mac(i.mac)
        # data_str = set_wlan_str(m)
        # DataQuery.DQSetUpdateConfig('wireless',m,data_str)

@app.task
def task_for_modify_wlan_ajax(group_id_id):
    for i in Device.objects.filter(group_id = group_id_id):
        create_wireless_json(i)
        # m = change_mac(i.mac)
        # data_str = set_wlan_str(m)
        # DataQuery.DQSetUpdateConfig('wireless',m,data_str)

@app.task
def task_for_global_config_ajax(groupname,gp_str,mac_list = [],fun_type = 'all'):
    if mac_list == [] and fun_type == 'all':
        dev_list = Device.objects.filter(Q(account_group_name = groupname),Q(support_mode = 1)|Q(support_mode = 3))
    else:
        dev_list = Device.objects.filter(mac__in = mac_list)
    for i in dev_list:
        wireless = []
        new_str = json.loads(gp_str)
        for j in Group_wlan.objects.filter(group_id_id = i.group_id).order_by('wlan_id'):
            if j.auth_type == 6:
                localwechat = collections.OrderedDict([('appid',j.wechat_appid),('appkey',j.wechat_appkey),('auth_type',6),('forcefollow',j.wechat_forcefollow),('secretkey',j.wechat_secretkey),('shopid',j.wechat_shopid),('wlanid',j.wlan_id)])
                # {
                #     "wlanid": j.wlan_id,
                #     "auth_type": 6,
                #     "appid": j.wechat_appid ,
                #     "appkey": j.wechat_appkey,
                #     "shopid": j.wechat_shopid,
                #     "secretkey": j.wechat_secretkey,
                #     "forcefollow": j.wechat_forcefollow,
                # }
                wireless.append(localwechat)
            elif j.auth_type == 7:
                portal_server = collections.OrderedDict([('auth_type',7),('hostname',j.auth_server_hostname),('loginurl',j.auth_server_loginurl),('portalurl',j.auth_server_portalurl),('wlanid',j.wlan_id)])
                # {
                #     "wlanid": j.wlan_id,
                #     "auth_type": 7,
                #     "hostname": j.auth_server_hostname,
                #     "loginurl": j.auth_server_loginurl,
                #     "portalurl": j.auth_server_portalurl,
                # }
                wireless.append(portal_server)
        if i.model == "KL0001" or i.model == "TPY3101-HR":
            pass
        else:
            new_str['wireless'] = wireless
        new_str = json.dumps(new_str,sort_keys = True)
        m = change_mac(i.mac)
        DataQuery.DQSetUpdateConfig('portal',m,gp_str)

@app.task
def task_for_user_policy_config_ajax(groupname,upc_str,mac_list = [],fun_type = 'all'):
    if mac_list == [] and fun_type == 'all':
        dev_list = Device.objects.filter(Q(account_group_name = groupname),Q(support_mode = 1)|Q(support_mode = 3))
    else:
        dev_list = Device.objects.filter(mac__in = mac_list)
    for i in dev_list:
        m = change_mac(i.mac)
        DataQuery.DQSetUpdateConfig('policy',m,upc_str)

@app.task
def task_for_user_policy_config_ajax(groupname,upc_str,mac_list = [],fun_type = 'all'):
    if mac_list == [] and fun_type == 'all':
        dev_list = Device.objects.filter(Q(account_group_name = groupname),Q(support_mode = 1)|Q(support_mode = 3))
    else:
        dev_list = Device.objects.filter(mac__in = mac_list)
    for i in dev_list:
        m = change_mac(i.mac)
        DataQuery.DQSetUpdateConfig('policy',m,upc_str)


def change_mac(mac):
    return ''.join(mac.lower().split('-'))


def set_wlan_str(mac):
    dev = Device.objects.get(mac = mac)
    try:
        radios_type = Public_function.device_type_info_dict[dev.own_model]['radio_num']
    except Exception as e:
        print e
        radios_type = '0'

    try:
        if hasattr(dev,'device_ap'):
            if dev.device_ap.radios_2_channel == 'auto':
                radios_2_channel = 0
            else:
                radios_2_channel = int(dev.device_ap.radios_2_channel)

            if dev.device_ap.radios_2_ht == 'auto':
                radios_2_ht = 'auto'
            else:
                radios_2_ht = 'HT' + dev.device_ap.radios_2_ht

            if dev.device_ap.radios_2_power == 'auto':
                radios_2_power = 0
            elif dev.device_ap.radios_2_power == 'high':
                radios_2_power = int(Public_function.device_type_info_dict[dev.own_model]['radio_2_txp'])
            elif dev.device_ap.radios_2_power == 'medium':
                radios_2_power = int(Public_function.device_type_info_dict[dev.own_model]['radio_2_txp']) - 5
            elif dev.device_ap.radios_2_power == 'low':
                radios_2_power = int(Public_function.device_type_info_dict[dev.own_model]['radio_2_txp']) - 10
            else:
                radios_2_power = int(dev.device_ap.radios_2_power)

            if dev.device_ap.radios_2_com == 'auto':
                radios_2_com = '11ng'
            else:
                radios_2_com = dev.device_ap.radios_2_com



            if dev.device_ap.radios_5_channel == 'auto':
                radios_5_channel = 0
            else:
                radios_5_channel = int(dev.device_ap.radios_5_channel)

            if dev.device_ap.radios_5_ht == 'auto':
                radios_5_ht = 'auto'
            else:
                radios_5_ht = 'HT' + dev.device_ap.radios_5_ht

            if dev.device_ap.radios_5_power == 'auto':
                radios_5_power = 0
            elif dev.device_ap.radios_5_power == 'high':
                radios_5_power = int(Public_function.device_type_info_dict[dev.own_model]['radio_5_txp'])
            elif dev.device_ap.radios_5_power == 'medium':
                radios_5_power = int(Public_function.device_type_info_dict[dev.own_model]['radio_5_txp']) - 5
            elif dev.device_ap.radios_5_power == 'low':
                radios_5_power = int(Public_function.device_type_info_dict[dev.own_model]['radio_5_txp']) - 10
            else:
                radios_5_power = int(dev.device_ap.radios_5_power)

            if dev.device_ap.radios_5_com == 'auto':
                radios_5_com = '11ac'
            else:
                radios_5_com = dev.device_ap.radios_5_com
        else:
            radios_2_channel = 0
            radios_2_ht = 'auto'
            radios_2_power = 0
            radios_2_com = '11ng'
            radios_5_channel = 0
            radios_5_ht = 'auto'
            radios_5_power = 0
            radios_5_com = '11ac'
    except Exception as e:
        print e,'xwwwwww'
        radios_2_channel = 0
        radios_2_ht = 'auto'
        radios_2_power = 0
        radios_2_com = '11ng'
        radios_5_channel = 0
        radios_5_ht = 'auto'
        radios_5_power = 0
        radios_5_com = '11ac'

    radio2_str = {
        "channel": radios_2_channel,
        "country": "CN",
        "disabled": 0,
        "htmode": radios_2_ht,
        "hwmode": radios_2_com,
        "mode": "2.4G",
        "txpower": radios_2_power,
    }
    radio5_str =  {
        "channel": radios_5_channel,
        "country": "CN",
        "disabled": 0,
        "htmode": radios_5_ht,
        "hwmode": radios_5_com,
        "mode": "5G",
        "txpower": radios_5_power
    }

    apwlan2 = []
    apwlan5 = []
    if Group_wlan.objects.filter(group_id_id = dev.group_id).count() == 0:
        apwlan2 = []
        apwlan5 = []
    else:
        gp_wlan = Group_wlan.objects.filter(group_id_id = dev.group_id)
        for i in gp_wlan:
            if Device_wlan.objects.filter(device_id = dev.pk,wlan_id = i.wlan_id).exists():
                dev_wlan = Device_wlan.objects.get(device_id = dev.pk,wlan_id = i.wlan_id)
            else:
                dev_wlan = False

            if dev_wlan != False:
                i.wlan_service = dev_wlan.wlan_service if dev_wlan.wlan_service != "" else i.wlan_service
                i.upload_speed = dev_wlan.upload_speed if dev_wlan.upload_speed != "" else i.upload_speed
                i.download_speed = dev_wlan.download_speed if dev_wlan.download_speed != "" else i.download_speed
                i.passphrase = dev_wlan.passphrase if dev_wlan.passphrase != "" else i.passphrase
                i.wlan_ssid = dev_wlan.wlan_ssid if dev_wlan.wlan_ssid != "" else i.wlan_ssid
                i.radios_enable = dev_wlan.radios_enable if dev_wlan.radios_enable != "" else i.radios_enable
                i.vlan_enabled = dev_wlan.vlan_enabled if dev_wlan.vlan_enabled != "" else i.vlan_enabled
                i.vlan = dev_wlan.vlan if dev_wlan.vlan != "" else i.vlan


            wlan_service = 0 if i.wlan_service == 'on' else 1
            if i.upload_speed == 'Unlimited' and i.download_speed == 'Unlimited':
                peruserrate = 0
                upload_speed = 0
                download_speed = 0
            else:
                peruserrate = 1
                try:
                    if i.upload_speed == 'Unlimited':
                        upload_speed = 0
                    elif 'K' in i.upload_speed :
                        upload_speed = int(i.upload_speed.replace('K',''))
                    elif 'M' in i.upload_speed :
                        upload_speed = int(i.upload_speed.replace('M','')) * 1024
                    else:
                        upload_speed = int(i.upload_speed)

                    if i.download_speed == 'Unlimited':
                        download_speed = 0
                    elif 'K' in i.download_speed :
                        download_speed = int(i.download_speed.replace('K',''))
                    elif 'M' in i.download_speed :
                        download_speed = int(i.download_speed.replace('M','')) * 1024
                    else:
                        download_speed = int(i.download_speed)

                except Exception as e:
                    print e
                    peruserrate = 0
                    upload_speed = 0
                    download_speed = 0

            if i.sec_type == 'psk2' and (i.encry_type == 'tkip' or i.encry_type == 'ccmp'):
                encryption = i.sec_type + '+' + i.encry_type
            else:
                encryption = 'none'
            hidden_ssid = 1 if i.hidden_ssid == 'on' else 0
            if i.guest_enabled == 'on':
                portal = Public_function.protal_type_num_dict[i.auth_type]
            else:
                portal = 0
            if i.vlan_enabled == "on":
                vlan = i.vlan
            else:
                vlan = 0
            wl = {
                "apidx": int(i.wlan_id),
                "disabled": wlan_service,
                "downperuserrate": download_speed,
                "encryption": encryption,
                "hidden": hidden_ssid,
                "key": i.passphrase,
                "peruserrate": peruserrate,
                "portal": portal,
                "ssid": i.wlan_ssid,
                "upperuserrate": upload_speed,
                "vlan":int(vlan)
            }
            if i.radios_enable == "both":
                apwlan2.append(wl)
                apwlan5.append(wl)
            elif i.radios_enable == "2g":
                apwlan2.append(wl)
            elif i.radios_enable == "5g":
                apwlan5.append(wl)

    if radios_type == '0':
        data = "{'wifi':[{'radio':%s,'ap':%s},{'radio':%s,'ap':%s}]}"%(json.dumps(radio2_str ,sort_keys=True , ensure_ascii=False),json.dumps(apwlan2,sort_keys=True , ensure_ascii=False), json.dumps(radio5_str ,sort_keys=True , ensure_ascii=False), json.dumps(apwlan5 ,sort_keys=True , ensure_ascii=False))
    elif radios_type == '1':
        data = "{'wifi':[{'radio':%s,'ap':%s}]}"%(json.dumps(radio2_str ,sort_keys=True , ensure_ascii=False),json.dumps(apwlan2,sort_keys=True , ensure_ascii=False))
    print 'peizhi',data.replace(' ','').replace('\'','\"')
    return data.replace(' ','').replace('\'','\"')

def audit_str(mac):
    astr = '{"audit":{'
    print mac
    # dev = model_to_dict(Probe_audit_dev_status.objects.get(mac = mac))
    dev = audit_setting_compare(mac,1,"dev")
    dev.pop('mac')
    dev.pop('id')
    DataQuery.DQClearNullValeForDict(dev)
    dstr = json.dumps(dev, sort_keys=True, ensure_ascii=False)
    dstr = dstr.replace(" ", '')
    #print dstr
    astr = astr + '"device":' + dstr + ','

    # place = model_to_dict(Probe_audit_place_status.objects.get(mac = mac))
    place = audit_setting_compare(mac,1,"place")
    place.pop('mac')
    place.pop('id')
    DataQuery.DQClearNullValeForDict(place)
    pstr = json.dumps(place, sort_keys=True, ensure_ascii=False)
    pstr = pstr.replace(" ", '')
    #print pstr
    astr = astr + '"site":' + pstr + ','

    # basic = model_to_dict(Probe_audit_basic_status.objects.get(mac = mac))
    basic = audit_setting_compare(mac,1,"basic")
    basic.pop('mac')
    basic.pop('id')
    DataQuery.DQClearNullValeForDict(basic)
    bstr = json.dumps(basic, sort_keys=True, ensure_ascii=False)
    bstr = bstr.replace(" ", '')
    #print bstr
    astr = astr + '"system":' + bstr + "}}"

    # DataQuery.DQSetUpdateConfig("audit", mac, astr.encode("utf-8"))

    return astr

def audit_setting_compare(mac,model_type,kind):
    model_type = int(model_type)
    audit_setting = ''
    dev = Device.objects.get(mac = mac)
    if model_type == 1:
        if dev.group_id == 0:
            group = Probe_group.objects.get(group_name = 'DefaultGroup',account_group_name = 'admin',group_type = '3')
        else:
            group = Probe_group.objects.get(pk = dev.group_id)

        if kind == 'dev':
            try:
                audit_setting = Probe_audit_dev_status.objects.get(mac = mac)

                audit_setting.collection_radius = group.collection_radius if audit_setting.collection_radius == '' else audit_setting.collection_radius
                audit_setting.collection_equipment_type = group.collection_equipment_type if audit_setting.collection_equipment_type == '' else audit_setting.collection_equipment_type
                audit_setting.collection_equipment_name = group.collection_equipment_name if audit_setting.collection_equipment_name == '' else audit_setting.collection_equipment_name
                audit_setting.collection_equipment_address = group.collection_equipment_address if audit_setting.collection_equipment_address == '' else audit_setting.collection_equipment_address
                audit_setting.security_software_orgcode = group.security_software_orgcode if audit_setting.security_software_orgcode == '' else audit_setting.security_software_orgcode
                audit_setting.security_software_orgname = group.security_software_orgname if audit_setting.security_software_orgname == '' else audit_setting.security_software_orgname
                audit_setting.security_software_address = group.security_software_address if audit_setting.security_software_address == '' else audit_setting.security_software_address
                audit_setting.contactor = group.contactor if audit_setting.contactor == '' else audit_setting.contactor
                audit_setting.contactor_tel = group.contactor_tel if audit_setting.contactor_tel == '' else audit_setting.contactor_tel
                audit_setting.contactor_mail = group.contactor_mail if audit_setting.contactor_mail == '' else audit_setting.contactor_mail
                auds = model_to_dict(audit_setting)
            except Exception as e:
                print e
                audit_setting = {'collection_radius':'','collection_equipment_type':'','collection_equipment_name':'','collection_equipment_address':'','security_software_orgcode':'','security_software_orgname':'','security_software_address':'','contactor':'','contactor_tel':'','contactor_mail':'','mac':'','id':''}

                audit_setting['collection_radius'] = group.collection_radius if audit_setting['collection_radius'] == '' else audit_setting['collection_radius']
                audit_setting['collection_equipment_type'] = group.collection_equipment_type if audit_setting['collection_equipment_type'] == '' else audit_setting['collection_equipment_type']
                audit_setting['collection_equipment_name'] = group.collection_equipment_name if audit_setting['collection_equipment_name'] == '' else audit_setting['collection_equipment_name']
                audit_setting['collection_equipment_address'] = group.collection_equipment_address if audit_setting['collection_equipment_address'] == '' else audit_setting['collection_equipment_address']
                audit_setting['security_software_orgcode'] = group.security_software_orgcode if audit_setting['security_software_orgcode'] == '' else audit_setting['security_software_orgcode']
                audit_setting['security_software_orgname'] = group.security_software_orgname if audit_setting['security_software_orgname'] == '' else audit_setting['security_software_orgname']
                audit_setting['security_software_address'] = group.security_software_address if audit_setting['security_software_address'] == '' else audit_setting['security_software_address']
                audit_setting['contactor'] = group.contactor if audit_setting['contactor'] == '' else audit_setting['contactor']
                audit_setting['contactor_tel'] = group.contactor_tel if audit_setting['contactor_tel'] == '' else audit_setting['contactor_tel']
                audit_setting['contactor_mail'] = group.contactor_mail if audit_setting['contactor_mail'] == '' else audit_setting['contactor_mail']

                auds = audit_setting

            for k in auds:
                if auds[k] == None:
                    auds[k] = ""
            return auds

        if kind == 'place':
            print 'xt1tx1'
            if Probe_audit_basic_status.objects.filter(mac = mac).exists():
                place_audit_corp = Probe_audit_basic_status.objects.get(mac = mac).audit_corp
            else:
                place_audit_corp = group.audit_corp
            print 'xt2xt2',place_audit_corp
            try:
                audit_setting = Probe_audit_place_status.objects.get(mac = mac)

                audit_setting.place_name = group.place_name if audit_setting.place_name == '' else audit_setting.place_name
                audit_setting.site_address = group.site_address if audit_setting.site_address == '' else audit_setting.site_address
                audit_setting.netsite_type = group.netsite_type if audit_setting.netsite_type == '' else audit_setting.netsite_type
                audit_setting.bussiness_nature = group.bussiness_nature if audit_setting.bussiness_nature == '' else audit_setting.bussiness_nature
                audit_setting.law_principal_name = group.law_principal_name if audit_setting.law_principal_name == '' else audit_setting.law_principal_name
                audit_setting.law_principal_certificate_type = group.law_principal_certificate_type if audit_setting.law_principal_certificate_type == '' else audit_setting.law_principal_certificate_type
                audit_setting.law_principal_certificate_id = group.law_principal_certificate_id if audit_setting.law_principal_certificate_id == '' else audit_setting.law_principal_certificate_id
                audit_setting.relationship_account = group.relationship_account if audit_setting.relationship_account == '' else audit_setting.relationship_account
                audit_setting.start_time = group.start_time if audit_setting.start_time == '' else audit_setting.start_time
                audit_setting.end_time = group.end_time if audit_setting.end_time == '' else audit_setting.end_time

                audit_setting.site_type = group.site_type if audit_setting.site_type == '' else audit_setting.site_type
                audit_setting.police_station_code = group.police_station_code if audit_setting.police_station_code == '' else audit_setting.police_station_code

                a_s = model_to_dict(audit_setting)
                print 'tttttt11111',a_s
                if place_audit_corp == '27':
                    a_s['policestation'] = a_s['police_station_code']
                    a_s['area'] = a_s['site_type']
                if place_audit_corp == '29':
                    a_s['policestation'] = a_s['police_station_code']
                del a_s['site_type']
                del a_s['police_station_code']

                auds = a_s
                for k in auds:
                    if auds[k] == None:
                        auds[k] = ""
                print 'tttttt22222',a_s
                return auds

            except Exception as e:
                print e,
                print 'xt3xt3'
                audit_setting = {'place_name':'','site_address':'','netsite_type':'','bussiness_nature':'','law_principal_name':'','law_principal_certificate_type':'','law_principal_certificate_id':'','relationship_account':'','start_time':'','end_time':'','mac':'','id':'','site_type':'','police_station_code':''}

                audit_setting['place_name'] = group.place_name if audit_setting['place_name'] == '' else audit_setting['place_name']
                audit_setting['site_address'] = group.site_address if audit_setting['site_address'] == '' else audit_setting['site_address']
                audit_setting['netsite_type'] = group.netsite_type if audit_setting['netsite_type'] == '' else audit_setting['netsite_type']
                audit_setting['bussiness_nature'] = group.bussiness_nature if audit_setting['bussiness_nature'] == '' else audit_setting['bussiness_nature']
                audit_setting['law_principal_name'] = group.law_principal_name if audit_setting['law_principal_name'] == '' else audit_setting['law_principal_name']
                audit_setting['law_principal_certificate_type'] = group.law_principal_certificate_type if audit_setting['law_principal_certificate_type'] == '' else audit_setting['law_principal_certificate_type']
                audit_setting['law_principal_certificate_id'] = group.law_principal_certificate_id if audit_setting['law_principal_certificate_id'] == '' else audit_setting['law_principal_certificate_id']
                audit_setting['relationship_account'] = group.relationship_account if audit_setting['relationship_account'] == '' else audit_setting['relationship_account']
                audit_setting['start_time'] = group.start_time if audit_setting['start_time'] == '' else audit_setting['start_time']
                audit_setting['end_time'] = group.end_time if audit_setting['end_time'] == '' else audit_setting['end_time']
                audit_setting['site_type'] = group.site_type if audit_setting['site_type'] == '' else audit_setting['site_type']
                audit_setting['police_station_code'] = group.police_station_code if audit_setting['police_station_code'] == '' else audit_setting['police_station_code']

                if place_audit_corp == '27':
                    audit_setting['policestation'] = audit_setting['police_station_code']
                    audit_setting['area'] = audit_setting['site_type']
                if place_audit_corp == '29':
                    audit_setting['policestation'] = audit_setting['police_station_code']
                del audit_setting['site_type']
                del audit_setting['police_station_code']

                auds = audit_setting
                for k in auds:
                    if auds[k] == None:
                        auds[k] = ""
                return auds

        if kind == 'basic':
            try:
                audit_setting = Probe_audit_basic_status.objects.get(mac = mac)

                audit_setting.audit_corp = group.audit_corp if audit_setting.audit_corp == '' else audit_setting.audit_corp

                audit_setting.ftp_name = group.ftp_name if audit_setting.ftp_name == '' else audit_setting.ftp_name
                audit_setting.ftp_passwd = group.ftp_passwd if audit_setting.ftp_passwd == '' else audit_setting.ftp_passwd
                audit_setting.ftp_port = group.ftp_port if audit_setting.ftp_port == '' else audit_setting.ftp_port

                audit_setting.audit_ip = group.audit_ip if audit_setting.audit_ip == '' else audit_setting.audit_ip
                audit_setting.audit_port = group.audit_port if audit_setting.audit_port == '' else audit_setting.audit_port
                audit_setting.location_encode = group.location_encode if audit_setting.location_encode == '' else audit_setting.location_encode
                audit_setting.device_encode = group.device_encode if audit_setting.device_encode == '' else audit_setting.device_encode
                audit_setting.longitude = group.longitude if audit_setting.longitude == '' else audit_setting.longitude
                audit_setting.latitude = group.latitude if audit_setting.latitude == '' else audit_setting.latitude
                audit_setting.ssid = json.loads(group.ssid)
                # print audit_setting.ssid,'QWEQWEQWEWQEQ'
                a_s = model_to_dict(audit_setting)
                if a_s['ssid'] == "":
                    a_s['ssid'] = []
                if dev.own_model != 'WitMAX-P550E-L':
                    del a_s['ssid']

                # renzixing,wangbo,chongqingaisi,byzoro feijing
                if audit_setting.audit_corp == '50':
                    pass
                # elif audit_setting.audit_corp == '3' or audit_setting.audit_corp == '15' or audit_setting.audit_corp == '22' or audit_setting.audit_corp == '27' or audit_setting.audit_corp == '28':
                elif audit_setting.audit_corp in Public_function.auditCropLimitList:
                    del a_s['ftp_port']
                else:
                    del a_s['ftp_port']
                    del a_s['ftp_name']
                    del a_s['ftp_passwd']

                for k in a_s:
                    if a_s[k] == None:
                        a_s[k] = ""
                print a_s
                return a_s

                # return model_to_dict(audit_setting)

            except Exception as e:
                print e
                audit_setting = {'audit_corp':'','ftp_name':'', 'ftp_passwd':'', 'ftp_port':'', 'audit_ip':'','audit_port':'','location_encode':'','device_encode':'','longitude':'','latitude':'','mac':'','id':'','ssid':''}

                audit_setting['audit_corp'] = group.audit_corp if audit_setting['audit_corp'] == '' else audit_setting['audit_corp']
                # renzixing,wangbo,chongqingaisi,byzoro feijing
                # if audit_setting['audit_corp'] == '3' or audit_setting['audit_corp'] == '15' ||  audit_setting['audit_corp'] == '22' || audit_setting['audit_corp'] == '50':
                audit_setting['ftp_name'] = group.ftp_name if audit_setting['ftp_name'] == '' else audit_setting['ftp_name']
                audit_setting['ftp_passwd'] = group.ftp_passwd if audit_setting['ftp_passwd'] == '' else audit_setting['ftp_passwd']
                audit_setting['ftp_port'] = group.ftp_port if audit_setting['ftp_port'] == '' else audit_setting['ftp_port']

                audit_setting['audit_ip'] = group.audit_ip if audit_setting['audit_ip'] == '' else audit_setting['audit_ip']
                audit_setting['audit_port'] = group.audit_port if audit_setting['audit_port'] == '' else audit_setting['audit_port']
                audit_setting['location_encode'] = group.location_encode if audit_setting['location_encode'] == '' else audit_setting['location_encode']
                audit_setting['device_encode'] = group.device_encode if audit_setting['device_encode'] == '' else audit_setting['device_encode']
                audit_setting['longitude'] = group.longitude if audit_setting['longitude'] == '' else audit_setting['longitude']
                audit_setting['latitude'] = group.latitude if audit_setting['latitude'] == '' else audit_setting['latitude']
                audit_setting['ssid'] = json.loads(group.ssid)
                # print audit_setting['ssid'],'ASDASDADS'

                if audit_setting['ssid'] == "":
                    audit_setting['ssid'] = []
                if dev.own_model != 'WitMAX-P550E-L':
                    del audit_setting['ssid']

                # renzixing,wangbo,chongqingaisi,byzoro feijing
                if audit_setting['audit_corp'] == '50':
                    pass
                # elif audit_setting['audit_corp'] == '3' or audit_setting['audit_corp'] == '15' or audit_setting['audit_corp'] == '22' or audit_setting['audit_corp'] == '27' or audit_setting['audit_corp'] == '28':
                elif audit_setting['audit_corp'] in Public_function.auditCropLimitList:
                    del audit_setting['ftp_port']
                else:
                    del audit_setting['ftp_name']
                    del audit_setting['ftp_passwd']
                    del audit_setting['ftp_port']

                auds = audit_setting
                for k in auds:
                    if auds[k] == None:
                        auds[k] = ""
                print auds
                return auds
                # return audit_setting




@app.task
def default_config_issued():
    wifi_str = default_config_wifi_str()
    DataQuery.DQSetUpdateConfig('wireless','default_config_nonoperate_wireless',wifi_str)
    customer_policy_str = default_config_customer_policy_str()
    DataQuery.DQSetUpdateConfig('policy','default_config_nonoperate_policy',customer_policy_str)
    portal_str = default_config_portal_str()
    DataQuery.DQSetUpdateConfig('portal','default_config_nonoperate_portal',portal_str)
    audit_str = default_config_audit_str()
    DataQuery.DQSetUpdateConfig("audit", 'default_config_nonoperate_audit', audit_str.encode("utf-8"))
    print 'xxxccc'


def default_config_wifi_str():
    radios_type = '0'

    radios_2_channel = 0
    radios_2_ht = 'auto'
    radios_2_power = 0
    radios_2_com = '11ng'
    radios_5_channel = 0
    radios_5_ht = 'auto'
    radios_5_power = 0
    radios_5_com = '11ac'

    radio2_str = {
        "channel": radios_2_channel,
        "country": "CN",
        "disabled": 0,
        "htmode": radios_2_ht,
        "hwmode": radios_2_com,
        "mode": "2.4G",
        "txpower": radios_2_power,
    }
    radio5_str =  {
        "channel": radios_5_channel,
        "country": "CN",
        "disabled": 0,
        "htmode": radios_5_ht,
        "hwmode": radios_5_com,
        "mode": "5G",
        "txpower": radios_5_power
    }

    apwlan2 = []
    apwlan5 = []
    pg = Probe_group.objects.get(Q(group_name = 'DefaultGroup')&Q(account_group_name = 'admin')&Q(group_type = 3))
    if Group_wlan.objects.filter(group_id_id = pg.pk).count() == 0:
        apwlan2 = []
        apwlan5 = []
    else:
        gp_wlan = Group_wlan.objects.filter(group_id_id = pg.pk)
        for i in gp_wlan:


            wlan_service = 0 if i.wlan_service == 'on' else 1
            if i.upload_speed == 'Unlimited' and i.download_speed == 'Unlimited':
                peruserrate = 0
                upload_speed = 0
                download_speed = 0
            else:
                peruserrate = 1
                try:
                    if i.upload_speed == 'Unlimited':
                        upload_speed = 0
                    elif 'K' in i.upload_speed :
                        upload_speed = int(i.upload_speed.replace('K',''))
                    elif 'M' in i.upload_speed :
                        upload_speed = int(i.upload_speed.replace('M','')) * 1024
                    else:
                        upload_speed = int(i.upload_speed)

                    if i.download_speed == 'Unlimited':
                        download_speed = 0
                    elif 'K' in i.download_speed :
                        download_speed = int(i.download_speed.replace('K',''))
                    elif 'M' in i.download_speed :
                        download_speed = int(i.download_speed.replace('M','')) * 1024
                    else:
                        download_speed = int(i.download_speed)

                except Exception as e:
                    print e
                    peruserrate = 0
                    upload_speed = 0
                    download_speed = 0

            if i.sec_type == 'psk2' and (i.encry_type == 'tkip' or i.encry_type == 'ccmp'):
                encryption = i.sec_type + '+' + i.encry_type
            else:
                encryption = 'none'
            hidden_ssid = 1 if i.hidden_ssid == 'on' else 0
            if i.guest_enabled == 'on':
                portal = Public_function.protal_type_num_dict[i.auth_type]
            else:
                portal = 0
            if i.vlan_enabled == "on":
                vlan = i.vlan
            else:
                vlan = 0
            wl = {
                "apidx": int(i.wlan_id),
                "disabled": wlan_service,
                "downperuserrate": download_speed,
                "encryption": encryption,
                "hidden": hidden_ssid,
                "key": i.passphrase,
                "peruserrate": peruserrate,
                "portal": portal,
                "ssid": i.wlan_ssid,
                "upperuserrate": upload_speed,
                "vlan":int(vlan)
            }
            if i.radios_enable == "both":
                apwlan2.append(wl)
                apwlan5.append(wl)
            elif i.radios_enable == "2g":
                apwlan2.append(wl)
            elif i.radios_enable == "5g":
                apwlan5.append(wl)

    if radios_type == '0':
        data = "{'wifi':[{'radio':%s,'ap':%s},{'radio':%s,'ap':%s}]}"%(json.dumps(radio2_str ,sort_keys=True , ensure_ascii=False),json.dumps(apwlan2,sort_keys=True , ensure_ascii=False), json.dumps(radio5_str ,sort_keys=True , ensure_ascii=False), json.dumps(apwlan5 ,sort_keys=True , ensure_ascii=False))
    elif radios_type == '1':
        data = "{'wifi':[{'radio':%s,'ap':%s}]}"%(json.dumps(radio2_str ,sort_keys=True , ensure_ascii=False),json.dumps(apwlan2,sort_keys=True , ensure_ascii=False))
    print 'defaultpeizhi-wifi',data.replace(' ','').replace('\'','\"')
    return data.replace(' ','').replace('\'','\"')


def default_config_customer_policy_str():
    groupname = 'admin'
    if Account_Group.objects.filter(groupname = groupname).exists():
        ag = Account_Group.objects.get(groupname = groupname)
        if hasattr(ag,'user_policy_config'):
            up = model_to_dict(User_policy_config.objects.get(domainname = ag))
        else:
            up = user_policy_config
    else:
        up = user_policy_config

    user_policy = up

    rssi_max = str(int(float(user_policy['rssi_threshold'])) + 95)
    policy = collections.OrderedDict([("access_policy",str(user_policy['access_policy'])),("band_steer",str(user_policy['band_steering'])),("dual_max_user",str(user_policy['dual_max_user'])),("l2_isolation",str(user_policy['l2_isolation'])),("load_balance",str(user_policy['load_balance'])),("reject_max",str(user_policy['reject_max'])),("roaming_assoc_rssi",str(user_policy['roaming_assoc_rssi'])),("roaming_detect",str(user_policy['roaming_policy'])),("roaming_unassoc_rssi",str(user_policy['roaming_unassoc_rssi'])),("rssi_max",rssi_max),("single_max_user",str(user_policy['single_max_user'])),("thredhold_5g",'0'),("thredhold_5g_rssi",'0')])
    mac_list = []
    if Customer_black_white_switch.objects.filter(groupname = groupname).exists():
        wb_type = Customer_black_white_switch.objects.get(groupname = groupname).switch
    else:
        wb_type = "none"
    if wb_type == "":
        wb_type = "none"
        mac_list = []
    elif wb_type == "black":
        wb_type = "blacklist"
        for i in Customer_black_list.objects.filter(groupname = groupname):
            i.mac = (i.mac[:2] + ':' + i.mac[2:4] + ':' + i.mac[4:6] + ':' + i.mac[6:8] + ':' + i.mac[8:10] + ':' + i.mac[10:]).lower()
            mac_list.append(i.mac)
    elif wb_type == "white":
        wb_type = "whitelist"
        for i in Customer_white_list.objects.filter(groupname = groupname):
            i.mac = (i.mac[:2] + ':' + i.mac[2:4] + ':' + i.mac[4:6] + ':' + i.mac[6:8] + ':' + i.mac[8:10] + ':' + i.mac[10:]).lower()
            mac_list.append(i.mac)
    wb_list = collections.OrderedDict([('maclist',mac_list),('type',wb_type)])

    if Timing_Policy.objects.filter(groupname = groupname).exists():
        time_pilocy = model_to_dict(Timing_Policy.objects.get(groupname = groupname))
    else:
        time_pilocy = {'gpon_light_switch':'off'}
    print 'xxxxx'
    if time_pilocy['gpon_light_switch'] == 'on':
        switch = 'on'
        timer = []
        timer_origin = json.loads(time_pilocy['gpon_timer'])
        print timer_origin,type(timer_origin)
        for i in timer_origin:
            timer.append(collections.OrderedDict([('end',i['end']),('start',i['start']),('weekday',','.join(i['weekday']))]))
    elif time_pilocy['gpon_light_switch'] == 'off':
        switch = 'off'
        timer = ''
    # timer = json.dumps(timer)
    ledtimer = collections.OrderedDict([('switch',switch),('timer',timer)])
    # policy_str = json.dumps({'policy':policy,'list':wb_list,'ledtimer':ledtimer},sort_keys = True).replace(' ','')
    policy_str = json.dumps(collections.OrderedDict([('ledtimer',ledtimer),('list',wb_list),('policy',policy)])).replace(' ','')

    print 'defaultpeizhi-policy',policy_str
    return policy_str


def default_config_portal_str():
    groupname = 'admin'
    wireless = []
    if Account_Group.objects.filter(groupname = groupname).exists():
        ag = Account_Group.objects.get(groupname = groupname)
        if hasattr(ag,'guest_policy'):
            gp = model_to_dict(Guest_policy.objects.get(domainname = ag))
        else:
            gp = guest_policy_config
    else:
        gp = guest_policy_config

    guest_policy = gp


    white_list = json.loads(guest_policy['white_list'])
    trusted_mac_list = json.loads(guest_policy['trusted_mac_list'])
    if guest_policy['wechatallowed'] == 'true' :
        white_list = list(set(white_list)) + ['long.weixin.qq.com','short.weixin.qq.com','szlong.weixin.qq.com','szshort.weixin.qq.com','mp.weixin.qq.com','res.wx.qq.com']
    # 保序去重
    # new_list = list(set(white_list))
    # new_list.sort(key = white_list.index)
    gp_str = {"bypass": guest_policy['bypass'], "validatetime": int(guest_policy['auth_validate_timeout']), "clienttimeout": int(guest_policy['client_timeout']), "whitelist": list(set(white_list)), "trustedlist": list(set(trusted_mac_list)), "wireless":[],"personaltype":"normal"}
    gp_str = json.dumps(gp_str,sort_keys = True).replace(' ','')


    new_str = json.loads(gp_str)
    pg = Probe_group.objects.get(Q(group_name = 'DefaultGroup')&Q(account_group_name = 'admin')&Q(group_type = 3))
    for j in Group_wlan.objects.filter(group_id_id = pg.pk).order_by('wlan_id'):
        if j.auth_type == 6:
            localwechat = collections.OrderedDict([('appid',j.wechat_appid),('appkey',j.wechat_appkey),('auth_type',6),('forcefollow',j.wechat_forcefollow),('secretkey',j.wechat_secretkey),('shopid',j.wechat_shopid),('wlanid',j.wlan_id)])
            # {
            #     "wlanid": j.wlan_id,
            #     "auth_type": 6,
            #     "appid": j.wechat_appid ,
            #     "appkey": j.wechat_appkey,
            #     "shopid": j.wechat_shopid,
            #     "secretkey": j.wechat_secretkey,
            #     "forcefollow": j.wechat_forcefollow,
            # }
            wireless.append(localwechat)
        elif j.auth_type == 7:
            portal_server = collections.OrderedDict([('auth_type',7),('hostname',j.auth_server_hostname),('loginurl',j.auth_server_loginurl),('portalurl',j.auth_server_portalurl),('wlanid',j.wlan_id)])
            # {
            #     "wlanid": j.wlan_id,
            #     "auth_type": 7,
            #     "hostname": j.auth_server_hostname,
            #     "loginurl": j.auth_server_loginurl,
            #     "portalurl": j.auth_server_portalurl,
            # }
            wireless.append(portal_server)
    new_str['wireless'] = wireless
    new_str = (json.dumps(new_str,sort_keys = True)).replace(" ","")
    print 'defaultpeizhi-portal',new_str
    return new_str


def default_config_audit_str():

    astr = '{"audit":{'
    # print mac
    # dev = model_to_dict(Probe_audit_dev_status.objects.get(mac = mac))
    dev = default_audit_setting_compare('admin',1,"dev")
    dev.pop('mac')
    dev.pop('id')
    DataQuery.DQClearNullValeForDict(dev)
    dstr = json.dumps(dev, sort_keys=True, ensure_ascii=False)
    dstr = dstr.replace(" ", '')
    #print dstr
    astr = astr + '"device":' + dstr + ','

    # place = model_to_dict(Probe_audit_place_status.objects.get(mac = mac))
    place = default_audit_setting_compare('admin',1,"place")
    place.pop('mac')
    place.pop('id')
    DataQuery.DQClearNullValeForDict(place)
    pstr = json.dumps(place, sort_keys=True, ensure_ascii=False)
    pstr = pstr.replace(" ", '')
    #print pstr
    astr = astr + '"site":' + pstr + ','

    # basic = model_to_dict(Probe_audit_basic_status.objects.get(mac = mac))
    basic = default_audit_setting_compare('admin',1,"basic")
    basic.pop('mac')
    basic.pop('id')
    DataQuery.DQClearNullValeForDict(basic)
    bstr = json.dumps(basic, sort_keys=True, ensure_ascii=False)
    bstr = bstr.replace(" ", '')
    #print bstr
    astr = astr + '"system":' + bstr + "}}"

    # DataQuery.DQSetUpdateConfig("audit", mac, astr.encode("utf-8"))

    return astr

def default_audit_setting_compare(mac,model_type,kind):
    model_type = int(model_type)
    audit_setting = ''
    # dev = Device.objects.get(mac = mac)
    if model_type == 1:
        group = Probe_group.objects.get(group_name = 'DefaultGroup',account_group_name = 'admin',group_type = '3')
        # if dev.group_id == 0:
        #     group = Probe_group.objects.get(group_name = 'DefaultGroup',account_group_name = 'admin',group_type = '2')
        # else:
        #     group = Probe_group.objects.get(pk = dev.group_id)

        if kind == 'dev':
            # try:
            #     audit_setting = Probe_audit_dev_status.objects.get(mac = mac)

            #     audit_setting.collection_radius = group.collection_radius if audit_setting.collection_radius == '' else audit_setting.collection_radius
            #     audit_setting.collection_equipment_type = group.collection_equipment_type if audit_setting.collection_equipment_type == '' else audit_setting.collection_equipment_type
            #     audit_setting.collection_equipment_name = group.collection_equipment_name if audit_setting.collection_equipment_name == '' else audit_setting.collection_equipment_name
            #     audit_setting.collection_equipment_address = group.collection_equipment_address if audit_setting.collection_equipment_address == '' else audit_setting.collection_equipment_address
            #     audit_setting.security_software_orgcode = group.security_software_orgcode if audit_setting.security_software_orgcode == '' else audit_setting.security_software_orgcode
            #     audit_setting.security_software_orgname = group.security_software_orgname if audit_setting.security_software_orgname == '' else audit_setting.security_software_orgname
            #     audit_setting.security_software_address = group.security_software_address if audit_setting.security_software_address == '' else audit_setting.security_software_address
            #     audit_setting.contactor = group.contactor if audit_setting.contactor == '' else audit_setting.contactor
            #     audit_setting.contactor_tel = group.contactor_tel if audit_setting.contactor_tel == '' else audit_setting.contactor_tel
            #     audit_setting.contactor_mail = group.contactor_mail if audit_setting.contactor_mail == '' else audit_setting.contactor_mail
            #     auds = model_to_dict(audit_setting)
            # except Exception as e:
            #     print e
            audit_setting = {'collection_radius':'','collection_equipment_type':'','collection_equipment_name':'','collection_equipment_address':'','security_software_orgcode':'','security_software_orgname':'','security_software_address':'','contactor':'','contactor_tel':'','contactor_mail':'','mac':'','id':''}

            audit_setting['collection_radius'] = group.collection_radius if audit_setting['collection_radius'] == '' else audit_setting['collection_radius']
            audit_setting['collection_equipment_type'] = group.collection_equipment_type if audit_setting['collection_equipment_type'] == '' else audit_setting['collection_equipment_type']
            audit_setting['collection_equipment_name'] = group.collection_equipment_name if audit_setting['collection_equipment_name'] == '' else audit_setting['collection_equipment_name']
            audit_setting['collection_equipment_address'] = group.collection_equipment_address if audit_setting['collection_equipment_address'] == '' else audit_setting['collection_equipment_address']
            audit_setting['security_software_orgcode'] = group.security_software_orgcode if audit_setting['security_software_orgcode'] == '' else audit_setting['security_software_orgcode']
            audit_setting['security_software_orgname'] = group.security_software_orgname if audit_setting['security_software_orgname'] == '' else audit_setting['security_software_orgname']
            audit_setting['security_software_address'] = group.security_software_address if audit_setting['security_software_address'] == '' else audit_setting['security_software_address']
            audit_setting['contactor'] = group.contactor if audit_setting['contactor'] == '' else audit_setting['contactor']
            audit_setting['contactor_tel'] = group.contactor_tel if audit_setting['contactor_tel'] == '' else audit_setting['contactor_tel']
            audit_setting['contactor_mail'] = group.contactor_mail if audit_setting['contactor_mail'] == '' else audit_setting['contactor_mail']

            auds = audit_setting

            for k in auds:
                if auds[k] == None:
                    auds[k] = ""
            return auds

        if kind == 'place':
            # try:
            #     audit_setting = Probe_audit_place_status.objects.get(mac = mac)

            #     audit_setting.place_name = group.place_name if audit_setting.place_name == '' else audit_setting.place_name
            #     audit_setting.site_address = group.site_address if audit_setting.site_address == '' else audit_setting.site_address
            #     audit_setting.netsite_type = group.netsite_type if audit_setting.netsite_type == '' else audit_setting.netsite_type
            #     audit_setting.bussiness_nature = group.bussiness_nature if audit_setting.bussiness_nature == '' else audit_setting.bussiness_nature
            #     audit_setting.law_principal_name = group.law_principal_name if audit_setting.law_principal_name == '' else audit_setting.law_principal_name
            #     audit_setting.law_principal_certificate_type = group.law_principal_certificate_type if audit_setting.law_principal_certificate_type == '' else audit_setting.law_principal_certificate_type
            #     audit_setting.law_principal_certificate_id = group.law_principal_certificate_id if audit_setting.law_principal_certificate_id == '' else audit_setting.law_principal_certificate_id
            #     audit_setting.relationship_account = group.relationship_account if audit_setting.relationship_account == '' else audit_setting.relationship_account
            #     audit_setting.start_time = group.start_time if audit_setting.start_time == '' else audit_setting.start_time
            #     audit_setting.end_time = group.end_time if audit_setting.end_time == '' else audit_setting.end_time

            #     auds = model_to_dict(audit_setting)

            # except Exception as e:
            #     print e
            audit_setting = {'place_name':'','site_address':'','netsite_type':'','bussiness_nature':'','law_principal_name':'','law_principal_certificate_type':'','law_principal_certificate_id':'','relationship_account':'','start_time':'','end_time':'','mac':'','id':'','site_type':'','police_station_code':''}

            audit_setting['place_name'] = group.place_name if audit_setting['place_name'] == '' else audit_setting['place_name']
            audit_setting['site_address'] = group.site_address if audit_setting['site_address'] == '' else audit_setting['site_address']
            audit_setting['netsite_type'] = group.netsite_type if audit_setting['netsite_type'] == '' else audit_setting['netsite_type']
            audit_setting['bussiness_nature'] = group.bussiness_nature if audit_setting['bussiness_nature'] == '' else audit_setting['bussiness_nature']
            audit_setting['law_principal_name'] = group.law_principal_name if audit_setting['law_principal_name'] == '' else audit_setting['law_principal_name']
            audit_setting['law_principal_certificate_type'] = group.law_principal_certificate_type if audit_setting['law_principal_certificate_type'] == '' else audit_setting['law_principal_certificate_type']
            audit_setting['law_principal_certificate_id'] = group.law_principal_certificate_id if audit_setting['law_principal_certificate_id'] == '' else audit_setting['law_principal_certificate_id']
            audit_setting['relationship_account'] = group.relationship_account if audit_setting['relationship_account'] == '' else audit_setting['relationship_account']
            audit_setting['start_time'] = group.start_time if audit_setting['start_time'] == '' else audit_setting['start_time']
            audit_setting['end_time'] = group.end_time if audit_setting['end_time'] == '' else audit_setting['end_time']
            audit_setting['site_type'] = group.site_type if audit_setting['site_type'] == '' else audit_setting['site_type']
            audit_setting['police_station_code'] = group.police_station_code if audit_setting['police_station_code'] == '' else audit_setting['police_station_code']

            place_audit_corp = group.audit_corp
            if place_audit_corp == '27':
                audit_setting['policestation'] = audit_setting['police_station_code']
                audit_setting['area'] = audit_setting['site_type']
            if place_audit_corp == '29':
                audit_setting['policestation'] = audit_setting['police_station_code']
            del audit_setting['site_type']
            del audit_setting['police_station_code']

            auds = audit_setting

            for k in auds:
                if auds[k] == None:
                    auds[k] = ""
            return auds

        if kind == 'basic':
            # try:
            #     audit_setting = Probe_audit_basic_status.objects.get(mac = mac)

            #     audit_setting.audit_corp = group.audit_corp if audit_setting.audit_corp == '' else audit_setting.audit_corp
            #     audit_setting.audit_ip = group.audit_ip if audit_setting.audit_ip == '' else audit_setting.audit_ip
            #     audit_setting.audit_port = group.audit_port if audit_setting.audit_port == '' else audit_setting.audit_port
            #     audit_setting.location_encode = group.location_encode if audit_setting.location_encode == '' else audit_setting.location_encode
            #     audit_setting.device_encode = group.device_encode if audit_setting.device_encode == '' else audit_setting.device_encode
            #     audit_setting.longitude = group.longitude if audit_setting.longitude == '' else audit_setting.longitude
            #     audit_setting.latitude = group.latitude if audit_setting.latitude == '' else audit_setting.latitude
            #     audit_setting.ssid = json.loads(group.ssid)
            #     # print audit_setting.ssid,'QWEQWEQWEWQEQ'
            #     auds = model_to_dict(audit_setting)
            #     if dev.own_model != 'WitMAX-P550E-L':
            #         del auds['ssid']

            #     # return model_to_dict(audit_setting)

            # except Exception as e:
            #     print e
            audit_setting = {'audit_corp':'','ftp_name':'', 'ftp_passwd':'', 'ftp_port':'','audit_ip':'','audit_port':'','location_encode':'','device_encode':'','longitude':'','latitude':'','mac':'','id':'','ssid':''}

            audit_setting['audit_corp'] = group.audit_corp if audit_setting['audit_corp'] == '' else audit_setting['audit_corp']

            audit_setting['ftp_name'] = group.ftp_name if audit_setting['ftp_name'] == '' else audit_setting['ftp_name']
            audit_setting['ftp_passwd'] = group.ftp_passwd if audit_setting['ftp_passwd'] == '' else audit_setting['ftp_passwd']
            audit_setting['ftp_port'] = group.ftp_port if audit_setting['ftp_port'] == '' else audit_setting['ftp_port']

            audit_setting['audit_ip'] = group.audit_ip if audit_setting['audit_ip'] == '' else audit_setting['audit_ip']
            audit_setting['audit_port'] = group.audit_port if audit_setting['audit_port'] == '' else audit_setting['audit_port']
            audit_setting['location_encode'] = group.location_encode if audit_setting['location_encode'] == '' else audit_setting['location_encode']
            audit_setting['device_encode'] = group.device_encode if audit_setting['device_encode'] == '' else audit_setting['device_encode']
            audit_setting['longitude'] = group.longitude if audit_setting['longitude'] == '' else audit_setting['longitude']
            audit_setting['latitude'] = group.latitude if audit_setting['latitude'] == '' else audit_setting['latitude']
            audit_setting['ssid'] = json.loads(group.ssid)
            # print audit_setting['ssid'],'ASDASDADS'

            # if dev.own_model != 'WitMAX-P550E-L':
            #     del audit_setting['ssid']

            # renzixing,wangbo,chongqingaisi,byzoro feijing
            if audit_setting['audit_corp'] == '50':
                pass
            # elif audit_setting['audit_corp'] == '3' or audit_setting['audit_corp'] == '15' or audit_setting['audit_corp'] == '22' or audit_setting['audit_corp'] == '27':
            elif audit_setting['audit_corp'] in DataQuery.auditCropLimitList:
                del audit_setting['ftp_port']
            else:
                del audit_setting['ftp_name']
                del audit_setting['ftp_passwd']
                del audit_setting['ftp_port']

            auds = audit_setting
                # return audit_setting
            for k in auds:
                if auds[k] == None:
                    auds[k] = ""
            return auds

