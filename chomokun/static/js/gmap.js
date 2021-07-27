var map;
var markers = []; // マーカー保存配列
var areaPolygon = []; // ポリゴン生成する座標配列
let current_point = []; //現在地保存用
let places;
let infoWindow;
let autocomplete;
const countryRestrict = { country: "jp" };
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");


function initMap() {
    // Geolocation APIに対応している
    if (navigator.geolocation) {
        // 現在地を取得
        navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
        function(position){
        // 緯度・経度を変数に格納
                current_point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                // マップオプションを変数に格納
                var mapOptions = {
                    zoom : 15,          // 拡大倍率
                    center : current_point, // 現在地の座標
                    disableDefaultUI: true,
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

                infoWindow = new google.maps.InfoWindow({
                    content: document.getElementById("info-content"),
                });

                autocomplete = new google.maps.places.Autocomplete(
                    document.getElementById("autocomplete"),
                    {
                      types: ["(cities)"],
                      componentRestrictions: countryRestrict,
                    }
                );
                places = new google.maps.places.PlacesService(map);
                autocomplete.addListener("place_changed", onPlaceChanged);
                
                //document.getElementById("country").addEventListener("change", setAutocompleteCountry);


                //現在地にマーカーをセット
                /* const marker = new google.maps.Marker({
                    position: current_point,
                    map: map,
                }); */


                // マップのクリックイベントの関数登録
                //google.maps.event.addListener(map, 'click', function(event) {
                // マップ上の位置でマーカーを生成
                //    addMarker(event.latLng);
                //}); 
                
                // マーカーの生成関数
                //function addMarker(location) {
                    /* // マーカーを生成
                    marker = new google.maps.Marker({
                    position: location,
                    //ドラッグを許可
                    draggable: true,
                    map: map
                }); */
                
                    // 情報ウインドウの生成とクリックイベント関数の登録処理
                    //setMarkerListener(marker, location);
                    // 生成されたマーカーを保存
                    //markers.push(marker);
                //}            

            //　マップにマーカーを表示する
            map.data.setStyle(function(feature) {
                if (feature.getProperty('type') === 'point') {
                    // マーカーのスタイル
                    return ({
                        icon: {
                            url:  feature.getProperty('icon'),
                            scaledSize: new google.maps.Size(32, 32)
                        }
                    }); 
                }else if (feature.getProperty('type') === 'polyline') {
                    // ポリラインのスタイル
                    return ({
                        strokeColor: '#ff0000',
                        strokeWeight: 1,
                        clickable: true,
                        zIndex: 1
                    });
                }else if (feature.getProperty('type') === 'polygon'){
                    // ポリゴンのスタイル
                    return ({
                        fillColor: '#ff0000',
                        fillOpacity: 0.6,
                        strokeWeight: 0,
                        clickable: true,
                        zIndex: 1
                    });
                }
            });
        },
        // 取得失敗した場合
        function(error) {
            // エラーメッセージを表示
            switch(error.code) {
                case 1: // PERMISSION_DENIED
                    alert("位置情報の利用が許可されていません");
                    break;
                case 2: // POSITION_UNAVAILABLE
                    alert("現在位置が取得できませんでした");
                    break;
                case 3: // TIMEOUT
                    alert("タイムアウトになりました");
                    break;
                default:
                alert("その他のエラー(エラーコード:"+error.code+")");
                break;
            }
        }   
    );
    // Geolocation APIに対応していない
    } else {
        alert("この端末では位置情報が取得できません");
    }
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();
  
    if (place.geometry && place.geometry.location) {
      map.panTo(place.geometry.location);
      map.setZoom(14);
      search();
    } else {
      document.getElementById("autocomplete").placeholder = "Enter a city";
    }
}

function search() {
    var place_Type = document.getElementById("business_format").value;
    const search = {
        bounds: map.getBounds(),
        types: [place_Type],
    };
    places.nearbySearch(search, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            clearResults();
            clearMarkers();
  
        for (let i = 0; i < results.length; i++) {
            const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
            const markerIcon = MARKER_PATH + markerLetter + ".png";
            markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                animation: google.maps.Animation.DROP,
                icon: markerIcon,
            });
            markers[i].placeResult = results[i];
            google.maps.event.addListener(markers[i], "click", showInfoWindow);
            setTimeout(dropMarker(i), i * 100);
            addResult(results[i], i);
            }
        }
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}

