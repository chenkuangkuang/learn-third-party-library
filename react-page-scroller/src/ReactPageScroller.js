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
  animationTimer,
  animationTimerBuffer,
  blockScrollDown,
  blockScrollUp,
  children,
  containerHeight,
  containerWidth,
  customPageNumber,
  handleScrollUnavailable,
  onBeforePageScroll,
  pageOnChange,
  renderAllPagesOnFirstRender,
  transitionTimingFunction,
}) => {
  const [componentIndex, setComponentIndex] = useState(DEFAULT_COMPONENT_INDEX);
  const [componentsToRenderLength, setComponentsToRenderLength] = useState(
    DEFAULT_COMPONENTS_TO_RENDER_LENGTH,
  );
  const prevComponentIndex = usePrevious(componentIndex);
  const scrollContainer = useRef(null);
  const pageContainer = useRef(null);
  const lastScrolledElement = useRef(null);
  const isMountedRef = useRef(false);
  const containersRef = useRef([]);
  children = useMemo(() => React.Children.toArray(children), [children]);

  // 缓存每个组件对应的高度（或位置）
  const positions = useMemo(
    () =>
      children.reduce(
        (_positions, _children) => {
          const lastElement = _positions.slice(-1);
          const height = _children.props.height
            ? parseInt(_children.props.height)
            : 100;
          return _positions.concat([lastElement - height]);
        },
        [0],
      ),
    [children],
  );

  // 执行滚动页面
  const scrollPage = useCallback(
    nextComponentIndex => {
      if (onBeforePageScroll) {
        onBeforePageScroll(nextComponentIndex);
      }
      // 页面容器transform修改偏移：往下滚动一个页面，就是translateY -100%
      // 从positions里面读取每个组件的高度数据
      pageContainer.current.style.transform = `translate3d(0, ${positions[nextComponentIndex]}%, 0)`;
    },
    [onBeforePageScroll, positions],
  );

  // 添加余下的组件？
  const addNextComponent = useCallback(
    (componentsToRenderOnMountLength = 0) => {
      let tempComponentsToRenderLength = Math.max(
        componentsToRenderOnMountLength,
        componentsToRenderLength,
      );

      if (tempComponentsToRenderLength <= componentIndex + 1) {
        if (!isNil(children[componentIndex + 1])) {
          tempComponentsToRenderLength++;
        }
      }

      setComponentsToRenderLength(tempComponentsToRenderLength);
    },
    [children, componentIndex, componentsToRenderLength],
  );

  const checkRenderOnMount = useCallback(() => {
    // 如果设置了在第一次渲染组件时渲染所有页面
    if (renderAllPagesOnFirstRender) {
      // 定义组件数量
      setComponentsToRenderLength(React.Children.count(children));
    }
    // 默认情况：如果不需要在第一次渲染就渲染所有页面
    // 并且children有至少两个
    else if (!isNil(children[DEFAULT_COMPONENT_INDEX + 1])) {
      // 把高度小于两百的组件高度值数组取出，并得其长度
      const componentsToRenderAdditionally = positions.filter(
        position => Math.abs(position) < 200,
      ).length;

      // 把符合要求的组件高度值作为参数传入 addNextComponent
      addNextComponent(
        DEFAULT_COMPONENTS_TO_RENDER_LENGTH + componentsToRenderAdditionally,
      );
    }
  }, [addNextComponent, children, positions, renderAllPagesOnFirstRender]);

  const disableScroll = useCallback(() => {
    if (isBodyScrollEnabled) {
      isBodyScrollEnabled = false;
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
      document.body.classList.add(DISABLED_CLASS_NAME);
      document.documentElement.classList.add(DISABLED_CLASS_NAME);
    }
  }, []);

  const enableDocumentScroll = useCallback(() => {
    if (!isBodyScrollEnabled) {
      isBodyScrollEnabled = true;
      document.body.classList.remove(DISABLED_CLASS_NAME);
      document.documentElement.classList.remove(DISABLED_CLASS_NAME);
    }
  }, []);

  const setRenderComponents = useCallback(() => {
    const newComponentsToRender = [];

    let i = 0;

    while (i < componentsToRenderLength && !isNil(children[i])) {
      containersRef.current[i] = true;
      // children[i].type.name 都是 SectionContainer
      // 当 i = 2 时，SectionContainer.name = SectionContainer
      console.log('=children[i].type.name=', i, children[i].type.name, SectionContainer.name, children[i]);
      if (children[i].type.name === SectionContainer.name) {
        newComponentsToRender.push(
          <React.Fragment key={i}>{children[i]}</React.Fragment>,
        );
      } else {
        newComponentsToRender.push(
          <SectionContainer key={i}>{children[i]}</SectionContainer>,
        );
      }
      i++;
    }

    return newComponentsToRender;
  }, [children, componentsToRenderLength]);

  // 往下滚动
  const scrollWindowDown = useCallback(() => {
    if (!isScrolling && !blockScrollDown) {
      if (!isNil(containersRef.current[componentIndex + 1])) {
        // 暂时禁止滚动
        disableScroll();
        isScrolling = true;
        scrollPage(componentIndex + 1);

        setTimeout(() => {
          if (isMountedRef.current) {
            setComponentIndex(prevState => prevState + 1);
          }
        }, animationTimer + animationTimerBuffer);
      } else {
        // 解除禁止滚动
        enableDocumentScroll();
        if (handleScrollUnavailable) {
          handleScrollUnavailable();
        }
      }
    }
  }, [
    animationTimer,
    animationTimerBuffer,
    blockScrollDown,
    componentIndex,
    disableScroll,
    enableDocumentScroll,
    handleScrollUnavailable,
    scrollPage,
  ]);

  const scrollWindowUp = useCallback(() => {
    if (!isScrolling && !blockScrollUp) {
      if (!isNil(containersRef.current[componentIndex - 1])) {
        disableScroll();
        isScrolling = true;
        scrollPage(componentIndex - 1);

        setTimeout(() => {
          if (isMountedRef.current) {
            setComponentIndex(prevState => prevState - 1);
          }
        }, animationTimer + animationTimerBuffer);
      } else {
        enableDocumentScroll();
        if (handleScrollUnavailable) {
          handleScrollUnavailable();
        }
      }
    }
  }, [
    animationTimer,
    animationTimerBuffer,
    blockScrollUp,
    componentIndex,
    disableScroll,
    enableDocumentScroll,
    handleScrollUnavailable,
    scrollPage,
  ]);

  const touchMove = useCallback(
    event => {
      console.log('=event=', event);
      if (!isNull(previousTouchMove)) {
        if (event.touches[0].clientY > previousTouchMove) {
          scrollWindowUp();
        } else {
          scrollWindowDown();
        }
      } else {
        previousTouchMove = event.touches[0].clientY;
      }
    },
    [scrollWindowDown, scrollWindowUp],
  );

  // 鼠标滚轮事件
  const wheelScroll = useCallback(
    event => {
      console.log('=event=wheelScroll', event);
      // event.deltaY : 滚轮的纵向滚动量
      // 滚动量 大于1 
      // Math.abs 返回 绝对值
      if (Math.abs(event.deltaY) > MINIMAL_DELTA_Y_DIFFERENCE) {
        // 如果是正数
        if (isPositiveNumber(event.deltaY)) {
          lastScrolledElement.current = event.target;
          // 执行往下滚动
          scrollWindowDown();
        } else {
          lastScrolledElement.current = event.target;
          // 执行往上滚动
          scrollWindowUp();
        }
      }
    },
    [scrollWindowDown, scrollWindowUp],
  );

  const keyPress = useCallback(
    event => {
      if (event.keyCode === KEY_UP) {
        scrollWindowUp();
      }
      if (event.keyCode === KEY_DOWN) {
        scrollWindowDown();
      }
    },
    [scrollWindowDown, scrollWindowUp],
  );
  // 初始化1：绑定鼠标滚轮事件等
  useEffect(() => {
    const instance = scrollContainer.current;
    instance.addEventListener(Events.TOUCHMOVE, touchMove);
    instance.addEventListener(Events.KEYDOWN, keyPress);
    return () => {
      instance.removeEventListener(Events.TOUCHMOVE, touchMove);
      instance.removeEventListener(Events.KEYDOWN, keyPress);
    };
  }, [touchMove, keyPress]);

  // 初始化2：checkRenderOnMount
  useEffect(() => {
    isMountedRef.current = true;

    checkRenderOnMount();
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isScrolling = false;
    previousTouchMove = null;
    if (componentIndex > prevComponentIndex) {
      addNextComponent();
    }
  }, [addNextComponent, componentIndex, prevComponentIndex]);

  useEffect(() => {
    if (pageOnChange) {
      pageOnChange(componentIndex);
    }
  }, [pageOnChange, componentIndex]);

  useEffect(() => {
    if (!isNil(customPageNumber) && customPageNumber !== componentIndex) {
      let newComponentsToRenderLength = componentsToRenderLength;

      if (customPageNumber !== componentIndex) {
        if (!isNil(containersRef.current[customPageNumber]) && !isScrolling) {
          isScrolling = true;
          scrollPage(customPageNumber);

          if (
            isNil(containersRef.current[customPageNumber]) &&
            !isNil(children[customPageNumber])
          ) {
            newComponentsToRenderLength++;
          }

          setTimeout(() => {
            setComponentIndex(customPageNumber);
            setComponentsToRenderLength(newComponentsToRenderLength);
          }, animationTimer + animationTimerBuffer);
        } else if (!isScrolling && !isNil(children[customPageNumber])) {
          for (let i = componentsToRenderLength; i <= customPageNumber; i++) {
            newComponentsToRenderLength++;
          }

          if (!isNil(children[customPageNumber])) {
            newComponentsToRenderLength++;
          }

          isScrolling = true;
          isTransitionAfterComponentsToRenderChanged = true;
          setComponentsToRenderLength(newComponentsToRenderLength);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customPageNumber, scrollPage]);

  useEffect(() => {
    if (isTransitionAfterComponentsToRenderChanged) {
      isTransitionAfterComponentsToRenderChanged = false;

      scrollPage(customPageNumber);

      setTimeout(() => {
        setComponentIndex(customPageNumber);
      }, animationTimer + animationTimerBuffer);
    }
  }, [
    animationTimer,
    animationTimerBuffer,
    componentsToRenderLength,
    customPageNumber,
    scrollPage,
  ]);

  return (
    <div
      ref={scrollContainer}
      style={{
        height: containerHeight,
        width: containerWidth,
        overflow: "hidden",
      }}
    >
      <div
        ref={pageContainer}
        onWheel={wheelScroll}
        style={{
          height: "100%",
          width: "100%",
          transition: `transform ${animationTimer}ms ${transitionTimingFunction}`,
          outline: "none",
        }}
        tabIndex={0}
      >
        {setRenderComponents()}
      </div>
    </div>
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
