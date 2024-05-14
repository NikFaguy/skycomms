import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

function CreateDiscussion() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [errors, setErrors] = useState({});
    const categoriesEnum = ["Art", "Gaming", "Politique", "Science", "Sports", "Technologie", "Autre"]
    const { user } = useUserContext();
    const navigate = useNavigate();

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setErrors({ ...errors, title: '' });
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
        setErrors({ ...errors, text: '' });
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setImage(selectedFile);
        setErrors({ ...errors, image: '' });

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('imagePreview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setErrors({ ...errors, category: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};

        if (!title) {
            newErrors.title = "Un titre est requis.";
        }
        if (!text) {
            newErrors.text = "Une description est requise.";
        }
        if (!image) {
            newErrors.image = "Une image est requise.";
        }
        if (!category) {
            newErrors.category = "Une catégorie est requise.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('text', text);
        formData.append('imageUploaded', image);
        formData.append('category', category);

        try {
            const response = await axios.post('https://skycomms-api.onrender.comdiscussion/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.status === 201) {
                navigate('/', { state: { message: 'Discussion ajoutée.' } });
            } else {
                console.log('Error:', response.data.error);
            }
        } catch (error) {
            console.error('Error during discussion creation:', error);
            setErrors({ ...errors, general: 'Erreur lors de la création de la discussion' });
        }
    };

    return (
        <div>
            <h2>Créer une publication</h2>
            <form className="creer-form" onSubmit={handleSubmit} noValidate>
                <label htmlFor="title">Titre</label>
                <input type="text" id="title" value={title} className={errors.title && "error"} placeholder='Titre' onChange={handleTitleChange} />
                {errors.title && <p className="error">{errors.title}</p>}

                <label htmlFor="text">Description</label>
                <textarea id="text" value={text} className={errors.text && "error"} placeholder='Corps' onChange={handleTextChange}></textarea>
                {errors.text && <p className="error">{errors.text}</p>}

                <label htmlFor="image">Image</label>
                <label className='custom-file-upload'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                    </svg>
                    Téléverser une image
                    <input type="file" id="image" name='imageUploaded' className={errors.image && "error"} onChange={handleImageChange} accept="image/*" />
                </label>
                {image &&
                    <div>
                        <img id='imagePreview' alt="Aperçu" width='200px'></img>
                        <br></br>
                        <br></br>
                        <button onClick={() => setImage(null)}>Supprimer l'image</button>
                    </div>
                }

                {errors.image && <p className="error">{errors.image}</p>}

                <label htmlFor="category">Catégorie</label>
                <select id="category" value={category} className={errors.category && "error"} onChange={handleCategoryChange}>
                    <option value="" disabled>Sélectionnez une catégorie</option>
                    {categoriesEnum.map(categoryOption => (
                        <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
                    ))}
                </select>
                {errors.category && <p className="error">{errors.category}</p>}

                {errors.general && <p className="error" style={{ color: 'red' }}>{errors.general}</p>}

                <button type="submit">Créer</button>
            </form>
        </div>
    );
}

export default CreateDiscussion;