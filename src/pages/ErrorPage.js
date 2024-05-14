import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ errorType }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

 
  let errorMessage = 'erreur';
  if (errorType === '404') {
    errorMessage = '404: cette page n\'existe pas.';
    
  }else if(errorType ==='403' ){
    errorMessage = '403: authorization requise';
  } 
  else {
    errorMessage = '500: erreur interne.';
  } 

  return (
    <div className="error-container">
      <h2 className="error-heading">Oops! une erreur est survenue.</h2>
      <h3 className="error-heading">{errorMessage}</h3>

      <button  onClick={handleGoBack}>
        retour
      </button>
    </div>
  );
};

export default ErrorPage;
