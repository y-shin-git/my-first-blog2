let map;
var markers = []; // マーカー保存配列
var areaPolygon = []; // ポリゴン生成する座標配列
let current_point = []; //現在地保存用


function initMap() {
    var mapOptions = {
        zoom : 15,          // 拡大倍率
        center : { lat: 35.667, lng: 139.824 }, // 現在地の座標
        zoom : 12,
        styles: [{
            featureType: 'poi',
            stylers: [
                { visibility: 'off' }
            ]
        }]
    };
    // マップオブジェクト作成
    map = new google.maps.Map(
    document.getElementById("map"), // マップを表示する要素
    mapOptions    // マップオプション
    );
    map.data.loadGeoJson('chomokun/api/chomonicx');
}


// 情報ウインドウの生成とクリックイベント関数の登録処理
function setMarkerListener(marker, location) {
    // 表示文字列の生成(緯度・経度)
    var contentString = "lat:" + location.lat() + "<br>" + "lng:" + location.lng();
    // 情報ウィンドウの生成
    var infoWindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });
    // マーカーのクリックイベントの関数登録
    google.maps.event.addListener(marker, 'click', function(event) {
        // 情報ウィンドウの表示
        infoWindow.open(map, marker);
    });
}


/* // マップからマーカーの画像を消す(保存されたマーカーはそのまま)
function clearMarkers() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
        }
    }
}
// 保存されたマーカーをマップ上に表示
function showMarkers() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(map);
        }
    }
}
// マップからマーカーの画像を消し、マーカーも削除
function deleteMarkers() {
    if (markers) {
        clearMarkers();
        markers.length = 0;
    }
}

function shapeMarkers() {
    var markerLatLong = [] // マーカーの座標配列
    //多角形の頂点の座標を指定して変数に代入
    for (let i = 0; i < markers.length; i++) {
        var pos = markers[i].getPosition();
        var mlat = pos.lat();
        var mlng = pos.lng();
        markerLatLong.push({lat: mlat, lng: mlng});
        }

   //各種オプションを指定してコンストラクタでポリゴン（多角形）のインスタンスを生成
    var shapelines = new google.maps.Polygon({
        paths: markerLatLong,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#808080',
        fillOpacity: 0.8,
        editable: true,
    });

    areaPolygon = new google.maps.Polygon(shapelines);
    //多角形を地図に描画
    areaPolygon.setMap(map);
}
 */

function getLatLng() {
    var place = document.getElementById('address').value;
    // ジオコーダのコンストラクタ
    var geocoder = new google.maps.Geocoder();
    // geocodeリクエストを実行。
    // 第１引数はGeocoderRequest。住所⇒緯度経度座標の変換時はaddressプロパティを入れればOK。
    // 第２引数はコールバック関数。
    geocoder.geocode({
        address: place
        }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // 結果の表示範囲。結果が１つとは限らないので、LatLngBoundsで用意。
                    var bounds = new google.maps.LatLngBounds();
                    for (var i in results) {
                        if (results[i].geometry) {
                            // 緯度経度を取得
                            var latlng = results[i].geometry.location;
                            ido_kedo = document.getElementById("ido_kedo");
                            ido_kedo.innerHTML = latlng;

                            // 住所を取得(日本の場合だけ「日本, 」を削除)
                            var address = results[0].formatted_address.replace(/^日本, /, '');
                            // 検索結果地が含まれるように範囲を拡大
                            bounds.extend(latlng);
                            // infowindowオプション
                            new google.maps.InfoWindow({
                            content: address + "<br>(Lat, Lng) = " + latlng.toString()
                            }).open(map,new google.maps.Marker({
                            position: latlng,
                            map: map
                            }))
                        }
                    }
                    // 検索した住所へ移動
                    map.fitBounds(bounds);
                    map.setZoom(15)

                } else if (status == google.maps.GeocoderStatus.ERROR) {
                    alert("サーバとの通信時に何らかのエラーが発生しました");
                } else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
                    alert("有効な値を入力してください");
                } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    alert("短時間でのクエリ実行を検知");
                } else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
                    alert("geocodingAPIの利用が許可されていません");
                } else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
                    alert("サーバ側でなんらかのトラブルが発生したようです");
                } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                    alert("見つかりませんでした");
                } else {
                    alert("原因不明のエラーです");
                }
    });
}

/* function deletePolygon() { 
    areaPolygon.setMap(null);
} */

//現在地へ戻る
/* function currentPoint() {
    map.panTo(current_point);
} */

