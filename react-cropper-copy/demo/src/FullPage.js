import React, { useState, useEffect, useRef } from "react";

import "./index.css";

const FullPage = () => {
  const [isDropping, setIsDropping] = useState(false);
  const [offset, setOffset] = useState({ left: 0, top: 0 });
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const boxRef = useRef(null);

  const start = (e) => {
    console.log('start=e=', e, boxRef.current);
    setOffset({
      left: e.nativeEvent.offsetX,
      top: e.nativeEvent.offsetY
    })
    setIsDropping(true);
  }
  const move = (e) => {
    if (isDropping) {
      let targetPos = {
        left: e.clientX - offset.left,
        top: e.clientY - offset.top,
      }
      // 判断边界，如果targetLeft >= outer.width - inner.width, 或者 targetTop >= outer.height - inner.width 则return(应为强制为最大值，否则在left=400时无法往下移动)
      if (targetPos.left >= 400) {
        targetPos.left = 400;
      }
      if (targetPos.top >= 400) {
        targetPos.top = 400;
      }
      if (targetPos.left <= 0) {
        targetPos.left = 0;
      }
      if (targetPos.top <= 0) {
        targetPos.top = 0;
      }
      console.log('move=e=', e, offset);
      // e.clientX 需要减去 鼠标按下时相对方块左上角的偏移量
      setPos(targetPos)
    }
  }
  const end = (e) => {
    console.log('end=e=', e);
    setIsDropping(false);
  }

  useEffect(() => {

    document.addEventListener("mouseup", end);
    document.addEventListener("mousemove", move);

    return () => {
      document.removeEventListener("mouseup", end);
      document.removeEventListener("mousemove", move);
    }
  }, [isDropping])


  return (
    <div className={"outer"}>
      <div className="inner" ref={re => boxRef.current = re} style={{ position: 'absolute', left: pos.left, top: pos.top }} onMouseDown={start} ></div>
    </div>
  );
}

export default FullPage;
