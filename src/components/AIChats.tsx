import { motion } from 'motion/react';
import { Bot, MessageSquare, Sparkles, Zap, ExternalLink, MessageCircle } from 'lucide-react';

export default function AIChats() {
  const assistants = [
    {
      title: "Google Gemini",
      description: "Google's powerful AI assistant for writing and learning.",
      url: "https://gemini.google.com/",
      icon: <Sparkles className="text-blue-500" size={32} />,
      color: "bg-blue-50",
    },
    {
      title: "ChatGPT",
      description: "Ask questions, get answers, and spark creativity.",
      url: "https://chatgpt.com/",
      icon: <MessageSquare className="text-emerald-500" size={32} />,
      color: "bg-emerald-50",
    },
    {
      title: "Claude",
      description: "Anthropic's helpful and honest AI companion.",
      url: "https://claude.ai/",
      icon: <Zap className="text-orange-500" size={32} />,
      color: "bg-orange-50",
    },
    {
      title: "Grok",
      description: "Real-time AI assistant integrated with X.",
      url: "https://x.com/i/grok",
      icon: <Bot className="text-gray-900" size={32} />,
      color: "bg-gray-100",
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <header className="mb-10 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center md:text-left">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
          <MessageCircle size={28} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Assistants</h2>
        <p className="text-gray-500">Intelligent chat companions to help you with anything.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {assistants.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-6"
          >
            <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>

            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto px-8 py-4 bg-[#1A1A1A] text-white rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 whitespace-nowrap"
            >
              Chat Now
              <ExternalLink size={14} className="opacity-50" />
            </a>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 border border-gray-100 p-8 rounded-[40px] text-center italic">
        <p className="text-gray-500 text-xs">These links open the official websites of the respective AI services.</p>
      </div>
    </div>
  );
}
