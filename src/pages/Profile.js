import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import { useLogout } from "../hooks/useLogout";


const Profile = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorUsername, setErrorUsername] = useState(null);
	const [errorEmail, setErrorEmail] = useState(null);
	const [errorPassword, setErrorPassword] = useState(null);
	const { user } = useUserContext();
	const { logout } = useLogout();
	const [discussions, setDiscussions] = useState([]);

	// Get the modal
	const modal = document.getElementById("modal");

	// When the user clicks anywhere outside of the modal, close it
	window.onClick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

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

	const showModal = () => {
		document.getElementById("modal").style.display = "block";
	}

	const closeModal = () => {
		document.getElementById("modal").style.display = "none";
	}

	window.onClick = function (event) {
		if (event.target !== modal) {
			modal.style.display = "none";
		}
	}

	const handleUsername = async (e) => {
		e.preventDefault();

		const updateProfile = { username }

		if (username === '') {
			setErrorUsername('Veuillez entrer un pseudonyme.');
			return;
		}

		if (username.length < 3) {
			setErrorUsername('Le pseudonyme doit contenir au moins 3 caractères.');
			return;
		}

		const res = await fetch('https://skycomms-api.onrender.com/user/profile/username/' + user.user._id, {
			method: 'PUT',
			body: JSON.stringify(updateProfile),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		//Parse the response
		const data = await res.json();

		if (!res.ok) {
			setErrorUsername(data.error);
		}
		if (res.ok) {
			//Clear the form
			setUsername('');

			//Clear the error
			setErrorUsername(null);

			localStorage.setItem('username', username);
			user.user.username = username;
		}
	};

	const handleEmail = async (e) => {
		e.preventDefault();

		const updateProfile = { email }

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailPattern.test(email)) {
			setErrorEmail('Veuillez entrer un courriel valide.');
			return;
		}

		const res = await fetch('https://skycomms-api.onrender.com/user/profile/email/' + user.user._id, {
			method: 'PUT',
			body: JSON.stringify(updateProfile),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		//Parse the response
		const data = await res.json();

		if (!res.ok) {
			setErrorEmail(data.error);
		}
		if (res.ok) {
			//Clear the form
			setEmail('');

			//Clear the error
			setErrorEmail(null);

			localStorage.setItem('email', email);
			user.user.email = email;
		}
	};

	const handleSupprimerCompte = async (e) => {
		e.preventDefault();

		const mdp = { password }
		console.log(mdp);

		if (password === '') {
			setErrorPassword('Veuillez entrer votre mot de passe.');
			return;
		}

		if (password !== user.user.password) {
			setErrorPassword('Mot de passe incorrect.');
			return;
		}

		const res = await fetch('https://skycomms-api.onrender.com/user/profile/' + user.user._id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		//Parse the response
		const data = await res.json();

		if (!res.ok) {
			setErrorPassword(data.error);
		}
		if (res.ok) {
			//Clear the error
			setErrorPassword(null);

			//Logout
			logout();
		}
	}

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				const response = await fetch('https://skycomms-api.onrender.com/discussion/discussions-recentes/' + user.user._id, {
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				});
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
		<section className='max-width'>
			<h2>Mon profil</h2>
			<div>
				<h3>Modifier mes informations</h3>
				<form className='profil-container' onSubmit={handleUsername} noValidate>

					<div>
						<label htmlFor="username">Pseudonyme</label>
						<p>{user.user.username}</p>
					</div>
					<input type="text" id="username" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />

					<button type="submit">Modifier</button>

					{errorUsername && <div className='error'>{errorUsername}</div>}
				</form>

				<form className='profil-container' onSubmit={handleEmail} noValidate>

					<div>
						<label htmlFor="email">Courriel</label>
						<p>{user.user.email}</p>
					</div>
					<input type="email" id="email" value={email} placeholder="exemple@mail.com" onChange={(e) => setEmail(e.target.value)} />

					<button type="submit">Modifier</button>

					{errorEmail && <div className='error'>{errorEmail}</div>}
				</form>
			</div>

			<div>
				<h3>Vue d'ensemble</h3>
				<h4>Vos publications récentes</h4>
				<div>
					{discussions.filter(discussion => !discussion.isDeleted)
						.map((discussion) => (
							<div key={discussion._id} className="discussion-container">
								<p className='discussion-auteur'>{heuresDepuisDate(discussion.createdAt)}</p>
								<Link to={`/discussion/${discussion._id}`} className="discussion-bouton">
									<button>Consulter</button>
								</Link>
								<h3 className='discussion-titre'>[{discussion.category}] {discussion.title}</h3>
								<div><span>{discussion.category}</span></div>
								<p className='discussion-description'>{(discussion.text).substr(0, 250) + "..."}</p>
								<img src={require(`/images/${discussion.image}`)} alt={discussion.title} className="discussion-image" />
							</div>
						))}
					{!discussions.length && <p>Vous n'avez rien publié pour le moment.</p>}
				</div>
			</div>

			<div>
				<h3>Supprimer mon compte</h3>
				<button id='modal-button' onClick={showModal}>Supprimer</button>
				<div id='modal' className='modal'>
					<div className='modal-content'>
						<div className='container-close'>
							<span className="close" onClick={closeModal}>&times;</span>
						</div>
						<form onSubmit={handleSupprimerCompte} noValidate>
							<h4>Êtes-vous sûr de vouloir supprimer votre compte ?</h4>
							<p>Cette action est irréversible.</p>
							<div>
								<label htmlFor="password">Mot de passe</label>
								<input type="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
							</div>
							<div>
								<button type="submit">Supprimer</button>
							</div>
						</form>
						{errorPassword && <div className='error'>{errorPassword}</div>}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Profile;