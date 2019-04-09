#coding:utf-8
from DevCloud.celery import app
from celery.decorators import task
import sys
sys.path.append("DataQuery")
import DataQuery
from device.models import Device,Probe_config,Probe_audit_basic_status,Probe_audit_dev_status,Probe_audit_place_status,Probe_event,Probe_group
import json
from django.forms.models import model_to_dict
from ap.models import Device_ap,AP_event,Group_wlan,Device_wlan,User_policy_config,Guest_policy,ApBlackList,Gpon,Group_gpon,Setting_gpon,Customer,Customer_name,Customer_black_list,Customer_history,Customer_white_list,Customer_black_white_switch
from ap.default_settions import user_policy_config,guest_policy_config
from account.models import NewUser,Account_Group
import Public_function
from django.db.models import Q
import collections

reload(sys)
sys.setdefaultencoding('utf-8')

@app.task
def default_config_issued():
    audit_str = default_config_audit_str()
    print 'xxxaaa'
    DataQuery.DQSetUpdateConfig("audit", 'default_config_probe_audit', audit_str.encode("utf-8"))



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
        group = Probe_group.objects.get(group_name = 'DefaultGroup',account_group_name = 'admin',group_type = '2')
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
            # elif audit_setting['audit_corp'] == '3' or audit_setting['audit_corp'] == '15' or audit_setting['audit_corp'] == '22' or audit_setting['audit_corp'] == '27' or audit_setting['audit_corp'] == '28':
            elif audit_setting['audit_corp'] in Public_function.auditCropLimitList:
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
