// TextControls.js
// Placeholder for the text controls component

import React from 'react';

const TextControls = ({ 
    topText, 
    bottomText, 
    onTopTextChange, 
    onBottomTextChange, 
    fontSize, 
    onFontSizeChange 
}) => {
    return (
        <div className="text-controls">
            <h3 className="control-heading">Текст мема</h3>
            
            <div className="control-group">
                {/* <label htmlFor="topText" className="control-label">Верхний текст:</label> */}
                <textarea
                    id="topText"
                    value={topText}
                    onChange={(e) => onTopTextChange(e.target.value)}
                    className="text-input"
                    placeholder="Текст вверху мема"
                    rows="2"
                />
            </div>
            
            <div className="control-group">
                {/* <label htmlFor="bottomText" className="control-label">Нижний текст:</label> */}
                <textarea
                    id="bottomText"
                    value={bottomText}
                    onChange={(e) => onBottomTextChange(e.target.value)}
                    className="text-input"
                    placeholder="Текст внизу мема"
                    rows="2"
                />
            </div>
            
            <div className="control-group">
                <label htmlFor="fontSize" className="control-label">Размер шрифта: {fontSize}px</label>
                <input
                    type="range"
                    id="fontSize"
                    min="20"
                    max="80"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                    className="range-input"
                />
            </div>
        </div>
    );
};

export default TextControls; 