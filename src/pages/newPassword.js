import React, { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';

const NewPassword =  () => {

  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    // logique de réinitialisation du mot de passe
    try{
      const requestBody = {
        id: id,
        token: token,
        password: password
      };

      const response = await fetch(`https://skycomms-api/newPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        
      }
      
      );
      const data= await response.json()
      if (response.ok) {
        navigate('/user/login', { state: { message: 'Votre mot de passe a été modifié avec succès.' } });


      } else {
        setError(data.error)

      }
    } catch (error) {
      
      setError('Erreur durant l\'enregistrement : ', error);
    }
  };
  return (
    <div>
      <h2>Réinitialisation du mot de passe</h2>
      <form className='forms' onSubmit={handleSubmit} noValidate>

        <div>
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmez votre nouveau mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Modifier le mot de passe</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

    </div>
  );
};

export default NewPassword;