
import * as React from 'react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { 
  Zap, 
  ShieldCheck, 
  Cloud, 
  Trash2, 
  LogOut, 
  ChevronRight,
  CreditCard,
  Apple,
  Star,
  Lock,
  AppWindow
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface SettingsViewProps {
  isPro: boolean;
  setIsPro: (v: boolean) => void;
}

export function SettingsView({ isPro, setIsPro }: SettingsViewProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubscribe = () => {
    // Simulated Apple Pay Flow
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Processing via App Store...',
        success: () => {
          setIsPro(true);
          setShowUpgrade(false);
          return 'Subscription active! Welcome to PRO.';
        },
        error: 'Subscription failed',
      }
    );
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Account Section */}
      <div className="bg-[#1C1C1E] rounded-[32px] shadow-sm border border-[#2C2C2E] overflow-hidden divide-y divide-[#2C2C2E]">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-[#0A84FF] to-[#BF5AF2] rounded-2xl flex items-center justify-center text-white font-bold text-xl border border-white/10 shadow-lg">
              AR
            </div>
            <div>
              <p className="font-bold text-white tracking-tight">Ajreddy</p>
              <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest mt-0.5">ajreddy981@gmail.com</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-[#3A3A3C] hover:text-white rounded-full">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Pro Banner */}
      {!isPro ? (
        <button 
          onClick={() => setShowUpgrade(true)}
          className="w-full flex items-center justify-between p-5 bg-gradient-to-br from-[#FFD60A] to-[#FF9F0A] rounded-[32px] text-black font-extrabold shadow-xl shadow-yellow-500/20 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 rotate-12 opacity-10 group-hover:scale-110 transition-transform">
            <Zap size={80} fill="black" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2.5 bg-black/10 rounded-2xl backdrop-blur-md border border-black/5">
              <Zap size={20} fill="black" />
            </div>
            <div className="text-left">
              <p className="text-sm uppercase tracking-wider font-extrabold">Go Enterprise</p>
              <p className="text-[10px] font-bold opacity-70">Unlock AI Core & Backups</p>
            </div>
          </div>
          <ChevronRight size={20} className="relative z-10" />
        </button>
      ) : (
        <div className="p-5 bg-[#1C1C1E] rounded-[32px] text-white flex items-center justify-between border border-[#30D158]/20 shadow-lg shadow-green-500/5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#30D158]/10 rounded-2xl border border-[#30D158]/20 text-[#30D158]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">Enterprise Active</p>
              <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest mt-0.5">Renewing May 2027</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
        </div>
      )}

      {/* Main Settings List */}
      <div className="space-y-3">
        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8E8E93] px-2">Security Infrastructure</h3>
        <div className="bg-[#1C1C1E] rounded-[32px] shadow-sm border border-[#2C2C2E] overflow-hidden divide-y divide-[#2C2C2E]">
          <div className="p-4 flex items-center justify-between hover:bg-[#2C2C2E]/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0A84FF]/10 text-[#0A84FF] rounded-xl border border-[#0A84FF]/20">
                <Lock size={18} />
              </div>
              <p className="text-sm font-bold text-white tracking-tight">App Shield (FaceID)</p>
            </div>
            <Switch checked={true} className="data-[state=checked]:bg-[#30D158]" />
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-[#2C2C2E]/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#BF5AF2]/10 text-[#BF5AF2] rounded-xl border border-[#BF5AF2]/20">
                <Cloud size={18} />
              </div>
              <p className="text-sm font-bold text-white tracking-tight">Neural Backup Sync</p>
            </div>
            <Switch checked={isPro} disabled={!isPro} className="data-[state=checked]:bg-[#30D158]" />
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-[#2C2C2E]/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF453A]/10 text-[#FF453A] rounded-xl border border-[#FF453A]/20">
                <Trash2 size={18} />
              </div>
              <p className="text-sm font-bold text-white tracking-tight">Integrity Confirmation</p>
            </div>
            <Switch checked={true} className="data-[state=checked]:bg-[#30D158]" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8E8E93] px-2">System Diagnostics</h3>
        <div className="bg-[#1C1C1E] rounded-[32px] shadow-sm border border-[#2C2C2E] overflow-hidden divide-y divide-[#2C2C2E]">
           <button className="w-full p-4 flex items-center justify-between hover:bg-[#2C2C2E]/20 group transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#121212] rounded-xl border border-[#2C2C2E] text-[#8E8E93]">
                <AppWindow size={18} />
              </div>
              <p className="text-sm font-bold text-white tracking-tight">Core Version</p>
            </div>
            <span className="text-[10px] font-bold text-[#3A3A3C] uppercase tracking-wider">v2.4.0 (Enterprise)</span>
          </button>
           <button className="w-full p-4 flex items-center justify-between hover:bg-[#FF453A]/5 group transition-colors">
             <div className="flex items-center gap-3 text-[#FF453A]">
              <div className="p-2 bg-[#FF453A]/10 rounded-xl border border-[#FF453A]/20">
                <LogOut size={18} />
              </div>
              <p className="text-sm font-bold tracking-tight">Terminate Session</p>
            </div>
            <ChevronRight size={20} className="text-[#3A3A3C] group-hover:text-[#FF453A] transition-colors" />
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent className="sm:max-w-[425px] rounded-[40px] p-0 overflow-hidden border-[#2C2C2E] bg-black">
          <div className="bg-[#121212] h-full relative p-8 text-center space-y-8">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A84FF]/10 to-transparent pointer-events-none" />
            
            <div className="flex justify-center relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#0A84FF] to-[#BF5AF2] rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-500/20 transform rotate-3 active:rotate-0 transition-transform">
                 <Zap size={44} fill="white" className="text-white" />
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <DialogTitle className="text-3xl font-extrabold tracking-tighter text-white">Unlock Enterprise</DialogTitle>
              <DialogDescription className="text-[#8E8E93] font-bold text-xs uppercase tracking-widest">
                The ultimate neural contact architect.
              </DialogDescription>
            </div>

            <div className="space-y-4 text-left py-2 relative z-10 max-w-[240px] mx-auto">
              <FeatureItem text="Neural Conflict Resolution" />
              <FeatureItem text="256-bit Binary Encryption" />
              <FeatureItem text="Unlimited Data Clusters" />
              <FeatureItem text="Smart Logic Analysis" />
            </div>

            <div className="space-y-4 relative z-10">
               <Button 
                onClick={handleSubscribe}
                className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl shadow-white/5"
              >
                <Apple size={22} fill="currentColor" /> Subscribe
              </Button>
              <p className="text-[10px] text-[#3A3A3C] font-bold uppercase tracking-[0.2em] px-4">
                $4.99 / Month • Secured by Cloud Connect
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 bg-[#30D158]/10 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={12} className="text-[#30D158]" />
      </div>
      <span className="text-sm font-bold text-white tracking-tight">{text}</span>
    </div>
  );
}

function CheckCircle2({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
