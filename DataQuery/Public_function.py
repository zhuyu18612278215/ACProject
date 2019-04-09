#!/usr/bin/env python
# -*- coding:utf-8 -*-
#
#
from account.models import NewUser
import json
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy as lazy_
from django.contrib.auth.hashers import check_password

device_type_info_dict = {
    # cap520 old
    "WAE-A1":{
        'radio_num':'0',
        'radio_2_txp':'23',
        'radio_5_txp':'23',
    },
    "CLP2640":{
        'radio_num':'0',
        'radio_2_txp':'23',
        'radio_5_txp':'23',
    },
    #cap510 old
    "CLR1200":{
        'radio_num':'1',
        'radio_2_txp':'28',
    },
    # cap310 old
    "1200C":{
        'radio_num':'1',
        'radio_2_txp':'20',
    },
    # cap520 old
    "CLR2640":{
        'radio_num':'0',
        'radio_2_txp':'23',
        'radio_5_txp':'23',
    },
    "CLR2640-E":{
        'radio_num':'0',
        'radio_2_txp':'23',
        'radio_5_txp':'23',
    },
    # cap510 old
    "CLR1200-E":{
        'radio_num':'1',
        'radio_2_txp':'28',
    },
    "CLR1200-R":{
        'radio_num':'1',
        'radio_2_txp':'28',
    },
    # cap310 old
    "CLR1200-C":{
        'radio_num':'1',
        'radio_2_txp':'20',
    },
    # wap310 old
    "CLR1200-W":{
        'radio_num':'1',
        'radio_2_txp':'17',
    },
    # probe old
    "CLP3422":{
        'radio_num':'0',
        'radio_2_txp':'17',
        'radio_5_txp':'16',
    },
    "KLP3422":{
        'radio_num':'0',
        'radio_2_txp':'17',
        'radio_5_txp':'16',
    },
    # cap310H old
    "CLR1200-HP":{
        'radio_num':'1',
        'radio_2_txp':'27',
    },

    "WitFi-WAP520":{
        'radio_num':'0',
        'radio_2_txp':'17',
        'radio_5_txp':'17',
    },
    "WitFi-WAP510":{
        'radio_num':'1',
        'radio_2_txp':'17',
    },
    "WitFi-CAP510":{
        'radio_num':'1',
        'radio_2_txp':'28',
    },
    "WitFi-CAP310":{
        'radio_num':'1',
        'radio_2_txp':'20',
    },
    # null old
    "WitFi-DAP310E":{
        'radio_num':'1',
        'radio_2_txp':'17',
    },

    "WitFi-WAP310":{
        'radio_num':'1',
        'radio_2_txp':'17',
    },
    "WitFi-CAP520":{
        'radio_num':'0',
        'radio_2_txp':'23',
        'radio_5_txp':'23',
    },
    #null old
    "WitFi-DAP520E":{
        'radio_num':'0',
        'radio_2_txp':'17',
        'radio_5_txp':'16',
    },
    "WitMAX-P520E":{
        'radio_num':'0',
        'radio_2_txp':'17',
        'radio_5_txp':'16',
    },
    # probe
    "WitMAX-P550E":{
        'radio_num':'0',
        'radio_2_txp':'19',
        'radio_5_txp':'18',
    },

    "WitFi-CAP310H":{
        'radio_num':'1',
        'radio_2_txp':'27',
    },
    "WitMAX-AP310E":{
        'radio_num':'1',
        'radio_2_txp':'27',
    },
    "WitMAX-AP520":{
        'radio_num':'0',
        'radio_2_txp':'30',
        'radio_5_txp':'30',
    },
    "WitMAX-AP521":{
        'radio_num':'0',
        'radio_2_txp':'30',
        'radio_5_txp':'30',
    },
    # null
    "WitFi-DAP510E":{
        'radio_num':'1',
        'radio_2_txp':'17',
    },
    "WitFi-DAP511E":{
        'radio_num':'1',
        'radio_2_txp':'25',
    },
    "WitFi-CAP521":{
        'radio_num':'0',
        'radio_2_txp':'18',
        'radio_5_txp':'23',
    },
    "WitFi-DAP520":{
        'radio_num':'0',
        'radio_2_txp':'18',
        'radio_5_txp':'23',
    },
    # null old
    "WitFi-CAP521E":{
        'radio_num':'0',
        'radio_2_txp':'18',
        'radio_5_txp':'23',
    },
    # null
    "WitFi-CAP522":{
        'radio_num':'0',
        'radio_2_txp':'18',
        'radio_5_txp':'23',
    },

    "WitFi-CAP523":{
        'radio_num':'0',
        'radio_2_txp':'27',
        'radio_5_txp':'27',
    },
    "WitFi-CAP524":{
        'radio_num':'0',
        'radio_2_txp':'23',
        'radio_5_txp':'20',
    },
    # null
    "WitFi-WAP511":{
        'radio_num':'1',
        'radio_2_txp':'18',
    },
    "WitFi-WAP521":{
        'radio_num':'0',
        'radio_2_txp':'18',
        'radio_5_txp':'23',
    },
    # null old
    "WitFi-VP310":{
        'radio_num':'1',
        'radio_2_txp':'18',
        # 'radio_5_txp':'23',
    },

    "WitFi-CAP525":{
        'radio_num':'0',
        'radio_2_txp':'27',
        'radio_5_txp':'20',
    },
    "WitFi-CAP511":{
        'radio_num':'1',
        'radio_2_txp':'27',
        # 'radio_5_txp':'23',
    },
    # null
    "WitFi-WAP512":{
        'radio_num':'1',
        'radio_2_txp':'18',
        # 'radio_5_txp':'23',
    },
    "WitMAX-AP522E":{
        'radio_num':'0',
        'radio_2_txp':'18',
        'radio_5_txp':'23',
    },
    # ?
    "WitFi-CAP526":{
        'radio_num':'0',
        'radio_2_txp':'30',
        'radio_5_txp':'27',
    },
    # null
    "WitFi-DAP512E":{
        'radio_num':'1',
        'radio_2_txp':'18',
        # 'radio_5_txp':'23',
    },
    # ?
    "WitFi-CAP527-G":{
        'radio_num':'0',
        'radio_2_txp':'20',
        'radio_5_txp':'26',
    },

    # new

    # probe
    "WitMAX-P550E-L":{
        'radio_num':'0',
        'radio_2_txp':'19',
        'radio_5_txp':'18',
    },
    "WitMAX-P521E":{
        'radio_num':'0',
        'radio_2_txp':'19',
        'radio_5_txp':'18',
    },
    "WitFi-P510":{
        'radio_num':'0',
        'radio_2_txp':'19',
        'radio_5_txp':'18',
    },
    "WitFi-P522E":{
        'radio_num':'0',
        'radio_2_txp':'19',
        'radio_5_txp':'18',
    },

    "WitFi-DAP523E":{
        'radio_num':'0',
        'radio_2_txp':'20',
        'radio_5_txp':'20',
    },
    "WitFi-CAP320":{
        'radio_num':'0',
        'radio_2_txp':'20',
        'radio_5_txp':'20',
    },
}






