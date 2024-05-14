import React, { useState } from 'react';
import {  useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      console.log(email)
      setError('Veuillez entrer une adresse courriel valide.');
      return;
    }

    try {
      const response = await fetch('https://skycomms-api.onrender.comsend_password_recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });

      const data = await response.json();
      if (response.ok) {
        if (data.Status === 'Success') {
          navigate('/user/login', { state: { message: 'Un courriel pour réinitialiser votre mot de passe a été envoyé, veuillez vérifier vos messages indésirables.' } });
        } else {
          setError('Échec de l\'envoi du courriel de réinitialisation du mot de passe.');
          console.log('block1',data.error)
        }
      } else {
        setError('Échec de l\'envoi du courriel de réinitialisation du mot de passe.');
        console.log('block2',data.error)
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Une erreur s\'est produite lors de l\'envoi du courriel de réinitialisation du mot de passe.');
    }
  };


  return (
    <div>
      <h2>Récupération du mot de passe</h2>
      <form className='forms' onSubmit={handleSubmit}>
        <label htmlFor="email">Adresse courriel</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Envoyer le courriel de réinitialisation</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>


    </div>
  );
};

export default ResetPassword;