var centerLatitude = 47.369024;
var centerLongitude = 8.538033;
var startZoom = 13;
var map;
var markers = new Hash();

function loadMap()
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
          var latlng = new GLatLng(parseFloat(lat),parseFloat(lng));
          addMarker(cur.marker.id, latlng);
          });
        GEvent.trigger(map, 'markersLoaded');
      }
    });

  }
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
  markers[id].openInfoWindowHtml('loading...');
  new Ajax.Request('/markers/'+id, { method: 'GET' });
}

function loadAccordion() {
  operation_acc = new accordion('operation');
  operation_acc.activate($$('#operation .accordion_toggle')[0]);
}

window.onunload = GUnload;

Event.observe(window, 'load', function() {
  loadMap();
  loadAccordion();
});
