
import * as React from 'react';
import { useState, useMemo } from 'react';
import { Contact, DuplicateGroup } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { findDuplicates, mergeContacts } from '../lib/contacts-utils';
import { 
  Users, 
  Copy, 
  ChevronRight, 
  ShieldCheck, 
  Info,
  Layers,
  Merge,
  ArrowRight,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface DuplicatesViewProps {
  contacts: Contact[];
  isPro: boolean;
  onUpgrade: () => void;
}

export function DuplicatesView({ contacts, isPro, onUpgrade }: DuplicatesViewProps) {
  const duplicates = useMemo(() => findDuplicates(contacts), [contacts]);
  
  const groupsByType = {
    exact: duplicates.filter(d => d.type === 'exact'),
    'same-name': duplicates.filter(d => d.type === 'same-name'),
    'duplicate-data': duplicates.filter(d => d.type === 'duplicate-data'),
  };

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const handleMerge = (group: DuplicateGroup) => {
    if (!isPro) {
      onUpgrade();
      toast.error('PRO feature: Merging requires a subscription');
      return;
    }
    // In a real app, we would update DB here
    toast.success('Contacts merged successfully (Demo)');
  };

  const handleAutoMergeAll = () => {
    if (!isPro) {
      onUpgrade();
      return;
    }
    toast.success('Auto-merged all certain duplicates');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Pro Teaser */}
      {!isPro && (
        <div 
          onClick={onUpgrade}
          className="p-5 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-3xl text-white shadow-xl border border-[#3A3A3C] cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 rotate-12 translate-x-4 -translate-y-4 opacity-5">
            <Zap size={140} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-[#FFD60A] text-black border-0 hover:bg-[#FFD60A]/90 font-bold tracking-wider rounded-md">PRO</Badge>
              <Zap size={20} className="text-[#FFD60A] animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Smart Merge</h3>
              <p className="text-[#8E8E93] text-sm font-medium">Analyze and resolve contact conflicts automatically.</p>
            </div>
            <Button variant="secondary" className="w-full bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90 border-0 rounded-2xl h-12 font-bold transition-all shadow-lg shadow-blue-500/20">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard 
          icon={<Copy size={20} className="text-[#FF453A]" />} 
          label="Exact" 
          count={groupsByType.exact.length} 
          color="red"
        />
        <StatsCard 
          icon={<Users size={20} className="text-[#FF9F0A]" />} 
          label="Same Name" 
          count={groupsByType["same-name"].length} 
          color="orange"
        />
        <StatsCard 
          icon={<Layers size={20} className="text-[#BF5AF2]" />} 
          label="Duplicates" 
          count={groupsByType["duplicate-data"].length} 
          color="purple"
        />
        <StatsCard 
          icon={<Info size={20} className="text-[#0A84FF]" />} 
          label="Total Units" 
          count={duplicates.reduce((acc, curr) => acc + curr.contacts.length, 0)} 
          color="blue"
        />
      </div>

      {isPro && duplicates.length > 0 && (
        <div className="pt-2">
          <Button onClick={handleAutoMergeAll} className="w-full h-12 rounded-2xl bg-[#0A84FF] text-white font-bold hover:bg-[#0A84FF]/90 shadow-lg shadow-blue-500/20">
            <Merge size={18} className="mr-2" /> One-Tap Merge All
          </Button>
        </div>
      )}

      {/* List Sections */}
      <div className="space-y-8">
        <GroupSection 
          title="Exact Duplicates" 
          groups={groupsByType.exact} 
          onMerge={handleMerge}
          isPro={isPro}
        />
        <GroupSection 
          title="Similar Records" 
          groups={groupsByType["same-name"]} 
          onMerge={handleMerge}
          isPro={isPro}
        />
        <GroupSection 
          title="Data Conflicts" 
          groups={groupsByType["duplicate-data"]} 
          onMerge={handleMerge}
          isPro={isPro}
        />
      </div>

      {duplicates.length === 0 && (
        <div className="p-16 text-center space-y-4 bg-[#1C1C1E] rounded-[40px] border border-[#2C2C2E] shadow-sm">
          <div className="w-16 h-16 bg-[#0A84FF]/10 rounded-3xl flex items-center justify-center mx-auto text-[#0A84FF] border border-[#0A84FF]/20">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold text-lg tracking-tight">Zero Conflicts</p>
            <p className="text-sm text-[#8E8E93] font-medium leading-relaxed">Your contact library is perfectly organized and clean.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ icon, label, count, color }: { icon: React.ReactNode, label: string, count: number, color: string }) {
  const borderColors = {
    red: 'border-[#FF453A]/20',
    orange: 'border-[#FF9F0A]/20',
    purple: 'border-[#BF5AF2]/20',
    blue: 'border-[#0A84FF]/20',
  };
  
  return (
    <div className={`p-5 rounded-3xl border bg-[#1C1C1E] ${borderColors[color as keyof typeof borderColors]} transition-all hover:bg-[#2C2C2E] cursor-default border-solid`}>
      <div className="mb-4">{icon}</div>
      <div className="text-3xl font-bold tracking-tighter text-white mb-1">{count}</div>
      <div className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}

function GroupSection({ title, groups, onMerge, isPro }: { title: string, groups: DuplicateGroup[], onMerge: (g: DuplicateGroup) => void, isPro: boolean }) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-[0.2em] px-2">{title}</h3>
      <div className="bg-[#1C1C1E] rounded-3xl shadow-sm border border-[#2C2C2E] overflow-hidden divide-y divide-[#2C2C2E]">
        {groups.map(group => (
          <div key={group.id} className="p-4 flex items-center justify-between group hover:bg-[#2C2C2E]/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {group.contacts.slice(0, 3).map((c, i) => (
                  <div key={c.id} className="w-10 h-10 rounded-full bg-[#1C1C1E] border-2 border-[#2C2C2E] flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ zIndex: 3 - i }}>
                    {c.firstName[0]}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold text-white text-sm tracking-tight">{group.contacts[0].firstName} {group.contacts[0].lastName}</p>
                <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">{group.contacts.length} items • {group.reason}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMerge(group)}
              className="rounded-xl h-9 px-4 text-[#0A84FF] hover:bg-[#0A84FF]/10 font-bold transition-all group-hover:translate-x-1"
            >
              Merge <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
