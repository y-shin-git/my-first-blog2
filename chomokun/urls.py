from django.urls import path
from django.urls.conf import include
from . import views
from rest_framework.routers import DefaultRouter
from .views import ChomonicxViewSet,UsrPoiDataViewSet,ViewAnnualincome2018ChoGeomViewSet
from django.contrib.auth import views as auth_views
from django.conf.urls import url


app_name = 'chomokun'

router = DefaultRouter()
router.register('chomonicx', ChomonicxViewSet)
router.register('poidata', UsrPoiDataViewSet)
router.register('nenshu', ViewAnnualincome2018ChoGeomViewSet)


urlpatterns = [
    path('', views.index, name='index'),
    path('report/', views.index, name='upload'),
    path('poi_file_upload', views.poi_file_upload, name='poi_file_upload'),
    path('api/', include(router.urls)),

]
