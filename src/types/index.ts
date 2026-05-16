
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumbers: { label: string; number: string }[];
  emails: { label: string; email: string }[];
  company: string;
  jobTitle: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface DuplicateGroup {
  id: string;
  type: 'exact' | 'same-name' | 'duplicate-data';
  contacts: Contact[];
  reason: string;
}

export interface Backup {
  id: string;
  name: string;
  timestamp: number;
  contactCount: number;
  size: number;
}
