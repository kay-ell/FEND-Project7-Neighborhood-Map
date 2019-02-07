import React, { Component } from 'react';
import Map from './components/Map';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this)
  }
  componentDidMount() {
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

  initMap() {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7831, lng: -73.9712},
      zoom: 13
    })
  }
  render() {
    return (
      <Map

      />
    );
  }
}

export default App;
