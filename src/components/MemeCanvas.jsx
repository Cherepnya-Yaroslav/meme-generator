import React, { useEffect, useRef, useState } from "react";

const MemeCanvas = ({ image, topText, bottomText, fontSize, template = 'none' }) => {
    const canvasRef = useRef(null);
    const canvasInstance = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false);
    const topTextRef = useRef(null);
    const bottomTextRef = useRef(null);
    const imageRef = useRef(null);
    const demotivatorFrameRef = useRef(null);
    const demotivatorTextRef = useRef(null);
    const canvasSize = 500; // Фиксированный размер холста
    
    // Инициализация холста при монтировании компонента
    useEffect(() => {
        console.log("Attempting to initialize canvas...");
        
        // Идентификатор таймера для его очистки при размонтировании
        let timerID = null;
        
        // Функция инициализации холста с повторными попытками
        const initCanvas = () => {
            // Проверяем, есть ли canvas элемент
            if (!canvasRef.current) {
                timerID = setTimeout(initCanvas, 200);
                return;
            }
            
            // Проверяем, доступен ли Fabric.js
            if (typeof window.fabric === 'undefined') {
                console.log("Fabric.js not loaded yet, will retry...");
                
                // Добавляем событие загрузки скрипта, если скрипт еще загружается
                const fabricScript = document.createElement('script');
                fabricScript.src = "https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js";
                fabricScript.async = true;
                fabricScript.onload = initCanvas;
                
                // Проверяем, нет ли уже скрипта на странице
                if (!document.querySelector('script[src*="fabric"]')) {
                    document.head.appendChild(fabricScript);
                    console.log("Added Fabric.js script dynamically");
                } else {
                    // Если скрипт уже есть, просто ждем его загрузки
                    timerID = setTimeout(initCanvas, 300);
                }
                return;
            }
            
            try {
                console.log("Fabric.js loaded, initializing canvas", canvasRef.current);
                
                // Убедимся, что мы не инициализируем холст, если он уже инициализирован
                if (canvasInstance.current) {
                    console.log("Canvas already initialized");
                    return;
                }
                
                // Инициализируем холст с фиксированным размером
                canvasInstance.current = new window.fabric.Canvas(canvasRef.current, {
                    width: canvasSize,
                    height: canvasSize,
                    backgroundColor: "#f0f0f0",
                    selection: false // Отключаем выделение объектов
                });
                
                // Добавим текст-подсказку на пустой холст
                const helpText = new window.fabric.Text('Загрузите изображение', {
                    left: canvasSize / 2,
                    top: canvasSize / 2,
                    originX: 'center',
                    originY: 'center',
                    fill: '#999999',
                    selectable: false // Делаем текст невыделяемым
                });
                
                canvasInstance.current.add(helpText);
                canvasInstance.current.renderAll();
                setCanvasReady(true);
                console.log("Canvas initialized successfully", canvasInstance.current);
            } catch (error) {
                console.error("Error initializing canvas:", error);
                // Пробуем еще раз через некоторое время
                timerID = setTimeout(initCanvas, 500);
            }
        };
        
        // Запускаем инициализацию
        initCanvas();
        
        // Очистка при размонтировании
        return () => {
            // Очищаем таймер при размонтировании
            if (timerID) {
                clearTimeout(timerID);
            }
            
            // Очищаем canvas
            if (canvasInstance.current) {
                console.log("Disposing canvas");
                canvasInstance.current.dispose();
                canvasInstance.current = null;
            }
        };
    }, []);
    
    // Функция для применения шаблона
    const applyTemplate = () => {
        if (!canvasInstance.current || !imageRef.current) return;
        
        // Удаляем предыдущие элементы шаблона
        if (demotivatorFrameRef.current) {
            canvasInstance.current.remove(demotivatorFrameRef.current);
            demotivatorFrameRef.current = null;
        }
        
        if (demotivatorTextRef.current) {
            canvasInstance.current.remove(demotivatorTextRef.current);
            demotivatorTextRef.current = null;
        }
        
        // Очищаем холст и добавляем изображение
        canvasInstance.current.clear();
        
        if (template === 'none') {
            // Стандартный режим без шаблона
            const scale = Math.min(
                (canvasSize - 20) / imageRef.current.width,
                (canvasSize - 20) / imageRef.current.height
            );
            
            imageRef.current.scale(scale);
            canvasInstance.current.centerObject(imageRef.current);
            canvasInstance.current.add(imageRef.current);
        } 
        else if (template === 'demotivator') {
            // Шаблон демотиватора
            
            // Устанавливаем черный фон
            canvasInstance.current.setBackgroundColor('#000000', canvasInstance.current.renderAll.bind(canvasInstance.current));
            
            // Масштабируем изображение, чтобы оно занимало примерно 70% высоты холста
            const maxHeight = canvasSize * 0.7;
            const maxWidth = canvasSize * 0.8;
            
            const scale = Math.min(
                maxWidth / imageRef.current.width,
                maxHeight / imageRef.current.height
            );
            
            imageRef.current.scale(scale);
            
            // Центрируем изображение в верхней части холста
            imageRef.current.set({
                left: canvasSize / 2,
                top: (maxHeight / 2) + 20,
                originX: 'center',
                originY: 'center',
                selectable: false
            });
            
            // Создаем рамку вокруг изображения
            const imgWidth = imageRef.current.getScaledWidth();
            const imgHeight = imageRef.current.getScaledHeight();
            
            demotivatorFrameRef.current = new window.fabric.Rect({
                left: canvasSize / 2,
                top: (maxHeight / 2) + 20,
                width: imgWidth + 10,
                height: imgHeight + 10,
                fill: 'transparent',
                stroke: 'white',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center',
                selectable: false
            });
            
            // Добавляем текст демотиватора (используем нижний текст)
            if (bottomText) {
                // Создаем многострочный текст для демотиватора
                demotivatorTextRef.current = new window.fabric.Textbox(bottomText, {
                    left: canvasSize / 2,
                    top: maxHeight + 50,
                    fontSize: fontSize,
                    fontFamily: 'Times New Roman',
                    fill: 'white',
                    textAlign: 'center',
                    originX: 'center',
                    width: canvasSize * 0.8,
                    breakWords: true,
                    selectable: true
                });
                
                canvasInstance.current.add(demotivatorTextRef.current);
            }
            
            // Добавляем элементы на холст
            canvasInstance.current.add(imageRef.current);
            canvasInstance.current.add(demotivatorFrameRef.current);
        }
    };
    
    // Функция для создания многострочного текста
    const createMultilineText = (text, options) => {
        // Заменяем \n на реальные переносы строк
        const processedText = text.replace(/\\n/g, '\n');
        
        return new window.fabric.Textbox(processedText, {
            ...options,
            width: canvasSize * 0.9,
            breakWords: true,
            selectable: true
        });
    };
    
    // Функция для обновления нижнего текста
    const updateBottomText = (text) => {
        if (!canvasInstance.current) return;
        
        // Если есть предыдущий текст, удаляем его
        if (bottomTextRef.current) {
            canvasInstance.current.remove(bottomTextRef.current);
        }
        
        // Для демотиватора нижний текст обрабатывается в applyTemplate
        if (template === 'demotivator') {
            applyTemplate();
            return;
        }
        
        if (text) {
            // Создаем новый многострочный текст
            bottomTextRef.current = createMultilineText(text.toUpperCase(), {
                left: canvasSize / 2,
                top: canvasSize - 20 - fontSize,
                originX: 'center',
                fontSize: fontSize,
                fontWeight: 'bold',
                fill: 'white',
                stroke: 'black',
                strokeWidth: 2,
                strokeUniform: true,
                textAlign: 'center'
            });
            
            canvasInstance.current.add(bottomTextRef.current);
            canvasInstance.current.bringToFront(bottomTextRef.current);
        }
    };
    
    // Функция для обновления верхнего текста
    const updateTopText = (text) => {
        if (!canvasInstance.current) return;
        
        // Если есть предыдущий текст, удаляем его
        if (topTextRef.current) {
            canvasInstance.current.remove(topTextRef.current);
        }
        
        if (text && template !== 'demotivator') {
            // Создаем новый многострочный текст
            topTextRef.current = createMultilineText(text.toUpperCase(), {
                left: canvasSize / 2,
                top: 20,
                originX: 'center',
                fontSize: fontSize,
                fontWeight: 'bold',
                fill: 'white',
                stroke: 'black',
                strokeWidth: 2,
                strokeUniform: true,
                textAlign: 'center'
            });
            
            canvasInstance.current.add(topTextRef.current);
            canvasInstance.current.bringToFront(topTextRef.current);
        }
    };
    
    // Обработка изображения при его загрузке
    useEffect(() => {
        if (image && canvasInstance.current && canvasReady) {
            console.log("Loading image to canvas");
            
            // Удаляем все объекты перед добавлением нового изображения
            canvasInstance.current.clear();
            
            window.fabric.Image.fromURL(image, (img) => {
                console.log("Image loaded successfully");
                
                if (!img) {
                    console.error("Failed to create image object");
                    return;
                }
                
                // Делаем изображение невыделяемым
                img.selectable = true;
                
                // Сохраняем ссылку на изображение
                imageRef.current = img;
                
                // Применяем шаблон в зависимости от выбранного
                applyTemplate();
                
                // Создаем верхний и нижний текст, если они уже заданы
                updateTopText(topText);
                updateBottomText(bottomText);
                
                canvasInstance.current.renderAll();
            }, { crossOrigin: 'anonymous' });
        }
    }, [image, canvasReady, applyTemplate, bottomText, topText, updateBottomText, updateTopText]);
    
    // Обновление шаблона при его изменении
    useEffect(() => {
        if (canvasInstance.current && imageRef.current) {
            applyTemplate();
            canvasInstance.current.renderAll();
        }
    }, [template, applyTemplate]);
    
    // Обновление верхнего текста при его изменении
    useEffect(() => {
        if (canvasInstance.current && image) {
            updateTopText(topText);
            canvasInstance.current.renderAll();
        }
    }, [topText, fontSize, image, updateTopText]);
    
    // Обновление нижнего текста при его изменении
    useEffect(() => {
        if (canvasInstance.current && image) {
            updateBottomText(bottomText);
            canvasInstance.current.renderAll();
        }
    }, [bottomText, fontSize, image, updateBottomText]);
    
    return (
            <canvas 
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
                className="responsive-canvas"
            />
        
    );
};

export default MemeCanvas; 