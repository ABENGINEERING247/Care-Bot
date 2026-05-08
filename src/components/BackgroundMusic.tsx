import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Pause, Play, Volume2, Volume1, VolumeX } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef<any>(null);
  const apiLoaded = useRef(false);

  const videoId = "VpD-f1165A8"; // Coke Studio - Hum Kyun Chalen

  useEffect(() => {
    // Load YouTube API
    if (!window.YT && !apiLoaded.current) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      apiLoaded.current = true;
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: videoId
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
          }
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const togglePlayback = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[100]">
      <div className="relative flex flex-col items-end gap-3">
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-white/95 backdrop-blur-xl border border-gray-100 p-5 rounded-[32px] shadow-2xl flex flex-col gap-4 min-w-[280px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-2xl overflow-hidden relative group shrink-0 shadow-lg shadow-black/10">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/0.jpg`} 
                    alt="Track Cover" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="text-[10px] font-black text-[#E29578] uppercase tracking-[0.2em] mb-1">Now Playing</div>
                  <h4 className="text-base font-bold text-gray-900 truncate">Hum Kyun Chalen</h4>
                  <p className="text-xs text-gray-500">Coke Studio</p>
                </div>

                <button 
                  onClick={togglePlayback}
                  className="w-12 h-12 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                </button>
              </div>

              {/* Volume Control */}
              <div className="px-1 space-y-3 pt-2 border-t border-gray-50">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    {volume === 0 ? <VolumeX size={14} /> : volume < 50 ? <Volume1 size={14} /> : <Volume2 size={14} />}
                    <span>Volume</span>
                  </div>
                  <span>{volume}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#E29578]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 relative ${
            isPlaying ? 'bg-[#E29578] text-white' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
          }`}
        >
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-[#E29578] animate-ping opacity-20"></span>
          )}
          {isPlaying ? <Music size={24} className="relative" /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Hidden YouTube Container */}
      <div id="yt-player" className="hidden"></div>
    </div>
  );
}
