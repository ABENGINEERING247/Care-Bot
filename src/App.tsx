/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import MedicineReminder from './components/MedicineReminder';
import Entertainment from './components/Entertainment';
import { Pill, Gamepad2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'meds' | 'play'>('meds');

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
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
          onClick={() => setActiveTab('play')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'play' ? 'text-[#3282B8] scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <Gamepad2 size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Play</span>
        </button>
      </nav>

      <main className="flex-1 pb-24">
        {activeTab === 'meds' ? <MedicineReminder /> : <Entertainment />}
      </main>
    </div>
  );
}
