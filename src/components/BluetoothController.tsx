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
      onClick={() => sendCommand(cmd)}
      className={`relative w-24 h-24 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-lg ${
        lastCommand === cmd ? 'bg-black text-white' : `${color} text-gray-900`
      } ${status !== 'connected' ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-gray-50'}`}
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
          <h2 className="text-3xl font-black text-gray-900 mb-2">Robot Remote</h2>
          <p className="text-gray-500 font-medium">Control your Bluetooth enabled devices.</p>
        </div>
        
        <button
          onClick={status === 'connected' ? () => device?.gatt?.disconnect() : connect}
          disabled={isConnecting}
          className={`px-6 py-4 rounded-[24px] font-black flex items-center gap-3 transition-all uppercase tracking-widest text-xs ${
            status === 'connected' 
              ? 'bg-blue-50 text-blue-500 shadow-inner' 
              : 'bg-black text-white hover:bg-gray-800 shadow-lg'
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

      <div className="flex flex-col items-center gap-4 py-10">
        {/* Top Row */}
        <ControlButton cmd="F" icon={ChevronUp} color="bg-gray-100" label="Forward" />

        {/* Middle Row */}
        <div className="flex gap-8 items-center">
          <ControlButton cmd="L" icon={ChevronLeft} color="bg-gray-100" label="Left" />
          <button
            onClick={() => sendCommand('S')}
            className={`w-24 h-24 bg-rose-500 text-white rounded-full flex flex-col items-center justify-center gap-1 shadow-lg hover:bg-rose-600 transition-all active:scale-90 ${status !== 'connected' ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            disabled={status !== 'connected'}
          >
            <Square size={32} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Stop</span>
          </button>
          <ControlButton cmd="R" icon={ChevronRight} color="bg-gray-100" label="Right" />
        </div>

        {/* Bottom Row */}
        <ControlButton cmd="B" icon={ChevronDown} color="bg-gray-100" label="Backward" />
      </div>

      {status !== 'connected' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 bg-[#F9FAFB] border border-dashed border-gray-200 rounded-[32px] p-6 flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <Zap size={20} />
          </div>
          <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tight">Robot Not Linked</h3>
          <p className="text-gray-400 max-w-xs mb-4 text-[11px] font-medium leading-relaxed">Tap "Connect Robot" at the top to start controlling your hardware.</p>
          
          <div className="flex items-start gap-2 text-left bg-blue-50 p-3 rounded-xl max-w-sm">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
            <p className="text-[9px] text-blue-800 leading-relaxed">
              Arduino Serial: Listening for 'F', 'B', 'L', 'R', and 'S'. (9600 baud)
            </p>
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <div className="mt-6 flex flex-col gap-3">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-center text-xs font-bold uppercase tracking-widest">
            Connection failed. Make sure Bluetooth is enabled and the device is in range.
          </div>
          
          <div className="p-4 bg-gray-50 border border-black rounded-2xl text-center">
            <p className="text-black text-xs font-bold mb-2">💡 Iframe Restriction Detected</p>
            <p className="text-gray-500 text-[10px] leading-relaxed">
              Web Bluetooth is often blocked in embedded windows. If you see a "Disallowed by Permission Policy" error, please 
              <span className="text-black font-bold block mt-1 uppercase tracking-widest">OPEN THIS APP IN A NEW TAB</span>
              to enable secure device connection.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
