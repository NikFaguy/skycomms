import { UserContext } from "../context/userContext.js";
import { useContext } from "react";

export const useUserContext = ()=>{
    const context = useContext(UserContext)


if(!context){
    throw Error('No context found')
}
return context
}