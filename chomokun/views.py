from django import forms
from django.db.models import query
from django.http import request
from django.http.response import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import UsrPoiDataSerializer,ViewAnnualincome2018ChoGeomSerializer,ViewChomonicxGeomSerializer
from .models import DataChomonicx,UsrPoiData,UsrPoiList,ViewAnnualincome2018ChoGeom,DataPref,DataCity,ViewChomonicxGeom
from .forms import UploadPoiFileForm
from .libs import poi_csv2db
from django.contrib.auth.decorators import login_required
from geopy.geocoders import Nominatim


@login_required # ログイン状態の時のみ下記を処理する

def index(requests):
    template = loader.get_template('chomokun/index.html')
    form = UploadPoiFileForm()
    context = {'form': form,
            'pref_list': DataPref.objects.all(),
    }
    return HttpResponse(template.render(context, requests))

class ChomonicxViewSet(viewsets.ModelViewSet):
    queryset = ViewChomonicxGeom.objects.filter(地域コード__contains=13108)
    serializer_class = ViewChomonicxGeomSerializer
    def get_queryset(self):
        return ViewChomonicxGeom.objects.filter(地域コード__startswith=self.request.GET.get('pref'))

def poi_file_upload(request):
    if request.method == 'POST':
        form = UploadPoiFileForm(request.POST, request.FILES)
        model = UsrPoiData
        if form.is_valid():
            poi_csv2db(form.cleaned_data['title'], request.FILES['file'])
            return render(request, 'report/poi_upload.html', {'form': form})
    else:
        form = UploadPoiFileForm()
    return render(request, 'report/poi_upload.html', {'form': form})


class UsrPoiDataViewSet(viewsets.ModelViewSet):
    queryset = UsrPoiData.objects.all()
    serializer_class = UsrPoiDataSerializer
    def get_queryset(self):
        return UsrPoiData.objects.all()


class ViewAnnualincome2018ChoGeomViewSet(viewsets.ModelViewSet):
    queryset = ViewAnnualincome2018ChoGeom.objects.filter(地域コード__contains=13108)
    serializer_class = ViewAnnualincome2018ChoGeomSerializer
    def get_queryset(self):
        return ViewAnnualincome2018ChoGeom.objects.filter(市区町村名__contains=self.request.GET.get('address'))
