import { motion } from 'motion/react';
import { ExternalLink, ShoppingCart, Truck, Clock, ShieldCheck, Search } from 'lucide-react';

export default function PharmacyDelivery() {
  const pharmacies = [
    {
      name: "Dawaai",
      url: "https://dawaai.pk/",
      description: "Leading online pharmacy in Pakistan with home delivery.",
      color: "bg-blue-600",
      accent: "text-blue-600",
      label: "D"
    },
    {
      name: "DVAGO",
      url: "https://www.dvago.pk/",
      description: "Reliable pharmacy chain providing original medicines.",
      color: "bg-emerald-600",
      accent: "text-emerald-600",
      label: "DV"
    },
    {
      name: "emeds",
      url: "https://emeds.pk/",
      description: "Order prescription drugs & healthcare products online.",
      color: "bg-indigo-600",
      accent: "text-indigo-600",
      label: "E"
    },
    {
      name: "Sehat",
      url: "https://sehat.com.pk/",
      description: "A project of Fazal Din & Sons with national reach.",
      color: "bg-[#E29578]",
      accent: "text-[#E29578]",
      label: "S"
    },
    {
      name: "Meri Pharmacy",
      url: "https://meripharmacy.pk/",
      description: "One stop shop for all your healthcare needs.",
      color: "bg-rose-600",
      accent: "text-rose-600",
      label: "M"
    },
    {
      name: "MedicalStore.com.pk",
      url: "https://www.medicalstore.com.pk/",
      description: "Reliable distribution for consumer health products.",
      color: "bg-cyan-600",
      accent: "text-cyan-600",
      label: "MS"
    },
    {
      name: "PillBox",
      url: "https://pillbox.pk/",
      description: "Quick and easy medication delivery to your doorstep.",
      color: "bg-orange-600",
      accent: "text-orange-600",
      label: "PB"
    },
    {
      name: "Bin Hashim Pharmacy",
      url: "https://binhashimonline.pk/",
      description: "Trusted healthcare and pharmacy services.",
      color: "bg-green-700",
      accent: "text-green-700",
      label: "BH"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <header className="mb-10 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center shrink-0">
            <ShoppingCart size={40} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Medicine Delivery</h2>
            <p className="text-gray-500 text-lg">Order original medications from trusted companies in Pakistan.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
            <Truck className="text-emerald-500" size={20} />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
            <ShieldCheck className="text-blue-500" size={20} />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">100% Original</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
            <Clock className="text-amber-500" size={20} />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">24/7 Support</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pharmacies.map((shop, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col gap-4"
            onClick={() => window.open(shop.url, '_blank')}
          >
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 ${shop.color} text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white`}>
                {shop.label}
              </div>
              <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                <ExternalLink className="text-gray-400 group-hover:text-emerald-500" size={18} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{shop.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{shop.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${shop.accent}`}>Verified Pakistan Company</span>
              <button className="text-[11px] font-bold text-gray-400 group-hover:text-black transition-colors">Visit Store →</button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-[#1A1A1A] p-8 rounded-[40px] text-center dark">
        <h3 className="text-white font-bold text-lg mb-2">Need a specific medicine?</h3>
        <p className="text-gray-400 text-sm mb-6">Search across multiple platforms for the best price and availability.</p>
        <div className="flex bg-white/10 rounded-2xl p-1 max-w-md mx-auto focus-within:ring-2 ring-emerald-500">
          <input 
            type="text" 
            placeholder="Search medicine brand..." 
            className="bg-transparent text-white px-4 py-3 flex-1 outline-none text-sm"
          />
          <button className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-gray-300">
          * Pharmacy links are for informational purposes. Always consult a doctor before consumption.
        </p>
      </div>
    </div>
  );
}
