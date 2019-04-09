var site_type = {
  // '1': 'hotel',
  // '2': 'shower',
  // '3': 'ktv',
  // '4': 'mobrepair',
  // '5': 'mall',
  // '6': 'finance',
  // '7': 'dinning',
  // '8': 'education',
  // '9': 'cap',
  // '10': 'awifi',
  // '11': 'netbar',
  // '12': 'hospital',
  // '13': 'cinema',
  // '14': 'station',
  // '15': 'bookstore',
  // '16': 'game',
  // '99': 'other',
  '1': '宾馆、酒店',
  '2': '洗浴',
  '3': 'KTV',
  '4': '汽修',
  '5': '大型商场、超市',
  '6': '金融',
  '7': '餐饮',
  '8': '学校',
  '9': '围栏',
  '10': 'awifi',
  '11': '网吧',
  '12': '医院（含诊所）、药房',
  '13': '影院（含剧院）',
  '14': '车站（汽车站、火车站、公交站）',
  '15': '书店',
  '16': '棋牌室、游戏厅、电竞',
  '99': '其他',
};
var police_station_code = {
  '32050101': '平江派出所',
  '32050102': '皮市街派出所',
  '32050103': '娄门派出所',
  '32050104': '观前派出所',
  '32050105': '城北派出所',
  '32050106': '苏锦派出所',
  '32050107': '桃花坞派出所',
  '32050108': '双塔派出所',
  '32050109': '葑门派出所',
  '32050110': '沧浪派出所',
  '32050111': '吴门桥派出所',
  '32050112': '友新派出所',
  '32050113': '胥江派出所',
  '32050114': '石路派出所',
  '32050115': '留园派出所',
  '32050116': '金阊派出所',
  '32050117': '虎丘派出所',
  '32050118': '白洋湾派出所',
  '32050119': '火车站广场派出所',
  '32050501': '狮山派出所',
  '32050502': '枫桥派出所',
  '32050503': '横塘派出所',
  '32050504': '浒墅关派出所',
  '32050505': '浒关新区派出所',
  '32050506': '通安派出所',
  '32050507': '东渚派出所',
  '32050508': '镇湖派出所',
  '32050509': '科技城派出所',
  '32050601': '长桥派出所',
  '32050602': '南区派出所',
  '32050603': '郭巷派出所',
  '32050604': '车坊派出所',
  '32050605': '甪直派出所',
  '32050606': '越溪派出所',
  '32050607': '横泾派出所',
  '32050608': '临湖派出所',
  '32050609': '东山派出所',
  '32050610': '木渎派出所',
  '32050611': '胥口派出所',
  '32050612': '藏书派出所',
  '32050701': '开发区派出所',
  '32050702': '元和派出所',
  '32050703': '渭塘派出所',
  '32050704': '北桥派出所',
  '32050705': '太平派出所',
  '32050706': '阳澄湖派出所',
  '32050707': '望亭派出所',
  '32050708': '漕湖派出所',
  '32050709': '黄桥派出所',
  '32050710': '黄埭派出所',
  '32050711': '中心商贸城派出所',
  '32050712': '高铁新城派出所',
  '32050901': '运西派出所',
  '32050902': '开发区派出所',
  '32050903': '松陵派出所',
  '32050904': '八坼派出所',
  '32050905': '同里派出所',
  '32050906': '金家坝派出所',
  '32050907': '北厍派出所',
  '32050908': '芦墟派出所',
  '32050909': '黎里派出所',
  '32050910': '平望派出所',
  '32050911': '横扇派出所',
  '32050912': '七都派出所',
  '32050913': '盛东派出所',
  '32050914': '盛西派出所',
  '32050915': '盛泽派出所',
  '32050916': '震泽派出所',
  '32050917': '桃源派出所',
  '32050918': '城南派出所',
  '32050919': '滨湖派出所',
  '32050920': '盛南派出所',
  '32057001': '娄葑派出所',
  '32057002': '唯亭派出所',
  '32057003': '湖西派出所',
  '32057004': '湖东派出所',
  '32057005': '永安桥派出所',
  '32057006': '阳澄湖半岛派出所',
  '32057007': '斜塘派出所',
  '32057008': '胜浦派出所',
  '32057009': '淞泽派出所',
  '32057010': '综合保税区派出所',
  '32057011': '水上派出所',
  '32057012': '东沙湖派出所',
  '32058001': '香山派出所',
  '32058002': '金庭派出所',
  '32058003': '光福派出所',
  '32058004': '水上派出所',
  '32058101': '兴福派出所',
  '32058102': '虹桥派出所',
  '32058103': '高新园派出所',
  '32058104': '莫城派出所',
  '32058105': '服装城派出所',
  '32058106': '大义派出所',
  '32058107': '谢桥派出所',
  '32058108': '沙家浜派出所',
  '32058109': '碧溪派出所',
  '32058110': '练塘派出所',
  '32058111': '支塘派出所',
  '32058112': '辛庄派出所',
  '32058113': '任阳派出所',
  '32058114': '古里派出所',
  '32058115': '白茆派出所',
  '32058116': '东张派出所',
  '32058117': '福山派出所',
  '32058118': '海虞派出所',
  '32058119': '董浜派出所',
  '32058120': '东南派出所',
  '32058121': '徐市派出所',
  '32058122': '梅李派出所',
  '32058123': '尚湖派出所',
  '32058124': '赵市派出所',
  '32058125': '周行派出所',
  '32058126': '淼泉派出所',
  '32058127': '度假区派出所',
  '32058128': '张桥派出所',
  '32058129': '滨江派出所',
  '32058130': '方塔派出所',
  '32058131': '琴湖派出所',
  '32058201': '城东所',
  '32058202': '城南所',
  '32058203': '城西所',
  '32058204': '城北所',
  '32058205': '城中所',
  '32058206': '锦丰所',
  '32058207': '港区所',
  '32058208': '塘桥所',
  '32058209': '塘市所',
  '32058210': '后塍所',
  '32058211': '南沙所',
  '32058212': '晨阳所',
  '32058213': '德积所',
  '32058214': '大新所',
  '32058215': '合兴所',
  '32058216': '乘航所',
  '32058217': '东莱所',
  '32058218': '三兴所',
  '32058219': '鹿苑所',
  '32058220': '妙桥所',
  '32058221': '港口所',
  '32058222': '凤凰所',
  '32058223': '西张所',
  '32058224': '南丰所',
  '32058225': '乐余所',
  '32058226': '兆丰所',
  '32058227': '农场所',
  '32058301': '城中派出所',
  '32058302': '朝阳派出所',
  '32058303': '城北派出所',
  '32058304': '同心派出所',
  '32058305': '城西派出所',
  '32058306': '科教园派出所',
  '32058307': '吴淞江派出所',
  '32058308': '长江派出所',
  '32058309': '青阳派出所',
  '32058310': '中华园派出所',
  '32058311': '兵希派出所',
  '32058312': '蓬朗派出所',
  '32058313': '陆家派出所',
  '32058314': '花桥派出所',
  '32058315': '曹安派出所',
  '32058316': '巴城派出所',
  '32058317': '正仪派出所',
  '32058318': '周市派出所',
  '32058319': '新镇派出所',
  '32058320': '张浦派出所',
  '32058321': '千灯派出所',
  '32058322': '石浦派出所',
  '32058323': '淀山湖派出所',
  '32058324': '锦溪派出所',
  '32058325': '周庄派出所',
  '32058326': '综保区派出所',
  '32058501': '城中派出所',
  '32058502': '城西派出所',
  '32058503': '开发区派出所',
  '32058504': '浏河派出所',
  '32058505': '沙溪派出所',
  '32058506': '板桥派出所',
  '32058507': '陆渡派出所',
  '32058508': '浏家港派出所',
  '32058509': '港区派出所',
  '32058510': '金浪派出所',
  '32058511': '璜泾派出所',

}
var url_type = 'list';
if (window.location.pathname === '/device/device_group/' || window.location.pathname === '/nonoperate/nonoperate_group/') {
  url_type = 'group';
};


