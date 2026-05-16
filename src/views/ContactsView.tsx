
import * as React from 'react';
import { useState } from 'react';
import { Contact } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { 
  Search, 
  Trash2, 
  Download, 
  UserPlus, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileText,
  FileSpreadsheet,
  Users
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { exportToCSV, exportToVCF } from '../lib/contacts-utils';
import { toast } from 'sonner';

interface ContactsViewProps {
  contacts: Contact[];
  onDelete: (id: string) => Promise<void>;
  onDeleteMultiple: (ids: string[]) => Promise<void>;
  onAdd: (contact: any) => Promise<void>;
}

export function ContactsView({ contacts, onDelete, onDeleteMultiple, onAdd }: ContactsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const filteredContacts = contacts.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumbers.some(p => p.number.includes(search)) ||
    c.emails.some(e => e.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} contacts?`)) {
      await onDeleteMultiple(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
      toast.success(`${selectedIds.length} contacts deleted`);
    }
  };

  const handleGenerateDemo = async () => {
    const demoContacts = [
      { firstName: 'Alice', lastName: 'Johnson', company: 'Google', phoneNumbers: [{ label: 'Work', number: '555-0101' }], emails: [{ label: 'Personal', email: 'alice@example.com' }], jobTitle: 'Designer', notes: '' },
      { firstName: 'Bob', lastName: 'Smith', company: 'Apple', phoneNumbers: [{ label: 'Mobile', number: '555-0102' }], emails: [{ label: 'Work', email: 'bob@apple.com' }], jobTitle: 'Engineer', notes: '' },
      { firstName: 'Alice', lastName: 'Johnson', company: 'Self', phoneNumbers: [{ label: 'Home', number: '555-0101' }], emails: [{ label: 'Personal', email: 'alice.j@me.com' }], jobTitle: 'Freelancer', notes: 'Duplicate name test' },
      { firstName: 'Charlie', lastName: 'Davis', company: 'Microsoft', phoneNumbers: [{ label: 'Office', number: '555-0102' }], emails: [{ label: 'Office', email: 'charlie@ms.com' }], jobTitle: 'Product Manager', notes: 'Duplicate phone test' },
    ];
    for (const c of demoContacts) {
      await onAdd(c);
    }
    toast.success('Demo contacts added');
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Search and Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
          <Input 
            placeholder="Search contacts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-[#1C1C1E] border-[#2C2C2E] text-white shadow-sm rounded-xl focus-visible:ring-[#0A84FF] placeholder:text-[#8E8E93]/50"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-xl bg-[#1C1C1E] shadow-sm border border-[#2C2C2E] text-white hover:bg-[#2C2C2E]" />}>
            <MoreVertical size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl overflow-hidden p-1 bg-[#1C1C1E] border-[#3A3A3C] text-white">
            <DropdownMenuItem onClick={() => setIsSelectionMode(!isSelectionMode)} className="rounded-lg focus:bg-[#2C2C2E] focus:text-white">
              {isSelectionMode ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              <span className="font-medium"> {isSelectionMode ? 'Cancel Selection' : 'Select Contacts'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToCSV(contacts)} className="rounded-lg focus:bg-[#2C2C2E] focus:text-white">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span className="font-medium">Export as CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToVCF(contacts)} className="rounded-lg focus:bg-[#2C2C2E] focus:text-white">
              <FileText className="mr-2 h-4 w-4" />
              <span className="font-medium">Export as VCF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGenerateDemo} className="rounded-lg text-[#0A84FF] focus:bg-[#0A84FF]/10 focus:text-[#0A84FF]">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="font-bold">Generate Demo Data</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isSelectionMode && selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-[#0A84FF]/10 p-3 rounded-xl border border-[#0A84FF]/20 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-bold text-[#0A84FF]">{selectedIds.length} selected</span>
          <Button variant="destructive" size="sm" onClick={handleDeleteSelected} className="rounded-lg h-8 px-3 bg-[#FF453A] hover:bg-[#FF453A]/80 font-bold">
            <Trash2 size={14} className="mr-2" /> Delete
          </Button>
        </div>
      )}

      {/* Contacts List */}
      <div className="bg-[#1C1C1E] rounded-2xl shadow-sm border border-[#2C2C2E] overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-[#2C2C2E] rounded-full flex items-center justify-center mx-auto">
              <Users size={32} className="text-[#3A3A3C]" />
            </div>
            <p className="text-[#8E8E93] font-bold tracking-tight">No results found</p>
            {!contacts.length && (
              <Button variant="outline" onClick={handleGenerateDemo} className="rounded-xl border-[#3A3A3C] border-dashed text-[#8E8E93] hover:bg-[#2C2C2E]">
                Import Contacts
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#2C2C2E]">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                className={`flex items-center gap-4 p-4 hover:bg-[#2C2C2E]/50 transition-colors cursor-pointer group`}
                onClick={() => isSelectionMode && toggleSelection(contact.id)}
              >
                {isSelectionMode ? (
                  <Checkbox 
                    checked={selectedIds.includes(contact.id)}
                    onCheckedChange={() => toggleSelection(contact.id)}
                    className="rounded-full h-5 w-5 border-[#3A3A3C] data-[state=checked]:bg-[#0A84FF] data-[state=checked]:border-[#0A84FF]"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white font-bold shrink-0 border border-[#3A3A3C] shadow-sm">
                    {contact.firstName[0]}{contact.lastName[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white tracking-tight truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    {contact.company && (
                      <Badge variant="secondary" className="bg-[#2C2C2E] text-[#8E8E93] font-bold text-[9px] uppercase tracking-wider rounded-md px-1.5 py-0.5 border-0">
                        {contact.company}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#8E8E93] truncate font-medium">
                    {contact.phoneNumbers[0]?.number || contact.emails[0]?.email || 'No info available'}
                  </p>
                </div>
                {!isSelectionMode && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8E8E93] hover:text-[#FF453A] hover:bg-[#FF453A]/10 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(contact.id);
                      toast.success('Contact removed');
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-[0.2em]">
          {filteredContacts.length} Total Contacts
        </p>
      </div>
    </div>
  );
}
