import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../lib/DataContext';
import { addMember } from '../lib/db';
import MemberCard from '../components/MemberCard';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const { members, weighings, loading, error, getLatestWeight } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  async function handleAdd() {
    if (!newName.trim()) return;
    await addMember(newName.trim());
    setNewName('');
    setShowAdd(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center mb-8 mt-2"
      >
        <motion.div
          className="inline-block text-6xl mb-2"
          animate={{ rotate: [0, 15, -15, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          ⚖️
        </motion.div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[#3B2A4A]">
          Timbangan Mingguan!
        </h2>
        <p className="font-body text-[#3B2A4A]/70 mt-2">
          Yuk liat siapa yang paling ideal minggu ini~ 💪
        </p>
      </motion.div>

      {/* Error banner - cuma muncul kalau data beneran ga ada */}
      {error && members.length === 0 && (
        <div className="candy-card mb-6 border-red-300 bg-red-50/80">
          <h3 className="font-display font-bold text-red-700 mb-2">⚠️ Ada masalah koneksi</h3>
          <p className="font-body text-sm text-red-900/80 mb-3">{error}</p>
          <div className="font-body text-xs text-red-900/70 space-y-1">
            <p><strong>Checklist:</strong></p>
            <p>1. Firestore Database udah di-create di Firebase Console?</p>
            <p>2. Rules udah <code className="bg-red-100 px-1 rounded">allow read, write: if true</code>?</p>
            <p>3. Env vars Vercel udah diisi lengkap?</p>
            <p>4. Matiin ad-blocker buat domain ini.</p>
          </div>
        </div>
      )}

      {/* Dashboard rekap */}
      {members.length > 0 && (
        <Dashboard members={members} weighings={weighings} />
      )}

      {/* Section title anggota */}
      {members.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="text-3xl">👥</div>
            <div>
              <h3 className="font-display font-bold text-2xl text-[#3B2A4A] leading-none">Anggota</h3>
              <p className="font-body text-xs text-[#3B2A4A]/60">Hover / klik kartu buat liat nama & detail</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showAdd ? (
              <motion.button
                key="btn"
                onClick={() => setShowAdd(true)}
                className="candy-btn-grape text-sm px-4 py-2"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                + Tambah
              </motion.button>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex gap-2 items-center bg-white/80 p-1.5 rounded-full shadow-candy-sm border-2 border-candy-grape"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Nama..."
                  className="px-3 py-1 rounded-full bg-transparent outline-none font-body font-semibold w-32 text-sm"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="candy-btn-mint text-xs px-3 py-1">OK</button>
                <button onClick={() => setShowAdd(false)} className="candy-btn-pink text-xs px-3 py-1">X</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Grid */}
      {loading && members.length === 0 && !error ? (
        <div className="text-center py-20">
          <motion.div
            className="text-5xl inline-block"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          >🍩</motion.div>
          <p className="mt-4 font-body font-semibold text-[#3B2A4A]/60">Lagi nimbang...</p>
        </div>
      ) : members.length === 0 && !error ? (
        <div className="text-center py-20 font-body text-[#3B2A4A]/60">
          Belum ada anggota. Klik "+ Tambah" buat mulai.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {members.map((m, i) => (
            <MemberCard
              key={m.id}
              member={m}
              latestWeight={getLatestWeight(m.id)}
              weighings={weighings}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
