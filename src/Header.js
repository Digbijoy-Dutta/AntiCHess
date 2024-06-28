// Header.js
import React, { Component } from 'react';
import './Header.css'; // Import CSS for styling

class Header extends Component {
    constructor(props){
        super(props);

    }
  render() {
    return (
      <header className="header">
        <h1>Anti-Chess Game</h1>
        <p>TURN: {this.props.turn}</p>
      </header>
    );
  }
}

export default Header;
