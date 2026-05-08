import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Pill, 
  Clock, 
  Volume2, 
  VolumeX, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Bell,
  X,
  Edit2
} from 'lucide-react';
import { Medicine } from '../types';

export default function MedicineReminder() {
  const [meds, setMeds] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('carebot_meds');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeAlarm, setActiveAlarm] = useState<Medicine | null>(null);
  const [snoozedMeds, setSnoozedMeds] = useState<Record<string, number>>({});
  
  // Form State
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [dosage, setDosage] = useState('');
  const [voice, setVoice] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [inventoryCount, setInventoryCount] = useState<string>('');
  const [inventoryThreshold, setInventoryThreshold] = useState<string>('5');

  const DAYS = [
    { label: 'S', value: 0, full: 'Sunday' },
    { label: 'M', value: 1, full: 'Monday' },
    { label: 'T', value: 2, full: 'Tuesday' },
    { label: 'W', value: 3, full: 'Wednesday' },
    { label: 'T', value: 4, full: 'Thursday' },
    { label: 'F', value: 5, full: 'Friday' },
    { label: 'S', value: 6, full: 'Saturday' },
  ];

  // Persistence
  useEffect(() => {
    localStorage.setItem('carebot_meds', JSON.stringify(meds));
  }, [meds]);

  // Alarm Check Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const dueMed = meds.find(m => {
        const isScheduledTime = m.time === currentTime && m.days.includes(currentDay) && !m.taken;
        const isSnoozeTime = snoozedMeds[m.id] && now.getTime() >= snoozedMeds[m.id];
        
        // Don't re-trigger if it was just snoozed for the future
        if (isScheduledTime && snoozedMeds[m.id] && snoozedMeds[m.id] > now.getTime()) return false;
        
        return isScheduledTime || isSnoozeTime;
      });

      if (dueMed && activeAlarm?.id !== dueMed.id) {
        if (snoozedMeds[dueMed.id] && now.getTime() >= snoozedMeds[dueMed.id]) {
          setSnoozedMeds(prev => {
            const next = { ...prev };
            delete next[dueMed.id];
            return next;
          });
        }
        triggerAlarm(dueMed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [meds, activeAlarm]);

  // Repeating Voice Alarm
  useEffect(() => {
    let voiceInterval: NodeJS.Timeout;

    if (activeAlarm && activeAlarm.voiceEnabled) {
      const message = `Attention. It is time to take your ${activeAlarm.dosage} of ${activeAlarm.name}. Please confirm when taken.`;
      
      // Speak immediately
      speak(message);

      // Repeat every 12 seconds (allowing time for the message to finish)
      voiceInterval = setInterval(() => {
        speak(message);
      }, 12000);
    }

    return () => {
      if (voiceInterval) clearInterval(voiceInterval);
      window.speechSynthesis.cancel();
    };
  }, [activeAlarm]);

  const triggerAlarm = (med: Medicine) => {
    setActiveAlarm(med);
  };

  const saveMedication = () => {
    if (!name || !time || selectedDays.length === 0) return;
    
    if (editingId) {
      setMeds(meds.map(m => m.id === editingId ? {
        ...m,
        name,
        time,
        dosage: dosage || '1 dose',
        voiceEnabled: voice,
        days: selectedDays,
        inventoryCount: inventoryCount !== '' ? parseInt(inventoryCount) : undefined,
        inventoryWarningThreshold: inventoryThreshold !== '' ? parseInt(inventoryThreshold) : 5
      } : m).sort((a, b) => a.time.localeCompare(b.time)));
    } else {
      const newMed: Medicine = {
        id: crypto.randomUUID(),
        name,
        time,
        dosage: dosage || '1 dose',
        instructions: '',
        voiceEnabled: voice,
        taken: false,
        days: selectedDays,
        inventoryCount: inventoryCount !== '' ? parseInt(inventoryCount) : undefined,
        inventoryWarningThreshold: inventoryThreshold !== '' ? parseInt(inventoryThreshold) : 5
      };
      setMeds([...meds, newMed].sort((a, b) => a.time.localeCompare(b.time)));
    }
    
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const startEditing = (med: Medicine) => {
    setEditingId(med.id);
    setName(med.name);
    setTime(med.time);
    setDosage(med.dosage);
    setVoice(med.voiceEnabled);
    setSelectedDays(med.days);
    setInventoryCount(med.inventoryCount?.toString() || '');
    setInventoryThreshold(med.inventoryWarningThreshold?.toString() || '5');
    setIsAdding(true);
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const [voiceVolume, setVoiceVolume] = useState(() => {
    const saved = localStorage.getItem('carebot_voice_volume');
    return saved ? parseFloat(saved) : 1.0;
  });

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = voiceVolume;
      window.speechSynthesis.speak(utterance);
    }
  };

  const resetForm = () => {
    setName('');
    setTime('');
    setDosage('');
    setVoice(true);
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setInventoryCount('');
    setInventoryThreshold('5');
    setEditingId(null);
  };

  const removeMed = (id: string) => {
    if (editingId === id) setEditingId(null);
    setMeds(meds.filter(m => m.id !== id));
  };

  const acknowledgeMed = (id: string) => {
    setMeds(meds.map(m => m.id === id ? { 
      ...m, 
      taken: true,
      inventoryCount: m.inventoryCount !== undefined ? Math.max(0, m.inventoryCount - 1) : undefined
    } : m));
    setSnoozedMeds(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setActiveAlarm(null);
    window.speechSynthesis.cancel();
  };

  const snoozeMed = (id: string, minutes: number = 5) => {
    const snoozeTime = Date.now() + minutes * 60 * 1000;
    setSnoozedMeds(prev => ({ ...prev, [id]: snoozeTime }));
    setActiveAlarm(null);
    window.speechSynthesis.cancel();
  };

  const acknowledgeAllDue = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setMeds(meds.map(m => {
      const isDue = (m.days.includes(currentDay) && m.time === currentTime && !m.taken);
      const isSnoozed = snoozedMeds[m.id] && now.getTime() >= snoozedMeds[m.id];
      if (isDue || isSnoozed) {
        return { 
          ...m, 
          taken: true,
          inventoryCount: m.inventoryCount !== undefined ? Math.max(0, m.inventoryCount - 1) : undefined
        };
      }
      return m;
    }));

    setSnoozedMeds({}); // Clear all snoozes
    setActiveAlarm(null);
    window.speechSynthesis.cancel();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen font-sans bg-[#F9FAFB]">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="text-[#E29578]" /> CareBot Meds
          </h1>
          <p className="text-gray-500 text-sm">Reliable reminders for your health</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#1A1A1A] hover:bg-gray-800 text-white p-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Med List */}
      <div className="space-y-4">
        {meds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-gray-300 mb-2" size={48} />
            <p className="text-gray-400">No medicines scheduled yet.</p>
          </div>
        ) : (
          meds.map((med) => (
            <motion.div
              layout
              key={med.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-4 p-5 rounded-3xl border transition-all ${
                med.taken 
                  ? 'bg-gray-50 border-transparent opacity-60' 
                  : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <div className={`p-4 rounded-2xl ${med.taken ? 'bg-gray-100' : 'bg-[#E29578]/10 text-[#E29578]'}`}>
                <Clock size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold text-lg ${med.taken ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {med.name}
                  </h3>
                  {med.voiceEnabled ? <Volume2 size={14} className="text-gray-400" /> : <VolumeX size={14} className="text-gray-300" />}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">{med.time} • {med.dosage}</p>
                  
                  {med.inventoryCount !== undefined && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        med.inventoryCount <= (med.inventoryWarningThreshold || 5)
                        ? 'bg-rose-100 text-rose-600 animate-pulse'
                        : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {med.inventoryCount} left
                      </div>
                      {med.inventoryCount <= (med.inventoryWarningThreshold || 5) && (
                        <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                          <AlertCircle size={10} /> Low Stock
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-1 mt-1">
                    {DAYS.map(d => (
                      <span 
                        key={d.value} 
                        className={`text-[9px] font-bold px-1 rounded ${med.days?.includes(d.value) ? 'bg-[#E29578]/20 text-[#E29578]' : 'bg-gray-100 text-gray-300'}`}
                      >
                        {d.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {!med.taken && (
                  <>
                    <button 
                      onClick={() => acknowledgeMed(med.id)}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 size={24} />
                    </button>
                    <button 
                      onClick={() => startEditing(med)}
                      className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => removeMed(med.id)}
                  className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Dialog Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingId ? 'Edit Reminder' : 'New Reminder'}</h2>
                <button onClick={() => { setIsAdding(false); resetForm(); }} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Medicine Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="e.g. Paracetamol"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border-none p-4 rounded-2xl text-lg focus:ring-2 focus:ring-[#E29578] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Time</label>
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-gray-50 border-none p-4 rounded-2xl text-lg focus:ring-2 focus:ring-[#E29578] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Dosage</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500mg"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="w-full bg-gray-50 border-none p-4 rounded-2xl text-lg focus:ring-2 focus:ring-[#E29578] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Repeat Days</label>
                  <div className="flex justify-between gap-1">
                    {DAYS.map(day => (
                      <button
                        key={day.value}
                        onClick={() => toggleDay(day.value)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          selectedDays.includes(day.value) 
                            ? 'bg-[#E29578] text-white' 
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Pills</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 30"
                      value={inventoryCount}
                      onChange={(e) => setInventoryCount(e.target.value)}
                      className="w-full bg-gray-50 border-none p-4 rounded-2xl text-lg focus:ring-2 focus:ring-[#E29578] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Low Stock Alert</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 5"
                      value={inventoryThreshold}
                      onChange={(e) => setInventoryThreshold(e.target.value)}
                      className="w-full bg-gray-50 border-none p-4 rounded-2xl text-lg focus:ring-2 focus:ring-[#E29578] outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setVoice(!voice)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${voice ? 'bg-[#E29578]/10 text-[#E29578] border border-[#E29578]/20' : 'bg-gray-50 text-gray-400'}`}
                >
                  <div className="flex items-center gap-3">
                    {voice ? <Volume2 /> : <VolumeX />}
                    <span className="font-medium">Voice Alarms</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${voice ? 'bg-[#E29578]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${voice ? 'left-5' : 'left-1'}`} />
                  </div>
                </button>

                {voice && (
                  <div className="space-y-3 px-1">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                      <span>Alarm Volume</span>
                      <span>{Math.round(voiceVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={voiceVolume}
                      onChange={(e) => {
                        const newVol = parseFloat(e.target.value);
                        setVoiceVolume(newVol);
                        localStorage.setItem('carebot_voice_volume', newVol.toString());
                        speak("Volume test");
                      }}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#E29578]"
                    />
                  </div>
                )}

                <button 
                  onClick={saveMedication}
                  className="w-full bg-[#1A1A1A] text-white py-5 rounded-[24px] font-bold text-lg hover:shadow-xl hover:shadow-black/10 transition-all active:scale-[0.98]"
                >
                  {editingId ? 'Update Reminder' : 'Save Reminder'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Active Alarm UI */}
      <AnimatePresence>
        {activeAlarm && (
          <div className="fixed inset-0 bg-rose-500 z-[100] flex items-center justify-center p-6 text-white text-center overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative z-10 space-y-10"
            >
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Bell size={64} />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-6xl font-black uppercase tracking-tighter">Time for Medicine!</h2>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20">
                  <h3 className="text-4xl font-bold mb-2">{activeAlarm.name}</h3>
                  <p className="text-2xl opacity-80">{activeAlarm.dosage}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full max-w-sm mx-auto">
                <button 
                  onClick={() => acknowledgeMed(activeAlarm.id)}
                  className="bg-white text-rose-500 py-6 rounded-[32px] font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  I HAVE TAKEN IT
                </button>
                <button 
                  onClick={acknowledgeAllDue}
                  className="bg-white/20 text-white border border-white/40 py-4 rounded-[32px] font-black text-xl shadow-lg hover:bg-white/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={24} />
                  DISMISS ALL
                </button>
                <button 
                  onClick={() => snoozeMed(activeAlarm.id, 5)}
                  className="bg-transparent text-white/60 py-4 rounded-full font-bold hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Clock size={20} />
                  Remind me in 5 mins
                </button>
              </div>
            </motion.div>
            
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
