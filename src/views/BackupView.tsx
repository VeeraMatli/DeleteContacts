
import * as React from 'react';
import { Contact, Backup } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  RefreshCcw, 
  History, 
  ShieldCheck, 
  Database,
  CloudLightning,
  ChevronRight,
  Clock,
  ArrowDownToLine
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface BackupViewProps {
  backups: Backup[];
  onCreate: (name: string) => Promise<void>;
  contacts: Contact[];
}

export function BackupView({ backups, onCreate, contacts }: BackupViewProps) {
  const handleBackup = async () => {
    if (contacts.length === 0) {
      toast.error('No contacts to backup');
      return;
    }
    const name = `Backup ${new Date().toLocaleDateString()}`;
    await onCreate(name);
    toast.success('Backup created successfully');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Current State Card */}
      <Card className="rounded-3xl border-0 shadow-xl shadow-blue-500/10 overflow-hidden bg-gradient-to-br from-[#0A84FF] to-[#121212] text-white relative">
        <div className="absolute top-0 right-0 p-8 rotate-12 translate-x-12 -translate-y-6 opacity-10">
          <Database size={160} />
        </div>
        <CardContent className="p-6 space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
              <Database size={24} className="text-white" />
            </div>
            <div className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
              <ShieldCheck size={14} className="text-blue-100" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Cloud Backup</h2>
            <p className="text-blue-100/60 text-xs font-medium">Encrypted storage for your contact library.</p>
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleBackup}
              className="w-full bg-white text-[#0A84FF] hover:bg-blue-50 rounded-2xl h-12 font-bold shadow-lg transition-transform active:scale-95"
            >
              <RefreshCcw size={18} className="mr-2" /> 
              Backup {contacts.length} Contacts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8E8E93] flex items-center gap-2">
            <History size={14} /> Backup History
          </h3>
          {backups.length > 0 && <span className="text-[8px] bg-[#2C2C2E] px-1.5 py-0.5 rounded text-[#8E8E93] font-bold uppercase tracking-wider">{backups.length} archived</span>}
        </div>

        <div className="bg-[#1C1C1E] rounded-2xl shadow-sm border border-[#2C2C2E] overflow-hidden divide-y divide-[#2C2C2E]">
          {backups.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-[#2C2C2E] rounded-full flex items-center justify-center mx-auto border border-[#3A3A3C]">
                <Clock size={24} className="text-[#3A3A3C]" />
              </div>
              <p className="text-[#8E8E93] text-sm font-bold tracking-tight">System ready for backup</p>
            </div>
          ) : (
            backups.map(backup => (
              <div key={backup.id} className="p-4 flex items-center justify-between hover:bg-[#2C2C2E]/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#2C2C2E] text-[#0A84FF] rounded-xl flex items-center justify-center border border-[#3A3A3C] shadow-inner">
                    <CloudLightning size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{backup.name}</p>
                    <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider mt-0.5">
                      {formatDistanceToNow(backup.timestamp)} ago • {backup.contactCount} units
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full text-[#3A3A3C] group-hover:text-[#0A84FF] group-hover:bg-[#0A84FF]/10 transition-all">
                  <ArrowDownToLine size={20} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-5 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck size={64} className="text-[#30D158]" />
        </div>
        <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-[#30D158]" /> Advanced Protection
        </h4>
        <p className="text-xs text-[#8E8E93] leading-relaxed font-medium">
          All archives are secured with <span className="text-white">AES-256 binary encryption</span>. Your data is isolated in your dedicated cloud instance and never shared with third parties.
        </p>
      </div>
    </div>
  );
}
