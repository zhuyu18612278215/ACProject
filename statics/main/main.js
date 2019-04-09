//计算流量值（ flowVlueBytes为流量的bytes字节数）
function getFlow(flowVlueBytes) {
    var flow = "";
    //如果赠送流量小于1MB.则显示为KB
    if (flowVlueBytes / 1024 < 1024) {
        flow = (Math.round(flowVlueBytes / 1024) > 0 ? Math.round(flowVlueBytes / 1024) : 0) + 'KB';
    } else if (flowVlueBytes / 1024 >= 1024 && flowVlueBytes / 1024 / 1024 < 1024) {
        //如果赠送流量大于1MB且小于1    GB的则显示为MB
        flow = (Math.round(flowVlueBytes / 1024 / 1024) > 0 ? Math.round(flowVlueBytes / 1024 / 1024) : 0) + 'MB';
    } else if (flowVlueBytes / 1024 / 1024 >= 1024) {
        //如果流量大于1Gb
        var gb_Flow = flowVlueBytes / 1024 / 1024 / 1024;
        //toFixed(1);四舍五入保留一位小数
        flow = gb_Flow.toFixed(1) + 'GB';
    } else {
        flow = "0KB";
    }
    return flow;
}

function rssiToSignalQuality(b) {
    b = parseFloat(b);
    if (!b)
        return "N/A";
    if (b > 45)
        b = 45;
    if (b < 5)
        b = 5;
    return `${((b - 5) / 40 * 99).toPrecision(2)}% (${parseInt(b) + (-95)}dBm)`;
};

function limit_max_power(id, num) {
    // body...
    $('#' + id).on('keyup', function(event) {
        /* Act on the event */
        $(this).val($(this).val().replace(/\D/g, ''));
    });
    $('#' + id).on('blur', function(event) {
        /* Act on the event */
        if ($(this).val() > num) {
            console.log(true);
            $(this).val(num);
        }
        console.log($(this).val());
        console.log(num);
    });

}

function check_input_ip(data) {
    // body...
    var reg = /(^((2[0-4]\d|25[0-5]|[1-9]?\d|1\d{2})\.){3}(2[0-4]\d|25[0-5]|[1-9]?\d|1\d{2})+(:([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$)|(^[-a-zA-Z0-9]{0,62}(\.[-a-zA-Z0-9]{0,62})+\.?[a-zA-Z]+(:([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$)/g
    return reg.test(data)
}

function txpower_turn(power) {
    // body...
    var result = power;
    if (power === 'high') {
        result = '高';
    } else if (power === 'medium') {
        result = '中';
    } else if (power === 'low') {
        result = '低';
    } else {
        result = power;
    }
    return result;
}
