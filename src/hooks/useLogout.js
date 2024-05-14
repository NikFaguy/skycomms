import { useUserContext } from '../hooks/useUserContext';

export const useLogout = () =>{

const {dispatch} = useUserContext()

    const logout = () =>{
        //remove user from local storage
        localStorage.removeItem('user')

        //dispatch action
        dispatch({type : 'LOGOUT'})

    }

    return {logout}
}