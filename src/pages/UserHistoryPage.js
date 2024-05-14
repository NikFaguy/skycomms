import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';

const UserHistoryPage = () =>{
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUserContext();

    const handleDeleteUser = async (id)=>{
        try{
        const response = await fetch(`https://skycomms-api.onrender.comuser/delete/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            

        });

        if (response.ok) {
            navigate('/', { state: { message: 'discussion supprimé.' } });
        }
    } catch (error) {
        console.error("erreur:", error);
    }

}

return (
    <div>
        
    {user && user.user.isAdmin &&(
        <button className='delete_button' onClick={()=>handleDeleteUser(id)} >Bannir l'utilisateur</button>
    )}
    </div>
)
}
export default UserHistoryPage;