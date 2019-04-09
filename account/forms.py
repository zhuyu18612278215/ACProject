#!/usr/bin/env/python
#coding=utf-8

from django import forms
from captcha.fields import CaptchaField
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy as lazy_
class LoginForm(forms.Form):
    #username = CharField()
    #captcha = CaptchaField()
    captcha = CaptchaField()

    def clean(self):

        # 验证码
        try:
            captcha = self.cleaned_data['captcha']
        except Exception as e:
            print 'except: '+ str(e)
            raise forms.ValidationError(_(u"验证码有误，请重新输入"))
        return self.cleaned_data

class RegisterForm(forms.Form):
    """docstring for RegisterForm"""
    username = forms.CharField(max_length = 18 , min_length = 6)
    password = forms.CharField(max_length = 18 , min_length = 6)
    passwordconfirm = forms.CharField(max_length = 18 , min_length = 6)
    email = forms.EmailField()
    language = forms.CharField(max_length = 10)
