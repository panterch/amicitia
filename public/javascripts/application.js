var centerLatitude = 47.369024;
var centerLongitude = 8.538033;
var startZoom = 13;
var map;
var markers = new Hash();
var activeMarker = '';
var state = '';

function changeState(new_state) {
  GEvent.trigger(window, new_state);
  state = new_state;
}

function loadMap()
{
  map = new GMap2(document.getElementById("map"));
  map.enableGoogleBar();
  var location = new GLatLng(centerLatitude, centerLongitude);
  map.setCenter(location, startZoom);
  map.addControl(new GLargeMapControl());

}

function loadMarkers() {
  map.closeInfoWindow();
  GEvent.clearListeners(map, 'click');
  if (1 > markers.size()) {
    new Ajax.Request('/markers', { method: 'GET',
      onComplete: function(request){
          res=eval( "(" + request.responseText + ")" );
          res.each(function(cur) {
            var lat = cur.marker.lat;
            var lng = cur.marker.lng;
            var latlng = new GLatLng(parseFloat(lat),parseFloat(lng));
            addMarker(cur.marker.id, latlng);
            });
          changeState('markersLoaded');
        }
      });
  } else { changeState('markersLoaded'); }
}



function addMarker(id, latlng) {
  var marker = new GMarker(latlng);
  GEvent.addListener(marker, 'click',
    function() {
      activateMarker(id);
    }
  );
  map.addOverlay(marker);
  markers[id] = marker;
}

function activateMarker(id) {
  activeMarker = id;
  changeState('display');
}

function showActiveMarker() {
  if (markers[activeMarker]) {
    markers[activeMarker].openInfoWindowHtml('loading...');
    new Ajax.Request('/markers/'+activeMarker, { method: 'GET' });
  }
}

function loadAccordion() {
  operation_acc = new accordion('operation');
  operation_acc.activate($$('#operation .accordion_toggle')[0]);
}

function loadInput() {
  map.clearOverlays();
  markers = new Hash();
  GEvent.addListener(map, "click", function(overlay, latlng) {
    if (null != overlay) return;
    map.openInfoWindowHtml(latlng,'loading...');
    new Ajax.Request('/markers/new', { method: 'GET' });
  });
  map.openInfoWindowHtml(map.getCenter(), 'Just click on the map to add your entry!');
}

window.onunload = GUnload;

Event.observe(window, 'load', function() {

  GEvent.addListener(window, 'init', function() {
    loadMap();
    loadAccordion();
    changeState('display');
  });

  GEvent.addListener(window, 'display', loadMarkers);

  GEvent.addListener(window, 'input', loadInput);

  GEvent.addListener(window, 'markersLoaded', showActiveMarker);

  changeState('init');

});
