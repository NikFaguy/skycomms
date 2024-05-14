import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: ajouter dans la BD

    try {
      await signup(username, email, password, confirmPassword)

    } catch (error) {
      console.error('Erreur durant l\'enregistrement : ', error);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form className="forms" onSubmit={handleSubmit} noValidate>

        <label htmlFor="username">Nom d'utilisateur</label>
        <input type="text" id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="email">Courriel</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email} />

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password} />

        <label htmlFor="confirmPassword">Confirmer mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword} />

        <button type="submit" disabled={isLoading}>S'inscrire</button>
        <p>
          Déjà un compte? <Link to="/user/login">Se connecter</Link>
        </p>

        <ul>
          {error && error.map(err => <li style={{ color: 'red' }} key={err}>{err}</li>)}
        </ul>
      </form>

    </div>
  );
};

export default Signup;