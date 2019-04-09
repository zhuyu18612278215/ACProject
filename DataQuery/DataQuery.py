#!/usr/bin/env python
# -*- coding:utf-8 -*-
#

import sys, os
import time
import json

import datetime
import logging
import redis
from django.utils.timezone import is_naive, make_aware, utc, is_aware
import hashlib
import math

import logging
import logging.handlers
from logging import *

#global upgrade_file_list
ugfl = []
ap_ugfl = []
lugfl = []
# HASH devices tcp report (device info report, user info report)
rt = redis.Redis(host='localhost', port=6379, db=4)

# HASH device config for md5
rm = redis.Redis(host='localhost', port=6379, db=1)
# LIST for command list
rcmd = redis.Redis(host='localhost', port=6379, db=2)
# STRING for notice string
rnt = redis.Redis(host='localhost', port=6379, db=3)

# STRING for config string
rcf = redis.Redis(host='localhost', port=6379, db=5)

# STRING for device expire and device event
rde = redis.Redis(host='localhost', port=6379, db=6)


# def LOGGING_INIT():
#     logging.basicConfig(level=logging.INFO,
#                     format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
#                     datefmt='%a, %d %b %Y %H:%M:%S',
#                     filename='./statics/log/wyun.log',
#                     filemode='a')

def LOGGING_INIT():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    rht = logging.handlers.TimedRotatingFileHandler("./statics/log/wyun.log", 'D')
    fmt = logging.Formatter("%(asctime)s %(filename)s %(lineno)s %(levelname)s - %(message)s", "%Y-%m-%d %H:%M:%S")
    rht.setFormatter(fmt)
    logger.addHandler(rht)

# def LOGGING_STR(level, lstr):
#     # if level == "DEBUG":
#     #     logging.debug(lstr)
#     if level == "INFO":
#         logging.info(lstr)
#     elif level == "WARNING":
#         logging.warning(lstr)
#     elif level == "ERROR":
#         logging.error(lstr)
#     elif level == "CRITICAL":
#         logging.critical(lstr)
#     else:
#         pass

# debug = logger.debug
# info = logger.info
# warning = logger.warn
# error = logger.error
# critical = logger.critical


# config		101
# reboot		201
# upgrade		301
# reset			401
# locate		501
# vpn			601
# roughap		701
# logip			801
# acip			901
# apcontain		1001

ActionCMD = {'config':101, 'reboot':201, 'upgrade':301, 'reset':401, 'locate':501, 'vpn':601, 'ntp':701, 'logip':801, 'acip':901, 'apcontain':1001, 'kickmac':1002,'gpcmd':1101,'gppcmd':1102,'leddetect':1103}
# lpush('001122334455', '{"event":601, "timestamp":1491358010,"param":"1.1.1.1;222;2.2.2.2"}')
# input request json like {'action':'update','mac':'r_mac'}
# return success or error
def DQProcess(request):
    print "ALALALALXXXXXXXXXXXXXXX"
    print request
    cmdStr = ""
    t = int(time.time())
    if 'action' in request.keys() and 'mac' in request.keys():
        if request['action'] in ActionCMD.keys():
            if 'param' in request.keys():
                logging.info('Probe[%s] %s by Admin param %s' % (request['mac'], request['action'], request['param']))
                cmdStr = "{\"status\":0, \"event\":%u,\"timestamp\":%u,\"param\":\"%s\"}" % (ActionCMD[request['action']], t, request['param'])
            else:
                # print request['mac'], type(request['mac'])
                # print ActionCMD[request['action']]
                # print t
                logging.info('Probe[%s] %s by Admin' % (request['mac'], request['action']))
                cmdStr = "{\"status\":0, \"event\":%u,\"timestamp\":%u}" % (ActionCMD[request['action']], t)
        else:
            return False
    else:
        return False
    print cmdStr

    print "ALALALALXXXXXXXXXXXXXXX"
    try:
        rcmd.lpush(str(request['mac']), cmdStr)
        return True
    except:
        return False