def judgment_admin_pwd(request):
    error = {"error_type":'',"error_msg":''}
    if request.user.administrator_permission == 6 and request.user.username == 'admin':
        if check_password('admin',NewUser.objects.get(username = 'admin').password):
            error = {"error_type":'failed',"error_msg":_(u"超级管理员密码为原始密码,请修改密码")}
        else:
            pass
    return error


protal_type_num_dict = {
    'no_authentication': 1,
    'account': 2,
    'phonesms': 3,
    'wechatauth': 4,
    'smsandwechat': 5,
    'localwechat': 6,
    'external_auth_server': 7,
    'voucher_auth': 8,
    'radiusauth': 9,
}


page_limit_dict = {
    'ap_index':'1',
    'probe_index':'1',
    'nonoperate_index':'1',
    'ap_page':'1',
    'probe_page':'1',
    'audit_dev_page':'0',
    'nonoperate_page':'1',
}
# qingdao , 'qingdaofeijing'##没搜到干啥的 , sugpon
oem_limit_dict = {
    'oem_type':''
}
# ftp support
auditCropLimitList = ['3', '15', '22', '50', '27', '28', '31','7','29']

manu = {
    '0':u'Byzoro',
    '1':u'Paibo',
    '2':u'Runtech',
    '3':u'Surfilter',
    '4':u'Meiya',
    '5':u'Saiao',
    '6':u'Nielsen',
    '7':u'Pronetway',
    '8':u'Hengbang',
    '9':u'Ahzxsoft',
    '10':u'Hxct',
    '11':u'Ixianxia',
    '12':u'Witrusty',
    '13':u'Oplus',
    '15':u'Netbox',
    '16':u'Xinghan',
    '17':u'Yeetec',
    # '18':u'Jiayin',
    # '19':u'Jyssuo',
    # '20':u'Hnbbwl',
    # '21':u'Ssgm',
    '22':u'Ckisoft',
    '23':u'Star Media',
    '50':u'Byzoro',
    '51':u'Paibo',
    '52':u'Star Media',
    '27':u'XinghanV1.10',
    '28':u'NetboxV17',
    }
