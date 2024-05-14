import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';


const DiscussionPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [comments, setComments] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newCommentError, setNewCommentError] = useState('');
    const [discussions, setDiscussions] = useState([]);

    const [editingCommentId, setEditingCommentId] = useState(null);

    const davantageDeDiscussions = async () => {

        try {
            const response = await fetch('https://skycomms-api.onrender.comdiscussion/discussions-supplementaires/' + discussion.category + '/' + discussion._id,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            );
            const discussionsData = await response.json();
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

    window.onscroll = function () {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            davantageDeDiscussions();
        }
    };

    useEffect(() => {

        //récupération de la discussion
        const fetchData = async () => {
            try {
                const response = await fetch(`https://skycomms-api.onrender.comdiscussion/${id}`);

                if (response.ok) {
                    const discussionData = await response.json();

                    const userData = await getUsers(discussionData.userAuthor);

                    const discussionWithUserData = { ...discussionData, userData };

                    setDiscussion(discussionWithUserData);
                } else {
                    throw new Error("Discussion introuvable");
                }
            } catch (error) {
                navigate('/', { state: { error: error.message } });
            }
        };
        fetchData();

    }, [id, navigate]);

    useEffect(() => {
        // importe une image dynamiquement
        if (discussion && discussion.image) {
            import(`/images/${discussion.image}`).then(image => {
                setDiscussion(prevState => ({
                    ...prevState,
                    image: image.default
                }));
            }).catch(error => {
                //console.error('Error:', error);
            });
        }
    }, [discussion]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://skycomms-api.onrender.comcomment/comments/${id}`);

            if (response.ok) {
                const commentsData = await response.json();
                const commentsWithUserData = await Promise.all(
                    commentsData.map(async (comment) => {
                        const userData = await getUsers(comment.userId);
                        return { ...comment, userData };
                    }))
                setComments(commentsWithUserData);
            }

        };
        fetchData();
    }, [id])

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleEditComment = (commentId) => {
        if (editingCommentId !== commentId) {
            setEditingCommentId(commentId);
            const commentToEdit = comments.find(comment => comment.id === commentId);
            if (commentToEdit) {
                setNewComment(commentToEdit.text);
            }
        }
    };

    //gestion de la création d'un nouveau commentaire
    const handlePostComment = async (event) => {
        event.preventDefault();

        if (!newComment || newComment.trim().length === 0) {
            setNewCommentError('Veuillez saisir un commentaire.');
            return;
        }

        try {
            const response = await fetch(`https://skycomms-api.onrender.comcomment/create/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                setNewCommentError('');
                const newCommentData = await response.json();

                const userData = await getUsers(newCommentData.userId);
                const updatedComment = { ...newCommentData, userData };
                setComments([...comments, updatedComment]);
                setNewComment('');
            } else {
                throw new Error("Erreur lors de la publication du commentaire.");
            }
        } catch (error) {
            console.error('Erreur création d\'un commentaire:', error);
        }
    };

    //pour sauvegarder le changement du commentaire
    const handleSaveEditedComment = async (commentId, newText) => {

        try {
            const response = await fetch(`https://skycomms-api.onrender.comcomment/update/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ text: newText })

            });

            if (response.ok) {
                setEditingCommentId(null)
            }
        } catch (error) {
            console.error("erreur:", error);
        }
    }

    //suppression d'un commentaire
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`https://skycomms-api.onrender.comcomment/delete/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                // enleve le commentaire supprimé de la liste de commentaires
                setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
            } else {
                throw new Error("Erreur lors de la suppression du commentaire.");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire:", error);
        }
    };

    //suppression de la discussion
    const handleDeleteDiscussion = async (discussionId) => {
        try {
            const response = await fetch(`https://skycomms-api.onrender.comdiscussion/delete/${discussionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }


            });
            if (response.ok) {
                navigate('/', { state: { message: 'Utilisateur supprimé.' } });
            }

        } catch (error) {

        }
    }

    const handleUpvote = (commentId) => async () => {
        try {
            const response = await fetch(`https://skycomms-api.onrender.comcomment/upvote/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const updatedComments = comments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, votes: { upvotes: [...comment.votes.upvotes, user.user._id], downvotes: comment.votes.downvotes.filter(vote => vote !== user.user._id) } };
                    }
                    return comment;
                });
                setComments(updatedComments);
            } else {
                throw new Error('Erreur lors du upvote.');
            }

        } catch (error) {
            console.error('Erreur lors du vote:', error);
        }
    };

    const handleDownvote = (commentId) => async () => {
        try {
            const response = await fetch(`https://skycomms-api.onrender.comcomment/downvote/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const updatedComments = comments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, votes: { downvotes: [...comment.votes.downvotes, user.user._id], upvotes: comment.votes.upvotes.filter(vote => vote !== user.user._id) } };
                    }
                    return comment;
                });
                setComments(updatedComments);
            } else {
                throw new Error('Erreur lors du downvote.');
            }

        } catch (error) {
            console.error('Erreur lors du vote:', error);
        }
    };

    //on récupère l'utilisateur des commentaires
    const getUsers = async (id) => {
        try {
            const response = await fetch(`https://skycomms-api.onrender.comuser/profile/${id}`);
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Erreur lors de la récupération du profile:', error);
            return null;
        }
    };

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
            return jours + " j";
        }
        else {
            return heures + " h";
        }
    });

    return (
        <div className="discussion-page">
            {discussion ? (
                <div className="discussion-content">
                    <div>
                        <p><strong>{discussion.userData.username}</strong> il y a {heuresDepuisDate(discussion.createdAt)}</p>
                        {user && user.user.isAdmin && (
                            <button className='delete_button' onClick={() => handleDeleteDiscussion(discussion._id)}>Supprimer discussion</button>
                        )}

                    </div>

                    <h3>{discussion.title}</h3>

                    <h4>{discussion.category}</h4>

                    <img src={discussion.image} alt={discussion.title} />

                    <p>{discussion.text}</p>
                </div>
            ) : (
                <p>En cours de chargement...</p>
            )}

            {user && (
                <form onSubmit={handlePostComment} className="ajout-commentaire-page">
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Votre commentaire..."
                        className={newCommentError && "error"}
                    />
                    {newCommentError && <p className="error">{newCommentError}</p>}
                    <button>Publier</button>
                </form>
            )}

            <div className="comments-section">
                {comments && comments.length > 0 ? (
                    comments
                        .filter(comment => !comment.isDeleted)
                        .map(comment => (
                            <div key={comment._id}>
                                <p className='comment-author'>{comment.userData?.username} • <span>-{heuresDepuisDate(comment.createdAt)}</span></p>

                                {editingCommentId === comment._id ? (
                                    <div className='comment-edit'>
                                        <textarea
                                            value={comment.text}
                                            onChange={(e) => {
                                                const updatedText = e.target.value;
                                                setComments(prevComments =>
                                                    prevComments.map(prevComment =>
                                                        prevComment._id === comment._id
                                                            ? { ...prevComment, text: updatedText }
                                                            : prevComment
                                                    )
                                                );
                                            }}
                                        />
                                        <button onClick={() => handleSaveEditedComment(comment._id, comment.text)}>Sauvegarder</button>
                                    </div>
                                ) : (
                                    <div>
                                        <span>{comment.text}</span>

                                        <div className='comment-buttons'>
                                            <div className='boutons-votes'>
                                                {user && comment.votes.upvotes.includes(user.user._id) ? (
                                                    <button onClick={handleUpvote(comment._id)} disabled>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <button onClick={handleUpvote(comment._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                                                        </svg>
                                                    </button>
                                                )}

                                                <div className='compteur'>
                                                    <span>{comment.votes.upvotes.length - comment.votes.downvotes.length}</span>
                                                </div>

                                                {user && comment.votes.downvotes.includes(user.user._id) ? (
                                                    <button onClick={handleDownvote(comment._id)} disabled>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <button onClick={handleDownvote(comment._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                                                        </svg>
                                                    </button>
                                                )}

                                            </div>
                                            {user && (comment.userId === user.user._id || user.user.isAdmin) && (
                                                <div className='boutons-votes'>
                                                    <button onClick={() => handleEditComment(comment._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                        </svg>
                                                    </button>
                                                    <button className='delete-button2' onClick={() => handleDeleteComment(comment._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                    </button>
                                                    {user.user.isAdmin && (
                                                        <Link to={`/user/user_history/${comment.userData?._id}`} className="image-link">
                                                            <button className='bouton-historique'>Gérer</button>
                                                        </Link>
                                                    )}

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                ) : (
                    <p className="no-comments">Aucun commentaire pour l'instant</p>
                )}
            </div>
            <div>
                <h4>Davantage de publications susceptibles de vous plaire</h4>
                {discussions && discussions.length > 0 ? (
                    discussions.filter(discussion => !discussion.isDeleted)
                        .map((discussion) => (
                            <div key={discussion._id} className="discussion-container">
                                <p className='discussion-auteur'>{discussion.userData && discussion.userData.username} <strong>•</strong> {heuresDepuisDate(discussion.createdAt)}</p>
                                <Link to={`/discussion/${discussion._id}`} className="discussion-bouton">
                                    <button>Consulter</button>
                                </Link>
                                <h3 className='discussion-titre'>{discussion.title}</h3>
                                <div><span>{discussion.category}</span></div>
                                <p className='discussion-description'>{(discussion.text).substr(0, 500) + "..."}</p>
                                <img src={require(`/images/${discussion.image}`)} alt={discussion.title} className="discussion-image" />
                            </div>
                        ))
                ) : (
                    <p>Aucune discussion reliée</p>
                )}
            </div>
        </div >
    );
};



export default DiscussionPage;