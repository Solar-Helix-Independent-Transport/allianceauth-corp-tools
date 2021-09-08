import React, { Component } from "react";
import { render } from "react-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>This is App.js</h1>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