nonoperate_manu = {
    '1':u'JiangSuPaibo',
    '16':u'Xinghan',
    '50':u'Byzoro',
    '51':u'Paibo',
    '52':u'Star Media',
    }
dev_type = {
    '1':u'Fixed',
    '2':u'Vehicle',
    '3':u'Singal',
    '9':u'Other',
    }
place_type = {
    '1':u'Hotel',
    '2':u'Library',
    '3':u'Computer Training',
    '4':u'Entertainment',
    '5':u'Traffic Hinge',
    '6':u'Vehicle',
    '7':u'Catering',
    '8':u'Financial',
    'A':u'Shopping',
    'B':u'Public Service',
    'C':u'Cultural Services',
    'D':u'Public Leisure',
    '9':u'Other',
    }
nature = {
    '0':u'Business',
    '1':u'Non-Business',
    '3':u'Other',
    }
id_type = {
    '2':u'Phone Number',
    '111':u'ID card',
    '990':u'Other',
    }
site_type = {
    '1':u'hotel',
    '2':u'shower',
    '3':u'ktv',
    '4':u'mobrepair',
    '5':u'mall',
    '6':u'finance',
    '7':u'dinning',
    '8':u'education',
    '9':u'cap',
    '10':u'awifi',
    '11':u'netbar',
    '12':u'hospital',
    '13':u'cinema',
    '14':u'station',
    '15':u'bookstore',
    '16':u'game',
    '99':u'other',
}
police_station_code = {
    '32050101':u'平江派出所',
    '32050102':u'皮市街派出所',
    '32050103':u'娄门派出所',
    '32050104':u'观前派出所',
    '32050105':u'城北派出所',
    '32050106':u'苏锦派出所',
    '32050107':u'桃花坞派出所',
    '32050108':u'双塔派出所',
    '32050109':u'葑门派出所',
    '32050110':u'沧浪派出所',
    '32050111':u'吴门桥派出所',
    '32050112':u'友新派出所',
    '32050113':u'胥江派出所',
    '32050114':u'石路派出所',
    '32050115':u'留园派出所',
    '32050116':u'金阊派出所',
    '32050117':u'虎丘派出所',
    '32050118':u'白洋湾派出所',
    '32050119':u'火车站广场派出所',
    '32050501':u'狮山派出所',
    '32050502':u'枫桥派出所',
    '32050503':u'横塘派出所',
    '32050504':u'浒墅关派出所',
    '32050505':u'浒关新区派出所',
    '32050506':u'通安派出所',
    '32050507':u'东渚派出所',
    '32050508':u'镇湖派出所',
    '32050509':u'科技城派出所',
    '32050601':u'长桥派出所',
    '32050602':u'南区派出所',
    '32050603':u'郭巷派出所',
    '32050604':u'车坊派出所',
    '32050605':u'甪直派出所',
    '32050606':u'越溪派出所',
    '32050607':u'横泾派出所',
    '32050608':u'临湖派出所',
    '32050609':u'东山派出所',
    '32050610':u'木渎派出所',
    '32050611':u'胥口派出所',
    '32050612':u'藏书派出所',
    '32050701':u'开发区派出所',
    '32050702':u'元和派出所',
    '32050703':u'渭塘派出所',
    '32050704':u'北桥派出所',
    '32050705':u'太平派出所',
    '32050706':u'阳澄湖派出所',
    '32050707':u'望亭派出所',
    '32050708':u'漕湖派出所',
    '32050709':u'黄桥派出所',
    '32050710':u'黄埭派出所',
    '32050711':u'中心商贸城派出所',
    '32050712':u'高铁新城派出所',
    '32050901':u'运西派出所',
    '32050902':u'开发区派出所',
    '32050903':u'松陵派出所',
    '32050904':u'八坼派出所',
    '32050905':u'同里派出所',
    '32050906':u'金家坝派出所',
    '32050907':u'北厍派出所',
    '32050908':u'芦墟派出所',
    '32050909':u'黎里派出所',
    '32050910':u'平望派出所',
    '32050911':u'横扇派出所',
    '32050912':u'七都派出所',
    '32050913':u'盛东派出所',
    '32050914':u'盛西派出所',
    '32050915':u'盛泽派出所',
    '32050916':u'震泽派出所',
    '32050917':u'桃源派出所',
    '32050918':u'城南派出所',
    '32050919':u'滨湖派出所',
    '32050920':u'盛南派出所',
    '32057001':u'娄葑派出所',
    '32057002':u'唯亭派出所',
    '32057003':u'湖西派出所',
    '32057004':u'湖东派出所',
    '32057005':u'永安桥派出所',
    '32057006':u'阳澄湖半岛派出所',
    '32057007':u'斜塘派出所',
    '32057008':u'胜浦派出所',
    '32057009':u'淞泽派出所',
    '32057010':u'综合保税区派出所',
    '32057011':u'水上派出所',
    '32057012':u'东沙湖派出所',
    '32058001':u'香山派出所',
    '32058002':u'金庭派出所',
    '32058003':u'光福派出所',
    '32058004':u'水上派出所',
    '32058101':u'兴福派出所',
    '32058102':u'虹桥派出所',
    '32058103':u'高新园派出所',
    '32058104':u'莫城派出所',
    '32058105':u'服装城派出所',
    '32058106':u'大义派出所',
    '32058107':u'谢桥派出所',
    '32058108':u'沙家浜派出所',
    '32058109':u'碧溪派出所',
    '32058110':u'练塘派出所',
    '32058111':u'支塘派出所',
    '32058112':u'辛庄派出所',
    '32058113':u'任阳派出所',
    '32058114':u'古里派出所',
    '32058115':u'白茆派出所',
    '32058116':u'东张派出所',
    '32058117':u'福山派出所',
    '32058118':u'海虞派出所',
    '32058119':u'董浜派出所',
    '32058120':u'东南派出所',
    '32058121':u'徐市派出所',
    '32058122':u'梅李派出所',
    '32058123':u'尚湖派出所',
    '32058124':u'赵市派出所',
    '32058125':u'周行派出所',
    '32058126':u'淼泉派出所',
    '32058127':u'度假区派出所',
    '32058128':u'张桥派出所',
    '32058129':u'滨江派出所',
    '32058130':u'方塔派出所',
    '32058131':u'琴湖派出所',
    '32058201':u'城东所',
    '32058202':u'城南所',
    '32058203':u'城西所',
    '32058204':u'城北所',
    '32058205':u'城中所',
    '32058206':u'锦丰所',
    '32058207':u'港区所',
    '32058208':u'塘桥所',
    '32058209':u'塘市所',
    '32058210':u'后塍所',
    '32058211':u'南沙所',
    '32058212':u'晨阳所',
    '32058213':u'德积所',
    '32058214':u'大新所',
    '32058215':u'合兴所',
    '32058216':u'乘航所',
    '32058217':u'东莱所',
    '32058218':u'三兴所',
    '32058219':u'鹿苑所',
    '32058220':u'妙桥所',
    '32058221':u'港口所',
    '32058222':u'凤凰所',
    '32058223':u'西张所',
    '32058224':u'南丰所',
    '32058225':u'乐余所',
    '32058226':u'兆丰所',
    '32058227':u'农场所',
    '32058301':u'城中派出所',
    '32058302':u'朝阳派出所',
    '32058303':u'城北派出所',
    '32058304':u'同心派出所',
    '32058305':u'城西派出所',
    '32058306':u'科教园派出所',
    '32058307':u'吴淞江派出所',
    '32058308':u'长江派出所',
    '32058309':u'青阳派出所',
    '32058310':u'中华园派出所',
    '32058311':u'兵希派出所',
    '32058312':u'蓬朗派出所',
    '32058313':u'陆家派出所',
    '32058314':u'花桥派出所',
    '32058315':u'曹安派出所',
    '32058316':u'巴城派出所',
    '32058317':u'正仪派出所',
    '32058318':u'周市派出所',
    '32058319':u'新镇派出所',
    '32058320':u'张浦派出所',
    '32058321':u'千灯派出所',
    '32058322':u'石浦派出所',
    '32058323':u'淀山湖派出所',
    '32058324':u'锦溪派出所',
    '32058325':u'周庄派出所',
    '32058326':u'综保区派出所',
    '32058501':u'城中派出所',
    '32058502':u'城西派出所',
    '32058503':u'开发区派出所',
    '32058504':u'浏河派出所',
    '32058505':u'沙溪派出所',
    '32058506':u'板桥派出所',
    '32058507':u'陆渡派出所',
    '32058508':u'浏家港派出所',
    '32058509':u'港区派出所',
    '32058510':u'金浪派出所',
    '32058511':u'璜泾派出所',

}
