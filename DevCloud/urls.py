"""DevCloud URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import account.views


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^captcha/', include('captcha.urls')),
    url(r'^refresh-captcha/$','account.views.refresh_captcha', name = 'refresh-captcha'),
    url(r'^login/$',"account.views.login",name='login'),
    url(r'^reSendCheckMail/$', 'account.views.reSendCheckMail'),
    url(r'^$',"account.views.login",name='login'),
    url(r'^logout/$',"account.views.logout",name='logout'),
    url(r'^register/$',"account.views.register",name='register'),
    url(r'^activate/(?P<token>\w+.[-_\w]*\w+.[-_\w]*\w+)/$','account.views.active_user',name='active_user'),
    url(r'^i18n/', include('django.conf.urls.i18n')),

    url(r'^index/$',"account.views.index",name='index'),
    url(r'^index/sort_type_change/$',"account.views.sort_type_change",name='sort_type_change'),
    url(r'^index/chartajax/$',"account.views.chartajax",name = 'chartajax'),
    url(r'^index/warningajax/$',"account.views.warningajax",name = 'warningajax'),


    url(r'^probe-list/$',"device.views.probe_list",name = 'probe_list'),
    url(r'^probe-list/probe_access/$',"device.views.probe_access",name = 'probe_access'),
    url(r'^probe-list/probe_reboot/$',"device.views.probe_reboot",name = 'probe_reboot'),
    url(r'^probe-list/probe_update/$',"device.views.probe_update",name = 'probe_update'),
    url(r'^probe-list/probe_del/$',"device.views.probe_del",name = 'probe_del'),
    url(r'^probe-list/probe_detail/$',"device.views.probe_detail",name = 'probe_detail'),
    url(r'^probe-list/probe_detail/probe_config_modify/$',"device.views.probe_config_modify",name = 'probe_config_modify'),
    url(r'^probe-list/probe_detail/probe_vpn/$',"device.views.probe_vpn",name = 'probe_vpn'),
    url(r'^probe-list/porbe_detail/probe_audit_status/$',"device.views.probe_audit_status",name = 'probe_audit_status'),
    url(r'^probe-list/probe_detail/probe_audit_modify/$',"device.views.probe_audit_modify",name = 'probe_audit_modify'),
    url(r'^probe-list/adddevicebutton_ajax/$',"device.views.adddevicebutton_ajax",name = 'adddevicebutton_ajax'),
    url(r'^probe-list/exportdevicebutton_ajax/$',"device.views.exportdevicebutton_ajax",name = 'exportdevicebutton_ajax'),
    url(r'^probe-list/importdevice/$',"device.views.importdevice",name = 'importdevice'),
    url(r'^probe-list/eventajax/$',"device.views.eventajax",name = 'eventajax'),
    url(r'^probe-list/already_access_ajax/$',"device.views.already_access_ajax",name = 'already_access_ajax'),
    url(r'^probe-list/wait_access_ajax/$',"device.views.wait_access_ajax",name = 'wait_access_ajax'),

    url(r'^device/device_group/$',"device.views.device_group",name='device_group'),
    url(r'^device/device_group/device_add_ajax/$',"device.views.device_add_ajax",name='device_add_ajax'),
    url(r'^device/device_group/add_device_group_ajax/$',"device.views.add_device_group_ajax",name='add_device_group_ajax'),
    url(r'^device/device_group/device_group_del/$',"device.views.device_group_del",name='device_group_del'),
    url(r'^device/device_group/remove_device_ajax/$',"device.views.remove_device_ajax",name='remove_device_ajax'),
    url(r'^device/device_group/add_device_ajax/$',"device.views.add_device_ajax",name='add_device_ajax'),
    url(r'^device/device_group/device_setting_ajax/$',"device.views.device_setting_ajax",name='device_setting_ajax'),
    url(r'^device/device_group/modify_device_group_ajax/$',"device.views.modify_device_group_ajax",name='modify_device_group_ajax'),
    url(r'^device/device_group/auto-accept/$',"device.views.probe_auto_accept",name="probe_auto_accept"),
    url(r'^device/device_group/auto-update/$',"device.views.probe_auto_update",name="probe_auto_update"),



    url(r'^support/$',"system.views.support",name='support'),
    url(r'^support/mac_search/$',"system.views.mac_search",name='mac_search'),

    url(r'^system/account/$',"system.views.system_account",name='system_account'),
    url(r'^system/account/language/$',"system.views.language_save",name='language_save'),
    url(r'^system_account/basic_change/$',"system.views.basic_change",name='basic_change'),
    url(r'^system_account/passwd_change/$',"system.views.passwd_change",name='passwd_change'),
    url(r'^system_account/create_user/$',"system.views.create_user",name='create_user'),
    url(r'^system_account/user_del/$',"system.views.user_del",name='user_del'),
    url(r'^system_account/create_area/$',"system.views.create_area",name='create_area'),
    url(r'^system_account/add_area/$',"system.views.add_area",name='add_area'),
    url(r'^system_account/invite_user/$',"system.views.invite_user",name='invite_user'),
    url(r'^system_account/agree/$',"system.views.agree",name='agree'),
    url(r'^system_account/refuse/$',"system.views.refuse",name='refuse'),
    url(r'^system_account/group_user_move/$',"system.views.group_user_move",name='group_user_move'),
    url(r'^system_account/user_modify/$',"system.views.user_modify",name='user_modify'),
    url(r'^system_account/change_user/$',"system.views.change_user",name='change_user'),
    url(r'^system_account/change_reg/$',"system.views.change_reg",name='change_reg'),
    url(r'^system/system_service/$',"system.views.system_service",name='system_service'),
    url(r'^system/system_status/$',"system.views.system_status",name='system_status'),

    url(r'^system/system_service/device_version_address/$',"system.views.device_version_address",name='device_version_address'),
    url(r'^system/system_service/django_settings_ajax/$',"system.views.django_settings_ajax",name='django_settings_ajax'),
    url(r'^system/system_service/email_address/$',"system.views.email_address",name='email_address'),
    url(r'^system/system_service/system_version_ajax/$',"system.views.system_version_ajax",name='system_version_ajax'),
    url(r'^system/system_service/system_status_ajax/$',"system.views.system_status_ajax",name='system_status_ajax'),
    url(r'^system/system_service/test_email/$',"system.views.test_email",name='test_email'),
    url(r'^system/system_service/upgrade_ajax/$',"system.views.upgrade_ajax",name='upgrade_ajax'),
    url(r'^system/system_service/local_upload/$',"system.views.local_upload",name='local_upload'),
    url(r'^system/system_service/upgrade_cancel_ajax/$',"system.views.upgrade_cancel_ajax",name='upgrade_cancel_ajax'),
    url(r'^system/system_service/upgrade_down_pro_ajax/$',"system.views.upgrade_down_pro_ajax",name='upgrade_down_pro_ajax'),
    url(r'^system/system_service/issue_config_switch_ajax/$',"system.views.issue_config_switch_ajax",name='issue_config_switch_ajax'),
    url(r'^system/system_service/issue_config_switch_set/$',"system.views.issue_config_switch_set",name='issue_config_switch_set'),

    url(r'^system/system_service/exportconf/$',"system.views.exportconf",name='exportconf'),
    url(r'^system/system_service/importconf/$',"system.views.importconf",name='importconf'),
    url(r'^system/system_service/exportsysset/$',"system.views.exportsysset",name='exportsysset'),
    url(r'^system/system_service/importsysset/$',"system.views.importsysset",name='importsysset'),



    url(r'^ap-list/$',"ap.views.ap_list",name = 'ap_list'),
    url(r'^ap-list/ap_wait_access_ajax/$',"ap.views.ap_wait_access_ajax",name = 'ap_wait_access_ajax'),
    url(r'^ap-list/ap_access/$',"ap.views.ap_access",name = 'ap_access'),
    url(r'^ap-list/ap_already_access_ajax/$',"ap.views.ap_already_access_ajax",name = 'ap_already_access_ajax'),
    url(r'^ap-list/ap_reboot/$',"ap.views.ap_reboot",name = 'ap_reboot'),
    url(r'^ap-list/ap_update/$',"ap.views.ap_update",name = 'ap_update'),
    url(r'^ap-list/ap_del/$',"ap.views.ap_del",name = 'ap_del'),
    url(r'^ap-list/ap_kickmac/$',"ap.views.ap_kickmac",name = 'ap_kickmac'),
    url(r'^ap-list/ap_detail/$',"ap.views.ap_detail",name = 'ap_detail'),
    url(r'^ap-list/ap_config/$',"ap.views.ap_config",name = 'ap_config'),
    url(r'^ap-list/ap_detail/ap_vpn/$',"ap.views.ap_vpn",name = 'ap_vpn'),
    url(r'^ap-list/ap_eventajax/$',"ap.views.ap_eventajax",name = 'ap_eventajax'),

    url(r'^ap-list/ap_wlan_list/$',"ap.views.ap_wlan_list",name='ap_wlan_list'),
    url(r'^ap-list/wlan_show_detail/$',"ap.views.wlan_show_detail",name='wlan_show_detail'),
    url(r'^ap-list/apply_change_wlan/$',"ap.views.apply_change_wlan",name='apply_change_wlan'),
    url(r'^ap-list/reduction_change_wlan/$',"ap.views.reduction_change_wlan",name='reduction_change_wlan'),
    url(r'^ap-list/ap_user_policy_config/$',"ap.views.ap_user_policy_config",name='ap_user_policy_config'),
    url(r'^ap-list/ap_user_policy_config_ajax/$',"ap.views.ap_user_policy_config_ajax",name='ap_user_policy_config_ajax'),
    url(r'^ap-list/policy_config_ajax/$',"ap.views.policy_config_ajax",name='policy_config_ajax'),
    url(r'^ap-list/timing_policy_ajax/$',"ap.views.timing_policy_ajax",name='timing_policy_ajax'),


    url(r'^ap/ap_group/$',"ap.views.ap_group",name='ap_group'),
    url(r'^ap/ap_group/ap_add_ajax/$',"ap.views.ap_add_ajax",name='ap_add_ajax'),
    url(r'^ap/ap_group/add_ap_group_ajax/$',"ap.views.add_ap_group_ajax",name='add_ap_group_ajax'),
    url(r'^ap/ap_group/ap_group_del/$',"ap.views.ap_group_del",name='ap_group_del'),
    url(r'^ap/ap_group/remove_ap_ajax/$',"ap.views.remove_ap_ajax",name='remove_ap_ajax'),
    url(r'^ap/ap_group/modify_ap_group_ajax/$',"ap.views.modify_ap_group_ajax",name='modify_ap_group_ajax'),
    url(r'^ap/ap_group/add_ap_ajax/$',"ap.views.add_ap_ajax",name='add_ap_ajax'),
    url(r'^ap/ap_group/add_wlan_in_group_ajax/$',"ap.views.add_wlan_in_group_ajax",name='add_wlan_in_group_ajax'),


    url(r'^ap/ap_wlan/$',"ap.views.ap_wlan",name='ap_wlan'),
    url(r'^ap/ap_wlan/add_wlan_ajax/$',"ap.views.add_wlan_ajax",name='add_wlan_ajax'),
    url(r'^ap/ap_wlan/choose_ap_group_ajax/$',"ap.views.choose_ap_group_ajax",name='choose_ap_group_ajax'),
    url(r'^ap/ap_wlan/ap_wlan_del/$',"ap.views.ap_wlan_del",name='ap_wlan_del'),
    url(r'^ap/ap_wlan/ap_wlan_info_ajax/$',"ap.views.ap_wlan_info_ajax",name='ap_wlan_info_ajax'),
    url(r'^ap/ap_wlan/modify_wlan_ajax/$',"ap.views.modify_wlan_ajax",name='modify_wlan_ajax'),
    url(r'^ap/ap_wlan/ap_setting_ajax/$',"ap.views.ap_setting_ajax",name='ap_setting_ajax'),
    url(r'^ap/ap_wlan/ap_wlan_create_get_portal_config/$','ap.views.ap_wlan_create_get_portal_config',name = 'ap_wlan_create_get_portal_config'),

    url(r'^ap/ap_wlan/auto-accept/$',"ap.views.ap_auto_accept",name="ap_auto_accept"),
    url(r'^ap/ap_wlan/auto-update/$',"ap.views.ap_auto_update",name="ap_auto_update"),

    url(r'^ap/ap_wlan/black_list_add_ajax/$',"ap.views.black_list_add_ajax",name="black_list_add_ajax"),
    url(r'^ap/ap_wlan/blacklist_add/$',"ap.views.blacklist_add",name="blacklist_add"),
    url(r'^ap/ap_wlan/black_list_table/$',"ap.views.black_list_table",name="black_list_table"),
    url(r'^ap/ap_wlan/blacklist_remove/$',"ap.views.blacklist_remove",name="blacklist_remove"),

    url(r'^ap/ap_list/gpon/$',"ap.views.gpon",name="gpon"),
    url(r'^ap/ap_list/gpon/gpon_config/$',"ap.views.gpon_config",name="gpon_config"),
    url(r'^ap/ap_list/gpon/gpon_action/$',"ap.views.gpon_action",name="gpon_action"),
    url(r'^ap/ap_list/gpon/gpon_config_group/$',"ap.views.gpon_config_group",name="gpon_config_group"),
    url(r'^ap/ap_list/gpon/gpon_config_system/$',"ap.views.gpon_config_system",name="gpon_config_system"),
    url(r'^ap/ap_list/gpon/show_gpon_config/$',"ap.views.show_gpon_config",name="show_gpon_config"),
    url(r'^ap/ap_list/ap_radios_config/$',"ap.views.ap_radios_config",name="ap_radios_config"),



    url(r'^ap/ap_customer/$',"ap.views.customer_list",name="customer_list"),
    url(r'^ap/ap_customer/customer_table/$',"ap.views.customer_table",name="customer_table"),
    url(r'^ap/ap_list/ap_customer_tab_table/$',"ap.views.ap_customer_tab_table",name="ap_customer_tab_table"),
    url(r'^ap/ap_customer/customer_detail/$',"ap.views.customer_detail",name="customer_detail"),
    url(r'^ap/ap_customer/customer_detail/change_customer_name/$',"ap.views.change_customer_name",name="change_customer_name"),
    url(r'^ap/ap_customer/customer_detail/custome_detail_table/$',"ap.views.custome_detail_table",name="custome_detail_table"),



    url(r'^ap/ap_index/$',"ap.views.ap_index",name="ap_index"),
    url(r'^ap/ap_index/ap_sort_type_change/$',"ap.views.ap_sort_type_change",name="ap_sort_type_change"),
    url(r'^ap/ap_index/ap_chartajax/$',"ap.views.ap_chartajax",name="ap_chartajax"),
    url(r'^ap/ap_index/ap_user_chartajax/$',"ap.views.ap_user_chartajax",name="ap_user_chartajax"),
    url(r'^ap/ap_index/ap_warningajax/$',"ap.views.ap_warningajax",name="ap_warningajax"),
    url(r'^ap/ap_index/ap_user_counterajax/$',"ap.views.ap_user_counterajax",name="ap_user_counterajax"),
    url(r'^ap/ap_index/ap_ssid_select/$',"ap.views.ap_ssid_select",name="ap_ssid_select"),

    url(r'^ap-list/ap_guest_policy/$',"ap.views.ap_guest_policy",name='ap_guest_policy'),
    url(r'^ap-list/ap_guest_policy/customer_black_list_table/$',"ap.views.customer_black_list_table",name='customer_black_list_table'),
    url(r'^ap-list/ap_guest_policy/customer_black_list_add_ajax/$',"ap.views.customer_black_list_add_ajax",name='customer_black_list_add_ajax'),
    url(r'^ap-list/ap_guest_policy/customer_blacklist_add/$',"ap.views.customer_blacklist_add",name='customer_blacklist_add'),
    url(r'^ap-list/ap_guest_policy/customer_blacklist_remove/$',"ap.views.customer_blacklist_remove",name='customer_blacklist_remove'),

    url(r'^ap-list/ap_guest_policy/customer_white_list_table/$',"ap.views.customer_white_list_table",name='customer_white_list_table'),
    url(r'^ap-list/ap_guest_policy/customer_white_list_add_ajax/$',"ap.views.customer_white_list_add_ajax",name='customer_white_list_add_ajax'),
    url(r'^ap-list/ap_guest_policy/customer_whitelist_add/$',"ap.views.customer_whitelist_add",name='customer_whitelist_add'),
    url(r'^ap-list/ap_guest_policy/customer_whitelist_remove/$',"ap.views.customer_whitelist_remove",name='customer_whitelist_remove'),
    url(r'^ap-list/ap_guest_policy/customer_black_white_switch/$',"ap.views.customer_black_white_switch",name='customer_black_white_switch'),




    url(r'^audit-device/audit_device_list/$','auditdevice.views.audit_device_list',name = 'audit_device_list'),
    url(r'^audit-device/audit_device_list/ad_already_access_ajax/$','auditdevice.views.ad_already_access_ajax',name = 'ad_already_access_ajax'),
    url(r'^audit-device/audit_device_list/auditdevice_detail/$','auditdevice.views.auditdevice_detail',name = 'auditdevice_detail'),
    url(r'^audit-device/audit_device_list/auditdevice_del/$','auditdevice.views.auditdevice_del',name = 'auditdevice_del'),
    url(r'^audit-device/audit_device_list/auditdevice_update/$','auditdevice.views.auditdevice_update',name = 'auditdevice_update'),
    url(r'^audit-device/audit_device_list/auditdevice_reboot/$','auditdevice.views.auditdevice_reboot',name = 'auditdevice_reboot'),
    url(r'^audit-device/audit_device_list/auditdevice_library_update/$','auditdevice.views.auditdevice_library_update',name = 'auditdevice_library_update'),
    url(r'^audit-device/auditdevice_group/$','auditdevice.views.auditdevice_group',name = 'auditdevice_group'),
    url(r'^audit-device/auditdevice_group/auditdevice_add_ajax/$','auditdevice.views.auditdevice_add_ajax',name = 'auditdevice_add_ajax'),
    url(r'^audit-device/auditdevice_group/get_role_list/$','auditdevice.views.get_role_list',name = 'get_role_list'),
    url(r'^audit-device/auditdevice_group/add_audit_device_group_ajax/$','auditdevice.views.add_audit_device_group_ajax',name = 'add_audit_device_group_ajax'),
    url(r'^audit-device/auditdevice_group/audit_device_group_del/$','auditdevice.views.audit_device_group_del',name = 'audit_device_group_del'),
    url(r'^audit-device/auditdevice_group/add_audit_device_ajax/$','auditdevice.views.add_audit_device_ajax',name = 'add_audit_device_ajax'),
    url(r'^audit-device/auditdevice_group/remove_audit_device_ajax/$','auditdevice.views.remove_audit_device_ajax',name = 'remove_audit_device_ajax'),
    url(r'^audit-device/auditdevice_group/get_audit_group/$','auditdevice.views.get_audit_group',name = 'get_audit_group'),
    url(r'^audit-device/auditdevice_group/modify_aduit_device_group_ajax/$','auditdevice.views.modify_aduit_device_group_ajax',name = 'modify_aduit_device_group_ajax'),
    url(r'^audit-device/auditdevice_group/audit_device_auto_update/$','auditdevice.views.audit_device_auto_update',name = 'audit_device_auto_update'),



    url(r'^nonoperate-list/$',"nonoperate.views.nonoperate_list",name = 'nonoperate_list'),
    url(r'^nonoperate-list/nonoperate_wait_access_ajax/$',"nonoperate.views.nonoperate_wait_access_ajax",name = 'nonoperate_wait_access_ajax'),
    url(r'^nonoperate-list/nonoperate_access/$',"nonoperate.views.nonoperate_access",name = 'nonoperate_access'),
    url(r'^nonoperate-list/nonoperate_already_access_ajax/$',"nonoperate.views.nonoperate_already_access_ajax",name = 'nonoperate_already_access_ajax'),
    url(r'^nonoperate-list/nonoperate_reboot/$',"nonoperate.views.nonoperate_reboot",name = 'nonoperate_reboot'),
    url(r'^nonoperate-list/nonoperate_update/$',"nonoperate.views.nonoperate_update",name = 'nonoperate_update'),
    url(r'^nonoperate-list/nonoperate_del/$',"nonoperate.views.nonoperate_del",name = 'nonoperate_del'),
    url(r'^nonoperate-list/nonoperate_detail/$',"nonoperate.views.nonoperate_detail",name = 'nonoperate_detail'),
    url(r'^nonoperate-list/nonoperate_config/$',"nonoperate.views.nonoperate_config",name = 'nonoperate_config'),
    url(r'^nonoperate-list/nonoperate_detail/nonoperate_vpn/$',"nonoperate.views.nonoperate_vpn",name = 'nonoperate_vpn'),
    url(r'^nonoperate-list/nonoperate_eventajax/$',"nonoperate.views.nonoperate_eventajax",name = 'nonoperate_eventajax'),

    url(r'^nonoperate-list/nonoperate_wlan_list/$',"nonoperate.views.nonoperate_wlan_list",name='nonoperate_wlan_list'),
    url(r'^nonoperate-list/nonoperate_wlan_show_detail/$',"nonoperate.views.nonoperate_wlan_show_detail",name='nonoperate_wlan_show_detail'),
    url(r'^nonoperate-list/nonoperate_apply_change_wlan/$',"nonoperate.views.nonoperate_apply_change_wlan",name='nonoperate_apply_change_wlan'),
    url(r'^nonoperate-list/nonoperate_reduction_change_wlan/$',"nonoperate.views.nonoperate_reduction_change_wlan",name='nonoperate_reduction_change_wlan'),
    url(r'^nonoperate-list/nonoperate_user_policy_config/$',"nonoperate.views.nonoperate_user_policy_config",name='nonoperate_user_policy_config'),




    url(r'^nonoperate/nonoperate_group/$',"nonoperate.views.nonoperate_group",name='nonoperate_group'),
    url(r'^nonoperate/nonoperate_group/nonoperate_add_ajax/$',"nonoperate.views.nonoperate_add_ajax",name='nonoperate_add_ajax'),
    url(r'^nonoperate/nonoperate_group/add_nonoperate_group_ajax/$',"nonoperate.views.add_nonoperate_group_ajax",name='add_nonoperate_group_ajax'),
    url(r'^nonoperate/nonoperate_group/nonoperate_group_del/$',"nonoperate.views.nonoperate_group_del",name='nonoperate_group_del'),
    url(r'^nonoperate/nonoperate_group/remove_nonoperate_ajax/$',"nonoperate.views.remove_nonoperate_ajax",name='remove_nonoperate_ajax'),
    url(r'^nonoperate/nonoperate_group/modify_nonoperate_group_ajax/$',"nonoperate.views.modify_nonoperate_group_ajax",name='modify_nonoperate_group_ajax'),
    url(r'^nonoperate/nonoperate_group/add_nonoperate_ajax/$',"nonoperate.views.add_nonoperate_ajax",name='add_nonoperate_ajax'),
    url(r'^nonoperate/nonoperate_group/add_nonoperate_wlan_in_group_ajax/$',"nonoperate.views.add_nonoperate_wlan_in_group_ajax",name='add_nonoperate_wlan_in_group_ajax'),


    url(r'^nonoperate/nonoperate_wlan/$',"nonoperate.views.nonoperate_wlan",name='nonoperate_wlan'),
    url(r'^nonoperate/nonoperate_wlan/add_nonoperate_wlan_ajax/$',"nonoperate.views.add_nonoperate_wlan_ajax",name='add_nonoperate_wlan_ajax'),
    url(r'^nonoperate/nonoperate_wlan/choose_nonoperate_group_ajax/$',"nonoperate.views.choose_nonoperate_group_ajax",name='choose_nonoperate_group_ajax'),
    url(r'^nonoperate/nonoperate_wlan/nonoperate_wlan_del/$',"nonoperate.views.nonoperate_wlan_del",name='nonoperate_wlan_del'),
    url(r'^nonoperate/nonoperate_wlan/nonoperate_wlan_info_ajax/$',"nonoperate.views.nonoperate_wlan_info_ajax",name='nonoperate_wlan_info_ajax'),
    url(r'^nonoperate/nonoperate_wlan/nonoperate_modify_wlan_ajax/$',"nonoperate.views.nonoperate_modify_wlan_ajax",name='nonoperate_modify_wlan_ajax'),
    url(r'^nonoperate/nonoperate_wlan/nonoperate_setting_ajax/$',"nonoperate.views.nonoperate_setting_ajax",name='nonoperate_setting_ajax'),

    url(r'^nonoperate/nonoperate_wlan/auto-accept/$',"nonoperate.views.nonoperate_auto_accept",name="nonoperate_auto_accept"),
    url(r'^nonoperate/nonoperate_wlan/auto-update/$',"nonoperate.views.nonoperate_auto_update",name="nonoperate_auto_update"),

    url(r'^nonoperate/nonoperate_wlan/nonoperate_black_list_add_ajax/$',"nonoperate.views.nonoperate_black_list_add_ajax",name="nonoperate_black_list_add_ajax"),
    url(r'^nonoperate/nonoperate_wlan/nonoperate_blacklist_add/$',"nonoperate.views.nonoperate_blacklist_add",name="nonoperate_blacklist_add"),
    url(r'^nonoperate/nonoperate_wlan/nonoperate_black_list_table/$',"nonoperate.views.nonoperate_black_list_table",name="nonoperate_black_list_table"),
    url(r'^nonoperate/nonoperate_wlan/nonoperate_blacklist_remove/$',"nonoperate.views.nonoperate_blacklist_remove",name="nonoperate_blacklist_remove"),
    # url(r'^ap/ap_list/gpon/$',"ap.views.gpon",name="gpon"),
    # url(r'^ap/ap_list/gpon/gpon_config/$',"ap.views.gpon_config",name="gpon_config"),
    # url(r'^ap/ap_list/gpon/gpon_action/$',"ap.views.gpon_action",name="gpon_action"),
    # url(r'^ap/ap_list/gpon/gpon_config_group/$',"ap.views.gpon_config_group",name="gpon_config_group"),
    # url(r'^ap/ap_list/gpon/gpon_config_system/$',"ap.views.gpon_config_system",name="gpon_config_system"),
    # url(r'^ap/ap_list/gpon/show_gpon_config/$',"ap.views.show_gpon_config",name="show_gpon_config"),
    url(r'^nonoperate/nonoperate_list/nonoperate_radios_config/$',"nonoperate.views.nonoperate_radios_config",name="nonoperate_radios_config"),



    url(r'^nonoperate/nonoperate_customer/$',"nonoperate.views.nonoperate_customer_list",name="nonoperate_customer_list"),
    url(r'^nonoperate/nonoperate_customer/nonoperate_customer_table/$',"nonoperate.views.nonoperate_customer_table",name="nonoperate_customer_table"),
    url(r'^nonoperate/nonoperate_list/nonoperate_customer_tab_table/$',"nonoperate.views.nonoperate_customer_tab_table",name="nonoperate_customer_tab_table"),
    url(r'^nonoperate/nonoperate_customer/nonoperate_customer_detail/$',"nonoperate.views.nonoperate_customer_detail",name="nonoperate_customer_detail"),
    url(r'^nonoperate/nonoperate_customer/nonoperate_customer_detail/nonoperate_change_customer_name/$',"nonoperate.views.nonoperate_change_customer_name",name="nonoperate_change_customer_name"),
    url(r'^nonoperate/nonoperate_customer/customer_detail/nonoperate_custome_detail_table/$',"nonoperate.views.nonoperate_custome_detail_table",name="nonoperate_custome_detail_table"),



    url(r'^nonoperate/nonoperate_index/$',"nonoperate.views.nonoperate_index",name="nonoperate_index"),
    url(r'^nonoperate/nonoperate_index/nonoperate_sort_type_change/$',"nonoperate.views.nonoperate_sort_type_change",name="nonoperate_sort_type_change"),
    url(r'^nonoperate/nonoperate_index/nonoperate_chartajax/$',"nonoperate.views.nonoperate_chartajax",name="nonoperate_chartajax"),
    url(r'^nonoperate/nonoperate_index/nonoperate_user_chartajax/$',"nonoperate.views.nonoperate_user_chartajax",name="nonoperate_user_chartajax"),
    url(r'^nonoperate/nonoperate_index/nonoperate_user_counterajax/$',"nonoperate.views.nonoperate_user_counterajax",name="nonoperate_user_counterajax"),
    url(r'^nonoperate/nonoperate_index/nonoperate_warningajax/$',"nonoperate.views.nonoperate_warningajax",name="nonoperate_warningajax"),
    url(r'^nonoperate/nonoperate_index/nonoperate_ssid_select/$',"nonoperate.views.nonoperate_ssid_select",name="nonoperate_ssid_select"),



    url(r'^nonoperate-list/nonoperate_guest_policy/$',"nonoperate.views.nonoperate_guest_policy",name='nonoperate_guest_policy'),


    url(r'^ap-list/ap_guest_policy/auth_server_ajax/$',"ap.views.auth_server_ajax",name='auth_server_ajax'),
    url(r'^ap-list/ap_guest_policy/auth_server_show_ajax/$',"ap.views.auth_server_show_ajax",name='auth_server_show_ajax'),
    url(r'^ap-list/ap_guest_policy/global_config_ajax/$',"ap.views.global_config_ajax",name='global_config_ajax'),
    url(r'^ap-list/ap_guest_policy/auth_proxy/$',"ap.views.auth_proxy",name='auth_proxy'),
    url(r'^ap-list/ap_guest_policy/voucherprint/$',"ap.views.voucherprint",name='voucherprint'),




    url(r'^portal_master/list_template.php$',"ap.views.list_template_php",name='list_template_php'),
    url(r'^portal_master/list_page.php$',"ap.views.list_page_php",name='list_page_php'),
    url(r'^portal_master/create_portal_css.php$',"ap.views.create_portal_css_php",name='create_portal_css_php'),
    url(r'^portal_master/statement.php$',"ap.views.statement_php",name = "statement_php"),
    url(r'^portal_master/update_file.php$',"ap.views.update_file_php",name = "update_file_php"),
    url(r'^portal_master/list_portal.php$',"ap.views.list_portal_php",name = "list_portal_php"),
    url(r'^portal_master/configs.php$',"ap.views.configs_php",name = "configs_php"),
    url(r'^portal_master/list_edit_portal.php$',"ap.views.list_edit_portal_php",name = "list_edit_portal_php"),
    url(r'^portal_master/portal_operation.php$',"ap.views.portal_operation_php",name = "portal_operation_php"),


    url(r'^oemSettingPage/$',"system.views.oemSettingPage",name = "oemSettingPage"),
    url(r'^oemSettingApi/$',"system.views.oemSettingApi",name = "oemSettingApi"),

    url(r'^nonoperate-list/nonoperateByzoroXinyangList/$',"nonoperate.views.nonoperateByzoroXinyangList",name = 'nonoperateByzoroXinyangList'),
    url(r'^nonoperate-list/nonoperateByzoroXinyangTableApi/$',"nonoperate.views.nonoperateByzoroXinyangTableApi",name = 'nonoperateByzoroXinyangTableApi'),
    url(r'^nonoperate-list/xinyangExportDeviceButtonApi/$',"nonoperate.views.xinyangExportDeviceButtonApi",name = 'xinyangExportDeviceButtonApi'),
    url(r'^system/system_service/produceUpdateURL/$',"system.views.produceUpdateURL",name='produceUpdateURL'),

    url(r'^system/system_service/countryCodeApi/$',"system.views.countryCodeApi",name='countryCodeApi'),
    url(r'^system/system_service/timezoneCodeApi/$',"system.views.timezoneCodeApi",name='timezoneCodeApi'),

    url(r'^ap-list/ap_guest_policy/authAccountInfoApi/$',"ap.views.authAccountInfoApi",name='authAccountInfoApi'),
    url(r'^ap-list/deviceLocateApi/$',"ap.views.deviceLocateApi",name='deviceLocateApi'),
    url(r'^protalCustomPage/',"ap.views.protalCustomPage",name='protalCustomPage'),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# handler403 = view.page_permission_denied
handler404 = account.views.login
# handler500 = view.page_inter_error
