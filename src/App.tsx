/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { useContacts } from './hooks/useContacts';
import { ContactsView } from './views/ContactsView';
import { BackupView } from './views/BackupView';
import { DuplicatesView } from './views/DuplicatesView';
import { SmartFiltersView } from './views/SmartFiltersView';
import { SettingsView } from './views/SettingsView';
import { Toaster } from '@/components/ui/sonner';
import { 
  Users, 
  RefreshCcw, 
  Copy, 
  Filter, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'contacts' | 'backup' | 'duplicates' | 'filters' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const { contacts, backups, loading, user, removeContact, deleteMultiple, createBackup, addContact } = useContacts();
  const [isPro, setIsPro] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'contacts':
        return <ContactsView contacts={contacts} onDelete={removeContact} onDeleteMultiple={deleteMultiple} onAdd={addContact} />;
      case 'backup':
        return <BackupView backups={backups} onCreate={createBackup} contacts={contacts} />;
      case 'duplicates':
        return <DuplicatesView contacts={contacts} isPro={isPro} onUpgrade={() => setActiveTab('settings')} />;
      case 'filters':
        return <SmartFiltersView contacts={contacts} />;
      case 'settings':
        return <SettingsView isPro={isPro} setIsPro={setIsPro} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans selection:bg-[#0A84FF]/20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#121212]/80 backdrop-blur-xl border-b border-[#2C2C2E] px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold tracking-tight text-white">
            {activeTab === 'contacts' && 'All Contacts'}
            {activeTab === 'backup' && 'Cloud Backup'}
            {activeTab === 'duplicates' && 'Merge Center'}
            {activeTab === 'filters' && 'Smart Filters'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          {isPro && (
            <div className="bg-[#FFD60A] text-black px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck size={12} /> PRO
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full overflow-y-auto"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Tab Bar */}
      <nav className="bg-[#121212]/80 backdrop-blur-xl border-t border-[#2C2C2E] pb-safe pb-2">
        <div className="flex justify-around items-center h-14 max-w-lg mx-auto px-2">
          <TabButton 
            active={activeTab === 'contacts'} 
            onClick={() => setActiveTab('contacts')} 
            icon={<Users size={22} />} 
            label="Contacts" 
          />
          <TabButton 
            active={activeTab === 'backup'} 
            onClick={() => setActiveTab('backup')} 
            icon={<RefreshCcw size={22} />} 
            label="Backup" 
          />
          <TabButton 
            active={activeTab === 'duplicates'} 
            onClick={() => setActiveTab('duplicates')} 
            icon={<Copy size={22} />} 
            label="Merge" 
          />
          <TabButton 
            active={activeTab === 'filters'} 
            onClick={() => setActiveTab('filters')} 
            icon={<Filter size={22} />} 
            label="Filters" 
          />
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Settings size={22} />} 
            label="Settings" 
          />
        </div>
      </nav>

      <Toaster position="top-center" theme="dark" />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 ${active ? 'text-[#0A84FF]' : 'text-[#8E8E93] hover:text-white'}`}
    >
      <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className={`text-[10px] mt-1 font-semibold tracking-wide transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
    </button>
  );
}
