import React, { Component } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';
import './responsive-styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
    this.loadMap = this.loadMap.bind(this)
    this.loadPlaces = this.loadPlaces.bind(this);
    this.filterVenues = this.filterVenues.bind(this);
    this.clickVenueItem = this.clickVenueItem.bind(this);
    this.state = {
      venues: [],
      filteredVenues: [],
      markers: [],
      query: ''
    }
  }

  componentDidMount() {
    this.loadPlaces();
  }

  // get Google Maps API
  loadMap() {
    const script = document.createElement('script');
    const API = 'AIzaSyDoLtOi_ugdG-NpBw3oKrGSVL4Xgyj0qy0';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=${API}&v=3&callback=initMap`;
    document.body.appendChild(script);
    script.onerror = function(error) {
      alert('There was an error loading the Google Map: ' + error);
    };
    window.initMap = this.initMap;
  }

  // Create map
  initMap() {

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 12
    })


    // create infowindow
    const infowindow = new window.google.maps.InfoWindow();

    // loop through the venues array and display a marker for each venue
    this.state.venues.forEach(venue => {
      // create content for each marker to display in the infowindow
      let contentString = `<div id="content"><h3>${venue.name}</h3><p>${venue.location.address}<br>${venue.location.city}, ${venue.location.state}&nbsp;${venue.location.postalCode}<br>${venue.location.country}</p><p>${`<a href="https://foursquare.com/v/${venue.id}" target="_blank">Learn More...</a>`}</p></div>`

      let marker = new window.google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: map,
        venue: venue,
        id: venue.id,
        name: venue.name,
        animation: window.google.maps.Animation.DROP
      })

      this.state.markers.push(marker);



      // listen for marker click and show animation
      marker.addListener('click', function() {
        infowindow.setContent(contentString);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        window.setTimeout(function() {
          marker.setAnimation(null);
        }, 1000);
        map.setZoom(16);
        map.panTo(marker.getPosition());
        map.setCenter(marker.getPosition());
        infowindow.open(map, marker);
      })

      // stop marker animation and close infowindow when user clicks anywhere on the map
      map.addListener('click', function() {
        marker.setAnimation(null);
        infowindow.close(map, marker);
      })


    });

    // set bounds for fit all markers
    const bounds = new window.google.maps.LatLngBounds();
    for (let i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].setMap(map);
      bounds.extend(this.state.markers[i].position);
    }
    map.fitBounds(bounds);

  }

  // get a list of places from Foursquare API with a query
  loadPlaces() {
    let near = 'New York, NY';
    let query = 'museum';
    let client_id = 'EHAVVEFJT2BWVFJGCX4FRCQHOU33ZUBU0EH3WDFITZRCPX3L';
    let client_secret = 'N5IEQ1EP12OI5PR42Y12Z0GSVGJN5BWVDFFA3W4KR1X2TUFS';
    var apiURL = `https://api.foursquare.com/v2/venues/search?client_id=${client_id}&client_secret=${client_secret}&v=20180323&near=${near}&query=${query}`;
    return fetch(apiURL)
    .then(resp => resp.json())
    .then(myJson => {
      // console.log(myJson);
      let venues = myJson.response.venues;
      // console.log(venues);
      this.setState({ venues: venues, allVenues: venues }, this.loadMap());
    })
    .catch(error => {
      window.alert('Error! ' + error)
    });
  }

  // filter the venues based on user input
  filterVenues(query) {
    if (query) {
      let v = this.state.venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
      this.state.markers.forEach(marker => {
        marker.name.toLowerCase().includes(query.toLowerCase()) === true ? marker.setVisible(true) :
        marker.setVisible(false);
      })

      this.setState({ venues: v, query: query })
    } else {
      this.setState({ venues: this.state.allVenues, query: '' });
      this.state.markers.forEach(m => {
        m.setVisible(true);
      })
    }
  }

  // open infowindow when user clicks on the venue name in list-view
  clickVenueItem(venue) {
    this.state.markers.map((marker) => {
      if (marker.id === venue.id) {
        return window.google.maps.event.trigger(marker, 'click');
      }
    })
    // console.log(venueMarker);
  }

  render() {
    return (
      <div className="App" role="main">
      <Sidebar
        venues={this.state.venues}
        filterVenues={this.filterVenues}
        clickVenueItem={this.clickVenueItem}
      />

      <Map />
      </div>
    );
  }
}

export default App;
