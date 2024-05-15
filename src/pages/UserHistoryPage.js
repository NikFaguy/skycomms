import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';

const UserHistoryPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [userData, setUserData] = useState([]);

    const showModal = () => {
        document.getElementById("modal").style.opacity = "100%";
        document.getElementById("modal").style.pointerEvents = "all";

    }

    const closeModal = () => {
        document.getElementById("modal").style.opacity = "0%";
        document.getElementById("modal").style.pointerEvents = "none";
    }

    const handleDeleteUser = async (e) => {
        e.preventDefault();

        const res = await fetch(`https://skycomms-api.onrender.com/user/profile/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        //Parse the response
        const data = await res.json();

        if (!res.ok) {
            console.error("Erreur lors de la suppression de l'utilisateur:", data.error);
        }

        if (res.ok) {
            navigate('/', { state: { message: 'Utilisateur banni.' } });
        }
    }

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await fetch(`https://skycomms-api.onrender.com/user/profile/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const userData = await response.json();

                if (isMounted) {
                    setUserData(userData);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du profile:', error);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <h2>Options administrateur</h2>
            <p>Utilisateur sélectionné : <strong>{userData.username}</strong></p>
            {user && user.user.isAdmin && (
                <div>
                    <button id='modal-button' className='delete_button' onClick={showModal}>Bannir</button>
                    <div id='modal' className='modal'>
                        <div className='modal-content'>
                            <div className='container-close'>
                                <span className="close" onClick={closeModal}>&times;</span>
                            </div>
                            <form onSubmit={handleDeleteUser} noValidate>
                                <h4>Êtes-vous sûr de vouloir bannir {userData.username} ?</h4>
                                <p>Cette action est irréversible.</p>
                                <div>
                                    <button type="submit" className='delete_button'>Bannir</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default UserHistoryPage;