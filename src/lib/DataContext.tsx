import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Member, Weighing } from './types';
import { seedMembers } from './db';

interface DataCtx {
  members: Member[];
  weighings: Weighing[];
  loading: boolean;
  error: string | null;
  getLatestWeight: (memberId: string) => number | undefined;
  getMemberWeighings: (memberId: string) => Weighing[];
}

const Ctx = createContext<DataCtx | null>(null);

const DEFAULT_NAMES = [
  'Bpk Krisno', 'Pa Yoyo', 'Bu Desi', 'Pak Taufik', 'Yusuf',
  'Yola', 'Sinta', 'Frandi', 'Yusrel', 'Dena',
  'Dyah', 'Oby', 'Yovanka', 'Imam', 'Iwan',
  'Pandji', 'Akram', 'Arbi'
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [weighings, setWeighings] = useState<Weighing[]>([]);
  const [mLoaded, setMLoaded] = useState(false);
  const [wLoaded, setWLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs biar setTimeout ga kena stale closure bug
  const mLoadedRef = useRef(false);
  const wLoadedRef = useRef(false);

  useEffect(() => {
    // Timeout cuma set error kalau MEMANG listener belum pernah sukses sama sekali
    const timeout = setTimeout(() => {
      if (!mLoadedRef.current || !wLoadedRef.current) {
        setError('Koneksi Firebase lambat. Cek koneksi internet atau ad-blocker.');
      }
    }, 20000); // 20 detik, lebih toleran

    seedMembers(DEFAULT_NAMES).catch(e => {
      console.error('Seed failed:', e);
      // Cuma set error kalau belum ada data sama sekali
      if (!mLoadedRef.current) {
        setError(`Gagal connect Firebase: ${e.message}`);
      }
    });

    const unsubM = onSnapshot(
      collection(db, 'members'),
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }));
        setMembers(data.sort((a, b) => a.name.localeCompare(b.name)));
        mLoadedRef.current = true;
        setMLoaded(true);
        setError(null); // CLEAR error begitu data masuk
      },
      err => {
        console.error('Members listener error:', err);
        // Cuma set error kalau belum pernah dapet data
        if (!mLoadedRef.current) {
          setError(`Firestore error: ${err.message}`);
          setMLoaded(true);
        }
      }
    );

    const unsubW = onSnapshot(
      query(collection(db, 'weighings'), orderBy('date', 'asc')),
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Weighing, 'id'>) }));
        setWeighings(data);
        wLoadedRef.current = true;
        setWLoaded(true);
        setError(null);
      },
      err => {
        console.error('Weighings listener error:', err);
        if (!wLoadedRef.current) {
          setError(`Firestore error: ${err.message}`);
          setWLoaded(true);
        }
      }
    );

    return () => { clearTimeout(timeout); unsubM(); unsubW(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLatestWeight = (memberId: string) => {
    const mw = weighings
      .filter(w => w.memberId === memberId)
      .sort((a, b) => b.date.localeCompare(a.date));
    return mw[0]?.weightKg;
  };

  const getMemberWeighings = (memberId: string) =>
    weighings
      .filter(w => w.memberId === memberId)
      .sort((a, b) => a.date.localeCompare(b.date));

  const loading = !mLoaded || !wLoaded;

  // Jangan tampilin error kalau data members udah ada (bukti konkret connection sukses)
  const effectiveError = members.length > 0 ? null : error;

  return (
    <Ctx.Provider value={{ members, weighings, loading, error: effectiveError, getLatestWeight, getMemberWeighings }}>
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useData must be inside DataProvider');
  return c;
}
