import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BmiCategory, Gender } from '../lib/types';

interface Props {
  category: BmiCategory;
  gender?: Gender;
  hijab?: boolean;
  size?: number;
  /** Seed buat sinkronisasi animasi (pake member id biar tiap orang start dari activity berbeda) */
  seed?: number;
}

/**
 * Karakter kawaii SVG dengan:
 * - Proporsi badan yang berubah sesuai BMI (kurus tinggi, gendut bulet)
 * - Gender (laki / perempuan / perempuan berhijab)
 * - Animasi aktivitas yang ganti otomatis tiap 8 detik
 * - Variasi aktivitas berbeda per kategori BMI
 */

// Daftar aktivitas per kategori BMI
const ACTIVITIES: Record<BmiCategory, string[]> = {
  underweight: ['drink-milk', 'eat-banana', 'sleep', 'read-book'],
  normal:      ['jump-rope', 'yoga', 'jog', 'dance', 'peace'],
  overweight:  ['bike', 'squat', 'walk', 'dumbbell'],
  obese:       ['treadmill', 'pushup', 'eat-burger', 'pant', 'drink-water'],
};

export default function BmiCharacter({
  category,
  gender = 'male',
  hijab = false,
  size = 160,
  seed = 0,
}: Props) {
  const activities = ACTIVITIES[category];
  // Tiap karakter mulai di activity berbeda (berdasarkan seed) biar ga semua sama
  const [activityIndex, setActivityIndex] = useState(seed % activities.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex(i => (i + 1) % activities.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const activity = activities[activityIndex];

  // Proporsi badan per BMI: width factor, body roundness, head size
  const proportions = {
    underweight: { bodyW: 32, bodyH: 48, headR: 26, color: '#74D0F1', cheek: '#FFB088' },
    normal:      { bodyW: 42, bodyH: 50, headR: 28, color: '#7EEBC1', cheek: '#FF6FB5' },
    overweight:  { bodyW: 56, bodyH: 52, headR: 30, color: '#FFE66D', cheek: '#FF6FB5' },
    obese:       { bodyW: 70, bodyH: 56, headR: 33, color: '#FF6FB5', cheek: '#FFE66D' },
  }[category];

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 260"
      style={{ filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.12))' }}
    >
      <ActivityScene
        activity={activity}
        gender={gender}
        hijab={hijab}
        proportions={proportions}
        category={category}
      />
    </motion.svg>
  );
}

// ===========================================================================
// Body parts - reusable
// ===========================================================================

interface SceneProps {
  activity: string;
  gender: Gender;
  hijab: boolean;
  proportions: { bodyW: number; bodyH: number; headR: number; color: string; cheek: string };
  category: BmiCategory;
}

function ActivityScene({ activity, gender, hijab, proportions, category }: SceneProps) {
  // Render aktivitas yang sesuai
  switch (activity) {
    // === UNDERWEIGHT ===
    case 'drink-milk':   return <DrinkMilk g={gender} h={hijab} p={proportions} />;
    case 'eat-banana':   return <EatBanana g={gender} h={hijab} p={proportions} />;
    case 'sleep':        return <Sleep g={gender} h={hijab} p={proportions} />;
    case 'read-book':    return <ReadBook g={gender} h={hijab} p={proportions} />;
    // === NORMAL ===
    case 'jump-rope':    return <JumpRope g={gender} h={hijab} p={proportions} />;
    case 'yoga':         return <Yoga g={gender} h={hijab} p={proportions} />;
    case 'jog':          return <Jog g={gender} h={hijab} p={proportions} />;
    case 'dance':        return <Dance g={gender} h={hijab} p={proportions} />;
    case 'peace':        return <Peace g={gender} h={hijab} p={proportions} />;
    // === OVERWEIGHT ===
    case 'bike':         return <Bike g={gender} h={hijab} p={proportions} />;
    case 'squat':        return <Squat g={gender} h={hijab} p={proportions} />;
    case 'walk':         return <Walk g={gender} h={hijab} p={proportions} />;
    case 'dumbbell':     return <Dumbbell g={gender} h={hijab} p={proportions} />;
    // === OBESE ===
    case 'treadmill':    return <Treadmill g={gender} h={hijab} p={proportions} />;
    case 'pushup':       return <Pushup g={gender} h={hijab} p={proportions} />;
    case 'eat-burger':   return <EatBurger g={gender} h={hijab} p={proportions} />;
    case 'pant':         return <Pant g={gender} h={hijab} p={proportions} category={category} />;
    case 'drink-water':  return <DrinkWater g={gender} h={hijab} p={proportions} />;
    default:             return <Pant g={gender} h={hijab} p={proportions} category={category} />;
  }
}

// Body komponen reusable - gambar 1 karakter lengkap di posisi tertentu
interface BodyProps {
  g: Gender;
  h: boolean;
  p: { bodyW: number; bodyH: number; headR: number; color: string; cheek: string };
  cx?: number;
  cy?: number;
  expression?: 'happy' | 'tired' | 'sleep' | 'eat' | 'neutral';
  rotate?: number;
}

function Body({ g, h, p, cx = 100, cy = 130, expression = 'happy', rotate = 0 }: BodyProps) {
  const headCy = cy - p.bodyH / 2 - p.headR + 6;
  const legTop = cy + p.bodyH / 2 - 4;
  const legLen = 38;
  const footY = legTop + legLen;
  // Pisah kaki proporsional dengan badan
  const legSpread = Math.max(8, p.bodyW * 0.35);
  // Warna baju dan celana
  const shirtColor = p.color;
  const pantsColor = g === 'female' && !h ? '#FF6FB5' : '#3B5A8C'; // rok pink utk cewek, celana biru utk cowok/hijab
  const shoeColor = '#3B2A4A';

  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      {/* === KAKI (di belakang badan) === */}
      {/* Kaki kiri */}
      <line
        x1={cx - legSpread}
        y1={legTop}
        x2={cx - legSpread}
        y2={footY}
        stroke="#FFE0BD"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Kaki kanan */}
      <line
        x1={cx + legSpread}
        y1={legTop}
        x2={cx + legSpread}
        y2={footY}
        stroke="#FFE0BD"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Sepatu kiri */}
      <ellipse cx={cx - legSpread} cy={footY + 4} rx="9" ry="5" fill={shoeColor} stroke="#3B2A4A" strokeWidth="2" />
      {/* Sepatu kanan */}
      <ellipse cx={cx + legSpread} cy={footY + 4} rx="9" ry="5" fill={shoeColor} stroke="#3B2A4A" strokeWidth="2" />

      {/* === CELANA / ROK === */}
      {g === 'female' && !h ? (
        // Rok segitiga buat cewek non-hijab
        <path
          d={`M ${cx - p.bodyW * 0.7} ${legTop - 2}
              L ${cx + p.bodyW * 0.7} ${legTop - 2}
              L ${cx + p.bodyW * 0.85} ${legTop + 18}
              L ${cx - p.bodyW * 0.85} ${legTop + 18} Z`}
          fill={pantsColor}
          stroke="#3B2A4A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      ) : (
        // Celana pendek buat cowok/hijab (overlay di atas kaki)
        <rect
          x={cx - p.bodyW * 0.6}
          y={legTop - 2}
          width={p.bodyW * 1.2}
          height="16"
          rx="3"
          fill={pantsColor}
          stroke="#3B2A4A"
          strokeWidth="2.5"
        />
      )}

      {/* Jubah panjang untuk perempuan berhijab (nutupin sebagian kaki) */}
      {g === 'female' && h && (
        <path
          d={`M ${cx - p.bodyW * 0.9} ${cy + 4}
              Q ${cx - p.bodyW * 1.1} ${footY - 6}, ${cx - p.bodyW * 0.95} ${footY - 2}
              L ${cx + p.bodyW * 0.95} ${footY - 2}
              Q ${cx + p.bodyW * 1.1} ${footY - 6}, ${cx + p.bodyW * 0.9} ${cy + 4} Z`}
          fill="#5DA0BC"
          stroke="#3B2A4A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}

      {/* Hair belakang (perempuan tanpa hijab) */}
      {g === 'female' && !h && (
        <>
          <ellipse cx={cx - p.headR + 4} cy={headCy + 6} rx="6" ry="18" fill="#3B2A4A" />
          <ellipse cx={cx + p.headR - 4} cy={headCy + 6} rx="6" ry="18" fill="#3B2A4A" />
        </>
      )}

      {/* Body / Baju */}
      <ellipse cx={cx} cy={cy} rx={p.bodyW} ry={p.bodyH / 2} fill={shirtColor} stroke="#3B2A4A" strokeWidth="3" />

      {/* Head */}
      <circle cx={cx} cy={headCy} r={p.headR} fill="#FFE0BD" stroke="#3B2A4A" strokeWidth="3" />

      {/* Hijab (cover head + leher area) */}
      {g === 'female' && h && (
        <>
          <path
            d={`M ${cx - p.headR - 4} ${headCy + 4}
                Q ${cx - p.headR - 8} ${headCy - p.headR - 2}, ${cx} ${headCy - p.headR - 4}
                Q ${cx + p.headR + 8} ${headCy - p.headR - 2}, ${cx + p.headR + 4} ${headCy + 4}
                L ${cx + p.headR + 6} ${headCy + p.headR + 8}
                Q ${cx} ${headCy + p.headR + 14}, ${cx - p.headR - 6} ${headCy + p.headR + 8} Z`}
            fill="#74D0F1"
            stroke="#3B2A4A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse cx={cx} cy={headCy + 2} rx={p.headR - 6} ry={p.headR - 2} fill="#FFE0BD" stroke="none" />
          <ellipse cx={cx} cy={headCy + 2} rx={p.headR - 6} ry={p.headR - 2} fill="none" stroke="#3B2A4A" strokeWidth="2" />
          <circle cx={cx - p.headR + 2} cy={headCy - 4} r="2" fill="#FF6FB5" />
          <circle cx={cx - p.headR + 4} cy={headCy - 1} r="1.5" fill="#FFE66D" />
        </>
      )}

      {/* Hair laki-laki (jambul pendek) */}
      {g === 'male' && (
        <path
          d={`M ${cx - p.headR + 4} ${headCy - p.headR + 8}
              Q ${cx - p.headR + 2} ${headCy - p.headR - 2}, ${cx - 4} ${headCy - p.headR + 2}
              Q ${cx} ${headCy - p.headR - 6}, ${cx + 6} ${headCy - p.headR}
              Q ${cx + p.headR - 2} ${headCy - p.headR - 2}, ${cx + p.headR - 4} ${headCy - p.headR + 8}
              Q ${cx + 8} ${headCy - p.headR + 4}, ${cx} ${headCy - p.headR + 6}
              Q ${cx - 8} ${headCy - p.headR + 4}, ${cx - p.headR + 4} ${headCy - p.headR + 8} Z`}
          fill="#3B2A4A"
        />
      )}

      {/* Hair perempuan tanpa hijab (poni atas + side) */}
      {g === 'female' && !h && (
        <>
          <path
            d={`M ${cx - p.headR + 2} ${headCy - p.headR + 10}
                Q ${cx - p.headR - 2} ${headCy - p.headR - 4}, ${cx - 6} ${headCy - p.headR}
                Q ${cx + 2} ${headCy - p.headR - 8}, ${cx + 8} ${headCy - p.headR}
                Q ${cx + p.headR + 2} ${headCy - p.headR - 2}, ${cx + p.headR - 2} ${headCy - p.headR + 10}
                Q ${cx + 12} ${headCy - p.headR + 6}, ${cx + 4} ${headCy - p.headR + 8}
                Q ${cx - 4} ${headCy - p.headR + 4}, ${cx - p.headR + 2} ${headCy - p.headR + 10} Z`}
            fill="#3B2A4A"
          />
          <g transform={`translate(${cx + p.headR - 6}, ${headCy - p.headR + 4})`}>
            <ellipse cx="-3" cy="0" rx="4" ry="3" fill="#FF6FB5" stroke="#3B2A4A" strokeWidth="1" />
            <ellipse cx="3" cy="0" rx="4" ry="3" fill="#FF6FB5" stroke="#3B2A4A" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.5" fill="#3B2A4A" />
          </g>
        </>
      )}

      {/* Mata - chibi besar */}
      <Eyes cx={cx} cy={headCy + 2} expression={expression} female={g === 'female'} />

      {/* Pipi blush */}
      <circle cx={cx - p.headR * 0.55} cy={headCy + 8} r="4" fill={p.cheek} opacity="0.6" />
      <circle cx={cx + p.headR * 0.55} cy={headCy + 8} r="4" fill={p.cheek} opacity="0.6" />

      {/* Mulut */}
      <Mouth cx={cx} cy={headCy + 14} expression={expression} />
    </g>
  );
}

