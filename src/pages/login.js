import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const { message } = location.state || {};

  const handleUsernameChanged = (event) => {
    setUsername(event.target.value);
    setErrors({ ...errors, title: '' });
  };

  const handlePasswordChanged = (event) => {
    setPassword(event.target.value);
    setErrors({ ...errors, text: '' });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!username) {
      newErrors.username = "Votre nom d'utilisateur est requis.";
    }
    if (!password) {
      newErrors.password = "Votre mot de passe est requis.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await login(username, password);
  };

  return (
    <div>
      <h2>Se connecter</h2>
      <form className="forms" onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Nom d'utilisateur</label>
        <input type="text" id="username" value={username} onChange={handleUsernameChanged} />
        {errors.username && <p className="error">{errors.username}</p>}
        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChanged} />
        {errors.password && <p className="error">{errors.password}</p>}
        <button disabled={isLoading} className="form-btn" type="submit">
          Connexion
        </button>

        {error && <p className="error">{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <p>
          Pas de compte? <Link to="/user/signup">S'inscrire</Link>
        </p>
        <Link to="/user/resetPassword">Mot de passe oublié</Link>
      </form>
    </div>
  );
};

export default Login;