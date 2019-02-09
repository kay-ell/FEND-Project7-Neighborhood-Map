import React, { Component } from 'react';

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.updateVenues = this.updateVenues.bind(this)
    this.state = {
      query: ''
    }
  }

  updateVenues(query) {
    this.setState({ query: query});
    this.props.filterVenues(query);
  }

  render() {
    return(
      <div id="sidebar">
        <header>
          <h2>Museums in NYC</h2>
        </header>
        <label htmlFor="filter">Filter Venues</label>
        <input
          type="text"
          value={ this.state.query }
          placeholder="Type here to filter the venues"
          name="filter"
          id="filter"
          onChange={(e) => { this.updateVenues(e.target.value) }}
          />
          <ul>
            { this.props.venues.map((venueItem, index) => {
              return(
                <li
                  className="venueItem"
                  key={ venueItem.id }
                  tabIndex="0"
                  onClick={() => { this.props.clickVenueItem(venueItem) }}>{ venueItem.name }
                </li>
              )
            })}
          </ul>
      </div>
    );
  }
}

export default Sidebar;
