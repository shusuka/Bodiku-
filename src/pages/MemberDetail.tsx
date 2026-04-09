import { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  addWeighing, deleteWeighing, updateMember, uploadPhoto, deleteMember
} from '../lib/db';
import { calcBmi, formatDate, getCurrentWeek } from '../lib/bmi';
import { useData } from '../lib/DataContext';
import BmiCharacter from '../components/BmiCharacter';

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const { members, getMemberWeighings, loading } = useData();

  const member = useMemo(() => members.find(m => m.id === id), [members, id]);
  const weighings = useMemo(() => (id ? getMemberWeighings(id) : []), [id, getMemberWeighings]);

  const [date, setDate] = useState(getCurrentWeek());
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState(member?.heightCm?.toString() || '');
  const [editHeight, setEditHeight] = useState(false);
  const [saving, setSaving] = useState(false);

  const latest = weighings[weighings.length - 1]?.weightKg;
  const previous = weighings[weighings.length - 2]?.weightKg;
  const bmi = latest ? calcBmi(latest, member?.heightCm) : null;
  const trend = latest && previous ? latest - previous : 0;

  async function handleAddWeighing() {
    if (!id || !weight) return;
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    setSaving(true);
    try {
      await addWeighing(id, date, w);
      if (previous && w < previous) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6FB5', '#7EEBC1', '#FFE66D', '#B197FC', '#74D0F1'],
        });
      }
      setWeight('');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteWeighing(wid: string) {
    if (!confirm('Hapus data timbangan ini?')) return;
    await deleteWeighing(wid);
  }

  async function handleSaveHeight() {
    if (!id) return;
    const h = parseFloat(height);
    if (isNaN(h) || h <= 0) return;
    await updateMember(id, { heightCm: h });
    setEditHeight(false);
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!id || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    setSaving(true);
    try {
      const url = await uploadPhoto(id, file);
      await updateMember(id, { photoUrl: url });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMember() {
    if (!id || !member) return;
    if (!confirm(`Hapus ${member.name} beserta semua datanya?`)) return;
    await deleteMember(id);
    nav('/');
  }

  // Data udah ada dari context, loading cuma muncul kalau context blm siap sama sekali
  if (loading && !member) {
    return (
      <div className="text-center py-20">
        <motion.div
          className="text-5xl inline-block"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        >🍩</motion.div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-20 font-body text-[#3B2A4A]/60">
        Anggota tidak ditemukan.
      </div>
    );
  }

  const chartData = weighings.map(w => ({
    date: w.date.slice(5),
    berat: w.weightKg,
  }));

  const bgColor = bmi?.color || '#B197FC';

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pb-20">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="candy-card mb-6 relative overflow-hidden"
        style={{ borderColor: bgColor }}
      >
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20"
          style={{ background: bgColor }}
        />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer"
            >
              {member.photoUrl ? (
                <div
                  className="w-32 h-32 rounded-full border-[6px] bg-cover bg-center shadow-candy"
                  style={{ borderColor: bgColor, backgroundImage: `url(${member.photoUrl})` }}
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-full border-[6px] flex items-center justify-center text-5xl font-display font-bold shadow-candy bg-white"
                  style={{ borderColor: bgColor, color: bgColor }}
                >
                  {member.name.charAt(0)}
                </div>
              )}
            </motion.div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-candy-lemon border-2 border-black/20 rounded-full w-10 h-10 flex items-center justify-center shadow-candy-sm hover:brightness-110"
              title="Upload foto"
            >
              📷
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display font-bold text-3xl text-[#3B2A4A]">{member.name}</h2>

            <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start items-center">
              {editHeight ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="candy-input w-28 py-2"
                    placeholder="cm"
                  />
                  <button onClick={handleSaveHeight} className="candy-btn-mint text-sm px-3 py-1">✓</button>
                  <button onClick={() => setEditHeight(false)} className="candy-btn-pink text-sm px-3 py-1">×</button>
                </div>
              ) : (
                <button
                  onClick={() => { setHeight(member.heightCm?.toString() || ''); setEditHeight(true); }}
                  className="px-4 py-1.5 rounded-full bg-white/80 border-2 border-candy-grape font-body font-semibold text-sm text-[#3B2A4A] hover:bg-candy-grape/20"
                >
                  📏 {member.heightCm || '??'} cm (edit)
                </button>
              )}
            </div>

            {bmi && (
              <motion.div
                key={bmi.category}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="mt-4 inline-block px-5 py-2 rounded-full font-display font-bold text-white"
                style={{ background: bgColor }}
              >
                BMI {bmi.value} · {bmi.label} {bmi.emoji}
              </motion.div>
            )}

            {bmi && (
              <p className="mt-2 font-body text-sm text-[#3B2A4A]/70 italic">{bmi.message}</p>
            )}
          </div>

          {bmi && (
            <div className="shrink-0">
              <BmiCharacter category={bmi.category} size={140} />
            </div>
          )}
        </div>
      </motion.div>

      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <StatCard label="Berat Terakhir" value={`${latest} kg`} color="#FF6FB5" />
          <StatCard
            label="Perubahan"
            value={trend === 0 ? '—' : `${trend > 0 ? '+' : ''}${trend.toFixed(1)} kg`}
            color={trend < 0 ? '#7EEBC1' : trend > 0 ? '#FF6FB5' : '#B197FC'}
          />
          <StatCard label="Total Timbang" value={`${weighings.length}×`} color="#FFE66D" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="candy-card mb-6"
      >
        <h3 className="font-display font-bold text-xl mb-4 text-[#3B2A4A]">
          🍬 Tambah Timbangan Mingguan
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="candy-input sm:w-48"
          />
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="Berat (kg)"
            className="candy-input flex-1"
            onKeyDown={e => e.key === 'Enter' && handleAddWeighing()}
          />
          <button
            onClick={handleAddWeighing}
            disabled={saving || !weight}
            className="candy-btn-mint disabled:opacity-50"
          >
            {saving ? '...' : '+ Simpan'}
          </button>
        </div>
      </motion.div>

      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
          className="candy-card mb-6"
        >
          <h3 className="font-display font-bold text-xl mb-4 text-[#3B2A4A]">
            📈 Grafik Berat Badan
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFD6E8" />
                <XAxis dataKey="date" stroke="#3B2A4A" fontSize={12} fontFamily="Quicksand" />
                <YAxis stroke="#3B2A4A" fontSize={12} fontFamily="Quicksand" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '3px solid #FF6FB5',
                    borderRadius: '1rem',
                    fontFamily: 'Quicksand',
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="berat"
                  stroke="#FF6FB5"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#FF6FB5', stroke: 'white', strokeWidth: 2 }}
                  activeDot={{ r: 9 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {weighings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
          className="candy-card mb-6"
        >
          <h3 className="font-display font-bold text-xl mb-4 text-[#3B2A4A]">
            📖 Riwayat Timbangan
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            <AnimatePresence>
              {[...weighings].reverse().map((w, i) => {
                const prev = weighings[weighings.length - 2 - i]?.weightKg;
                const diff = prev ? w.weightKg - prev : 0;
                return (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between bg-white/60 rounded-2xl px-4 py-3 border-2 border-candy-pink/20"
                  >
                    <div>
                      <div className="font-body font-bold text-[#3B2A4A]">
                        {formatDate(w.date)}
                      </div>
                      <div className="text-sm text-[#3B2A4A]/60">
                        {w.weightKg} kg
                        {diff !== 0 && (
                          <span className={`ml-2 font-bold ${diff < 0 ? 'text-emerald-600' : 'text-pink-600'}`}>
                            ({diff > 0 ? '+' : ''}{diff.toFixed(1)})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWeighing(w.id)}
                      className="w-9 h-9 rounded-full bg-candy-pink/20 hover:bg-candy-pink/40 text-pink-700 font-bold transition-colors"
                      title="Hapus"
                    >
                      ✕
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleDeleteMember}
          className="text-sm font-body font-semibold text-pink-700/60 hover:text-pink-700 underline"
        >
          Hapus anggota ini
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className="candy-card py-4 px-3 text-center"
      style={{ borderColor: color }}
    >
      <div className="text-xs font-body font-semibold text-[#3B2A4A]/60 uppercase tracking-wide">
        {label}
      </div>
      <div className="font-display font-bold text-2xl mt-1" style={{ color }}>
        {value}
      </div>
    </motion.div>
  );
}
