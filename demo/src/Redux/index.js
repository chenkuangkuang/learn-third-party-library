import React, { useState, useEffect, useRef } from "react";
import createStore from "./redux";
import "./index.css";


function myReducer(state, action) {
  if (action.type == '+') {
    return state + 1;
  }
  else if (action.type == '-') {
    return state - 1;
  }
}

const mystore = createStore(myReducer, 0);

const Redux = () => {

  const [num, setNum] = useState(0);

  function add(){
    mystore.dispatch({type: '+'});
    setNum(num=>num+2);
  }

  function plus(){
    mystore.dispatch({type: '-'});
    setNum(num=>num-2);
  }

  useEffect(() => {

    return () => {
    }
  }, [])

  console.log('mystore=', mystore);


  return (

    <div>最新值：
      {mystore.getState()};
      {num}
      <button onClick={add}>add(+)</button>&nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={plus}>plus(-)</button>
    </div>
  );
}

export default Redux;