function Eyes({ cx, cy, expression, female }: { cx: number; cy: number; expression: string; female: boolean }) {
  if (expression === 'sleep') {
    return (
      <>
        <path d={`M ${cx - 12} ${cy} Q ${cx - 8} ${cy + 3}, ${cx - 4} ${cy}`} stroke="#3B2A4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d={`M ${cx + 4} ${cy} Q ${cx + 8} ${cy + 3}, ${cx + 12} ${cy}`} stroke="#3B2A4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    );
  }
  // mata chibi besar
  return (
    <>
      <ellipse cx={cx - 9} cy={cy} rx="4" ry="5" fill="#3B2A4A" />
      <ellipse cx={cx + 9} cy={cy} rx="4" ry="5" fill="#3B2A4A" />
      <circle cx={cx - 8} cy={cy - 1} r="1.4" fill="white" />
      <circle cx={cx + 10} cy={cy - 1} r="1.4" fill="white" />
      {female && (
        <>
          <line x1={cx - 13} y1={cy - 4} x2={cx - 11} y2={cy - 2} stroke="#3B2A4A" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx + 13} y1={cy - 4} x2={cx + 11} y2={cy - 2} stroke="#3B2A4A" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </>
  );
}

function Mouth({ cx, cy, expression }: { cx: number; cy: number; expression: string }) {
  if (expression === 'eat') {
    return <ellipse cx={cx} cy={cy} rx="4" ry="3" fill="#3B2A4A" />;
  }
  if (expression === 'tired') {
    return <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} stroke="#3B2A4A" strokeWidth="2" strokeLinecap="round" />;
  }
  if (expression === 'sleep') {
    return <ellipse cx={cx + 4} cy={cy} rx="3" ry="1.5" fill="#3B2A4A" opacity="0.5" />;
  }
  return <path d={`M ${cx - 5} ${cy - 1} Q ${cx} ${cy + 4}, ${cx + 5} ${cy - 1}`} stroke="#3B2A4A" strokeWidth="2" fill="none" strokeLinecap="round" />;
}

// ===========================================================================
// AKTIVITAS - tiap aktivitas adalah scene SVG dengan animasi
// ===========================================================================

// === UNDERWEIGHT ===

function DrinkMilk({ g, h, p }: BodyProps) {
  return (
    <g>
      <Body g={g} h={h} p={p} cy={115} expression="happy" />
      {/* Gelas susu di tangan */}
      <motion.g
        animate={{ rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ transformOrigin: '130px 100px' }}
      >
        <rect x="125" y="90" width="14" height="20" rx="2" fill="white" stroke="#3B2A4A" strokeWidth="2" />
        <ellipse cx="132" cy="91" rx="7" ry="2" fill="#F5F5F5" stroke="#3B2A4A" strokeWidth="2" />
      </motion.g>
    </g>
  );
}

function EatBanana({ g, h, p }: BodyProps) {
  return (
    <g>
      <Body g={g} h={h} p={p} cy={115} expression="eat" />
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
        <path d="M 120 80 Q 140 75, 145 95 Q 142 90, 122 88 Z" fill="#FFE66D" stroke="#3B2A4A" strokeWidth="2" />
      </motion.g>
    </g>
  );
}

function Sleep({ g, h, p }: BodyProps) {
  return (
    <g>
      <Body g={g} h={h} p={p} cy={140} expression="sleep" rotate={-90} />
      <motion.text x="140" y="60" fontSize="20" fill="#74D0F1"
        animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}>z</motion.text>
      <motion.text x="155" y="50" fontSize="16" fill="#74D0F1"
        animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>z</motion.text>
    </g>
  );
}

