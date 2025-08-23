import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Milestone, MilestoneMemory } from '../../types';
import { CameraIcon } from '../layout/Icons';

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onComplete: (milestoneId: string, memory?: MilestoneMemory) => void;
}

const CameraCapture: React.FC<{ onCapture: (photo: string) => void, onCancel: () => void }> = ({ onCapture, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let activeStream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                activeStream = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access camera. Please check permissions.");
                onCancel();
            }
        };

        startCamera();

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onCancel]);
    
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
                onCapture(dataUrl);
            }
        }
    };

    return (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-20">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-8">
                <button onClick={onCancel} className="p-4 bg-white/20 text-white rounded-full">Cancel</button>
                <button onClick={handleCapture} className="w-20 h-20 bg-pure-white rounded-full border-4 border-gray-400"></button>
            </div>
        </div>
    );
};

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ milestone, onComplete }) => {
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    const memory: MilestoneMemory = {
      milestoneId: milestone.id,
      note,
      photo: photo || undefined,
      date: new Date().toISOString(),
    };
    onComplete(milestone.id, memory);
  };
  
  const handleSkip = () => {
    setIsSaving(true);
    onComplete(milestone.id);
  };

  const handlePhotoCaptured = (photoDataUrl: string) => {
      setPhoto(photoDataUrl);
      setShowCamera(false);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-pure-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg h-full max-h-[90vh] flex flex-col overflow-hidden">
        {showCamera && <CameraCapture onCapture={handlePhotoCaptured} onCancel={() => setShowCamera(false)} />}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
            <header className="text-center">
                <h2 className="text-sm font-bold uppercase text-primary-blue tracking-widest">Milestone Reached!</h2>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-1">{milestone.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{milestone.description}</p>
            </header>

            <div className="bg-baby-blue dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Why This Is a Big Deal for You</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{milestone.fatherSignificance}</p>
            </div>

            <div className="bg-soft-pink dark:bg-warm-coral/10 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Navigating Your Emotions</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{milestone.emotionalGuidance}</p>
            </div>

            <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                <h3 className="text-lg font-bold text-center">Capture This Moment</h3>
                <p className="text-sm text-center text-gray-500 italic">"{milestone.celebrationPrompt}"</p>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write down your thoughts and feelings..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <div className="flex items-center gap-4">
                    {photo ? (
                        <div className="relative">
                            <img src={photo} alt="Milestone memory" className="w-20 h-20 rounded-lg object-cover" />
                            <button onClick={() => setPhoto(null)} className="absolute -top-2 -right-2 bg-alert-red text-white w-6 h-6 rounded-full text-xs">&times;</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowCamera(true)} className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600">
                           <CameraIcon className="w-8 h-8"/>
                           <span className="text-xs mt-1">Add Photo</span>
                        </button>
                    )}
                    <p className="text-xs text-gray-500">Add a photo and a note to remember this day forever. It will appear in your Milestone Journey on your profile.</p>
                </div>
            </div>
        </div>
        <footer className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 grid grid-cols-2 gap-3">
            <button onClick={handleSkip} disabled={isSaving} className="px-4 py-3 bg-gray-200 dark:bg-gray-600 font-bold rounded-lg disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Maybe Later'}
            </button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-3 bg-primary-blue text-white font-bold rounded-lg disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save & Celebrate'}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default MilestoneCelebration;