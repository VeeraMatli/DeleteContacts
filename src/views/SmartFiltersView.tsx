
import * as React from 'react';
import { useState } from 'react';
import { Contact } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { smartFilterContacts } from '../services/geminiService';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartFiltersViewProps {
  contacts: Contact[];
}

export function SmartFiltersView({ contacts }: SmartFiltersViewProps) {
  const [customCriteria, setCustomCriteria] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);

  const predefinedFilters = [
    { name: 'Missing Phone', criteria: 'return contacts that have NO phone numbers' },
    { name: 'Work Emails', criteria: 'return contacts that have a work or company email' },
    { name: 'Short Notes', criteria: 'return contacts with notes shorter than 10 characters' },
    { name: 'Recently Updated', criteria: 'return contacts updated in the last 24 hours' },
  ];

  const handleApplyFilter = async (criteria: string) => {
    if (contacts.length === 0) {
      toast.error('No contacts to filter');
      return;
    }
    setIsFiltering(true);
    try {
      const ids = await smartFilterContacts(contacts, criteria);
      setFilteredIds(ids);
      toast.success(`Found ${ids.length} contacts matching criteria`);
    } catch (error) {
      toast.error('Filtering failed');
    } finally {
      setIsFiltering(false);
    }
  };

  const filteredContacts = filteredIds 
    ? contacts.filter(c => filteredIds.includes(c.id))
    : [];

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* AI Search Box */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8E8E93] flex items-center gap-2">
            <Sparkles size={14} className="text-[#BF5AF2]" /> AI Search Console
          </h3>
        </div>
        <div className="relative group">
          <div className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-[#BF5AF2] via-[#0A84FF] to-[#30D158] rounded-full blur-xl opacity-20 group-focus-within:opacity-60 transition-opacity" />
          <div className="relative bg-[#1C1C1E] rounded-2xl flex items-center p-1.5 shadow-2xl border border-[#2C2C2E]">
            <Input 
              placeholder="Filter by criteria (e.g. 'Gmail users')..." 
              value={customCriteria}
              onChange={(e) => setCustomCriteria(e.target.value)}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-sm h-11 bg-transparent text-white placeholder:text-[#8E8E93]/50"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter(customCriteria)}
            />
            <Button 
              size="sm" 
              onClick={() => handleApplyFilter(customCriteria)}
              disabled={isFiltering || !customCriteria}
              className="bg-[#BF5AF2] text-white hover:bg-[#BF5AF2]/90 rounded-xl h-9 px-5 font-bold transition-transform active:scale-95"
            >
              {isFiltering ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : 'Run'}
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Filters */}
      <div className="space-y-3">
        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8E8E93] px-2 text-center">Intelligent Presets</h3>
        <div className="flex flex-wrap justify-center gap-2.5 px-1">
          {predefinedFilters.map(filter => (
            <button
              key={filter.name}
              onClick={() => handleApplyFilter(filter.criteria)}
              className="px-4 py-2 bg-[#1C1C1E] border border-[#2C2C2E] rounded-full text-[11px] font-bold text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] hover:border-[#3A3A3C] transition-all shadow-sm active:scale-95"
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {(filteredIds !== null || isFiltering) && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-2 pt-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              {isFiltering ? 'Analyzing library...' : `${filteredContacts.length} units identified`}
            </h3>
            {filteredIds && (
              <Button variant="ghost" size="sm" onClick={() => setFilteredIds(null)} className="h-8 px-3 text-[10px] uppercase font-bold tracking-widest text-[#FF453A] hover:text-[#FF453A] hover:bg-[#FF453A]/10 rounded-lg">
                Clear
              </Button>
            )}
          </div>

          <div className="bg-[#1C1C1E] rounded-3xl border border-[#2C2C2E] overflow-hidden shadow-sm divide-y divide-[#2C2C2E]">
            {isFiltering ? (
              <div className="p-16 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                   <div className="absolute inset-0 border-4 border-[#121212] rounded-full" />
                   <div className="absolute inset-0 border-4 border-t-[#BF5AF2] rounded-full animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles size={28} className="text-[#BF5AF2] animate-pulse" />
                   </div>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold tracking-tight">Gemini AI Active</p>
                  <p className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-[0.2em] animate-pulse">Scanning Data Clusters</p>
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-16 text-center text-[#8E8E93] space-y-4">
                <AlertCircle size={32} className="mx-auto text-[#2C2C2E]" />
                <p className="text-sm font-bold tracking-tight">Access Denied: No Matches</p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div key={contact.id} className="p-4 flex items-center gap-4 hover:bg-[#2C2C2E]/30 transition-colors">
                  <div className="w-11 h-11 rounded-full bg-[#1A1A1C] border border-[#2C2C2E] flex items-center justify-center font-bold text-[#8E8E93] text-sm">
                    {contact.firstName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white tracking-tight">{contact.firstName} {contact.lastName}</p>
                    <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">{contact.company || 'Private Link'}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BF5AF2]" />
                </div>
              ))
            )}
          </div>

          {filteredContacts.length > 0 && !isFiltering && (
            <div className="pt-2">
              <Button variant="destructive" className="w-full h-12 rounded-2xl font-bold bg-[#FF453A] hover:bg-[#FF453A]/90 shadow-lg shadow-red-500/20">
                <Trash2 size={18} className="mr-2" /> Purge Identified Matches
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Feature Explainer */}
      {filteredIds === null && !isFiltering && (
        <div className="p-6 bg-[#0A84FF]/5 rounded-[32px] border border-[#0A84FF]/10 space-y-4 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 rotate-12 translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Filter size={120} className="text-[#0A84FF]" />
          </div>
          <div className="w-12 h-12 bg-[#0A84FF]/10 rounded-2xl flex items-center justify-center text-[#0A84FF] border border-[#0A84FF]/20 backdrop-blur-xl">
            <Filter size={22} />
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="font-bold text-white tracking-tight">Neural Filter Logic</h4>
            <p className="text-xs text-[#8E8E93] leading-relaxed font-medium">
              Interact with your contact database using natural language. Query for attributes like <span className="text-[#0A84FF]">"Contacts at Apple"</span> or <span className="text-[#30D158]">"People without emails"</span>. High-precision AI matching handles the rest.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