function ReadBook({ g, h, p }: BodyProps) {
  return (
    <g>
      <Body g={g} h={h} p={p} cy={115} expression="happy" />
      {/* Buku */}
      <g transform="translate(80, 110)">
        <rect x="0" y="0" width="40" height="22" rx="1" fill="#FF6FB5" stroke="#3B2A4A" strokeWidth="2" />
        <line x1="20" y1="0" x2="20" y2="22" stroke="#3B2A4A" strokeWidth="1.5" />
        <line x1="5" y1="6" x2="16" y2="6" stroke="white" strokeWidth="1" />
        <line x1="5" y1="11" x2="16" y2="11" stroke="white" strokeWidth="1" />
        <line x1="24" y1="6" x2="35" y2="6" stroke="white" strokeWidth="1" />
        <line x1="24" y1="11" x2="35" y2="11" stroke="white" strokeWidth="1" />
      </g>
    </g>
  );
}

// === NORMAL ===

function JumpRope({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="happy" />
      </motion.g>
      <motion.path
        d="M 50 130 Q 100 90, 150 130"
        stroke="#FF6FB5"
        strokeWidth="2.5"
        fill="none"
        animate={{ d: ['M 50 130 Q 100 90, 150 130', 'M 50 130 Q 100 170, 150 130', 'M 50 130 Q 100 90, 150 130'] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      />
      <motion.text x="35" y="50" fontSize="18"
        animate={{ opacity: [0, 1, 0], y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}>✨</motion.text>
    </g>
  );
}

function Yoga({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{ transformOrigin: '100px 110px' }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="happy" />
        {/* tangan ke atas */}
        <line x1={100 - p.bodyW + 4} y1="100" x2="65" y2="55" stroke="#FFE0BD" strokeWidth="6" strokeLinecap="round" />
        <line x1={100 + p.bodyW - 4} y1="100" x2="135" y2="55" stroke="#FFE0BD" strokeWidth="6" strokeLinecap="round" />
      </motion.g>
      <motion.text x="55" y="50" fontSize="14"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}>🧘</motion.text>
    </g>
  );
}

function Jog({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 0.4 }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="happy" />
      </motion.g>
      {/* speed lines */}
      <motion.g
        animate={{ x: [-20, 0, -20] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <line x1="20" y1="100" x2="40" y2="100" stroke="#FF6FB5" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="115" x2="40" y2="115" stroke="#FF6FB5" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="130" x2="40" y2="130" stroke="#FF6FB5" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </g>
  );
}

function Dance({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ rotate: [-8, 8, -8], y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{ transformOrigin: '100px 130px' }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="happy" />
      </motion.g>
      <motion.text x="40" y="60" fontSize="16"
        animate={{ rotate: [0, 20, 0], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}>🎵</motion.text>
      <motion.text x="150" y="70" fontSize="16"
        animate={{ rotate: [0, -20, 0], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}>🎶</motion.text>
    </g>
  );
}

function Peace({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="happy" />
        {/* Tangan peace sign */}
        <circle cx="135" cy="85" r="6" fill="#FFE0BD" stroke="#3B2A4A" strokeWidth="2" />
        <text x="129" y="90" fontSize="10">✌</text>
      </motion.g>
      <motion.text x="40" y="60" fontSize="14"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}>⭐</motion.text>
    </g>
  );
}

// === OVERWEIGHT ===

function Bike({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="happy" />
      </motion.g>
      {/* Sepeda */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ transformOrigin: '70px 220px' }}
      >
        <circle cx="70" cy="220" r="18" fill="none" stroke="#3B2A4A" strokeWidth="3" />
        <line x1="55" y1="220" x2="85" y2="220" stroke="#3B2A4A" strokeWidth="2" />
        <line x1="70" y1="205" x2="70" y2="235" stroke="#3B2A4A" strokeWidth="2" />
      </motion.g>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ transformOrigin: '140px 220px' }}
      >
        <circle cx="140" cy="220" r="18" fill="none" stroke="#3B2A4A" strokeWidth="3" />
        <line x1="125" y1="220" x2="155" y2="220" stroke="#3B2A4A" strokeWidth="2" />
        <line x1="140" y1="205" x2="140" y2="235" stroke="#3B2A4A" strokeWidth="2" />
      </motion.g>
      <line x1="70" y1="220" x2="140" y2="220" stroke="#3B2A4A" strokeWidth="3" />
      <line x1="105" y1="220" x2="105" y2="195" stroke="#3B2A4A" strokeWidth="3" />
    </g>
  );
}

function Squat({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, 12, 0], scaleY: [1, 0.85, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ transformOrigin: '100px 130px' }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="tired" />
      </motion.g>
      <motion.text x="150" y="60" fontSize="16"
        animate={{ opacity: [0, 1, 0], y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}>💪</motion.text>
    </g>
  );
}

function Walk({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, -2, 0], rotate: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: 0.7 }}
        style={{ transformOrigin: '100px 130px' }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="happy" />
      </motion.g>
      <motion.text x="40" y="240" fontSize="12"
        animate={{ x: [0, -10, 0], opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}>👣</motion.text>
    </g>
  );
}

