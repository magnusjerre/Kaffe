function initMap() {
  // Create a map object and specify the DOM element for display.
  console.log("hello");
  var styleArray = [
    {
      featureType : "all",
      stylers : [
        { hue : "#C2B280"}
      ]
    }
  ];
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.66, lng: 46.76},
    scrollwheel: false,
    zoom : 3,
    maxZoom : 4,
    minZoom : 1, 
    zoomControl : true,
    disableDefaultUI : true,
    disableDoubleClickZoom : true,
    keyboardShortcuts : false,
    rotateControl : false,
    styles : styleArray
  });
  
  var markers = [];
  getMarkers(function(data){
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      markers.push(new google.maps.Marker({
        map : map,
        position : d.position,
        title : d.land
      }));
    }
  });
}

function getMarkers(callback) {
  $.ajax({
    url : '/kaffeKartJson',
    dataType : 'json',
    cache : false   
  }).done(function(data){
    callback(data);
  });
}