$(function add_xinghanV110_option() {
  // body...
  if (url_type !== 'group') {
    $('#site_type').html('');
    $('select#police_station_code').html('');
    Object.keys(site_type).forEach((key) => {

      $('#site_type').append(`<option value = '${key}'>${site_type[key]}</option>`);
      $('#site_type').val('');
      $('#status_site_type').text('');
      $('#site_type_hide').hide();
      $('#status_site_type_hide').hide();
    });
    Object.keys(police_station_code).forEach((key) => {
      $('select#police_station_code').append(`<option value = '${key}'>${police_station_code[key]}</option>`);
      $('#police_station_code').val('');
      $('#status_police_station_code').text('');
      $('#police_station_code_hide').hide();
      $('#status_police_station_code_hide').hide();
    });
  } else {
    $('#device_setting_ajax_site_type').html('');
    $('select#device_setting_ajax_police_station_code').html('');
    Object.keys(site_type).forEach((key) => {
      $('#device_setting_ajax_site_type').append(`<option value = '${key}'>${site_type[key]}</option>`);
      $('#device_setting_ajax_site_type').val('');
      $('#site_type_hide').hide();
    });
    Object.keys(police_station_code).forEach((key) => {
      $('select#device_setting_ajax_police_station_code').append(`<option value = '${key}'>${police_station_code[key]}</option>`);
      $('#device_setting_ajax_police_station_code').val('');
      $('#device_setting_ajax_police_station_code_hide').hide();
    });
  }
});

