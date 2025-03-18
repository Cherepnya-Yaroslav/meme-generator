import React from "react";
import { useState } from "react";

const UploadImage = ({onImageUpload}) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('Image loaded in UploadImage:', e.target.result.substring(0, 50) + '...'); // Проверяем данные
                setImage(e.target.result);
                onImageUpload(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                onImageUpload(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="upload-area">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileInput" />
            <label 
                htmlFor="fileInput" 
                className="upload-button"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {image ? 'Изменить изображение' : 'Загрузить изображение'}
            </label>
            <p className="upload-hint">
                {!image && 'Перетащите изображение или нажмите для выбора файла'}
            </p>
        </div>
    );
};

export default UploadImage; 