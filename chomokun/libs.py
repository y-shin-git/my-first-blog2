from .models import UsrPoiData, UsrPoiList
import datetime
from django.contrib.gis.geos import GEOSGeometry
import os
from django.db import connection

def get_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)


def poi_csv2db(title,file):
    ln = 0
    records = []
    new_list = UsrPoiList(title = title,upload_datetime = datetime.datetime.now()) # UPしたcsvの名前、UP日時を取得
    for line in file.read().decode("shift-jis").split("\r\n"): # UPしたcsvを１行ずつ読み込み、文字コード変換&\r\nで改行
        if line == "":
            break
        fields = line.replace('"', '').split(",") # csvから１行ずつ取り出し、不要な部分を削除、区切り文字で改行
        if ln == 0:
            fn = 0
            for f in fields:
                f = f.lower() #取り出した文字列全てを小文字に変換　lower()
                if f in ('name', '名前', '店舗名', '店名'): #この繰り返し処理はcsv１行目のみに実行。該当する列番号を取得する処理
                    fn_name = fn
                elif f in ('address', '住所'):
                    fn_address = fn
                elif f in ('longitude', 'lon', 'x', '経度'):
                    fn_x = fn
                elif f in ('latitude', 'lat', 'y', '緯度'):
                    fn_y = fn
                fn += 1
        
        elif len(fields) >= fn:
            # format関数で引数に入っているのはcsvで緯度軽度が入力されている部分。それが{0}{1}にそれぞれ代入される
            records.append(UsrPoiData(list = new_list, name = fields[fn_name], address = fields[fn_address], x = fields[fn_x], y = fields[fn_y]))
        ln += 1
    new_list.save()
    UsrPoiData.objects.bulk_create(records) #recordsに格納されているデータをDBに一括登録する

    with connection.cursor() as cur:
        cur.execute('UPDATE public.usr_poi_data SET geom=ST_setSRID(ST_Point(x, y), 4326) WHERE geom is null;')
