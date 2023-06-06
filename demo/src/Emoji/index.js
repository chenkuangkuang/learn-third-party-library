import React from "react";
import allEmoji from "./emojis.json";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import "./index.css";

// export const Categories = {
//   SMILEYS_PEOPLE = 'smileys_people',
//   ANIMALS_NATURE = 'animals_nature',
//   FOOD_DRINK = 'food_drink',
//   TRAVEL_PLACES = 'travel_places',
//   ACTIVITIES = 'activities',
//   OBJECTS = 'objects',
//   SYMBOLS = 'symbols',
//   FLAGS = 'flags'
// }

const Categories = [
  'smileys_people',
  'animals_nature',
  'food_drink',
  'travel_places',
  'activities',
  'objects',
  'symbols',
  'flags'
];

let emojiList = [], index = 1;

Object.keys(allEmoji).map((i, categoryIndex) => {
  var arr = allEmoji[i].map(j => ({ ...j, category: i, groupKey: categoryIndex, index: index++ }));
  // console.log(arr);
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
  console.log('nextItems=0', nextItems);
  return nextItems;
}

function setCategoryItems(category) {
  const nextItems = [];
  console.log('emojiList=', emojiList);
  var firstMatch = emojiList.find((i, index) => i.category === category);
  console.log('firstMatch=', firstMatch);
  for (let i = 0; i < firstMatch.index + 160; ++i) {
    nextItems.push({
      groupKey: i,
      // groupKey: Math.round(i / 80) + 1,
      key: emojiList[i].index,
      j: emojiList[i]
    });
  }
  console.log('nextItems=', nextItems);
  return nextItems;
}


// const Item = ({ j }) => <img src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${j.u}.png`} />;

const handleClick = (item) => {
  console.log('item=', item);
  if (!item.u) return;
  if ((/\-/g.test(item.u))) {
    const strArr = item.u.split("-").filter(i => i).map(i => "0x" + i);
    console.log('667=', String.fromCodePoint(...strArr));
  } else {
    console.log('66=', String.fromCodePoint("0x" + item.u));
  }
}

const Item = ({ j }) => {
  return j ? <button className="item" onClick={() => handleClick(j)}>
    <img src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${j.u}.png`} />
  </button> : null
};


const Index = () => {

  const [activeCategory, setActiveCategory] = React.useState();

  const domRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const [items, setItems] = React.useState(() => getItems(0, 10));

  const scrollCategoryIntoView = (category) => {
    console.log('domRef.current=', domRef.current, containerRef.current);
    console.log('666=', domRef.current.getVisibleItems(), domRef.current.getEndCursor());
    // domRef.current._wrapperRef.current.scrollTo(100, 100);

    // return;
    // console.log('category: ' + category);
    const newItems = setCategoryItems(category);
    // console.log('newItems=', newItems);
    // setItems(newItems);
    setActiveCategory(category);
    setTimeout(() => {
      domRef.current.setCursors(1, 2, false);
      domRef.current.renderItems();
    //   var firstMatch = emojiList.find((i, index) => i.category === category);
    //   const targetHeight = firstMatch.index / 8 * 40;
    //   console.log('targetHeight=', firstMatch, targetHeight, emojiList);
    //   containerRef.current && containerRef.current.scrollTo({
    //     top: targetHeight,
    //     left: 0,
    //     behavior: 'smooth'
    //   });
    }, 100);
  }

  console.log('items=', items);

  return <>
    {Categories.map(i => {
      return <button
        // className={clsx('epr-cat-btn', `epr-icn-${i}`, {
        //   [ClassNames.active]: category === activeCategory
        // })}"
        className={"category-btn " + ("epr-icn-" + i) + " " + (i == activeCategory ? "active-category" : "")}
        key={i}
        onClick={() => {
          setActiveCategory(i);
          scrollCategoryIntoView(i);
        }}
      />
    })}
    <div className="emoji-container" id="emoji-container" ref={containerRef}>
      <MasonryInfiniteGrid
        className="container"
        id="container"
        // getWrapperElement={() => document.querySelector("body")}
        // wrapperElement={document.querySelector("#emoji-container")}
        scrollContainer={"#emoji-container"}
        // containerElement={document.querySelector("#emoji-container")}
        gap={5}
        ref={domRef}
        isConstantSize={true}
        requestPrepend={(e) => {
          console.log("e=requestPrepend", e);
          const lastGroupKey = (+e.groupKey || 0) - 1;
          setItems([
            ...items,
            ...getItems(lastGroupKey, 80),
          ]);
        }}
        onRequestAppend={(e) => {
          console.log("e", e);
          const nextGroupKey = (+e.groupKey || 0) + 1;
          setItems([
            ...items,
            ...getItems(nextGroupKey, 80),
          ]);
        }}
      >
        {items.map((item) => <Item data-grid-groupkey={item.groupKey} key={item.key} num={item.key} j={item.j} />)}
      </MasonryInfiniteGrid>;
    </div>
  </>
}

export default Index;