import { motion } from 'motion/react';
import { Pill, Zap, MessageCircle, ShoppingBag, Gamepad2, ChevronRight, Heart } from 'lucide-react';

interface WelcomePageProps {
  onNavigate: (tab: 'meds' | 'play' | 'chat' | 'remote' | 'shop') => void;
}

export default function WelcomePage({ onNavigate }: WelcomePageProps) {
  const features = [
    {
      id: 'meds',
      title: 'Medicine Manager',
      description: 'Schedule your pills and track daily doses.',
      icon: Pill,
      color: 'bg-[#E29578]',
      lightColor: 'bg-[#E29578]/10',
      textColor: 'text-[#E29578]'
    },
    {
      id: 'remote',
      title: 'HC-05 Remote',
      description: 'Connect and control your hardware via Bluetooth.',
      icon: Zap,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50/50',
      textColor: 'text-blue-500'
    },
    {
      id: 'chat',
      title: 'AI Care Chat',
      description: 'Ask anything about your health or medicines.',
      icon: MessageCircle,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-500'
    },
    {
      id: 'shop',
      title: 'Pharmacy Delivery',
      description: 'Order original medicines from top stores.',
      icon: ShoppingBag,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-500'
    },
    {
      id: 'play',
      title: 'Entertainment',
      description: 'Relax with music and mindful activities.',
      icon: Gamepad2,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-500'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 mt-8"
      >
        <div className="inline-flex items-center gap-2 bg-[#E29578]/10 px-4 py-2 rounded-full text-[#E29578] mb-6 font-bold text-xs uppercase tracking-widest">
          <Heart size={14} className="fill-current text-[#E29578]" />
          CareBot Personal Assistant
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
          Welcome to <span className="text-[#E29578]">CareBot</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
          Your smart medicine assistant designed for better health and easier medication management.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => onNavigate(item.id as any)}
            className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center gap-6"
          >
            <div className={`w-20 h-20 ${item.lightColor} ${item.textColor} rounded-3xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
              <item.icon size={36} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 bg-[#1A1A1A] p-10 rounded-[48px] text-white text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E29578] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <h2 className="text-4xl font-black mb-2">Smart Care for Your Elders</h2>
        <p className="text-gray-400 font-medium mb-0">Experience the future of healthcare assistance at your fingertips.</p>
      </motion.div>
    </div>
  );
}
