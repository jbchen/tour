window.locations = {
  'LaGuardian': [40.7769, -73.8740],
  'Yale': [41.3163, -72.9223],
  'Princeton': [40.344, -74.6514],
  'Brown': [41.8268, -71.4025],
  'RISD': [41.8261, -71.4075]
};

const MAP_CENTER = {lat: 40.8, lng: -73};
const MAP_ZOOM = 8;

function makeControl(controlDiv, map, title, label, callback) {

  // Set CSS for the control border.
  let controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = title;
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  let controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = label;
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', () => callback());
}

function createMap() {
  window.directionsService = new google.maps.DirectionsService;
  window.directionsDisplay = new google.maps.DirectionsRenderer;
  window.trafficLayer = new google.maps.TrafficLayer();

  window.map = new google.maps.Map(document.getElementById('mapid'), {
    zoom: MAP_ZOOM,
    center: MAP_CENTER
    //gestureHandling: 'cooperative'
  });
  window.directionsDisplay.setMap(window.map);
  window.trafficLayer.setMap(window.map)

  const centerControlDiv = document.createElement('div');
  const centerControl = makeControl(
    centerControlDiv,
    window.map,
    'Click to recenter the map',
    'Center Map',
    () => {
      map.setZoom(MAP_ZOOM);
      map.setCenter(MAP_CENTER);
    }
    );
  centerControlDiv.index = 1;
  window.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

  const searchControlDiv = document.createElement('div');
  const searchControl = makeControl(
    searchControlDiv,
    window.map,
    'Click to search',
    'Search',
    () => onClickFly()
  );
  searchControlDiv.index = 1;
  window.map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchControlDiv);
}

function onClickFly() {
    let html =
        '<div class="modal fade" id="fly-to" tabindex="-1" role="dialog">'
        + '<div class="modal-dialog" role="document">'
        +   '<div class="modal-content">'
        +       '<div class="modal-body">'
        +           '<form onsubmit="flyTo(); return false;">'
        +               '<label>name: </label>'
        +               '<input type="text" id="location" data-provide="typeahead"/>'
        +           '</form>'
        +       '</div>'
        +   '</div>'
        +   '</div>'
        + '</div>';

    $('body').append(html);

    flyTo.name2location = new Map();
    const names = Object.keys(window.locations);
    Object.entries(window.locations).forEach(
      l => flyTo.name2location.set(l[0], l[1])
    )

    $('#location').typeahead({source: names});
    $('#fly-to').modal();
    $('#fly-to').on('shown.bs.modal', function () {
        $('#location').focus();
    });
}

function flyTo() {
    let ll = null;
    try {
        $('#fly-to').modal('hide');
        let target = $('#location').val();
        if (flyTo.name2location.has(target)) {
            target = flyTo.name2location.get(target);
            ll = {lat: target[0], lng: target[1]}
        } else {
            alert('Location not found: ' + target);
            return;
        }
        //message('going to ' + target, 2000)
        window.map.setZoom(15);
        window.map.setCenter(ll);
    } catch (err) {
        console.log(err);
    }
};

function message(msg, timeout) {
    let save = toastr.options.positionClass;
    toastr.options.positionClass = 'toast-bottom-full-width';
    toastr.info(msg, {timeout: timeout});
    toastr.options.positionClass = save;
}

function showJourney() {
  const trip = {
    origin: 'Queens, NY',
    destination: 'Providence, RI',
    waypoints: [
      {location: 'Princeton, NJ', stopover: true},
      {location: 'New Haven, CT', stopover: true}
    ],
    travelMode: 'DRIVING'
  };

  window.directionsService.route(trip, (result, status) => {
    if (status === 'OK') {
      //console.log(result)
      window.directionsDisplay.setDirections(result)
    }
  })
}

function showDestinations() {
  Object.keys(window.locations).forEach( u => {
    if (u in CONTENTS) {
      const info = new google.maps.InfoWindow({
        content: CONTENTS[u],
        maxWidth: 800
      });
      const marker = new google.maps.Marker({
        position: {
          lat: window.locations[u][0],
          lng: window.locations[u][1]
        },
        map: window.map,
        title: u,
        label: u
      });
      marker.addListener('click', () => info.open(window.map, marker))
    }
  })
}

const CONTENTS = {
  'Yale': `<div id="yale"> 
    <h6>Yale</h6> 
    <b>Light and truth</b>
    <br>
    <br>
    <p><b>Established: October 9, 1701</b>  Students: 12,312 </p>
    <p>Notable graduates: <b>Hillary Clinton, George Bush, Meryl Streep, Jodie Foster, Bill Clinton</b></p>
    <a href="https://admissions.yale.edu/visit-campus" target="_blank">visit</a>
    </div>`,

  'Princeton': `<div id="princeton">
    <h6>Princeton</h6>
    <b>Under God's Power She Flourishes</b>
    <br>
    <br>
    <p><b>Established: 1746</b>  Students: 8,181 </p>
    <p>Notable graduates: <b>John F. Kennedy, Michelle Obama, Ralph Nader, Jeff Bezos</b></p>
    <a href="https://www.princeton.edu/meet-princeton/visit-us" target="_blank">visit</a>
    </div>`,

  'Brown': `<div id="brown">
    <h6>Brown</h6>
    <b>In God We Hope</b>
    <br>
    <br>
    <p><b>Established: 1764</b>  Students: 9,380</p>
    <p>Notable graduates: <b>Emma Watson, Ted Turner, Janet Yellen, </b></p>
    <a href="https://www.brown.edu/admission/undergraduate/visit" target="_blank">visit</a>
    </div>`,

  'RISD': `<div id="RISD"> 
    <h6>Rhode Island School of Design</h6>
    <br>
    <p><b>Established: 1877</b>  Students: 2,282</p>
    <a href="https://www.risd.edu/admissions/first-year/visit-risd" target="_blank">visit</a>
    </div>`,
}

