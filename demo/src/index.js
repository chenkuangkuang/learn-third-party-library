import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";

import "./index.css";
import FullPage from "./FullPage/index";
import Cropper from "./Cropper/index";

import "./index.css";

class Demo extends React.Component {
  render() {
    return (
      <div>
        <h1 className="title">React Page Scroller Demo</h1>
        <div className="links">
          <div className="link">
            <Link to="/fullpage">Full page demo</Link>
          </div>
          <div className="link">
            <Link to="/cropper">React cropper demo</Link>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router basename="/demos">
    <div>
      <Switch>
        <Route exact path="/" component={Demo} />
        <Route path="/fullpage" component={FullPage} />
        <Route path="/cropper" component={Cropper} />
      </Switch>
    </div>
  </Router>,
  document.getElementById("root"),
);
