import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Bluetooth, BluetoothOff, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square, Zap, Info } from 'lucide-react';

export default function BluetoothController() {
  const [device, setDevice] = useState<any>(null);
  const [characteristic, setCharacteristic] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  // For generic Bluetooth Serial (HM-10, HC-08 etc)
  const UUID_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb';
  const UUID_CHAR = '0000ffe1-0000-1000-8000-00805f9b34fb';

  const connect = async () => {
    setIsConnecting(true);
    setStatus('disconnected');
    try {
      const bluetoothDevice = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: [UUID_SERVICE] }, { namePrefix: 'HC-' }, { namePrefix: 'BT' }, { namePrefix: 'HM-' }],
        optionalServices: ['generic_access', UUID_SERVICE]
      });

      setDevice(bluetoothDevice);
      const server = await bluetoothDevice.gatt?.connect();
      const service = await server?.getPrimaryService(UUID_SERVICE);
      const char = await service?.getCharacteristic(UUID_CHAR);

      setCharacteristic(char || null);
      setStatus('connected');
      
      bluetoothDevice.addEventListener('gattserverdisconnected', () => {
        setStatus('disconnected');
        setCharacteristic(null);
        setDevice(null);
      });
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        // User cancelled the dialog, just reset to disconnected
        setStatus('disconnected');
      } else {
        console.error(err);
        setStatus('error');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const sendCommand = async (cmd: string) => {
    if (!characteristic) return;
    try {
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(cmd));
      setLastCommand(cmd);
      // Reset last command highlight after a moment
      setTimeout(() => setLastCommand(null), 200);
    } catch (err) {
      console.error("Failed to send command:", err);
      setStatus('disconnected');
    }
  };

  const ControlButton = ({ cmd, icon: Icon, color, label }: { cmd: string, icon: any, color: string, label: string }) => (
    <button
      onMouseDown={() => sendCommand(cmd)}
      onMouseUp={() => sendCommand('S')} // Optional: Stop on release
      onTouchStart={() => sendCommand(cmd)}
      onTouchEnd={() => sendCommand('S')}
      className={`relative w-24 h-24 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all active:scale-90 shadow-lg ${
        lastCommand === cmd ? 'bg-white scale-95 shadow-inner' : `${color} text-white`
      } ${status !== 'connected' ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:brightness-110'}`}
      disabled={status !== 'connected'}
    >
      <Icon size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <header className="mb-8 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Robot Remote</h2>
          <p className="text-gray-500">Control your Bluetooth enabled devices.</p>
        </div>
        
        <button
          onClick={status === 'connected' ? () => device?.gatt?.disconnect() : connect}
          disabled={isConnecting}
          className={`px-6 py-4 rounded-[24px] font-bold flex items-center gap-3 transition-all ${
            status === 'connected' 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-[#1A1A1A] text-white hover:bg-gray-800'
          }`}
        >
          {isConnecting ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Bluetooth size={20} />
            </motion.div>
          ) : status === 'connected' ? <Bluetooth size={20} /> : <BluetoothOff size={20} />}
          {isConnecting ? 'Linking...' : status === 'connected' ? 'Connected' : 'Connect Robot'}
        </button>
      </header>

      {status === 'connected' ? (
        <div className="flex flex-col items-center gap-8 py-10">
          {/* Top Row */}
          <ControlButton cmd="F" icon={ChevronUp} color="bg-blue-500" label="Forward" />

          {/* Middle Row */}
          <div className="flex gap-8 items-center">
            <ControlButton cmd="L" icon={ChevronLeft} color="bg-blue-500" label="Left" />
            <button
              onClick={() => sendCommand('S')}
              className="w-24 h-24 bg-red-500 text-white rounded-full flex flex-col items-center justify-center gap-1 shadow-xl hover:bg-red-600 transition-all active:scale-90"
            >
              <Square size={32} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Stop</span>
            </button>
            <ControlButton cmd="R" icon={ChevronRight} color="bg-blue-500" label="Right" />
          </div>

          {/* Bottom Row */}
          <ControlButton cmd="B" icon={ChevronDown} color="bg-blue-500" label="Reverse" />
          
          <div className="mt-8 flex gap-4">
               <button onClick={() => sendCommand('1')} className="px-6 py-3 bg-gray-100 rounded-2xl text-xs font-bold hover:bg-gray-200">AUX 1</button>
               <button onClick={() => sendCommand('2')} className="px-6 py-3 bg-gray-100 rounded-2xl text-xs font-bold hover:bg-gray-200">AUX 2</button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-200 rounded-[40px] py-20 flex flex-col items-center text-center px-10"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Robot Connected</h3>
          <p className="text-gray-500 max-w-xs mb-8 text-sm">Bring your Bluetooth device close and tap "Connect Robot" to start controlling it.</p>
          
          <div className="flex items-start gap-3 text-left bg-blue-50 p-4 rounded-2xl max-w-sm">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Ensure your Arduino is running a standard Serial Bluetooth sketch (9600 baud) and listening for characters: 'F', 'B', 'L', 'R', and 'S'.
            </p>
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-medium">
          Connection failed. Make sure Bluetooth is enabled and the device is in range.
        </div>
      )}
    </div>
  );
}
