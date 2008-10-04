var centerLatitude = 47.369024;
var centerLongitude = 8.538033;
var startZoom = 13;
var map;
function init()
{
  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map"));
    map.enableGoogleBar();
    var location = new GLatLng(centerLatitude, centerLongitude);
    map.setCenter(location, startZoom);
    map.addControl(new GLargeMapControl());

    GEvent.addListener(map, "click", function(overlay, latlng) {
      if (null != overlay) return;
      map.openInfoWindowHtml(latlng,'loading...');
      new Ajax.Request('/markers/new', { method: 'GET' });
    });

    new Ajax.Request('/markers', { method: 'GET',
      onComplete: function(request){
        res=eval( "(" + request.responseText + ")" );
        res.each(function(cur) {
          var lat = cur.marker.lat;
          var lng = cur.marker.lng;
          var txt = cur.marker.title + ' ' + cur.marker.body;
          var latlng = new GLatLng(parseFloat(lat),parseFloat(lng));
          addMarker(latlng, txt);
          });
      }
    });

  }
}


function addMarker(latlng, description) {
  var marker = new GMarker(latlng);
  GEvent.addListener(marker, 'click',
    function() {
      marker.openInfoWindowHtml(description);
    }
  );
  map.addOverlay(marker);
}




window.onload = init;
window.onunload = GUnload;
