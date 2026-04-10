import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Member, Weighing, getGender, isHijab } from '../lib/types';
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
  const gender = getGender(member.name);
  const hijab = isHijab(member.name);
  // Seed dari member id biar tiap orang start aktivitas berbeda
  const seed = member.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

  const memberWeighings = weighings
    .filter(w => w.memberId === member.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  let trend = 0;
  if (memberWeighings.length >= 2) {
    trend = memberWeighings[memberWeighings.length - 1].weightKg - memberWeighings[memberWeighings.length - 2].weightKg;
  }

  const bgColor = bmi?.color || '#B197FC';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.25 }}
      whileHover={{ y: -4, scale: 1.015 }}
      className="h-full"
    >
      <Link to={`/member/${member.id}`} className="block h-full">
        <div
          className="candy-card relative overflow-hidden cursor-pointer h-full flex flex-col"
          style={{ borderColor: bgColor, minHeight: '180px' }}
        >
          {/* Decorative blob */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30 pointer-events-none"
            style={{ background: bgColor }}
          />

          <div className="relative flex items-center gap-3 flex-1">
            {/* Avatar - fixed size */}
            <div className="shrink-0">
              {member.photoUrl ? (
                <div
                  className="w-16 h-16 rounded-full border-4 bg-cover bg-center shadow-candy-sm"
                  style={{ borderColor: bgColor, backgroundImage: `url(${member.photoUrl})` }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-display font-bold shadow-candy-sm"
                  style={{ borderColor: bgColor, background: 'white', color: bgColor }}
                >
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info - flex grow so it fills the space consistently */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-base text-[#3B2A4A] truncate leading-tight">
                {member.name}
              </h3>
              {latestWeight ? (
                <>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-display font-bold leading-none" style={{ color: bgColor }}>
                      {latestWeight}
                    </span>
                    <span className="text-xs font-body font-semibold text-[#3B2A4A]/60">kg</span>
                  </div>
                  {bmi && (
                    <div className="text-[11px] font-body font-semibold mt-0.5 text-[#3B2A4A]/70 truncate">
                      BMI {bmi.value} · {bmi.label} {bmi.emoji}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs font-body text-[#3B2A4A]/50 italic mt-1">
                  Belum ada data 🥺
                </div>
              )}
            </div>

            {/* Character - fixed size slot */}
            <div className="shrink-0 w-[70px] h-[70px] flex items-center justify-center">
              {bmi ? (
                <BmiCharacter category={bmi.category} gender={gender} hijab={hijab} seed={seed} size={70} />
              ) : (
                <div className="text-4xl opacity-30">{gender === 'female' ? '👧' : '👦'}</div>
              )}
            </div>
          </div>

          {/* Bottom row: trend badge - selalu reserve space biar kartu tinggi sama */}
          <div className="relative mt-2 h-6 flex items-center">
            {trend !== 0 && latestWeight && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold
                ${trend < 0 ? 'bg-candy-mint/40 text-emerald-700' : 'bg-candy-pink/30 text-pink-700'}`}>
                {trend < 0 ? '▼' : '▲'} {Math.abs(trend).toFixed(1)} kg dari minggu lalu
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
