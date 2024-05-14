import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';


const Search = () => {
    const location = useLocation();
    const { message, error } = location.state || {};
    const [discussions, setDiscussions] = useState([]);
    const [category, setCategory] = useState('');
    let [term, setTerm] = useState('');
    const categoriesEnum = ["Art", "Gaming", "Politique", "Science", "Sports", "Technologie", "Autre"]

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

    const handleSubmit = (event) => {
        let isMounted = true;
        event.preventDefault();
        term = event.target.elements.term.value;
        setTerm(term);

        if (!term) {
            return;
        }

        const fetchData = async () => {
            try {
                let recherche = term;

                if (category) {
                    recherche = term + '/' + category;
                }

                const response = await fetch('https://skycomms-api.onrender.comdiscussion/search/' + recherche);
                const discussionsData = await response.json();

                if (discussionsData.length === 0) {
                    setDiscussions([]);
                    return;
                }

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
    }

    const getUsers = async (id) => {
        try {
            const response = await fetch(`https://skycomms-api.onrender.comuser/profile/${id}`);
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('erreur récupération du profile:', error);
            return null;
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setTerm('');

        if (!event.target.value) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch('https://skycomms-api.onrender.comdiscussion/search/' + event.target.value);
                const discussionsData = await response.json();

                if (discussionsData.length === 0) {
                    setDiscussions([]);
                    return;
                }

                const discussionsWithUserData = await Promise.all(
                    discussionsData.map(async (discussion) => {
                        const userData = await getUsers(discussion.userAuthor);
                        return { ...discussion, userData };
                    })
                );

                setDiscussions(discussionsWithUserData);
            } catch (error) {
                console.error('erreur récupération des disscussions:', error);
            }
        };

        fetchData();
    }

    return (
        <div className='max-width'>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Recherche</h2>
            <form className='recherche-form' onSubmit={handleSubmit} noValidate>
                <input type="text" id='term' placeholder="Recherche..." />
                <button type="submit">Rechercher</button>
            </form>
            <div className='recherche-category'>
                <label htmlFor="category">Catégorie</label>
                <select id="category" value={category} onChange={handleCategoryChange}>
                    <option value="" disabled>Sélectionnez une catégorie</option>
                    <option value="">Aucune</option>
                    {categoriesEnum.map(categoryOption => (
                        <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
                    ))}
                </select>
            </div>
            {(term && !category) && discussions.length !== 0 && <h3 className='recherche-message'>Résultats pour "{term}".</h3>}
            {(term && category) && discussions.length !== 0 && <h3 className='recherche-message'>Résultats pour "{term}" dans "{category}".</h3>}
            <div>
                {discussions.filter(discussion => !discussion.isDeleted)
                    .map((discussion) => (
                        <div key={discussion._id} className="discussion-container">
                            <p className='discussion-auteur'>{discussion.userData && discussion.userData.username} <strong>•</strong> {heuresDepuisDate(discussion.createdAt)}</p>
                            <Link to={`/discussion/${discussion._id}`} className="discussion-bouton">
                                <button>Consulter</button>
                            </Link>
                            <h3 className='discussion-titre'>[{discussion.category}] {discussion.title}</h3>
                            <p className='discussion-description'>{(discussion.text).substr(0, 250) + "..."}</p>
                            <img src={require(`/images/${discussion.image}`)} alt={discussion.title} className="discussion-image" />
                        </div>
                    ))}
            </div>
            {(term && !category) && discussions.length === 0 && <h3 className='recherche-message'>Aucun résultat pour "{term}".</h3>}
            {(term && category) && discussions.length === 0 && <h3 className='recherche-message'>Aucun résultat pour "{term}" dans "{category}".</h3>}
            {(!term && category) && discussions.length === 0 && <h3 className='recherche-message'>Aucun résultat dans "{category}".</h3>}

        </div>
    );
};

export default Search;