function Dumbbell({ g, h, p }: BodyProps) {
  return (
    <g>
      <Body g={g} h={h} p={p} cy={115} expression="tired" />
      <motion.g
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <circle cx="60" cy="100" r="6" fill="#3B2A4A" />
        <rect x="58" y="98" width="4" height="4" fill="#3B2A4A" />
        <circle cx="48" cy="100" r="6" fill="#3B2A4A" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <circle cx="140" cy="100" r="6" fill="#3B2A4A" />
        <rect x="138" y="98" width="4" height="4" fill="#3B2A4A" />
        <circle cx="152" cy="100" r="6" fill="#3B2A4A" />
      </motion.g>
    </g>
  );
}

// === OBESE ===

function Treadmill({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 0.4 }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="tired" />
      </motion.g>
      {/* Treadmill belt */}
      <rect x="40" y="215" width="120" height="14" rx="4" fill="#3B2A4A" />
      <rect x="40" y="215" width="120" height="14" rx="4" fill="none" stroke="#FF6FB5" strokeWidth="2" />
      <motion.g
        animate={{ x: [-20, 0] }}
        transition={{ repeat: Infinity, duration: 0.3, ease: 'linear' }}
      >
        <line x1="50" y1="222" x2="60" y2="222" stroke="#FFE66D" strokeWidth="2" />
        <line x1="70" y1="222" x2="80" y2="222" stroke="#FFE66D" strokeWidth="2" />
        <line x1="90" y1="222" x2="100" y2="222" stroke="#FFE66D" strokeWidth="2" />
        <line x1="110" y1="222" x2="120" y2="222" stroke="#FFE66D" strokeWidth="2" />
        <line x1="130" y1="222" x2="140" y2="222" stroke="#FFE66D" strokeWidth="2" />
        <line x1="150" y1="222" x2="160" y2="222" stroke="#FFE66D" strokeWidth="2" />
      </motion.g>
      {/* Console */}
      <rect x="30" y="170" width="14" height="50" fill="#3B2A4A" rx="2" />
      <motion.text x="155" y="60" fontSize="18"
        animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}>💦</motion.text>
    </g>
  );
}