function check_show_policy(param) {
  // body...
  let {
    audit_corp,
    site_type_val,
    police_station_code_val,
  } = param;
  console.log(param);
  console.log(url_type);
  if (url_type !== 'group') {
    if (audit_corp === '27') {
      $('#site_type').val(site_type_val);
      $('#status_site_type').text(site_type[site_type_val]);
      $('#site_type_hide').show();
      $('#status_site_type_hide').show();

      $('#police_station_code').val(police_station_code_val);
      $('#status_police_station_code').text(police_station_code[police_station_code_val]);
      $('#police_station_code_hide').show();
      $('#status_police_station_code_hide').show();
    } else if (auditDevTypeLimitList.indexOf(String(audit_corp)) !== -1) {
      $('#police_station_code').val(police_station_code_val);
      $('#status_police_station_code').text(police_station_code_val);
      $('#police_station_code_hide').show();
      $('#status_police_station_code_hide').show();
    } else {
      $('#site_type').val('');
      $('#status_site_type').text('');
      $('#site_type_hide').hide();
      $('#status_site_type_hide').hide();

      $('#police_station_code').val('');
      $('#status_police_station_code').text('');
      $('#police_station_code_hide').hide();
      $('#status_police_station_code_hide').hide();
    }

  } else {
    if (audit_corp === '27') {
      $('#device_setting_ajax_site_type').val(site_type_val);
      $('#device_setting_ajax_site_type_hide').show();

      $('#device_setting_ajax_police_station_code').val(police_station_code_val);
      $('#device_setting_ajax_police_station_code_hide').show();
    } else if (auditDevTypeLimitList.indexOf(String(audit_corp)) !== -1) {
      $('#device_setting_ajax_police_station_code').val(police_station_code_val);
      $('#device_setting_ajax_police_station_code_hide').show();
    } else {
      $('#device_setting_ajax_site_type').val('');
      $('#device_setting_ajax_site_type_hide').hide();

      $('#device_setting_ajax_police_station_code').val('');
      $('#device_setting_ajax_police_station_code_hide').hide();
    }
  }

}

$('#audit_corp').click(function() {
  // xinghan V1.10
  if ($('#audit_corp').attr('value') === '27' || $('#audit_corp').val() === '27') {
    // $('#site_type').val('');
    // $('#status_site_type').text('');
    $('#site_type_hide').show();
    $('#status_site_type_hide').show();

    // $('#police_station_code').val('');
    // $('#status_police_station_code').text('');
    $('#police_station_code_hide').show();
    $('#status_police_station_code_hide').show();
  } else if (auditDevTypeLimitList.indexOf(String($('#audit_corp').attr('value'))) !== -1 || auditDevTypeLimitList.indexOf(String($('#audit_corp').val())) !== -1) {
    $('#police_station_code_hide').show();
    $('#status_police_station_code_hide').show();
  } else {
    $('#site_type').val('');
    $('#status_site_type').text('');
    $('#site_type_hide').hide();
    $('#status_site_type_hide').hide();

    $('#police_station_code').val('');
    $('#status_police_station_code').text('');
    $('#police_station_code_hide').hide();
    $('#status_police_station_code_hide').hide();
  }
});

$('#device_setting_ajax_audit_corp').click(function() {
  // xinghan V1.10
  if ($('#device_setting_ajax_audit_corp').attr('value') === '27' || $('#device_setting_ajax_audit_corp').val() === '27') {
    $('#device_setting_ajax_site_type_hide').show();

    $('#device_setting_ajax_police_station_code_hide').show();
  } else if (auditDevTypeLimitList.indexOf(String($('#device_setting_ajax_audit_corp').attr('value'))) !== -1 || auditDevTypeLimitList.indexOf(String($('#device_setting_ajax_audit_corp').val())) !== -1) {
    $('#device_setting_ajax_police_station_code_hide').show();
  } else {
    $('#device_setting_ajax_site_type').val('');
    $('#device_setting_ajax_site_type_hide').hide();

    $('#device_setting_ajax_police_station_code').val('');
    $('#device_setting_ajax_police_station_code_hide').hide();
  }
});
