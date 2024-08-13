import React, {createContext, useEffect, useReducer} from "react";
import Reducer from './Reducer'


const initialState = {
    base: "https://f8cb93f68692.ngrok.io",
    query: "",
    pages: {}
};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;