import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading, error } = useSignup();
  const [errors, setErrors] = useState({});

  const handleUsernameChanged = (event) => {
    setUsername(event.target.value);
    setErrors({ ...errors, title: '' });
  };

  const handleEmailChanged = (event) => {
    setEmail(event.target.value);
    setErrors({ ...errors, text: '' });
  }

  const handlePasswordChanged = (event) => {
    setPassword(event.target.value);
    setErrors({ ...errors, text: '' });
  }

  const handleConfirmedPasswordChanged = (event) => {
    setConfirmPassword(event.target.value);
    setErrors({ ...errors, text: '' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!username) {
      newErrors.username = "Un nom d'utilisateur est requis.";
    }

    if (!email) {
      newErrors.email = "Un courriel est requis.";
    }

    if (!password) {
      newErrors.password = "Un mot de passe est requis.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vous devez confirmer votre mot de passe.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
          onChange={handleUsernameChanged} />
        {errors.username && <p className="error">{errors.username}</p>}

        <label htmlFor="email">Courriel</label>
        <input
          type="email"
          id="email"
          onChange={handleEmailChanged}
          value={email} />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          onChange={handlePasswordChanged}
          value={password} />
        {errors.password && <p className="error">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirmer mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          onChange={handleConfirmedPasswordChanged}
          value={confirmPassword} />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit" disabled={isLoading}>S'inscrire</button>
        <p>
          Déjà un compte? <Link to="/user/login">Se connecter</Link>
        </p>

        <ul>
          {error && <li style={{ color: 'red' }} >{error}</li>}
        </ul>
      </form>

    </div>
  );
};

export default Signup;