/* function setAutocompleteCountry() {
    const country = document.getElementById("country").value;
  
    if (country == "all") {
        autocomplete.setComponentRestrictions({ country: [] });
        map.setCenter({ lat: 15, lng: 0 });
        map.setZoom(2);
    } else {
        autocomplete.setComponentRestrictions({ country: country });
        map.setCenter(countries[country].center);
        map.setZoom(countries[country].zoom);
    }
    clearResults();
    clearMarkers();
} */

function dropMarker(i) {
    return function () {
        markers[i].setMap(map);
    };
}

function addResult(result, i) {
    const results = document.getElementById("results");
    const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
    const markerIcon = MARKER_PATH + markerLetter + ".png";
    const tr = document.createElement("tr");
    tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
  
    tr.onclick = function () {
        google.maps.event.trigger(markers[i], "click");
    };
    const iconTd = document.createElement("td");
    const nameTd = document.createElement("td");
    const icon = document.createElement("img");
    icon.src = markerIcon;
    icon.setAttribute("class", "placeIcon");
    icon.setAttribute("className", "placeIcon");
    const name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}
  
function clearResults() {
    const results = document.getElementById("results");
  
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}
  
function showInfoWindow() {
    const marker = this;
    places.getDetails(
        { placeId: marker.placeResult.place_id },
        (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
        }
    );
}
  
