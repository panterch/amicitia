var centerLatitude = 47.369024;
var centerLongitude = 8.538033;
var startZoom = 13;
var map;
function init()
{
  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map"));
    var location = new GLatLng(centerLatitude, centerLongitude);
    map.setCenter(location, startZoom);
    map.addControl(new GLargeMapControl());

    addMarker(centerLatitude, centerLongitude, 'hi maa');
  }
}



function addMarker(latitude, longitude, description) {
  var marker = new GMarker(new GLatLng(latitude, longitude));
  GEvent.addListener(marker, 'click',
    function() {
      marker.openInfoWindowHtml(description);
    }
  );
  map.addOverlay(marker);
}


window.onload = init;
window.onunload = GUnload;
