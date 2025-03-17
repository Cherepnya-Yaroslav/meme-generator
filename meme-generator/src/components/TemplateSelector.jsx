import React from 'react';

const TemplateSelector = ({ onSelectTemplate, currentTemplate }) => {
    // Пока у нас только один шаблон - демотиватор
    const templates = [
        { id: 'none', name: 'Без шаблона' },
        { id: 'demotivator', name: 'Демотиватор' }
    ];

    return (
        <div className="template-selector">
            <h3 className="control-heading">Выберите шаблон</h3>
            <div className="template-options">
                {templates.map(template => (
                    <button
                        key={template.id}
                        className={`template-button ${currentTemplate === template.id ? 'active' : ''}`}
                        onClick={() => onSelectTemplate(template.id)}
                    >
                        {template.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector; 