function showchomo() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/chomonicx?address=' + $('input[name=address]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('ソーシャルグループ') === 'プラチナタウン') {
			return ({
				fillColor: '#ff0000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});  
		} else if (feature.getProperty('ソーシャルグループ') === 'アーバンミドルクラス'){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === '下町'){
			return ({
				fillColor: '#FFFF00',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'エレガントファミリー'){
			return ({
				fillColor: '#375623',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'アクティブライフ'){
			return ({
				fillColor: '#00B050',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'シングルシティ'){
			return ({
				fillColor: '#92D050',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'マイホーム'){
			return ({
				fillColor: '#000080',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === '郊外安定生活'){
			return ({
				fillColor: '#00B0F0',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'ローカル郊外'){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === '田園生活'){
			return ({
				fillColor: '#7030A0',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === '地元志向'){
			return ({
				fillColor: '#FF6699',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'カントリーシンプルライフ'){
			return ({
				fillColor: '#FFCCFF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else {
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		}
	});
}

function showPopulation() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/chomonicx?address=' + $('input[name=address]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('人口総数') > 500) {
			return ({
				fillColor: '#ff0000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('人口総数') > 300){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('人口総数') > 100){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('人口総数') < 100){
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		}
	});
}

function showHouseholds() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/chomonicx?address=' + $('input[name=address]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('世帯総数') > 300) {
			return ({
				fillColor: '#ff0000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('世帯総数') > 200){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('世帯総数') > 100){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('世帯総数') > 50){
			return ({
				fillColor: '#FF6699',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('世帯総数') < 50){
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		}
	});
}

function showNenshu() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/nenshu?address=' + $('input[name=address]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('年収1500万円以上世帯数')) {
			return ({
				fillColor: '#ff0000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
            
		} else if (feature.getProperty('年収1000万円以上世帯数')){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('年収1000〜1500万円未満世帯数')){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('年収700〜1000万円未満世帯数')){
			return ({
				fillColor: '#FF6699',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('年収500〜700万円未満世帯数')){
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.5,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		}
	});
}


/* function csvMarkers() {
    var markerLatLong = []
    for (let i = 0; i < markers.length; i++) {
        var pos = markers[i].getPosition();
        var mlat = pos.lat();
        var mlng = pos.lng();
        markerLatLong.push({lat: mlat, lng: mlng});
        }

    var shapelines = new google.maps.Polygon({
        paths: markerLatLong,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#808080',
        fillOpacity: 0.8,
        editable: true,
    });

    areaPolygon = new google.maps.Polygon(shapelines);
    areaPolygon.setMap(map);
} */

function showPolygon(){
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    }); 
    var poryGroup = document.getElementsByName("pory-group");
    for ( var poryChoice="", i = poryGroup.length; i--;) {
        if (poryGroup[i].checked) {
            var poryChoice = poryGroup[i].value ;
            break ;
        }
    }
    map.data.loadGeoJson('api/chomonicx?' + poryChoice + '=' + $('input[name=polygonPoint]').val());
    map.data.setStyle(function(feature) {
        var Style = {
            fillColor: "#9AD2AE",
            fillOpacity: 0.5,
            strokeColor: "#1EB26A",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: true,
            visible: true,
            zIndex: 1
        };
        return (Style);
    });
}

function csv_poly(){
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    }); 
    map.data.loadGeoJson('/chomokun/api/poidata');
}

var polygon_elems = document.getElementsByName("polygon");
var chomo_elems = document.getElementsByName("chomo");

for(var i = 0; i < polygon_elems.length; i++){
    if(polygon_elems[i].checked) {
      var polygon_checked = polygon_elems[i]
    }
}
for(var n = 0; i < chomo_elems.length; n++){
    if(chomo_elems[n].checked) {
      var chomo_checked = chomo_elems[n]
    }
}


function show() {
    var flag = false; // 選択されているか否かを判定するフラグ
    // 2番目のラジオボタンがチェックされているかを判定
    if(document.form1.polygon[1].checked && document.form1.address.value != "" && document.form2.chomo[0].checked) { 
        flag = true;
        return showchomo()
    }else if(document.form1.polygon[1].checked && document.form2.chomo[1].checked) {
        flag = true;
        return showPopulation()
    }else if(document.form1.polygon[1].checked && document.form2.chomo[2].checked) {
        flag = true;
        return showHouseholds()
    }
    // 何も選択されていない場合の処理
    if(!flag){ 
        alert("項目が選択、入力されていないか、現在調整中の項目です。");
    }
}
