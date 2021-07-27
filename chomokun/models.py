from django.db import models
from django.contrib.gis.db import models
from django.db.models.base import Model


class DataChomonicx(models.Model):
    地域コード = models.CharField(primary_key=True, max_length=11)
    都道府県名 = models.CharField(max_length=8, blank=True, null=True)
    市区町村名 = models.CharField(max_length=30, blank=True, null=True)
    地域名 = models.CharField(max_length=40, blank=True, null=True)
    chomonicx40cd = models.CharField(db_column='Chomonicx40CD', max_length=4, blank=True, null=True)  # Field name made lowercase.
    大分類 = models.CharField(max_length=10, blank=True, null=True)
    ソーシャルグループ = models.CharField(max_length=24, blank=True, null=True)
    クラスター名称 = models.CharField(max_length=32, blank=True, null=True)
    人口総数 = models.IntegerField(blank=True, null=True)
    世帯総数 = models.IntegerField(blank=True, null=True)
    一般世帯数 = models.IntegerField(blank=True, null=True)
    geom = models.GeometryField(srid=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'data_chomonicx4_0'


class UsrPoiList(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    upload_datetime = models.DateTimeField(blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'usr_poi_list'

class UsrPoiData(models.Model):
    list = models.ForeignKey("UsrPoiList", models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    x = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    y = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    geom = models.GeometryField(srid=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usr_poi_data'

class DataAnnualincome2018Cho(models.Model):
    地域コード = models.CharField(primary_key=True, max_length=11, blank=True, null=False)
    地域区分 = models.CharField(max_length=1, blank=True, null=True)
    都道府県名 = models.CharField(max_length=10, blank=True, null=True)
    市区町村名 = models.CharField(max_length=20, blank=True, null=True)
    地域名 = models.CharField(max_length=30, blank=True, null=True)
    秘匿合算符号 = models.CharField(max_length=2, blank=True, null=True)
    一般世帯数 = models.FloatField(blank=True, null=True)
    年収300万円未満世帯数 = models.FloatField(blank=True, null=True)
    年収300_500万円未満世帯数 = models.FloatField(db_column='年収300～500万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収500_700万円未満世帯数 = models.FloatField(db_column='年収500～700万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収700_1000万円未満世帯数 = models.FloatField(db_column='年収700～1000万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収1000_1500万円未満世帯数 = models.FloatField(db_column='年収1000～1500万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収1500万円以上世帯数 = models.FloatField(blank=True, null=True)
    年収1000万円以上世帯数 = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'data_annualincome2018_cho'


class ViewAnnualincome2018ChoGeom(models.Model):
    地域コード = models.CharField(primary_key=True, max_length=11, blank=True, null=False)
    地域区分 = models.CharField(max_length=1, blank=True, null=True)
    都道府県名 = models.CharField(max_length=10, blank=True, null=True)
    市区町村名 = models.CharField(max_length=20, blank=True, null=True)
    地域名 = models.CharField(max_length=30, blank=True, null=True)
    秘匿合算符号 = models.CharField(max_length=2, blank=True, null=True)
    一般世帯数 = models.FloatField(blank=True, null=True)
    年収300万円未満世帯数 = models.FloatField(blank=True, null=True)
    年収300_500万円未満世帯数 = models.FloatField(db_column='年収300～500万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収500_700万円未満世帯数 = models.FloatField(db_column='年収500～700万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収700_1000万円未満世帯数 = models.FloatField(db_column='年収700～1000万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収1000_1500万円未満世帯数 = models.FloatField(db_column='年収1000～1500万円未満世帯数', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    年収1500万円以上世帯数 = models.FloatField(blank=True, null=True)
    年収1000万円以上世帯数 = models.FloatField(blank=True, null=True)
    geom = models.GeometryField(blank=True, null=True)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'view_annualincome2018_cho_geom'


class DataCity(models.Model):
    id = models.CharField(primary_key=True, max_length=5)
    都道府県名 = models.CharField(max_length=8, blank=True, null=True)
    市区町村名 = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'data_city'


class DataPref(models.Model):
    id = models.CharField(primary_key=True, max_length=2)
    都道府県名 = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'data_pref'


class ViewChomonicxGeom(models.Model):
    地域コード = models.CharField(primary_key=True, max_length=11)
    都道府県名 = models.CharField(max_length=8, blank=True, null=True)
    市区町村名 = models.CharField(max_length=30, blank=True, null=True)
    地域名 = models.CharField(max_length=40, blank=True, null=True)
    chomonicx40cd = models.CharField(db_column='Chomonicx40CD', max_length=4, blank=True, null=True)  # Field name made lowercase.
    大分類 = models.CharField(max_length=10, blank=True, null=True)
    ソーシャルグループ = models.CharField(max_length=24, blank=True, null=True)
    クラスター名称 = models.CharField(max_length=32, blank=True, null=True)
    人口総数 = models.IntegerField(blank=True, null=True)
    世帯総数 = models.IntegerField(blank=True, null=True)
    一般世帯数 = models.IntegerField(blank=True, null=True)
    geom = models.GeometryField(blank=True, null=True)

    class Meta:
        managed = False  # Created from a view. Don't remove.
        db_table = 'view_chomonicx_geom'