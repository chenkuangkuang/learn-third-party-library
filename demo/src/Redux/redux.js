
// 传入 reducer， 返回 store对象
// reducer：传入state 和 action，返回新的 state
// reducer 是“纯函数”，即没有副作用，同样的输入只会得到同样的输出
// store 包含方法
/* 

1.dispatch 

2.getState

3.subscribe 订阅

*/
export default function createStore(reducer, initialState){

    let state = initialState;
    let listeners = [];

    // action = {type: xxx, payload: yyy}
    function dispatch(action){
        state = reducer(state, action);

        listeners.forEach(item=>{
            item();
        })
    }

    function getState(){
        return state;
    }

    function subscribe(callback){
        listeners.push(callback)
    }

    // 典型闭包，调用函数内部方法以修改函数内部状态
    return {
        dispatch,
        getState,
        subscribe
    };
}


