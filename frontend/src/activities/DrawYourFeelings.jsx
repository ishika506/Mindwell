import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    IoColorPaletteOutline, 
    IoCheckmarkCircleOutline, 
    IoTrashOutline, 
    IoBrushOutline,
    IoSwapHorizontalOutline 
} from "react-icons/io5";

// Define thematic colors for quick selection based on common emotional associations
const emotionColors = [
    { name: 'Calm', hex: '#4FB3BF', emotion: 'Peace/Calm' }, // Teal
    { name: 'Happy', hex: '#FBC02D', emotion: 'Joy/Energy' }, // Yellow
    { name: 'Angry', hex: '#EF4444', emotion: 'Anger/Frustration' }, // Red
    { name: 'Sad', hex: '#3B82F6', emotion: 'Sadness/Grief' }, // Blue
    { name: 'Anxious', hex: '#A855F7', emotion: 'Anxiety/Worry' }, // Purple
    { name: 'Neutral', hex: '#A3A3A3', emotion: 'Ambivalence' }, // Gray
];

export default function DrawYourFeelings({ onComplete }) {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [penColor, setPenColor] = useState(emotionColors[0].hex); // Teal by default
    const [penSize, setPenSize] = useState(8); // Default to slightly larger size
    const [isErasing, setIsErasing] = useState(false);

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const canvasBg = "bg-[#102325]";
    const highlightColor = "text-teal-400";
    const buttonPrimary = "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-700/40";
    const buttonDanger = "bg-red-600 hover:bg-red-500 text-white";

    // --- Drawing Handlers ---
    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }, []);

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsErasing(false);
    };

    const start = useCallback((e) => {
        const ctx = canvasRef.current.getContext("2d");
        const { offsetX, offsetY } = e.nativeEvent;
        
        ctx.strokeStyle = isErasing ? canvasBg : penColor;
        ctx.lineWidth = isErasing ? penSize + 5 : penSize; // Thicker eraser
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over'; // Erasing blend mode

        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setDrawing(true);
    }, [penColor, penSize, isErasing, canvasBg]);

    const draw = useCallback((e) => {
        if (!drawing) return;
        const ctx = canvasRef.current.getContext("2d");
        const { offsetX, offsetY } = e.nativeEvent;
        
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }, [drawing]);

    const stop = useCallback(() => {
        if (drawing) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.closePath();
            setDrawing(false);
            // Reset blend mode after drawing/erasing session
            ctx.globalCompositeOperation = 'source-over'; 
        }
    }, [drawing]);
    
    const handleColorSelect = (color) => {
        setPenColor(color);
        setIsErasing(false);
    }
    
    const toggleEraser = () => {
        setIsErasing(p => !p);
    }


    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${primaryBg} p-6`}>

            <h2 className={`text-3xl font-extrabold ${highlightColor} mb-2 flex items-center gap-2 border-b border-teal-700/50 pb-3`}>
                <IoColorPaletteOutline /> Express Your Feelings (Art Therapy)
            </h2>
            <p className="text-lg italic text-gray-400 mb-6 text-center max-w-md">
                Use colors, shapes, and lines to visualize your current emotional state. This is for reflection only.
            </p>

            <div className={`flex flex-col md:flex-row gap-6 p-4 rounded-xl ${cardBg} shadow-2xl border border-[#2A474A]`}>
                
                {/* --- 1. Tools Panel --- */}
                <div className="flex md:flex-col items-center justify-start gap-4 p-3 border-b md:border-b-0 md:border-r border-[#2A474A]">
                    
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 mt-1 hidden md:block">Color Palette</h3>
                    
                    {/* Color Presets */}
                    <div className="flex flex-row md:flex-col flex-wrap justify-center gap-2 mb-4">
                        {emotionColors.map(color => (
                            <motion.button
                                key={color.hex}
                                onClick={() => handleColorSelect(color.hex)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-8 h-8 rounded-full border-2 transition ${
                                    penColor === color.hex && !isErasing ? 'border-white ring-2 ring-offset-2 ring-teal-400/50 ring-offset-[#152D30]' : 'border-gray-700/50'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={`${color.name} (${color.emotion})`}
                            />
                        ))}
                    </div>
                    
                    <div className="w-full h-px bg-[#2A474A] my-2 hidden md:block" />

                    {/* Size Slider */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-gray-400">
                            <IoBrushOutline size={18} />
                            <span className="text-xs">{penSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="3"
                            max="30"
                            value={penSize}
                            onChange={(e) => setPenSize(parseInt(e.target.value))}
                            className="w-24 h-2 cursor-pointer accent-teal-500"
                            title={`Pen Size: ${penSize}`}
                        />
                    </div>
                    
                    <div className="w-full h-px bg-[#2A474A] my-2 hidden md:block" />

                    {/* Eraser Button */}
                    <motion.button
                        onClick={toggleEraser}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-sm px-3 py-2 rounded-lg transition font-semibold w-full flex items-center justify-center gap-2 ${
                            isErasing ? 'bg-white text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Toggle Eraser"
                    >
                        <IoSwapHorizontalOutline size={16} /> {isErasing ? 'Pen Mode' : 'Eraser'}
                    </motion.button>
                    
                    {/* Clear Button */}
                    <motion.button
                        onClick={clearCanvas}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${buttonDanger} text-sm px-3 py-2 rounded-lg transition w-full flex items-center justify-center gap-2 mt-2`}
                        title="Clear Canvas"
                    >
                        <IoTrashOutline size={16} /> Clear
                    </motion.button>
                </div>

                {/* --- 2. Canvas Area --- */}
                <canvas
                    ref={canvasRef}
                    width={350}
                    height={350}
                    onMouseDown={start}
                    onMouseMove={draw}
                    onMouseUp={stop}
                    onMouseOut={stop}
                    onTouchStart={start}
                    onTouchMove={draw}
                    onTouchEnd={stop}
                    className={`border-4 border-teal-700/50 rounded-lg ${canvasBg} shadow-inner ${isErasing ? 'cursor-none' : 'cursor-crosshair'}`}
                    style={{ touchAction: 'none' }}
                ></canvas>
            </div>

            {/* --- 3. Completion Button --- */}
            <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 px-10 py-4 font-bold rounded-xl ${buttonPrimary} transition-all flex items-center gap-2 text-lg uppercase tracking-wider`}
            >
                <IoCheckmarkCircleOutline size={22} /> Finished Drawing
            </motion.button>
        </div>
    );
}