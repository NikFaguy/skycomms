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

    let errors = [];

    if (!username) {
      errors.push(
        'Veuillez entrer un nom d\'utilisateur.'
      );
    }

    if (!emailPattern.test(email)) {
      errors.push(
        'Veuillez entrer une adresse courriel valide.'
      );
    }

    if (!password) {
      errors.push(
        'Veuillez entrer un mot de passe.'
      );
    }
    else if (password.length < 6) {
      errors.push(
        'Le mot de passe doit avoir au moins 6 caractères.'
      );
    }

    if (password !== confirmPassword) {
      errors.push(
        'Les mots de passe ne correspondent pas.'
      );
    }

    if (errors) {
      setError(errors);
      setIsLoading(false);
      return;
    }

    try {
      const user = { username, email, password }

      const response = await fetch('https://skycomms-api.onrender.com/user/signup', {
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