# input device type
# device(ap) mac
def DQGetAccess(dtype):
    if dtype == "probe" or dtype == "ap":
        print time.time()
        access_list = []
        accessed_devs = rt.hkeys('AcesdDevs')
        for dmac in rt.hkeys('apinfo'):
            # if(rt.hget('AcesdDevs', str(dmac)) == None):
            if dmac in accessed_devs:
                # this devs is accessed
                pass
            else:
                # get 100 access devs
                #if len(access_list) > 100:
                #    continue
                devsinfo = {}
                # get probe device information from redis
                probe_info = rt.hget('apinfo', dmac)
                if probe_info == "":
                    continue
                # change to standard json string
                probe_info = probe_info.replace("'", '"')
                probe_info = probe_info.replace("u", '')
                # get json struct
                probe_json = json.loads(probe_info)
                # get device information
                dev_info = probe_json['ap'].split(";")
                if len(dev_info) < 16:
                    continue
                # {'mac':'112233445566','model':'X-300','privateip':'192.168.1.101','lastip':'10.200.10.1:20000','version':'2.00000001','last_heart_time':'2017-04-07 15:30:00'}
                devsinfo['mac'] = str(dev_info[0])
                devsinfo['model'] = str(dev_info[3])
                devsinfo['privateip'] = str(dev_info[5])
                devsinfo['lastip'] = str(dev_info[16])
                devsinfo['version'] = str(dev_info[4])
                devsinfo['last_heart_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(dev_info[7])))

                access_list.append(devsinfo)
                devsinfo = {}

        print time.time()
        return access_list
    else:
        return None

def DQGetAccessLen(dtype):
    if dtype == "probe" or dtype == "ap":
        print time.time()
        Alen = 0
        accessed_devs = rt.hkeys('AcesdDevs')
        for dmac in rt.hkeys('apinfo'):
            # if(rt.hget('AcesdDevs', str(dmac)) == None):
            if dmac in accessed_devs:
                # this devs is accessed
                pass
            else:
                # get 100 access devs
                Alen = Alen + 1

        print time.time()
        return Alen
    else:
        return None

# input device type
# device(ap) mac
def DQSetAccessed(dtype, mac):
    if dtype == "probe" or dtype == "ap":
        try:
            rt.hset('AcesdDevs', mac, 'Accessed')
        except:
            return False
    else:
        return False

# input device type
# device(ap) mac
def DQDelAccessed(dtype, mac):
    if dtype == "probe" or dtype == "ap":
        try:
            rt.hdel('AcesdDevs', mac)
            rt.hdel('apinfo', mac)
            rt.hdel('devsoff', mac)
            # clear device config md5
            rm.hdel('aplist', mac)
        except:
            return False
    else:
        return False

# input device type
# device(ap) mac
def DQGetAccessDev(dtype, mac):
    if dtype == "probe" or dtype == "ap":
        # get probe device information from redis
        probe_info = rt.hget('apinfo', mac)
        if probe_info:
            devsinfo = {}
            # change to standard json string
            if probe_info == "":
                return None
            probe_info = probe_info.replace("'", '"')
            probe_info = probe_info.replace("u", '')
            # get json struct
            probe_json = json.loads(probe_info)
            # get device information
            dev_info = probe_json['ap'].split(";")
            if len(dev_info) < 16:
                return None
            # data = {'mac':r_mac,'name':'','model':'X-300','sn':'00000001','lastip':'10.200.10.1:20000','privateip':'192.168.1.101','currstanum':'0','totalstanum':'1','currhotnum':'0','totalhotnum':'1','placecode':'0010001','devicecode':'0020002','manufacturer':'百卓','manufacturer_ip':'115.28.241.216','version':'2.0001','last_heart_time':'2017-04-07 15:30:00','upload':'0','download':'0'}
            devsinfo['mac'] = str(dev_info[0])
            devsinfo['name'] = ""
            devsinfo['own_model'] = str(dev_info[2])
            devsinfo['model'] = str(dev_info[3])
            devsinfo['sn'] = str(dev_info[1])
            devsinfo['privateip'] = str(dev_info[5])
            devsinfo['lastip'] = str(dev_info[16])
            devsinfo['version'] = str(dev_info[4])
            devsinfo['last_heart_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(dev_info[7])))
            # devsinfo['upload'] = str(dev_info[14])
            # devsinfo['download'] = str(dev_info[15])
            devsinfo['upload'] = DQchangeTraffic(float(dev_info[14]))
            devsinfo['download'] = DQchangeTraffic(float(dev_info[15]))


            devsinfo['currstanum'] = 0
            devsinfo['totalstanum'] = 0
            devsinfo['currhotnum'] = 0
            devsinfo['totalhotnum'] = 0
            devsinfo['placecode'] = ""
            devsinfo['devicecode'] = str(dev_info[0])
            devsinfo['manufacturer'] = ""
            devsinfo['manufacturer_ip'] = ""

            return devsinfo
        else:
            None
    else:
        return None

# input device type
# device(ap) list from mysql
def DQUpdateAccessed(dtype, alist):
    if dtype == "probe" or dtype == "ap":
        print time.time()
        # (ap info list) get all device info from redis
        apil = rt.hgetall('apinfo')
        for al in alist:
            # if(rt.hget('AcesdDevs', str(dmac)) == None):
            # ai = rt.hget('apinfo', al.mac)
            # if ai:
            if al.mac in apil:
                # get probe device information from redis
                # probe_info = rt.hget('apinfo', al.mac)
                probe_info = apil[al.mac]
                if probe_info == "":
                    continue
                # change to standard json string
                probe_info = probe_info.replace("'", '"')
                probe_info = probe_info.replace("u", '')
                # get json struct
                probe_json = json.loads(probe_info)
                # get device information
                dev_info = probe_json['ap'].split(";")
                if len(dev_info) < 16:
                    continue
                # {'mac':'112233445566','model':'X-300','privateip':'192.168.1.101','lastip':'10.200.10.1:20000','version':'2.00000001','last_heart_time':'2017-04-07 15:30:00'}
                # devsinfo['mac'] = str(dev_info[0])
                try:
                    al.own_model = str(dev_info[2])
                    al.model = str(dev_info[3])
                    al.sn = str(dev_info[1])
                    al.privateip = str(dev_info[5])
                    al.lastip = str(dev_info[16])
                    al.version = str(dev_info[4])
                    mslht = al.last_heart_time
                    # al.last_heart_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(dev_info[7])))
                    al.last_heart_time = make_aware(datetime.datetime.utcfromtimestamp(float(dev_info[7])), utc)
                    # print "FFFFFFFFFFFFFFFFFFFFFFFFFF"
                    # print al.last_heart_time

                    # al.upload = DQchangeTraffic(float(dev_info[14]))
                    # al.download = DQchangeTraffic(float(dev_info[15]))

                    rss = al.reboot_sign.split(",")
                    # print rss
                    # print rss[0]

                    if rss[0] == "0" or rss[0] == '':
                        pass
                    else:
                        # print "CCCCCC"
                        # print float(rss[1])
                        tms = make_aware(datetime.datetime.utcfromtimestamp(float(rss[1])), utc)
                        # print "xxxxxxxxxxxxxxxxxxx"
                        # print tms
                        # print al.last_heart_time
                        # print "xxxxxxxxxxxxxxxxxxx"
                        # tmn = django.utils.timezone.now()
                        # print timeStamp,"XXXXXXXXX",tmn
                        if al.last_heart_time > tms and int((al.last_heart_time - tms).total_seconds()) > 30:
                            al.reboot_sign = "0"
                    # save to mysql 6 mins interval
                    #
                    # if int((al.last_heart_time - mslht).total_seconds()) > 6*60:
                    #     al.save()
                    #
                except:
                    print dev_info
            # else:
            #     al.upload = al.upload
            #     al.download = al.download
        #print time.time()
        #print 232323232323232323232323233
    else:
        return None

def DQGetAPCpu(dtype,mac):
    if dtype == "probe" or dtype == "ap":
        # get probe device information from redis
        print mac
        probe_info = rt.hget('apinfo', mac)
        if probe_info:
            # change to standard json string
            probe_info = probe_info.replace("'", '"')
            probe_info = probe_info.replace("u", '')
            # get json struct
            probe_json = json.loads(probe_info)
            # get device information
            dev_info = probe_json['ap'].split(";")
            if len(dev_info) < 16:
                return None
            try:
                return str(dev_info[9]) + "%"
            except:
                print dev_info
                return None
        else:
            return None
    else:
        return None

def DQUpdateAccessedDev(dtype, mac, data):
    print dtype
    print mac
    if dtype == "probe" or dtype == "ap":
        # get probe device information from redis
        print mac
        probe_info = rt.hget('apinfo', mac)
        if probe_info:
            # change to standard json string
            probe_info = probe_info.replace("'", '"')
            probe_info = probe_info.replace("u", '')
            # get json struct
            probe_json = json.loads(probe_info)
            # get device information
            dev_info = probe_json['ap'].split(";")
            if len(dev_info) < 16:
                return None
            # data = {'mac':r_mac,'name':'','model':'X-300','sn':'00000001','lastip':'10.200.10.1:20000','privateip':'192.168.1.101','currstanum':'0','totalstanum':'1','currhotnum':'0','totalhotnum':'1','placecode':'0010001','devicecode':'0020002','manufacturer':'百卓','manufacturer_ip':'115.28.241.216','version':'2.0001','last_heart_time':'2017-04-07 15:30:00','upload':'0','download':'0'}
            try:
                data['mac'] = str(dev_info[0])

                data['sn'] = str(dev_info[1])
                data['model'] = str(dev_info[3])
                data['version'] = str(dev_info[4])
                data['ip'] = str(dev_info[5])
                data['running_time'] = str(dev_info[6])
                data['last_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(dev_info[7])))
                data['cpu'] = str(dev_info[9]) + "%"
                data['memory'] = str(dev_info[10]) + "%"
                data['flash'] = str(dev_info[11]) + "%"

            except:
                print dev_info
                return None
        else:
            return None
    else:
        return None

def DQClearNullValeForDict(d):
    s_key = list(d.keys())
    for k_s in s_key:
        # print "SSSSSSSS"
        # print k_s
        # print d[k_s]
        # print "SSSSSSSS"

        # #change "\u6492\u65e6\u6cd5" to chinese
        # if "\u" in d[k_s]:
        #     d[k_s] = eval('u"'+d[k_s]+'"').encode("utf-8")

        if d[k_s] == "":
            d.pop(k_s)

def DQSetUpdateConfig(dtype, mac, jstr):
    print "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", dtype, mac, jstr
    # rcf.set('001122334455audit', '{"audit":{"device":{"collection_equipme')
    # time_stamp = int(time.mktime(datetime.datetime.now().timetuple()))

    try:
        # saved for redis
        # sfstr = '{"'+ str(time_stamp) + '":' + jstr + '}'
        # print sfstr
        rcf.set(str(mac)+dtype, jstr)
    except:
        # log
        return

    # values = '{"status":0,"event":"101","param":"wconf"}'
    # # inspect network config
    # values = '{"status":0,"event":"101","param":"nconf"}'
    # # inspect policy config
    # values = '{"status":0,"event":"101","param":"plconf"}'
    # # inspect portal config
    # values = '{"status":0,"event":"101","param":"prconf"}'
    # # inspect audit config
    # values = '{"status":0,"event":"101","param":"aconf"}'

    # ap config md5sum status md5sum = apmac;wconf;nconf;plconf;prconf;aconf
    ai = rm.hget('aplist', mac)
    if ai == None:
        if dtype == "audit":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            sstr = mac+";;;;;"+str(amd5)

            m = hashlib.md5()
            m.update(sstr)
            smd5 = m.hexdigest()

            sstr = smd5+";;;;;"+str(amd5)

            # print "1111111111"
            # print sstr
        elif dtype == "wireless":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            sstr = mac + ";" + str(amd5) + ";;;;"

            m = hashlib.md5()
            m.update(sstr)
            smd5 = m.hexdigest()

            sstr = smd5+ ";" + str(amd5) + ";;;;"

            # print "1111111111"
            # print sstr
        elif dtype == "portal":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            sstr = mac + ";;;;" + str(amd5) + ";"

            m = hashlib.md5()
            m.update(sstr)
            smd5 = m.hexdigest()

            sstr = smd5+ ";;;;" + str(amd5) + ";"

            # print "1111111111"
            # print sstr
        elif dtype == "policy":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            sstr = mac + ";;;" + str(amd5) + ";;"

            m = hashlib.md5()
            m.update(sstr)
            smd5 = m.hexdigest()

            sstr = smd5+ ";;;" + str(amd5) + ";;"

            # print "1111111111"
            # print sstr

    else:
        if dtype == "audit":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            apms = ai.split(';')
            apms[0] = mac
            apms[5] = amd5
            # tt = ';'.join(apms)
            tt = str(apms).strip("[]")
            tt = tt.replace(" ", "")
            tt = tt.replace("'", "")
            tt = tt.replace(",", ";")

            m = hashlib.md5()
            m.update(tt)
            smd5 = m.hexdigest()
            apms = tt.split(';')
            apms[0] = smd5
            # sstr = ';'.join(apms)
            sstr = str(apms).strip("[]")
            sstr = sstr.replace(" ", "")
            sstr = sstr.replace("'", "")
            sstr = sstr.replace(",", ";")

            # print "222222222"
            # print sstr
        elif dtype == "wireless":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            apms = ai.split(';')
            apms[0] = mac
            apms[1] = amd5
            tt = ';'.join(apms)
            # tt = str(apms).strip("[]")
            # tt = tt.replace(" ", "")
            # tt = tt.replace("'", "")
            # tt = tt.replace(",", ";")

            m = hashlib.md5()
            m.update(tt)
            smd5 = m.hexdigest()
            apms = tt.split(';')
            apms[0] = smd5
            sstr = ';'.join(apms)
            # sstr = str(apms).strip("[]")
            # sstr = sstr.replace(" ", "")
            # sstr = sstr.replace("'", "")
            # sstr = sstr.replace(",", ";")

            # print "222222222"
            # print sstr
        elif dtype == "portal":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            apms = ai.split(';')
            apms[0] = mac
            apms[4] = amd5
            tt = ';'.join(apms)
            # tt = str(apms).strip("[]")
            # tt = tt.replace(" ", "")
            # tt = tt.replace("'", "")
            # tt = tt.replace(",", ";")

            m = hashlib.md5()
            m.update(tt)
            smd5 = m.hexdigest()
            apms = tt.split(';')
            apms[0] = smd5
            sstr = ';'.join(apms)
            # sstr = str(apms).strip("[]")
            # sstr = sstr.replace(" ", "")
            # sstr = sstr.replace("'", "")
            # sstr = sstr.replace(",", ";")

            # print "222222222"
            # print sstr
        elif dtype == "policy":
            m = hashlib.md5()
            m.update(jstr)
            amd5 = m.hexdigest()

            apms = ai.split(';')
            apms[0] = mac
            apms[3] = amd5
            tt = ';'.join(apms)
            # tt = str(apms).strip("[]")
            # tt = tt.replace(" ", "")
            # tt = tt.replace("'", "")
            # tt = tt.replace(",", ";")

            m = hashlib.md5()
            m.update(tt)
            smd5 = m.hexdigest()
            apms = tt.split(';')
            apms[0] = smd5
            sstr = ';'.join(apms)
            # sstr = str(apms).strip("[]")
            # sstr = sstr.replace(" ", "")
            # sstr = sstr.replace("'", "")
            # sstr = sstr.replace(",", ";")

            # print "222222222"
            # print sstr

    try:
        rm.hset('aplist', mac, sstr)
    except:
        # log error
        pass

def DQimportdev(mac):
    rt.hset("apinfo", mac, "")
    rt.hset('AcesdDevs', mac, 'Accessed')

def DQClearConfig(mac):
    try:
        rm.hdel('aplist', mac)
    except:
        # log error
        pass

# ai = rm.hget('aplist', mac)
#     if ai == None:
#         if dtype == "audit":

#             sstr = mac+";;;;;"+''

#             m = hashlib.md5()
#             m.update(sstr)
#             smd5 = m.hexdigest()

#             sstr = smd5+";;;;;"+''
#             # print "1111111111"
#             # print sstr
#     else:
#         if dtype == "audit":

#             apms = ai.split(';')
#             apms[0] = mac
#             apms[5] = ''
#             tt = str(apms).strip("[]")
#             tt = tt.replace(" ", "")
#             tt = tt.replace("'", "")
#             tt = tt.replace(",", ";")

#             m = hashlib.md5()
#             m.update(tt)
#             smd5 = m.hexdigest()
#             apms = tt.split(';')
#             apms[0] = smd5
#             sstr = str(apms).strip("[]")
#             sstr = sstr.replace(" ", "")
#             sstr = sstr.replace("'", "")
#             sstr = sstr.replace(",", ";")

#     try:
#         rm.hset('aplist', mac, sstr)
#     except:
#         # log error
#         pass

def DQGetEventFromRedis(seconds, Mlist):
    # for ev in rde.zscan_iter("devseve"):
    #   print ev[0].split("_")[0], ev[0].split("_")[1], int(ev[1])
    # event = {'data':[{'event_time':'2017/05/04 12:05:35','msg':'Probe[A4E6B1300005] was onlined.','action':_(u'存档'),'probe_mac':'A4E6B1300005','event':u'','state':state_check('A4E6B1300005')},{'event_time':'2017/05/04 12:04:44','msg':'Probe[8c8401163ae0] was offlined.','action':_(u"存档"),'probe_mac':'8c8401163ae0','event':u'PROBE_WAS_OFFLINED','state':state_check('8c8401163ae0')}]}
    # {'event_time':'2017/05/04 12:05:35','msg':'Probe[A4E6B1300005] was onlined.','action':_(u'存档'),'probe_mac':'A4E6B1300005','event':u'','state':state_check('A4E6B1300005')}
    evl = {}
    data = []
    event = {}
    for ev in rde.zscan_iter("devseve"):
        eve = ev[0].split("_")
        act = eve[0]
        dmac = eve[1]

        # add for Mutli users
        if Mlist == None or dmac in Mlist:
            pass
        else:
            continue

        tstamp = int(ev[1])
        time_stamp = int(time.mktime(datetime.datetime.now().timetuple()))
        print time_stamp, tstamp
        # Within the scope of the time
        if time_stamp - tstamp > seconds:
            continue

        event['event_time'] = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(tstamp))
        event['action'] = ""
        event['event'] = act
        event['state'] = ""
        event['probe_mac'] = dmac

        if eve[0] == "onlined" or eve[0] == "offlined":
            event['msg'] = "Device[" + dmac + "] " + act + "."
        else:
            # print eve[2]
            # print eve[2].replace(":", " ")
            event['msg'] = "Device[" + dmac + "] " + act + " " + eve[2].replace(":", " ") + "."
        print event

        data.append(event)
        event = {}

    evl['data'] = data

    return evl

def DQGetOnlinedDevs(Mlist):
    if Mlist == None:
        return rt.hlen('apinfo') - DQGetAccessLen('probe')
    else:
        alen = 0
        plen = 0
        apil = rt.hgetall('apinfo')
        for k, v in apil.items():
            if k in Mlist:
                alen = alen + 1

        Plist = rt.hgetall('probe')
        for k, v in Plist.items():
            if k in Mlist:
                plen = plen + 1

        return alen - plen
    #return rt.hlen('AcesdDevs')

def DQGetOfflinedDevs(Mlist):
    if Mlist == None:
        return rt.hlen('devsoff')
    else:
        len = 0
        Dolist = rt.hgetall('devsoff')
        for k, v in Dolist.items():
            if k in Mlist:
                len = len + 1
        return len

def DQchangeTime(allTime):
    day = 24*60*60
    hour = 60*60
    min = 60
    # print allTime
    # if allTime < 60:
    #     return  "%d s"% allTime
    if  allTime > day:
        days = divmod(allTime, day)
        return "%d days, %s"%(int(days[0]), DQchangeTime(days[1]))
    elif allTime > hour:
        hours = divmod(allTime, hour)
        # print hours
        # print '%d H, %s'%(int(hours[0]), DQchangeTime(hours[1]))
        return '%d:%s'%(int(hours[0]), DQchangeTime(hours[1]))
    else:
        mins = divmod(allTime, min)
        return "%d"%(int(mins[0]))
        #return "%d m, %d s"%(int(mins[0]),math.ceil(mins[1]))

def DQchangeTraffic(allTraffic):
    K = 1024
    M = 1024*1024
    G = 1024*1024*1024
    # print allTraffic
    if allTraffic > G:
        return  '%.2f GB'% (allTraffic/G)
    elif  allTraffic > M:
        return '%.2f MB'% (allTraffic/M)
    elif allTraffic > K:
        return '%.2f KB'% (allTraffic/K)
    else:
        return '%.2f B'% allTraffic

def DQGetTopItem(dtype, itype, Mlist):
    apil = rt.hgetall('apinfo')
    alist = []
    ralist = []
    ratim = {}

    # print itype
    for k, v in apil.items():
        probe_info = v
        # change to standard json string
        probe_info = probe_info.replace("'", '"')
        probe_info = probe_info.replace("u", '')
        # get json struct
        try:
            probe_json = json.loads(probe_info)
        except Exception as e:
            print e
            continue
        # get device information
        dev_info = probe_json['ap'].split(";")

        if k in Mlist:
            pass
        else:
            continue

        #delete not accessed device
        if rt.hget('AcesdDevs', dev_info[0]) == None:
            continue

        sn = str(dev_info[1])
        if dtype != 'all':
            if dtype != DQGetJudgeSN(sn, 6, 2):
                continue

        if itype == "onlinetime":
            # print 11111111111111111111111
            atim = (str(dev_info[0]), int(dev_info[6]))
        elif itype == "upload":
            # print 22222222222222222222222
            atim = (str(dev_info[0]), int(dev_info[14]))
        elif itype == "download":
            # print 22222222222222222222222
            atim = (str(dev_info[0]), int(dev_info[15]))
        elif itype == "immediateFlow":
            apImmediateFlow = rt.hget('apImmediateFlow',str(dev_info[0])) or 0
            atim = (str(dev_info[0]), int(apImmediateFlow))
        else:
            # print 3333333333333333333333333
            return None
        alist.append(atim)

    salist = sorted(alist, reverse=True, key=lambda s:s[1])
    # print salist
    print itype
    if dtype == 'all':
        end = 5
    else:
        end = 10
    for item in salist[0:end]:
        ratim['mac'] = item[0]
        if itype == "onlinetime":
            #print "hhhhhhhhhhhhhhhhhh"
            #print int(item[1])
            ratim['hour'] = DQchangeTime(int(item[1]))
            # ratim['hour'] = item[1]
            #print ratim['hour']
            #print "hhhhhhhhhhhhhhhhhh"
        elif itype == "upload":
            #print "ttttttttttttttttttttt"
            #print DQchangeTraffic(float(item[1]))
            ratim['upload'] = DQchangeTraffic(float(item[1]))
        elif itype == "download":
            #print "ttttttttttttttttttttt"
            #print DQchangeTraffic(float(item[1]))
            ratim['download'] = DQchangeTraffic(float(item[1]))
            #print "ttttttttttttttttttttt"
        elif itype == "immediateFlow":
            ratim['immediateFlow'] = DQchangeTraffic(float(item[1]))
        ralist.append(ratim)
        ratim = {}

    print ralist
    return ralist

# judge_sn(p.sn,6,2)
def DQGetJudgeSN(sn, num, add):
    if sn[:6] == '010107':
        return 'car'
    else:
        if sn[int(num):int(num)+int(add)] == '3G' or sn[int(num):int(num)+int(add)] == '3T':
            return '3g'
        elif sn[int(num):int(num)+int(add)] == '4G' or sn[int(num):int(num)+int(add)] == '4T':
            return '4g'
        else:
            return 'normal'

    # if sn[int(num):int(num)+int(add)] == '3G' or sn[int(num):int(num)+int(add)] == '3T':
    #     return '3g'
    # elif sn[int(num):int(num)+int(add)] == '4G' or sn[int(num):int(num)+int(add)] == '4T':
    #     return '4g'
    # elif sn[int(num):int(num)+int(add)] == 'BZ' :
    #     return 'normal'
    # elif sn[int(num):int(num)+int(add)] == 'VH' :
    #     return 'car'
    # else:
    #     return 'normal'

# input device type
# input information type
def DQGetTopItemByDtype(data, dtype, Mlist):
    # apil = rt.hgetall('apinfo')

    # print dtype
    ralist = DQGetTopItem(dtype, 'upload', Mlist)
    # print ralist
    for ai in ralist:
        # add for multi users
        if Mlist == None or ai['mac'] in Mlist:
            pass
        else:
            continue

        probe_info = rt.hget('apinfo', ai['mac'])
        # device must accessed device
        if probe_info and rt.hget('AcesdDevs', ai['mac']):
            # change to standard json string
            probe_info = probe_info.replace("'", '"')
            probe_info = probe_info.replace("u", '')
            # get json struct
            probe_json = json.loads(probe_info)
            # get device information
            dev_info = probe_json['ap'].split(";")

            data['mac'].append(str(dev_info[0]))
            data['upload'].append(float(dev_info[14])/1024/1024)
            data['download'].append(float(dev_info[15])/1024/1024)

    print data

def DQGetAPUsersDownload(apMac):
    usersdown = rt.hget('apusersdownload', apMac)
    if usersdown == None:
        return 0
    else:
        return int(float(usersdown))

def DQGetAPUsersUpload(apMac):
    usersup = rt.hget('apusersupload', apMac)
    if usersup == None:
        return 0
    else:
        return int(float(usersup))

def DQGetTopAPUsers(data, Mlist):
    apil = rt.hgetall('apusers')
    alist = []
    ralist = {}
    ratim_mac = []
    ratim_num = []
    ratim_download = []
    ratim_upload = []

    # print itype
    for k, v in apil.items():
        if k in Mlist:
            pass
        else:
            continue
        print k, v
        if v == '':
            continue
        atim = (str(k), int(len(v.split(';'))))
        print atim
        alist.append(atim)

    salist = sorted(alist, reverse=True, key=lambda s:s[1])
    # print salist
    # print itype
    uflow = []
    uflowdic = {}
    for item in salist[0:10]:
        ratim_mac.append(item[0])
        ratim_num.append(item[1])
        # ratim_upload.append(DQGetAPUsersUpload(item[0])/1024/1024)
        # ratim_download.append(DQGetAPUsersDownload(item[0])/1024/1024)

        uflowdic['y'] = item[1]

        uflowdic['z'] = int(float(DQGetAPUsersUpload(item[0]))/1024/1024)

        uflowdic['w'] = int(float(DQGetAPUsersDownload(item[0]))/1024/1024)
        uflow.append(uflowdic)
        uflowdic = {}
        # ratim['name'] = ''

    ralist['uflow'] = uflow

    ralist['mac'] = ratim_mac
    ralist['num'] = ratim_num
    ralist['upload'] = ratim_upload
    ralist['download'] = ratim_download
    ralist['name'] = []

    # pointFormat: '用户数 <b> {point.y} </b><br>' +
    # '上行流量: <b> {point.z}  Mkb </b><br>' +
    # '下行流量: <b> {point.w}  Mkb </b><br>'
    # ralist['uflow'] = [
    #         {'y': 3, 'z': 1000, 'w':200},
    #         {'y': 1, 'z': 1000, 'w':300}
    # ]

    print ralist,'yyyyyyyy'
    return ralist

# input msg type cpu flash memory
def DQGetWarnByDtype(mtype, Mlist):
    # waring top
    wtop = []
    wdata = {}

    if mtype == 'CPU' or mtype == 'FLASH' or mtype == 'MEMORY':
        pass
    else:
        return None
    kstr = "*" + mtype

        # rde.keys('*cpu')
        # rde.set('001122112233;cpu', '89%;192.168.1.79:36401;3.04.16.171100;2017-04-26 18:12:39')
        # top1 = {'mac':'a4e6b1300005','type':'CPU','num':'90%','name':'',
        # 'ip':'192.168.1.79:36401','version':'3.04.16.171100','time':'2017-04-26 18:12:39'}
    for wc in  rde.keys(kstr):
        cdata = rde.get(wc).split(";")
        wdata['mac'] = wc.split(';')[0]

        # add by mutli users
        if Mlist == None or wdata['mac'] in Mlist:
            pass
        else:
            continue

        wdata['type'] = mtype
        wdata['num'] = cdata[0]
        wdata['ip'] = cdata[1]
        wdata['version'] = cdata[2]
        wdata['time'] = cdata[3]
        wtop.append(wdata)
        wdata = {}

    return wtop

# def ByteFormat(size,unit='Bytes'):
#     units = ['Bytes','KB','MB','GB','TB','PB']
#     return ('%.2f'+" "+unit) % (size/math.pow(1024,units.index(unit)))

# import time
# import math

# def changeTime(allTime):
#     day = 24*60*60
#     hour = 60*60
#     min = 60
#     if allTime <60:
#         return  "%d sec"%math.ceil(allTime)
#     elif  allTime > day:
#         days = divmod(allTime,day)
#         return "%d days, %s"%(int(days[0]),changeTime(days[1]))
#     elif allTime > hour:
#         hours = divmod(allTime,hour)
#         return '%d hours, %s'%(int(hours[0]),changeTime(hours[1]))
#     else:
#         mins = divmod(allTime,min)
#         return "%d mins, %d sec"%(int(mins[0]),math.ceil(mins[1]))

def DQGetUserDevTypeSummary(dtype, Mlist):
    aplist = rt.hgetall('apuserssum')
    pcnum = 0
    mobnum = 0
    if aplist != None:
        for key,apumac in aplist.items():
            for udata in apumac.split(";"):
                udatalist = udata.split("|")
                if len(udatalist) == 3:
                    # get user is pc or mobile
                    # iphone and ipad and android or PC and Mac PC
                    if udatalist[1] == 'iphone' or udatalist[1] == 'ipad' or udatalist[1] == 'android':
                        mobnum = mobnum + 1
                    else:
                        pcnum = pcnum + 1
        return {"pc":pcnum, "moblie":mobnum}
    else:
        return {"pc":0, "moblie":0}

def DQGetApUserPortalSummary(umac):
    apusers = rt.hgetall('apuserssum', umac)
    users = 0
    portalusers = 0
    if apusers != None:
        for udata in apusers.split(";"):
            udatalist = udata.split("|")
            if len(udatalist) == 3:
                # get user is portal user
                if udatalist[2] == 'false':
                    users = users + 1
                else:
                    portalusers = portalusers + 1
        return {"users":users, "portalusrs":portalusers}
    else:
        return {"users":0, "portalusrs":0}


def DQGetAPCache_nojson(key):
    try:
        value = rde.get(key)
    except Exception as e:
        print e
        value = ""
    return value

def DQGetAPCache_json(key):
    try:
        value = json.loads(rde.get(key))
    except Exception as e:
        print e
        value = ""
    return value

# apMac ap mac(str), group id(str)
def DQAPMacSetGroupID(apMacmac, groupId):
    try:
        rt.hset("apgroupid", apMac, groupId)
    except:
        # log error
        pass

# mac ap mac(str), group id(str)
def DQAPMacGetGroupID(apMacmac):
    groupid = None
    try:
        # if rt.hget('apgroupid', apMac) == None:
        groupid = rt.hget("apgroupid", apMac)
    except:
        # log error
        return None

    return groupid

def DQGetUsersByGroupID(groupId, wlanId, timeStamp):
    users = None
    for i in range(0, 5):
        qkey = "users" + groupId + ";" + wlanId + ";" +  str(timeStamp + i*300)
        users = rde.get(qkey)
        if users != None:
            break
    # return 0
    if users == None:
        return 0
    else:
        return int(float(users))

def DQGetUsersDownLoadByGroupID(groupId, wlanId, timeStamp):
    usersdown = None
    for i in range(0, 5):
        qkey = "usersdownload" + groupId + ";" + wlanId + ";" +  str(timeStamp + i*300)
        # print "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD qkey", qkey
        usersdown = rde.get(qkey)
        # print "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD usersdown", i, i*300, usersdown, str(timeStamp + i*300)
        if usersdown != None:
            break
    # return 0
    if usersdown == None:
        return 0
    else:
        return int(float(usersdown))

def DQGetUsersUpLoadByGroupID(groupId, wlanId, timeStamp):
    usersup = None
    for i in range(0, 5):
        qkey = "usersupload" + groupId + ";" + wlanId + ";" +  str(timeStamp + i*300)
        usersup = rde.get(qkey)
        if usersup != None:
            break
    # return 0
    if usersup == None:
        return 0
    else:
        return int(float(usersup))

def DQUpdateAuditConfig():
    for k in rcf.keys():
        js = json.loads(rcf.get(k))
        jstr = json.dumps(js[js.keys()[0]], sort_keys=True).replace(" ", "")
        print k, jstr
        rcf.set(k, jstr)
        print jstr

def DQGetServerResponseTime():
    restm = rde.get("responsetime")
    if restm != None:
        return int(float(restm) * 1000)
    else:
        return 1

def DQGetModelBYMAC(mac):
    # get probe device information from redis
    print mac
    probe_info = rt.hget('apinfo', mac)
    if probe_info:
        # change to standard json string
        probe_info = probe_info.replace("'", '"')
        probe_info = probe_info.replace("u", '')
        # get json struct
        probe_json = json.loads(probe_info)
        # get device information
        dev_info = probe_json['ap'].split(";")
        if len(dev_info) < 16:
            return None
        else:
            return str(dev_info[2])

def DQGetSupportModeBYMAC(mac):
    # get probe device information from redis
    print mac
    probe_info = rt.hget('apinfo', mac)
    if probe_info:
        # change to standard json string
        probe_info = probe_info.replace("'", '"')
        probe_info = probe_info.replace("u", '')
        # get json struct
        probe_json = json.loads(probe_info)
        # get device information
        dev_info = probe_json['ap'].split(";")
        if len(dev_info) < 16:
            return None
        else:
            return str(dev_info[8])

def DQSetDevsUpdateMACData(mac, data):
    try:
        rcmd.hset('devsupdate', mac, data)
    except Exception as e:
        print e

def DQSetAccountGroupUpdateStatus(groupname, supportmode, status):
    hstr = groupname + ";" + str(supportmode)
    rt.hset("deviceautoupdate", hstr, status)

def DQGetAccountGroupUpdateStatus(groupname, supportmode):
    hstr = groupname + ";" + str(supportmode)
    status = rt.hget("deviceautoupdate", hstr)

    if status != None:
        return status
    else:
        return None
