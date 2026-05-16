
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Contact, Backup } from '../types';
import { onAuthStateChanged } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setContacts([]);
        setBackups([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const contactsPath = `users/${user.uid}/contacts`;
    const contactsQuery = query(
      collection(db, contactsPath),
      orderBy('firstName', 'asc')
    );

    const unsubscribeContacts = onSnapshot(contactsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      setContacts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, contactsPath);
    });

    const backupsPath = `users/${user.uid}/backups`;
    const backupsQuery = query(
      collection(db, backupsPath),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeBackups = onSnapshot(backupsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Backup));
      setBackups(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, backupsPath);
    });

    return () => {
      unsubscribeContacts();
      unsubscribeBackups();
    };
  }, [user]);

  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    const path = `users/${user.uid}/contacts`;
    try {
      await addDoc(collection(db, path), {
        ...contact,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const removeContact = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/contacts/${id}`;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/contacts`, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const deleteMultiple = async (ids: string[]) => {
    if (!user) return;
    const path = `users/${user.uid}/contacts`;
    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
        batch.delete(doc(db, `users/${user.uid}/contacts`, id));
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const createBackup = async (name: string) => {
    if (!user) return;
    const path = `users/${user.uid}/backups`;
    try {
      await addDoc(collection(db, path), {
        name,
        timestamp: serverTimestamp(),
        contactCount: contacts.length,
        size: JSON.stringify(contacts).length
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return { 
    contacts, 
    backups, 
    loading, 
    user,
    addContact,
    removeContact,
    deleteMultiple,
    createBackup
  };
}
