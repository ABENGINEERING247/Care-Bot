import { motion } from 'motion/react';
import { Youtube, Trophy, ExternalLink, Play, Bot, MessageSquare, Sparkles, Zap } from 'lucide-react';

export default function Entertainment() {
  const links = [
    {
      title: "Dr. Sulman Feroz",
      description: "Health and wellness guidance videos.",
      url: "https://youtube.com/@drsulmanferoz?si=Sbed-LHwLsA3PWKZ",
      icon: <Youtube className="text-red-600" size={32} />,
      type: "Videos",
      color: "bg-red-50",
      btnText: "Watch Now"
    },
    {
      title: "Cricket World Cup",
      description: "Play classic cricket games online.",
      url: "https://poki.com/en/g/cricket-world-cup",
      icon: <Trophy className="text-amber-500" size={32} />,
      type: "Game",
      color: "bg-amber-50",
      btnText: "Play Now"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <header className="mb-10 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Entertainment Hub</h2>
        <p className="text-gray-500 font-medium">Relax, watch, and play on your CareBot Tablet.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {links.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-all"
          >
            <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-1 block">
                {item.type}
              </span>
              <h3 className="text-2xl font-black text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>

            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto px-8 py-4 bg-black text-white rounded-[24px] font-black flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 whitespace-nowrap"
            >
              <Play size={18} fill="currentColor" />
              {item.btnText}
              <ExternalLink size={14} />
            </a>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-8 rounded-[40px] text-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
          <Play size={20} fill="currentColor" />
        </div>
        <h4 className="font-black text-gray-900 mb-1 uppercase tracking-tight">More content coming soon</h4>
        <p className="text-gray-400 text-sm">We are adding more carefully picked games and videos for you.</p>
      </div>
    </div>
  );
}
