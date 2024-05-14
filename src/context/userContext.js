import {createContext,useReducer,useEffect} from 'react'

export const UserContext = createContext()

export const userReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN':
            return {user: action.payload}

        case 'LOGOUT':
            return {user: null}

        default:
            return state
    }
}

export const UserContextProvider = ( {children} ) => {
    const [state, dispatch] = useReducer(userReducer, {user : null})

    //Si l'utilisateur est déjà connecté, on lui restaure sa session
    useEffect(() =>{
        try {
            
     
        const user= JSON.parse(localStorage.getItem('user'))
        const token= user.token
        if(!token){
            dispatch({type:'LOGOUT'})
        }
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        const expirationTime = payload.exp * 1000; 
        if(Date.now() >= expirationTime){
               //remove user from local storage
               localStorage.removeItem('user')

               //dispatch action
               dispatch({type : 'LOGOUT'})
        }
   
        if (user){
            dispatch({type: 'LOGIN', payload:user})
        }
    } catch (error) {
            console.log(error)
    }

    }, [])

    return(
        <UserContext.Provider value = {{...state, dispatch}}> 
            {children}
        </UserContext.Provider>
    )
}