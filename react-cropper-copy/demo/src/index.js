import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";

import "./index.css";
import FullPage from "./FullPage";

import "./index.css";

class Demo extends React.Component {
  render() {
    return (
      <FullPage />
    );
  }
}

ReactDOM.render(
  <Router basename="/demos">
    <div>
      <Switch>
        <Route exact path="/" component={Demo} />
        <Route path="/fullpage" component={FullPage} />
      </Switch>
    </div>
  </Router>,
  document.getElementById("root"),
);
