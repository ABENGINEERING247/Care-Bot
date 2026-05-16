import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, AlertTriangle, X, BellRing, BellOff } from 'lucide-react';

export default function FireAlarmIndicator() {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Simulate a random fire check or allow manual trigger for demo
  const triggerAlarm = () => {
    setIsAlertActive(true);
    setIsMuted(false);
  };

  const stopAlarm = () => {
    setIsAlertActive(false);
  };

  useEffect(() => {
    if (isAlertActive && !isMuted) {
      // Periodic ping sound or similar could be added here
      const interval = setInterval(() => {
        // play alert sound if any
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAlertActive, isMuted]);

  return (
    <>
      {/* Top Status Indicator */}
      <div className="fixed top-14 right-6 z-[80] pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isAlertActive ? stopAlarm : triggerAlarm}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-md ${
            isAlertActive 
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse' 
              : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
          }`}
        >
          {isAlertActive ? (
            <Flame size={18} className="animate-bounce" />
          ) : (
            <BellRing size={18} className="text-emerald-500" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isAlertActive ? 'Fire Detected!' : 'Fire System OK'}
          </span>
        </motion.button>
      </div>

      {/* Screen Overlay Alert */}
      <AnimatePresence>
        {isAlertActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-6"
          >
            {/* Flashing Background Overlay */}
            <motion.div 
              animate={{ 
                backgroundColor: ['rgba(244, 63, 94, 0.1)', 'rgba(244, 63, 94, 0.3)', 'rgba(244, 63, 94, 0.1)'] 
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0"
            />

            {/* Alert Box */}
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl p-8 pointer-events-auto border-4 border-rose-500 text-center"
            >
              <div className="w-20 h-20 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                <Flame size={40} />
              </div>
              
              <h2 className="text-3xl font-black text-rose-600 mb-2 uppercase tracking-tighter">Emergency!</h2>
              <p className="text-gray-900 font-bold text-lg mb-4">Fire detected in the facility!</p>
              
              <div className="bg-rose-50 p-4 rounded-3xl mb-8 flex items-start gap-3 text-left border border-rose-100">
                <AlertTriangle className="text-rose-500 shrink-0" size={20} />
                <p className="text-rose-800 text-xs font-semibold leading-relaxed">
                  Evacuation protocols are active. Robot is moving to the nearest safe exit. Please stay calm.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  {isMuted ? <BellRing size={18} /> : <BellOff size={18} />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={stopAlarm}
                  className="flex-1 bg-rose-500 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-lg shadow-rose-200"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
