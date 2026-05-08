/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import MedicineReminder from './components/MedicineReminder';
import Entertainment from './components/Entertainment';
import AIChats from './components/AIChats';
import BluetoothController from './components/BluetoothController';
import BackgroundMusic from './components/BackgroundMusic';
import { Pill, Gamepad2, MessageCircle, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'meds' | 'play' | 'chat' | 'remote'>('meds');

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Moving Marquee */}
      <div className="bg-white border-b border-gray-100 py-2 overflow-hidden sticky top-0 z-[70] shadow-sm">
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "linear" 
          }}
          className="whitespace-nowrap inline-block"
        >
          <span className="text-xs font-black uppercase tracking-widest text-indigo-500 mx-4">
            App is developed by AICIRCLE! • Smart Healthcare Solutions • Innovation in Care • App is developed by AICIRCLE!
          </span>
        </motion.div>
      </div>

      <BackgroundMusic />
      
      {/* Bottom Navigation for easy access on tablet */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-100 px-6 py-3 rounded-full shadow-2xl flex gap-8 z-[60]">
        <button 
          onClick={() => setActiveTab('meds')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'meds' ? 'text-[#E29578] scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <Pill size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Health</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'chat' ? 'text-indigo-500 scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <MessageCircle size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Chats</span>
        </button>
        <button 
          onClick={() => setActiveTab('remote')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'remote' ? 'text-blue-500 scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <Zap size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Remote</span>
        </button>
        <button 
          onClick={() => setActiveTab('play')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'play' ? 'text-[#3282B8] scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <Gamepad2 size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Play</span>
        </button>
      </nav>

      <main className="flex-1 pb-24">
        {activeTab === 'meds' ? <MedicineReminder /> : 
         activeTab === 'chat' ? <AIChats /> :
         activeTab === 'remote' ? <BluetoothController /> :
         <Entertainment />}
        
        <footer className="mt-12 mb-8 text-center border-t border-gray-100 pt-8 opacity-60">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Designed by AICIRCLE</p>
          <p className="text-xs font-bold text-gray-500 mt-1">Founder: Engr. Bilal Mehmood</p>
        </footer>
      </main>
    </div>
  );
}
