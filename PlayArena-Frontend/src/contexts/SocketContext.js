import {createContext,useContext} from 'react';

const socketContext = createContext();

export function useSocketContext() {
    return useContext(socketContext);
}

export default socketContext;
