import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";

import "./index.css";
import FullPage from "./FullPage/index";
import Cropper from "./Cropper/index";
import Routerr from "./Routerr/index";
import Redux from "./Redux/index";
import Emoji from "./Emoji/index";

import "./index.css";

class Demo extends React.Component {

  componentDidMount() {
    function doTask() {
      try {
        console.log('1 in try block');
        throw '2 test error';
        return 3;
      } catch (e) {
        console.log('4 in catch block');
        console.log(e);
        return 5;
      } finally {
        console.log('6 in finally block');
        return 7;
      }
    }
    // 控制台输出的结果是什么呢？
    console.log(doTask());
    /* 
    1 in try block
    4 in catch block
    2 test error
    6 in finally block
    */
  }

  render() {
    return (
      <div>
        <h1 className="title">React third party library Demo</h1>
        <div className="links">
          <div className="link">
            <Link to="/fullpage">Full page demo</Link>
          </div>
          <div className="link">
            <Link to="/cropper">React cropper demo</Link>
          </div>
          <div className="link">
            <Link to="/router">React router demo</Link>
          </div>
          <div className="link">
            <Link to="/redux">React redux demo</Link>
          </div>
          <div className="link">
            <Link to="/emoji">React emoji</Link>
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
        <Route path="/router" component={Routerr} />
        <Route path="/redux" component={Redux} />
        <Route path="/emoji" component={Emoji} />
      </Switch>
    </div>
  </Router>,
  document.getElementById("root"),
);
