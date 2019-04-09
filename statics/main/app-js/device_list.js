var url = window.location.origin;
var ap_table_url = `/ap-list/ap_already_access_ajax/`;
var non_table_url = `/nonoperate-list/nonoperate_already_access_ajax/`;
var probe_table_url = `/probe-list/already_access_ajax/`;
// var byzoroXinyangTableUrl = `/nonoperate-list/nonoperateByzoroXinyangTableApi/`;
var own_url;

function create_button(type) {
  // body...
  var button_div = (
    `<div>
      <button class = 'btn btn-default btn-xs' id='device_type_all'>${button_word['all']}</button>
      <button class = 'btn btn-default btn-xs' id='device_type_online'>${button_word['online']}</button>
      <button class = 'btn btn-default btn-xs' id='device_type_offline'>${button_word['offline']}</button>
    </div>`
  );
  var dynamicColumnsDiv = (
    `<div>
      <label class="checkbox-inline">
        <input type="checkbox" id="dynamicColumnsMac" value="mac"> MAC
      </label>
      <label class="checkbox-inline">
        <input type="checkbox" id="dynamicColumnsCpu" value="cpu"> CPU
      </label>
      <button class = 'btn btn-default btn-xs' id='dynamicColumnsButton'>${button_word['refresh']}</button>
    </div>`
  );
  if (type === 'ap') {
    own_url = ap_table_url;
  } else if (type === 'non') {
    own_url = non_table_url;
  } else if (type === 'probe') {
    own_url = probe_table_url
  }
  // else if (type === 'byzoroXinyang') {
  // own_url = byzoroXinyangTableUrl
  // }

  $('.device_type').html(button_div);
  $('.dynamicColumnsDiv').html(dynamicColumnsDiv);
  if (dynamicColumns.indexOf('mac') !== -1) {
    document.getElementById('dynamicColumnsMac').checked = true;
  };
  if (dynamicColumns.indexOf('cpu') !== -1) {
    document.getElementById('dynamicColumnsCpu').checked = true;
  };
  $('#device_type_all').addClass('active');

  $('#device_type_all').click(active_all);
  $('#device_type_online').click(active_online);
  $('#device_type_offline').click(active_offline);
  $('#dynamicColumnsButton').click(dynamicColumnsFresh);
  judge_window_url();
};

function active_all(type) {
  // body...
  $('#device_type_all').addClass('active');
  $('#device_type_online').removeClass('active');
  $('#device_type_offline').removeClass('active');
  oTable.ajax.url(`${own_url}?device_type=all`).load();
}

function active_online() {
  // body...
  $('#device_type_all').removeClass('active');
  $('#device_type_online').addClass('active');
  $('#device_type_offline').removeClass('active');
  oTable.ajax.url(`${own_url}?device_type=online`).load();
}

function active_offline() {
  // body...
  $('#device_type_all').removeClass('active');
  $('#device_type_online').removeClass('active');
  $('#device_type_offline').addClass('active');
  oTable.ajax.url(`${own_url}?device_type=offline`).load();
}

function judge_window_url() {
  // body...
  var param = {};
  window.location.search.replace('?', '').split('&').forEach((value) => {
    var key = value.split('=')[0];
    var val = value.split('=')[1];
    param[key] = val;
  });
  console.log(param);
  if (param['device_type'] === 'online') {
    $('#device_type_online').click();
    history.pushState({}, '', window.location.origin + window.location.pathname);
  } else if (param['device_type'] === 'offline') {
    $('#device_type_offline').click();
    history.pushState({}, '', window.location.origin + window.location.pathname);
  } else {
    // history.pushState({}, '', window.location.origin + window.location.pathname);
  }

}

var basicColumns = ['icon', 'name', 'mac', 'ip', 'state', 'cpu', 'upload', 'download', 'version', 'heart', 'group', 'act'];
var dynamicColumns = [];
var columnsData = {
  icon: {
    title: '',
    data: "state",
  },
  name: {
    title: 'deviceName',
    data: "name",
  },
  ip: {
    title: 'deviceIP',
    data: "lastip",
  },
  state: {
    title: 'deviceState',
    data: "state",
  },
  upload: {
    title: 'deviceUp',
    data: "upload",
  },
  download: {
    title: 'deviceDown',
    data: "download",
  },
  version: {
    title: 'deviceVersion',
    data: "version",
  },
  heart: {
    title: 'deviceHeart',
    data: "last_heart_time",
  },
  group: {
    title: 'deviceGroup',
    data: "group_id",
  },
  act: {
    title: 'deviceAct',
    data: "state",
  },
  mac: {
    title: 'deviceMac',
    data: 'mac',
    render: (data, type, row, meta) => {
      if (data && data !== '' && data.length === 12) {
        return `${data.slice(0,2).toUpperCase()}-${data.slice(2,4).toUpperCase()}-${data.slice(4,6).toUpperCase()}-${data.slice(6,8).toUpperCase()}-${data.slice(8,10).toUpperCase()}-${data.slice(10,12).toUpperCase()}`
      } else {
        return data
      }
    }
  },
  cpu: {
    title: 'devicceCpu',
    data: 'cpu',
    orderable: false,
  }
};

function dynamicColumnsFresh() {
  // body...
  let macColumn = document.getElementById('dynamicColumnsMac').checked;
  let cpuColumn = document.getElementById('dynamicColumnsCpu').checked;
  dynamicColumns = [];
  if (macColumn) {
    dynamicColumns.push('mac');
  };
  if (cpuColumn) {
    dynamicColumns.push('cpu');
  }
  oTable.destroy();
  $('#datatable-default').empty();
  al_access_table();
  create_button();
}
var columns = [];
var resultColumn = [];

function dynamicColumnsCreate() {
  // body...
  resultColumn = [];
  resultColumn = basicColumns.map((data) => {
    if (data === 'mac' || data === 'cpu') {
      if (dynamicColumns.indexOf(data) !== -1) {
        return data;
      }
    } else {
      return data;
    }
  });
  resultColumn = resultColumn.filter((data) => {
    return data !== undefined;
  });
  columns = [];
  columns = resultColumn.map((data) => {
    let res = columnsData[data];
    let title;
    let returnResult;
    if (data === 'icon') {
      title = '';
    } else {
      title = pageWords[res.title];
    }
    returnResult = {
      title: title,
      data: res.data,
    };
    if (res.orderable !== undefined) {
      returnResult.orderable = res.orderable;
    };
    if (res.render !== undefined) {
      returnResult.render = res.render;
    };
    return returnResult;
  });
}
