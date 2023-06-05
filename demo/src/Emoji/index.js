import React from "react";
import allEmoji from "./emojis.json";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import "./index.css";

let emojiList = [];

Object.keys(allEmoji).map(i => {
  var arr = allEmoji[i];
  console.log(arr);
  emojiList = emojiList.concat(arr);
  return arr;
})

function getItems(nextGroupKey, count) {
  const nextItems = [];
  const nextKey = nextGroupKey * count;

  for (let i = 0; i < count; ++i) {
    nextItems.push({
      groupKey: nextGroupKey,
      key: nextKey + i,
      j: emojiList[nextKey + i]
    });
  }
  return nextItems;
}

const Item = ({ j }) => <div className="item">
  <img src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${j.u}.png`} />
</div>;

// const Item = ({ j }) => <img src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${j.u}.png`} />;

const Index = () => {

  const [items, setItems] = React.useState(() => getItems(0, 10));

  return <div>
    <MasonryInfiniteGrid
      className="container"
      gap={5}
      onRequestAppend={(e) => {
        const nextGroupKey = (+e.groupKey || 0) + 1;
        setItems([
          ...items,
          ...getItems(nextGroupKey, 10),
        ]);
      }}
    >
      {items.map((item) => <Item data-grid-groupkey={item.groupKey} key={item.key} num={item.key} j={item.j} />)}
    </MasonryInfiniteGrid>;
  </div>
}

export default Index;