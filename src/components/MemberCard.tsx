import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Member, Weighing } from '../lib/types';
import { calcBmi } from '../lib/bmi';
import BmiCharacter from './BmiCharacter';

interface Props {
  member: Member;
  latestWeight?: number;
  weighings: Weighing[];
  index: number;
}

export default function MemberCard({ member, latestWeight, weighings, index }: Props) {
  const bmi = latestWeight ? calcBmi(latestWeight, member.heightCm) : null;

  const memberWeighings = weighings
    .filter(w => w.memberId === member.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  let trend = 0;
  if (memberWeighings.length >= 2) {
    trend = memberWeighings[memberWeighings.length - 1].weightKg - memberWeighings[memberWeighings.length - 2].weightKg;
  }

  const bgColor = bmi?.color || '#B197FC';

  // Anonymous label: cuma inisial (huruf pertama nama)
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.25 }}
      whileHover="hover"
    >
      <Link to={`/member/${member.id}`}>
        <motion.div
          className="candy-card relative overflow-hidden cursor-pointer group"
          style={{ borderColor: bgColor }}
          variants={{
            hover: { y: -4, scale: 1.015 },
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30"
            style={{ background: bgColor }}
          />

          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className="shrink-0">
              {member.photoUrl ? (
                <div
                  className="w-20 h-20 rounded-full border-4 bg-cover bg-center shadow-candy-sm"
                  style={{ borderColor: bgColor, backgroundImage: `url(${member.photoUrl})` }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-display font-bold shadow-candy-sm"
                  style={{ borderColor: bgColor, background: 'white', color: bgColor }}
                >
                  {initial}
                </div>
              )}
            </div>

            {/* Info - nama disembunyiin secara default, muncul pas hover */}
            <div className="flex-1 min-w-0">
              {/* Label default: cuma inisial (anonim) */}
              <div className="relative h-7 mb-0.5">
                <motion.div
                  className="absolute inset-0 flex items-center"
                  variants={{
                    hover: { opacity: 0, y: -8 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="font-display font-bold text-lg text-[#3B2A4A]/70">
                    Anggota {initial}•••
                  </span>
                </motion.div>
                {/* Nama asli: muncul pas hover */}
                <motion.h3
                  className="absolute inset-0 flex items-center font-display font-bold text-lg text-[#3B2A4A] truncate"
                  initial={{ opacity: 0, y: 8 }}
                  variants={{
                    hover: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {member.name}
                </motion.h3>
              </div>

              {latestWeight ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold" style={{ color: bgColor }}>
                      {latestWeight}
                    </span>
                    <span className="text-sm font-body font-semibold text-[#3B2A4A]/60">kg</span>
                  </div>
                  {bmi && (
                    <div className="text-xs font-body font-semibold mt-0.5 text-[#3B2A4A]/70">
                      BMI {bmi.value} · {bmi.label} {bmi.emoji}
                    </div>
                  )}
                  {trend !== 0 && (
                    <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-bold
                      ${trend < 0 ? 'bg-candy-mint/30 text-emerald-700' : 'bg-candy-pink/30 text-pink-700'}`}>
                      {trend < 0 ? '▼' : '▲'} {Math.abs(trend).toFixed(1)} kg
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm font-body text-[#3B2A4A]/50 italic">
                  Belum ada data 🥺
                </div>
              )}
            </div>

            {bmi && (
              <div className="shrink-0 -mr-2 -mt-2">
                <BmiCharacter category={bmi.category} size={70} />
              </div>
            )}
          </div>

          {/* Hint "klik untuk detail" pas hover */}
          <motion.div
            className="absolute bottom-2 right-3 text-xs font-body font-semibold text-[#3B2A4A]/50"
            initial={{ opacity: 0 }}
            variants={{ hover: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
          >
            klik untuk detail →
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
