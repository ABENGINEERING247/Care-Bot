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
import PharmacyDelivery from './components/PharmacyDelivery';
import WelcomePage from './components/WelcomePage';
import BackgroundMusic from './components/BackgroundMusic';
import { Pill, Gamepad2, MessageCircle, Zap, ShoppingBag, Home } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'meds' | 'play' | 'chat' | 'remote' | 'shop'>('home');

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex flex-col font-sans">
      {/* Moving Marquee */}
      <div className="bg-white border-b border-gray-100 py-2 overflow-hidden sticky top-0 z-[70]">
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
          <span className="text-xs font-black uppercase tracking-widest text-[#E29578] mx-4">
            App is developed by the students of KIET! • Smart Healthcare Solutions • Innovation in Care • App is developed by the students of KIET!
          </span>
        </motion.div>
      </div>

      <BackgroundMusic />
      
      {/* Bottom Navigation for easy access on tablet */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-100 px-6 py-3 rounded-full shadow-xl flex gap-8 z-[60]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-black scale-110' : 'text-gray-400'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('meds')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'meds' ? 'text-[#E29578] scale-110' : 'text-gray-400'}`}
        >
          <Pill size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Health</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'chat' ? 'text-indigo-500 scale-110' : 'text-gray-400'}`}
        >
          <MessageCircle size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Chats</span>
        </button>
        <button 
          onClick={() => setActiveTab('remote')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'remote' ? 'text-blue-500 scale-110' : 'text-gray-400'}`}
        >
          <Zap size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Remote</span>
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'shop' ? 'text-emerald-500 scale-110' : 'text-gray-400'}`}
        >
          <ShoppingBag size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Pharmacy</span>
        </button>
        <button 
          onClick={() => setActiveTab('play')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'play' ? 'text-amber-500 scale-110' : 'text-gray-400'}`}
        >
          <Gamepad2 size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Play</span>
        </button>
      </nav>

      <main className="flex-1 pb-24">
        {activeTab === 'home' ? <WelcomePage onNavigate={setActiveTab} /> :
         activeTab === 'meds' ? <MedicineReminder /> : 
         activeTab === 'chat' ? <AIChats /> :
         activeTab === 'remote' ? <BluetoothController /> :
         activeTab === 'shop' ? <PharmacyDelivery /> :
         <Entertainment />}
        
        <footer className="mt-12 mb-8 text-center bg-transparent pt-8 opacity-60">
          <p className="text-xs font-black uppercase tracking-widest text-[#E29578]">Designed by the students of KIET</p>
          <p className="text-xs font-bold text-gray-400 mt-1">Mahad Naeem - Usman - Faizan - Wajjie</p>
        </footer>
      </main>
    </div>
  );
}
