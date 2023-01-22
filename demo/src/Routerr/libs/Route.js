import React, {useContext} from "react";
import Context from "./Context";

export default function(props){


    const context = useContext(Context);
    console.log('props=', props, context);
    const {path, component: Component} = props;

    // path 来源于 props， pathname来源于context
    if(path == 'home' && context.location.pathname == '/demos/router'){
        console.log('1111');
        return <Component {...props}  />
    }
    return null;
}