import React, { useState, useEffect, useRef } from "react";
import { HashRouter as Router, Route } from "./libs/index";
import "./index.css";
import Home from "./pages/Home";
import Help from "./pages/Help";

const Routerr = () => {
  

  useEffect(() => {


    return () => {
    }
  }, [])


  return (
    <Router>
      <Route path="home" component={Home} />
      <Route path="help" component={Help} />
    </Router>
  );
}

export default Routerr;
