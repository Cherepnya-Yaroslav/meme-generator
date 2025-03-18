import React, { useState } from 'react';
import UploadImage from './components/UploadImage';
import MemeCanvas from './components/MemeCanvas';
import TextControls from './components/TextControls';
import TemplateSelector from './components/TemplateSelector';
import './App.css';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(40);
  const [template, setTemplate] = useState('none');

  const handleImageUpload = (imageData) => {
    console.log('Uploading image:', imageData ? imageData.substring(0, 50) : 'no image');
    setUploadedImage(imageData);
  };

  const handleTemplateChange = (templateId) => {
    setTemplate(templateId);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'meme.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>meme generator </h1>
      </div>
      <div className="content">
        <div className="canvas-area">
          <MemeCanvas 
            image={uploadedImage} 
            topText={topText}
            bottomText={bottomText}
            fontSize={fontSize}
            template={template}
          />
        </div>
        <div className="controls-area">
          <UploadImage onImageUpload={handleImageUpload} />
          
          {uploadedImage && (
            <>
              <TemplateSelector 
                onSelectTemplate={handleTemplateChange}
                currentTemplate={template}
              />
              
              <TextControls 
                topText={topText}
                bottomText={bottomText}
                onTopTextChange={setTopText}
                onBottomTextChange={setBottomText}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
              />
              
              <div className="download-area">
                <button 
                  className="download-button"
                  onClick={handleDownload}
                >
                  Скачать мем
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;