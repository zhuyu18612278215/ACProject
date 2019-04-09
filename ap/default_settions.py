#!/usr/bin/env python
# -*- coding:utf-8 -*-
#
#

user_policy_config = {
    'dual_max_user': 128,
    'single_max_user': 64,
    'rssi_threshold': -95,
    'access_policy':0,
    'load_balance': 0,
    'reject_max':3,
    'rssi_max':0,
    # 'rssi_min':0,
    "l2_isolation": 0,
    'band_steering':0,
    'thredhold_5g':0,
    'thredhold_5g_rssi':0,
    'roaming_policy':0,
    'roaming_assoc_rssi':0,
    'roaming_unassoc_rssi':0,
}

guest_policy_config = {
    'simpleauth':'false',
    'bypass':'false',
    'wechatallowed':'false',
    'auth_validate_timeout':'43200',
    'client_timeout':'2880',
    'auth_server':'',
    'white_list':'[]',
    'trusted_mac_list':'[]',
}


