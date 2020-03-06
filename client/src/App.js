import React from 'react';
import {Helmet} from "react-helmet";

import './App.css';
import Home from "./pages/Home"

function App() {
  return (
    <div className="App">
      <Helmet>
          <title>Coronavirus countries</title>
      </Helmet>
	  	<Home></Home>
    </div>
  );
}

export default App;
