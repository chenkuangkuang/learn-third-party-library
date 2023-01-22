import React, {useState, useEffect} from "react";
import Context from "./Context";

export default function HashRouter(props){

    const [location, setLocation] = useState({
        pathname: window.location.hash.slice(1), // 移除最前面的#号
        state: null
    })

    const hashChange = (e)=>{
        console.log('e=', e);
        setLocation({
            ...location,
            pathname: window.location.hash.slice(1)
        })
    }

    useEffect(()=>{
        window.addEventListener("hashchange", hashChange);
        
        return ()=>{
            
            window.removeEventListener("hashchange", hashChange);
        }
    }, [])

    const value = {
        location,
        history:{
            push: (to)=>{
                if(typeof to == 'string'){
                    window.location.hash = to;
                }
            }
        }
    }

    console.log('value=', value);

    return (
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    )

}