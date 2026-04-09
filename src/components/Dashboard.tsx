import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Member, Weighing } from '../lib/types';
import { calcBmi } from '../lib/bmi';

interface Props {
  members: Member[];
  weighings: Weighing[];
}

export default function Dashboard({ members, weighings }: Props) {
  // ---------- calculations ----------
  const membersWithData = members.map(m => {
    const mw = weighings
      .filter(w => w.memberId === m.id)
      .sort((a, b) => a.date.localeCompare(b.date));
    const latest = mw[mw.length - 1]?.weightKg;
    const first = mw[0]?.weightKg;
    const previous = mw[mw.length - 2]?.weightKg;
    const bmi = latest ? calcBmi(latest, m.heightCm) : null;
    const totalChange = latest && first && mw.length >= 2 ? latest - first : 0;
    const weekChange = latest && previous ? latest - previous : 0;
    return { member: m, latest, first, previous, bmi, totalChange, weekChange, weighingCount: mw.length };
  });

  const withWeighings = membersWithData.filter(x => x.latest !== undefined);

  const totalMembers = members.length;
  const totalWeighings = weighings.length;
  const avgBmi = withWeighings.length > 0
    ? withWeighings.reduce((sum, x) => sum + (x.bmi?.value || 0), 0) / withWeighings.length
    : 0;
  const avgWeight = withWeighings.length > 0
    ? withWeighings.reduce((sum, x) => sum + (x.latest || 0), 0) / withWeighings.length
    : 0;

  // distribusi BMI
  const dist = { underweight: 0, normal: 0, overweight: 0, obese: 0 };
  withWeighings.forEach(x => { if (x.bmi) dist[x.bmi.category]++; });
  const distData = [
    { name: 'Kurus', value: dist.underweight, color: '#74D0F1' },
    { name: 'Ideal', value: dist.normal, color: '#7EEBC1' },
    { name: 'Gemuk', value: dist.overweight, color: '#FFE66D' },
    { name: 'Obesitas', value: dist.obese, color: '#FF6FB5' },
  ].filter(d => d.value > 0);

  // leaderboard penurunan (total change, paling turun di atas)
  const losers = [...withWeighings]
    .filter(x => x.totalChange < 0)
    .sort((a, b) => a.totalChange - b.totalChange)
    .slice(0, 5);

  // leaderboard kenaikan
  const gainers = [...withWeighings]
    .filter(x => x.totalChange > 0)
    .sort((a, b) => b.totalChange - a.totalChange)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {/* Section title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">📊</div>
        <div>
          <h3 className="font-display font-bold text-2xl text-[#3B2A4A] leading-none">Rekapan</h3>
          <p className="font-body text-xs text-[#3B2A4A]/60">Ringkasan progress semua anggota</p>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatBox label="Total Anggota" value={`${totalMembers}`} emoji="👥" color="#B197FC" />
        <StatBox label="Total Timbang" value={`${totalWeighings}`} emoji="⚖️" color="#FF6FB5" />
        <StatBox label="Rata-rata BMI" value={avgBmi > 0 ? avgBmi.toFixed(1) : '—'} emoji="📐" color="#7EEBC1" />
        <StatBox label="Rata-rata BB" value={avgWeight > 0 ? `${avgWeight.toFixed(1)} kg` : '—'} emoji="🎯" color="#FFE66D" />
      </div>

      {/* Main grid: BMI chart + leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* BMI distribution */}
        <div className="candy-card">
          <h4 className="font-display font-bold text-[#3B2A4A] mb-3">Distribusi BMI</h4>
          {distData.length > 0 ? (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={3}
                      stroke="white"
                      strokeWidth={3}
                    >
                      {distData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'white',
                        border: '3px solid #FF6FB5',
                        borderRadius: '1rem',
                        fontFamily: 'Quicksand',
                        fontWeight: 600,
                        fontSize: '13px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {distData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-body font-semibold">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-[#3B2A4A]/80">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center text-sm font-body text-[#3B2A4A]/50 italic">
              Belum ada data
            </div>
          )}
        </div>

        {/* Top penurunan */}
        <div className="candy-card">
          <h4 className="font-display font-bold text-[#3B2A4A] mb-3">🏆 Top Penurunan</h4>
          {losers.length > 0 ? (
            <div className="space-y-2">
              {losers.map((x, i) => (
                <LeaderRow
                  key={x.member.id}
                  rank={i + 1}
                  name={x.member.name}
                  value={`${x.totalChange.toFixed(1)} kg`}
                  photoUrl={x.member.photoUrl}
                  positive
                />
              ))}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-sm font-body text-[#3B2A4A]/50 italic text-center px-4">
              Belum ada yang turun berat badan
            </div>
          )}
        </div>

        {/* Top kenaikan */}
        <div className="candy-card">
          <h4 className="font-display font-bold text-[#3B2A4A] mb-3">📈 Top Kenaikan</h4>
          {gainers.length > 0 ? (
            <div className="space-y-2">
              {gainers.map((x, i) => (
                <LeaderRow
                  key={x.member.id}
                  rank={i + 1}
                  name={x.member.name}
                  value={`+${x.totalChange.toFixed(1)} kg`}
                  photoUrl={x.member.photoUrl}
                />
              ))}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-sm font-body text-[#3B2A4A]/50 italic text-center px-4">
              Belum ada yang naik berat badan
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value, emoji, color }: { label: string; value: string; emoji: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="candy-card py-3 px-4 relative overflow-hidden"
      style={{ borderColor: color }}
    >
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
        style={{ background: color }}
      />
      <div className="relative">
        <div className="text-2xl mb-1">{emoji}</div>
        <div className="text-xs font-body font-semibold text-[#3B2A4A]/60 uppercase tracking-wide">{label}</div>
        <div className="font-display font-bold text-xl mt-0.5" style={{ color }}>{value}</div>
      </div>
    </motion.div>
  );
}

function LeaderRow({ rank, name, value, photoUrl, positive }: {
  rank: number; name: string; value: string; photoUrl?: string; positive?: boolean;
}) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = rank <= 3 ? medals[rank - 1] : `#${rank}`;
  return (
    <div className="flex items-center gap-2 bg-white/60 rounded-xl px-2.5 py-1.5 border border-candy-pink/10">
      <div className="text-base font-display font-bold w-6 text-center shrink-0">{medal}</div>
      {photoUrl ? (
        <div
          className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border-2 border-white"
          style={{ backgroundImage: `url(${photoUrl})` }}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-candy-grape/20 flex items-center justify-center font-display font-bold text-sm text-candy-grape shrink-0">
          {name.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0 font-body font-semibold text-sm text-[#3B2A4A] truncate">{name}</div>
      <div className={`font-display font-bold text-sm shrink-0 ${positive ? 'text-emerald-600' : 'text-pink-600'}`}>
        {value}
      </div>
    </div>
  );
}