function buildIWContent(place) {
    document.getElementById("iw-icon").innerHTML =
        '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
    document.getElementById("iw-url").innerHTML =
        '<b><a href="' + place.url + '">' + place.name + "</a></b>";
    document.getElementById("iw-address").textContent = place.vicinity;
  
    if (place.formatted_phone_number) {
        document.getElementById("iw-phone-row").style.display = "";
        document.getElementById("iw-phone").textContent = place.formatted_phone_number;
    } else {
        document.getElementById("iw-phone-row").style.display = "none";
    }
  
    if (place.rating) {
        let ratingHtml = "";
  
    for (let i = 0; i < 5; i++) {
        if (place.rating < i + 0.5) {
            ratingHtml += "&#10025;";
        } else {
            ratingHtml += "&#10029;";
        }
        document.getElementById("iw-rating-row").style.display = "";
        document.getElementById("iw-rating").innerHTML = ratingHtml;
        }
    } else {
        document.getElementById("iw-rating-row").style.display = "none";
    }
  
    if (place.website) {
        let fullUrl = place.website;
        let website = String(hostnameRegexp.exec(place.website));
  
        if (!website) {
            website = "http://" + place.website + "/";
            fullUrl = website;
        }
        document.getElementById("iw-website-row").style.display = "";
        document.getElementById("iw-website").textContent = website;
        } else {
        document.getElementById("iw-website-row").style.display = "none";
    }
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

function getLatLng() {
    var place = document.getElementById('move-address').value;
    // ジオコーダのコンストラクタ
    var geocoder = new google.maps.Geocoder();
    // geocodeリクエストを実行。
    // 第１引数はGeocoderRequest。住所⇒緯度経度座標の変換時はaddressプロパティを入れる。
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
                            //ido_kedo.innerHTML = latlng;

                            // 住所を取得(日本の場合だけ「日本, 」を削除)
                            var address = results[0].formatted_address.replace(/^日本, /, '');
                            // 検索結果地が含まれるように範囲を拡大
                            bounds.extend(latlng);
                            // infowindowオプション
                            new google.maps.InfoWindow({
                            content: address + "<br>(Lat, Lng) = " + latlng.toString()
                            }).open(map,new google.maps.Marker({
                            position: latlng,
                            map: map,
                            zoom: 13
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
function currentPoint() {
    map.panTo(current_point);
}

function showchomo() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/chomonicx?pref=' + $('select[name=pref]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('ソーシャルグループ') === 'プラチナタウン') {
			return ({
                fillColor: '#ff0000',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
            });
		} else if (feature.getProperty('ソーシャルグループ') === 'アーバンミドルクラス'){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === '下町'){
			return ({
				fillColor: '#FFFF00',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'エレガントファミリー'){
			return ({
				fillColor: '#375623',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'アクティブライフ'){
			return ({
				fillColor: '#00B050',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'シングルシティ'){
			return ({
				fillColor: '#92D050',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'マイホーム'){
			return ({
				fillColor: '#000080',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === '郊外安定生活'){
			return ({
				fillColor: '#00B0F0',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'ローカル郊外'){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === '田園生活'){
			return ({
				fillColor: '#7030A0',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === '地元志向'){
			return ({
				fillColor: '#FF6699',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('ソーシャルグループ') === 'カントリーシンプルライフ'){
			return ({
				fillColor: '#FFCCFF',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else {
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		}
	});
}

function showPopulation() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/chomonicx?pref=' + $('select[name=pref]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('人口総数') > 1000) {
			return ({
				fillColor: '#ff0000',
				fillOpacity: 0.6,
				strokeWeight: 2,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('人口総数') > 750){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('人口総数') > 500){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('人口総数') < 250){
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		}
	});
}

function showHouseholds() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/chomonicx?pref=' + $('select[name=pref]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('世帯総数') > 400) {
			return ({
				fillColor: '#ff0000',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('世帯総数') > 300){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('世帯総数') > 200){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('世帯総数') > 100){
			return ({
				fillColor: '#FF6699',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		} else if (feature.getProperty('世帯総数') < 50){
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1,
                strokeColor: '#f5f5f5'
			});
		}
	});
}

function showNenshu() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    map.data.loadGeoJson('api/chomonicx?pref=' + $('select[name=pref]').val());
    map.data.setStyle(function(feature) {
		if (feature.getProperty('年収1500万円以上世帯数')) {
			return ({
				fillColor: '#ff0000',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
            
		} else if (feature.getProperty('年収1000万円以上世帯数')){
			return ({
				fillColor: '#FFC000',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('年収1000〜1500万円未満世帯数')){
			return ({
				fillColor: '#90B5FF',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('年収700〜1000万円未満世帯数')){
			return ({
				fillColor: '#FF6699',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		} else if (feature.getProperty('年収500〜700万円未満世帯数')){
			return ({
				fillColor: '#FFFFFF',
				fillOpacity: 0.6,
				strokeWeight: 1,
				clickable: true,
				zIndex: 1
			});
		}
	});
}

function csvMarkers() {
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
}

function csv_point(){
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    }); 
    map.data.loadGeoJson('/chomokun/api/poidata');
}

function show() {
    var flag = false; // 選択されているか否かを判定するフラグ
    
    if(document.form1.polygon[4].checked && document.form2.chomo[0].checked) { 
        flag = true;
        return showchomo()
    }else if(document.form1.polygon[4].checked && document.form2.chomo[1].checked) {
        flag = true;
        return showPopulation()
    }else if(document.form1.polygon[4].checked && document.form2.chomo[2].checked) {
        flag = true;
        return showHouseholds()
    }
    // 何も選択されていない場合の処理
    if(!flag){ 
        alert("項目が選択、入力されていないか、現在調整中の項目です。");
    }
}

function selectchange() {
    search()
}


/* ------------------------------
 Loading イメージ表示関数
 引数： msg 画面に表示する文言
 ------------------------------ */
 function dispLoading(msg){
    // 引数なし（メッセージなし）を許容
    if( msg == undefined ){
      msg = "";
    }
    // 画面表示メッセージ
    var dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
    // ローディング画像が表示されていない場合のみ出力
    if($("#loading").length == 0){
      $("body").append("<div id='loading'>" + dispMsg + "</div>");
    }
  }
   
  /* ------------------------------
   Loading イメージ削除関数
   ------------------------------ */
  function removeLoading(){
    $("#loading").remove();
  }

  /* ------------------------------
 非同期処理の組み込みイメージ
 ------------------------------ */
$(function () {
    $("#show").click( function() {
   
      // 処理前に Loading 画像を表示
      dispLoading("処理中...");
   
      // 非同期処理
      $.ajax({
        url : "https://docs.djangoproject.com/en/3.2/ref/settings/#databases",
        type:"GET",
        dataType:"json"
      })
      // 通信成功時
      .done( function(data) {
        showMsg("成功しました");
      })
      // 通信失敗時
      .fail( function(data) {
        showMsg("失敗しました");
      })
      // 処理終了時
      .always( function(data) {
        // Lading 画像を消す
        removeLoading();
      });
    });
  });