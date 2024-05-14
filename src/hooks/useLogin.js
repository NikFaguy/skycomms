import { useState } from "react";
import { useUserContext } from "./useUserContext";

export const useLogin = () =>{
    const [error,setError]= useState(null)
    const [isLoading,setIsLoading] = useState(null)
    const {dispatch}=useUserContext();


    const login= async(username, password) =>{
        setIsLoading(true)
        setError(null)

        if(!username ){
            setError('Vous devez entrer votre nom d\'utilisateur.')
          }
          if(!password){
            setError('Vous devez entrer votre mot de passe.')
          }

        try{
            const user = { username, password }

            const response = await fetch('https://skycomms-api.onrender.com/user/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(user),
            });

            const data= await response.json()
            if (response.ok) {

              //save user
              localStorage.setItem('user', JSON.stringify(data))
              //update auth context
              dispatch({type: 'LOGIN',payload: data})

              setIsLoading(false)

            } else {
              setError(data.error)
              setIsLoading(false)
            }
          } catch (error) {
            setError('Erreur durant l\'enregistrement : ', error);
          }
        };

        return{login,isLoading,error}
    }
