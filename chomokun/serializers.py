# GeoFeatureModelSerializer読み込み
from rest_framework_gis.serializers import GeoFeatureModelSerializer

# モデル読み込み
from .models import DataChomonicx,UsrPoiData,ViewAnnualincome2018ChoGeom,ViewChomonicxGeom

# ポリゴンシリアライザ
class ViewChomonicxGeomSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ViewChomonicxGeom
        fields = ('__all__')
        # 位置情報カラム指定
        geo_field = 'geom'


class UsrPoiDataSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = UsrPoiData
        fields = ('__all__')
        # 位置情報カラム指定
        geo_field = 'geom'

class ViewAnnualincome2018ChoGeomSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ViewAnnualincome2018ChoGeom
        fields = ('__all__')
        # 位置情報カラム指定
        geo_field = 'geom'
