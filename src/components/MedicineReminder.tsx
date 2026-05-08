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
  
  // Form State
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [dosage, setDosage] = useState('');
  const [voice, setVoice] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

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
      
      const dueMed = meds.find(m => 
        m.time === currentTime && 
        !m.taken && 
        m.days.includes(currentDay)
      );
      if (dueMed && activeAlarm?.id !== dueMed.id) {
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

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for clarity
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
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
        days: selectedDays
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
        days: selectedDays
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
    setIsAdding(true);
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const resetForm = () => {
    setName('');
    setTime('');
    setDosage('');
    setVoice(true);
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setEditingId(null);
  };

  const removeMed = (id: string) => {
    if (editingId === id) setEditingId(null);
    setMeds(meds.filter(m => m.id !== id));
  };

  const acknowledgeMed = (id: string) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: true } : m));
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
                  <div className="flex gap-1">
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
                  onClick={() => setActiveAlarm(null)}
                  className="bg-transparent text-white/60 py-4 rounded-full font-bold hover:text-white transition-colors"
                >
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
