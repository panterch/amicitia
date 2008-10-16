var centerLatitude = 47.369024;
var centerLongitude = 8.538033;
var startZoom = 13;
var map;
var markers = new Hash();
var activeMarker = '';
var state = '';
var debug = true;


function logdebug(text) {
  if (debug) { 
    $('debug').innerHTML = (new Date())+': '+text+'\n'+$('debug').innerHTML;
  }
}

function changeState(new_state) {
  if (state == new_state) {
    return;
  }
  logdebug('state change from ['+state+'] to ['+new_state+']'); 
  state = new_state;
  GEvent.trigger(window, new_state);
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
  logdebug('sending request to load markers...');
  new Ajax.Request('/markers', { method: 'GET',
    parameters: {
      'days': $('sliderValue').innerHTML
    },
    onComplete: function(request){
        clearMarkers();
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
}

function clearMarkers() {
  map.clearOverlays();
  markers = new Hash();
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
  if (state == 'markersLoaded') {
    showActiveMarker();
  } else {
    changeState('display');
  }
}

function clearActiveMarker() {
  if (markers[activeMarker]) {
    markers[activeMarker].closeInfoWindow();
  }
  activeMarker = '';
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
  clearMarkers();
  GEvent.addListener(map, "click", function(overlay, latlng) {
    if (null != overlay) return;
    map.openInfoWindowHtml(latlng,'loading...');
    new Ajax.Request('/markers/new', { method: 'GET' });
  });
  map.openInfoWindowHtml(map.getCenter(), 'Just click on the map to add your entry!');
}

function loadSlider() {
  var min = 0;
  var max = 50;
  new Control.Slider('handle', 'track', {
    range: $R(min, max),
    values: $A($R(min, max)),
    sliderValue: 5,
    onSlide: function(v){ $('sliderValue').innerHTML = v; },
    onChange: function(v) {
      clearActiveMarker();
      if ('display' == state) {
        GEvent.addListener(window, 'markersLoaded', changeState('display'));
      } else {
        changeState('display');
      }
    }
  }); 
}

window.onunload = GUnload;

Event.observe(window, 'load', function() {

  GEvent.addListener(window, 'init', function() {
    loadMap();
    loadAccordion();
    loadSlider();
    changeState('display');
  });

  GEvent.addListener(window, 'display', loadMarkers);

  GEvent.addListener(window, 'input', loadInput);

  GEvent.addListener(window, 'markersLoaded', showActiveMarker);

  changeState('init');

});