function Pushup({ g, h, p }: BodyProps) {
  return (
    <g>
      <motion.g
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <Body g={g} h={h} p={p} cy={170} expression="tired" rotate={75} />
      </motion.g>
      <line x1="30" y1="225" x2="170" y2="225" stroke="#3B2A4A" strokeWidth="3" />
      <motion.text x="155" y="60" fontSize="16"
        animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}>💦</motion.text>
    </g>
  );
}

function EatBurger({ g, h, p }: BodyProps) {
  return (
    <g>
      <Body g={g} h={h} p={p} cy={115} expression="eat" />
      <motion.g
        animate={{ y: [0, -3, 0], rotate: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        {/* Burger */}
        <ellipse cx="135" cy="92" rx="13" ry="5" fill="#D97B3A" stroke="#3B2A4A" strokeWidth="2" />
        <rect x="122" y="92" width="26" height="4" fill="#7EEBC1" />
        <rect x="122" y="96" width="26" height="3" fill="#FF6FB5" />
        <ellipse cx="135" cy="100" rx="13" ry="5" fill="#D97B3A" stroke="#3B2A4A" strokeWidth="2" />
        {/* Sesame seeds */}
        <circle cx="130" cy="89" r="0.8" fill="white" />
        <circle cx="135" cy="88" r="0.8" fill="white" />
        <circle cx="140" cy="89" r="0.8" fill="white" />
      </motion.g>
    </g>
  );
}

function Pant({ g, h, p, category }: BodyProps & { category: BmiCategory }) {
  return (
    <g>
      <motion.g
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{ transformOrigin: '100px 130px' }}
      >
        <Body g={g} h={h} p={p} cy={115} expression="tired" />
      </motion.g>
      {category === 'obese' && (
        <>
          <motion.text x="145" y="55" fontSize="18"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}>💦</motion.text>
          <motion.text x="40" y="60" fontSize="18"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.5 }}>💦</motion.text>
        </>
      )}
    </g>
  );
}

function DrinkWater({ g, h, p }: BodyProps) {
  return (
    <g>
      <Body g={g} h={h} p={p} cy={115} expression="happy" />
      <motion.g
        animate={{ rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ transformOrigin: '135px 105px' }}
      >
        {/* Bottle */}
        <rect x="128" y="80" width="14" height="28" rx="3" fill="#74D0F1" stroke="#3B2A4A" strokeWidth="2" />
        <rect x="131" y="74" width="8" height="6" rx="1" fill="#3B2A4A" />
        <rect x="130" y="88" width="10" height="14" fill="#A6E0F5" />
      </motion.g>
    </g>
  );
}
