import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import * as Events from "./Events";
import { isNil, isNull, isPositiveNumber } from "./utils";
import usePrevious from "./usePrevValue";
import { SectionContainer } from "./SectionContainer";

if (!global._babelPolyfill) {
  require("babel-polyfill");
}

const DEFAULT_ANIMATION_TIMER = 1000;
const DEFAULT_ANIMATION = "ease-in-out";
const DEFAULT_CONTAINER_HEIGHT = "100vh";
const DEFAULT_CONTAINER_WIDTH = "100vw";
const DEFAULT_COMPONENT_INDEX = 0;
const DEFAULT_COMPONENTS_TO_RENDER_LENGTH = 0;

const DEFAULT_ANIMATION_TIMER_BUFFER = 200;
const KEY_UP = 38;
const KEY_DOWN = 40;
const MINIMAL_DELTA_Y_DIFFERENCE = 1;
const DISABLED_CLASS_NAME = "rps-scroll--disabled";

let previousTouchMove = null;
let isScrolling = false;
let isBodyScrollEnabled = true;
let isTransitionAfterComponentsToRenderChanged = false;

export const ReactPageScroller = ({
  children
}) => {

  const [current, setCurrent] = useState(0);

  // 第1步：计算子组件数量 给每个子组件包裹一个full page的div
  // 第2步：监听鼠标滚动事件，设置transform

  const curY = useRef(0);
  const currentRef = useRef(0);
  const timerRef = useRef(true);
  const containerRef = useRef();

  // 应该有一个节流 
  const scrollfunc = (e) => {
    if (timerRef.current == false) {
      return;
    }
    // console.log('=e=', e);
    // 根据当前显示的是第几个，计算应该设置的transLateY值

    // page1: 0, page2: -100%, page3: -200%, page4: -300%
    // 往下滚
    console.log('=children.length=', children.length);
    if (e.deltaY > 0) {
      if (currentRef.current == children.length - 1) {
        return;
      }
      curY.current = -((currentRef.current + 1) *100);
      console.log('往下', currentRef.current, curY.current);
      containerRef.current.style.transform = `translateY(${curY.current}%)`;
      currentRef.current += 1;
    }
    // 往上滚
    else if (e.deltaY < 0) {
      if (currentRef.current == 0) {
        return;
      }
      curY.current = -((currentRef.current - 1) *100);
      // 2应该是 -100%
      console.log('往上', currentRef.current, curY.current);
      containerRef.current.style.transform = `translateY(${curY.current}%)`;
      currentRef.current -= 1;
    }
    timerRef.current = false;
    console.log('结果', currentRef.current);
    setTimeout(() => {
      timerRef.current = true;
    }, 1000);
  }

  useEffect(() => {


    console.log('=containerRef=', containerRef.current);


    document.onmousewheel = scrollfunc;


    return () => {

    }
  }, [containerRef])

  console.log('=current=', current);


  return (
    <div className={"222"} style={{ height: "100vh", transition: `transform ${1000}ms ${"ease"}`,}} ref={(re) => containerRef.current = re}>{children.map((i, index) => {
      return <div style={{
        height: "100%",
      }} key={index}>{i}</div>
    })}</div>
  );
};

ReactPageScroller.propTypes = {
  animationTimer: PropTypes.number,
  animationTimerBuffer: PropTypes.number,
  blockScrollDown: PropTypes.bool,
  blockScrollUp: PropTypes.bool,
  children: PropTypes.any,
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  containerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  customPageNumber: PropTypes.number,
  handleScrollUnavailable: PropTypes.func,
  onBeforePageScroll: PropTypes.func,
  pageOnChange: PropTypes.func,
  renderAllPagesOnFirstRender: PropTypes.bool,
  transitionTimingFunction: PropTypes.string,
};

ReactPageScroller.defaultProps = {
  animationTimer: DEFAULT_ANIMATION_TIMER,
  animationTimerBuffer: DEFAULT_ANIMATION_TIMER_BUFFER,
  transitionTimingFunction: DEFAULT_ANIMATION,
  containerHeight: DEFAULT_CONTAINER_HEIGHT,
  containerWidth: DEFAULT_CONTAINER_WIDTH,
  blockScrollUp: false,
  blockScrollDown: false,
};
