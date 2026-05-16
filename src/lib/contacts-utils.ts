
import { Contact, DuplicateGroup } from '../types';

export function findDuplicates(contacts: Contact[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  
  // 1. Exact Duplicates (Same name, phone, email)
  const exactMap = new Map<string, Contact[]>();
  contacts.forEach(c => {
    const key = `${c.firstName}|${c.lastName}|${JSON.stringify(c.phoneNumbers.map(p => p.number).sort())}|${JSON.stringify(c.emails.map(e => e.email).sort())}`;
    if (!exactMap.has(key)) exactMap.set(key, []);
    exactMap.get(key)!.push(c);
  });
  
  exactMap.forEach((members, key) => {
    if (members.length > 1) {
      groups.push({
        id: `exact-${key.slice(0, 8)}`,
        type: 'exact',
        contacts: members,
        reason: 'Identical name and contact details'
      });
    }
  });

  // 2. Same Name
  const nameMap = new Map<string, Contact[]>();
  contacts.forEach(c => {
    const key = `${c.firstName}|${c.lastName}`.toLowerCase();
    if (!nameMap.has(key)) nameMap.set(key, []);
    nameMap.get(key)!.push(c);
  });

  nameMap.forEach((members, key) => {
    if (members.length > 1) {
      // Avoid overlapping with exact duplicates if they are already in a group?
      // For simplicity, we just add them if they aren't handled as "exact" already in the same way.
      groups.push({
        id: `name-${key.slice(0, 8)}`,
        type: 'same-name',
        contacts: members,
        reason: 'Different records with the same name'
      });
    }
  });

  // 3. Duplicate Data (Same phone or email)
  const phoneMap = new Map<string, Contact[]>();
  contacts.forEach(c => {
    c.phoneNumbers.forEach(p => {
      const num = p.number.replace(/\D/g, ''); // Normalize
      if (num.length > 5) {
        if (!phoneMap.has(num)) phoneMap.set(num, []);
        phoneMap.get(num)!.push(c);
      }
    });
  });

  phoneMap.forEach((members, phone) => {
    if (members.length > 1) {
      // Filter unique combinations
      const uniqueContacts = Array.from(new Set(members));
      if (uniqueContacts.length > 1) {
        groups.push({
          id: `phone-${phone}`,
          type: 'duplicate-data',
          contacts: uniqueContacts,
          reason: `Multiple contacts share the same phone number: ${phone}`
        });
      }
    }
  });

  return groups;
}

export function mergeContacts(contacts: Contact[]): Partial<Contact> {
  const merged: Partial<Contact> = {
    firstName: contacts[0].firstName,
    lastName: contacts[0].lastName,
    company: contacts.map(c => c.company).find(c => !!c) || '',
    jobTitle: contacts.map(c => c.jobTitle).find(c => !!c) || '',
    notes: contacts.map(c => c.notes).filter(Boolean).join('\n---\n'),
    phoneNumbers: [],
    emails: [],
  };

  const phones = new Set<string>();
  const emails = new Set<string>();

  contacts.forEach(c => {
    c.phoneNumbers.forEach(p => {
      if (!phones.has(p.number)) {
        phones.add(p.number);
        merged.phoneNumbers!.push(p);
      }
    });
    c.emails.forEach(e => {
      if (!emails.has(e.email)) {
        emails.add(e.email);
        merged.emails!.push(e);
      }
    });
  });

  return merged;
}

export function exportToCSV(contacts: Contact[]) {
  const headers = ['First Name', 'Last Name', 'Company', 'Job Title', 'Emails', 'Phone Numbers', 'Notes'];
  const rows = contacts.map(c => [
    c.firstName,
    c.lastName,
    c.company,
    c.jobTitle,
    c.emails.map(e => e.email).join('; '),
    c.phoneNumbers.map(p => p.number).join('; '),
    c.notes.replace(/\n/g, ' ')
  ]);

  const csvContent = [headers, ...rows].map(e => e.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `contacts_export_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToVCF(contacts: Contact[]) {
  let vcf = '';
  contacts.forEach(c => {
    vcf += 'BEGIN:VCARD\nVERSION:3.0\n';
    vcf += `FN:${c.firstName} ${c.lastName}\n`;
    vcf += `N:${c.lastName};${c.firstName};;;\n`;
    vcf += `ORG:${c.company}\n`;
    vcf += `TITLE:${c.jobTitle}\n`;
    c.emails.forEach(e => {
      vcf += `EMAIL;TYPE=INTERNET:${e.email}\n`;
    });
    c.phoneNumbers.forEach(p => {
      vcf += `TEL;TYPE=CELL:${p.number}\n`;
    });
    vcf += `NOTE:${c.notes}\n`;
    vcf += 'END:VCARD\n';
  });

  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `contacts_export_${new Date().getTime()}.vcf`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
