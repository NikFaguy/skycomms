import { useState } from "react";
import { useUserContext } from "./useUserContext";

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useUserContext();


  const signup = async (username, email, password, confirmPassword) => {
    setIsLoading(true)
    setError(null)

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError('Veuillez entrer un courriel valide.');
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
    }

    try {
      const user = { username, email, password }

      const response = await fetch('http://localhost:5000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json()
      if (response.ok) {

        //save user
        localStorage.setItem('user', JSON.stringify(data))
        //update auth context
        dispatch({ type: 'LOGIN', payload: data })

        setIsLoading(false)

      } else {
        setError(data.error)
        setIsLoading(false)
      }
    } catch (error) {
      setError('Erreur durant l\'enregistrement : ', error);
    }
  };

  return { signup, isLoading, error }
}