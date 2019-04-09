#!/usr/bin/env/python
#coding=utf-8

from django import forms



class ImageForm(forms.Form):
    """Image upload form."""
    headpic = forms.ImageField()
