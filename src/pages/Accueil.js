import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';


const Accueil = () => {
    const location = useLocation();
    const { message, error } = location.state || {};
    const [discussions, setDiscussions] = useState([]);

    const heuresDepuisDate = (dateDebut => {
        // Convertir la date donnée en millisecondes
        var debut = new Date(dateDebut).getTime();

        // Obtenir la date et l'heure actuelles en millisecondes
        var maintenant = new Date().getTime();

        // Calculer la différence entre les deux dates en millisecondes
        var difference = maintenant - debut;

        // Convertir la différence en heures
        var heures = difference / (1000 * 60 * 60);

        // Arrondir le nombre d'heures à l'unité la plus proche
        heures = Math.round(heures);

        // Si le nombre d'heures est supérieur à 24, convertir en jours et arrondir
        if (heures < 1) {
            return "maintenant";
        } 
        else if (heures > 23) {
            var jours = Math.round(heures / 24);
            return "-" + jours + " j";
        }
        else {
            return "-" + heures + " h";
        }
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await fetch('https://skycomms-api.onrender.com/discussion/discussions');
                const discussionsData = await response.json();
                const discussionsWithUserData = await Promise.all(
                    discussionsData.map(async (discussion) => {
                        const userData = await getUsers(discussion.userAuthor);
                        return { ...discussion, userData };
                    })
                );

                //pour ne pas refaire la requête si la page a déjà été charger 
                //(e.i on est sur une autre page et on retourne sur accueil )
                if (isMounted) {
                    setDiscussions(discussionsWithUserData);
                }
            } catch (error) {
                console.error('erreur récupération des disscussions:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const getUsers = async (id) => {
        try {
            const response = await fetch(`https://skycomms-api.onrender.com/user/profile/${id}`);
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('erreur récupération du profile:', error);
            return null;
        }
    };

    return (
        <div className='max-width'>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Fil d'actualité</h2>
            <div>
                {discussions.filter(discussion => !discussion.isDeleted)
                    .map((discussion) => (
                        <div key={discussion._id} className="discussion-container">
                            <p className='discussion-auteur'>{discussion.userData && discussion.userData.username} <strong>•</strong> {heuresDepuisDate(discussion.createdAt)}</p>
                            <Link to={`/discussion/${discussion._id}`} className="discussion-bouton">
                                <button>Consulter</button>
                            </Link>
                            <h3 className='discussion-titre'>{discussion.title}</h3>
                            <div><span>{discussion.category}</span></div>
                            <p className='discussion-description'>{(discussion.text).substr(0, 500) + "..."}</p>
                            <img src={`https://skycomms-api.onrender.com/${discussion.image}`} alt={discussion.title} className="discussion-image" />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Accueil;