reSubnetSpec = /^\d+.\d+.\d+.\d+\/\d+$/;
reIPv4Loose = /^\d+.\d+.\d+.\d+$/;
reDomainName = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
reMacAddress = /^([a-fA-F0-9]{12})|(([a-fA-F0-9]{2}[:-]){5}[a-fA-F0-9]{2})$/;

isSubnetSpec = function (a)
{
    if (reSubnetSpec.test(a))
    {
        var c = a.indexOf("/"), d = a.substring(0, c);
        a = parseInt(a.substring(c + 1));
        if (isIP(d, 255))
            if (!(a > 32))
                return true
    }
    return false
};
isIP = function (b, e)
{
    if (reIPv4Loose.test(b))
    {
        var a = b.match(/[0-9]+/g);
        if (a.length == 4)
        {
            if (a[0] == 0 || a[0] > parseInt(e))
                return false;
            for (var c = 1; c < 4; c++)
                if (a[c] > 255)
                    return false;
            return true
        }
    }
    return false
};
isDomainName = function(b)
{
    if (reDomainName.test(b))
    {
        return true;
    }
    return false;
};
isMacAddress = function(b)
{
    if (reMacAddress.test(b))
    {
        return true;
    }
    return false;
};
checkEmpty = function (b, e)
{
    normal(b);
    var a = getval(b);
    if ($.trim(a) == "")
    {
        error(b, localize(Msg.E_CannotBeEmpty, e));
        return false
    }
    return true
};
localizer_re = [];
for (var i = 0; i <= 16; i++)localizer_re.push(eval("/\\{" + i + "\\}/g"));
localize = function (b)
{
    for (var e = b, a = arguments.length - 1, c = 1; c <= a; c++)
        e = e.replace(localizer_re[c], arguments[c]);
    return e
};
normal = function (b)
{
    b = $(b).get(0);
    if ($.data(b, "v_error"))
    {
        $.removeData(b, "v_error");
        var e = $(b).parent();
        $(b).insertAfter(e);
        e.remove()
    }
};
getval = function (b)
{
    return b.data("jpass") ? b.jpass("val") : b.val()
};
error = function (b, e)
{
    b = $(b).get(0);
    if (!$.data(b, "v_error"))
    {
        $(b).wrap('<span class="v-error"></span>');
        $.data(b, "v_error", true);
        $(b).select();
        $(b).focus();
        alert(e)
    }
};
