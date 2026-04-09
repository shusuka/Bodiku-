import { motion } from 'framer-motion';
import { BmiCategory, Gender } from '../lib/types';

interface Props {
  category: BmiCategory;
  gender?: Gender;
  size?: number;
}

/**
 * Karakter SVG yang berubah bentuk sesuai BMI + gender (laki/perempuan).
 * - underweight: kurus, gemeter
 * - normal: ideal, senyum + sparkle
 * - overweight: agak bulat, wobble
 * - obese: bulat banget, bouncy + keringet
 *
 * Perempuan: rambut panjang + pita + bulu mata
 * Laki-laki: rambut pendek
 */
export default function BmiCharacter({ category, gender = 'male', size = 160 }: Props) {
  const config = {
    underweight: { bodyW: 60, bodyH: 90, color: '#74D0F1', cheek: '#FFB088', mouth: 'thin' },
    normal:      { bodyW: 85, bodyH: 95, color: '#7EEBC1', cheek: '#FF6FB5', mouth: 'smile' },
    overweight:  { bodyW: 115, bodyH: 100, color: '#FFE66D', cheek: '#FF6FB5', mouth: 'o' },
    obese:       { bodyW: 140, bodyH: 110, color: '#FF6FB5', cheek: '#FFE66D', mouth: 'wide' },
  }[category];

  const anim = {
    underweight: { rotate: [-2, 2, -2], transition: { repeat: Infinity, duration: 0.4 } },
    normal:      { y: [0, -8, 0], transition: { repeat: Infinity, duration: 2 } },
    overweight:  { scale: [1, 1.05, 1], rotate: [-3, 3, -3], transition: { repeat: Infinity, duration: 1.2 } },
    obese:       { scale: [1, 1.12, 0.95, 1.08, 1], transition: { repeat: Infinity, duration: 1.5 } },
  }[category];

  const cx = 100;
  const cy = 100;
  const bodyTop = cy + 10 - config.bodyH / 2;

  // Hair/aksesoris warna berbeda per gender
  const hairColor = '#3B2A4A';
  const ribbonColor = gender === 'female' ? '#FF6FB5' : null;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      animate={anim}
      style={{ filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.12))' }}
    >
      {/* Sparkles buat kategori normal */}
      {category === 'normal' && (
        <>
          <motion.text x="30" y="40" fontSize="24"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0 }}>✨</motion.text>
          <motion.text x="160" y="50" fontSize="20"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }}>✨</motion.text>
          <motion.text x="150" y="170" fontSize="18"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 1.2 }}>⭐</motion.text>
        </>
      )}

      {/* Keringat buat obese */}
      {category === 'obese' && (
        <motion.text x="145" y="55" fontSize="22"
          animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}>💦</motion.text>
      )}

      {/* === RAMBUT PEREMPUAN: Layer belakang (panjang, menjuntai di belakang badan) === */}
      {gender === 'female' && (
        <>
          {/* Rambut belakang kiri */}
          <path
            d={`M ${cx - config.bodyW * 0.35} ${bodyTop + 5}
                Q ${cx - config.bodyW * 0.55} ${cy + 20}, ${cx - config.bodyW * 0.45} ${cy + 40}`}
            stroke={hairColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          {/* Rambut belakang kanan */}
          <path
            d={`M ${cx + config.bodyW * 0.35} ${bodyTop + 5}
                Q ${cx + config.bodyW * 0.55} ${cy + 20}, ${cx + config.bodyW * 0.45} ${cy + 40}`}
            stroke={hairColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}

      {/* Badan (ellipse yang ukurannya beda-beda) */}
      <ellipse
        cx={cx}
        cy={cy + 10}
        rx={config.bodyW / 2}
        ry={config.bodyH / 2}
        fill={config.color}
        stroke="#3B2A4A"
        strokeWidth="4"
      />

      {/* === RAMBUT === */}
      {gender === 'male' ? (
        // Laki-laki: rambut pendek tipe "jambul"
        <path
          d={`M ${cx - 22} ${bodyTop + 8}
              Q ${cx - 25} ${bodyTop - 4}, ${cx - 8} ${bodyTop - 2}
              Q ${cx - 2} ${bodyTop - 10}, ${cx + 8} ${bodyTop - 2}
              Q ${cx + 20} ${bodyTop - 6}, ${cx + 22} ${bodyTop + 8}
              Q ${cx + 18} ${bodyTop + 2}, ${cx} ${bodyTop + 4}
              Q ${cx - 18} ${bodyTop + 2}, ${cx - 22} ${bodyTop + 8} Z`}
          fill={hairColor}
          stroke={hairColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : (
        // Perempuan: poni + rambut atas
        <>
          <path
            d={`M ${cx - 24} ${bodyTop + 10}
                Q ${cx - 26} ${bodyTop - 6}, ${cx - 5} ${bodyTop - 8}
                Q ${cx + 5} ${bodyTop - 12}, ${cx + 22} ${bodyTop - 4}
                Q ${cx + 26} ${bodyTop + 6}, ${cx + 24} ${bodyTop + 12}
                Q ${cx + 15} ${bodyTop + 2}, ${cx + 5} ${bodyTop + 6}
                Q ${cx - 5} ${bodyTop + 2}, ${cx - 18} ${bodyTop + 8}
                Q ${cx - 24} ${bodyTop + 4}, ${cx - 24} ${bodyTop + 10} Z`}
            fill={hairColor}
            stroke={hairColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Pita */}
          {ribbonColor && (
            <g transform={`translate(${cx + 14}, ${bodyTop - 2})`}>
              <path
                d="M -6 0 Q -10 -6, -4 -4 Q 0 -2, 0 0 Q 0 -2, 4 -4 Q 10 -6, 6 0 Q 10 6, 4 4 Q 0 2, 0 0 Q 0 2, -4 4 Q -10 6, -6 0 Z"
                fill={ribbonColor}
                stroke="#3B2A4A"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="2" fill="#3B2A4A" />
            </g>
          )}
        </>
      )}

      {/* Pipi */}
      <circle cx={cx - config.bodyW * 0.28} cy={cy + 5} r="8" fill={config.cheek} opacity="0.7" />
      <circle cx={cx + config.bodyW * 0.28} cy={cy + 5} r="8" fill={config.cheek} opacity="0.7" />

      {/* Mata */}
      <circle cx={cx - 18} cy={cy - 15} r="6" fill="#3B2A4A" />
      <circle cx={cx + 18} cy={cy - 15} r="6" fill="#3B2A4A" />
      <circle cx={cx - 16} cy={cy - 17} r="2" fill="white" />
      <circle cx={cx + 20} cy={cy - 17} r="2" fill="white" />

      {/* Bulu mata perempuan */}
      {gender === 'female' && (
        <>
          <line x1={cx - 24} y1={cy - 22} x2={cx - 22} y2={cy - 19} stroke="#3B2A4A" strokeWidth="2" strokeLinecap="round" />
          <line x1={cx - 20} y1={cy - 24} x2={cx - 20} y2={cy - 20} stroke="#3B2A4A" strokeWidth="2" strokeLinecap="round" />
          <line x1={cx - 15} y1={cy - 23} x2={cx - 16} y2={cy - 20} stroke="#3B2A4A" strokeWidth="2" strokeLinecap="round" />
          <line x1={cx + 15} y1={cy - 23} x2={cx + 16} y2={cy - 20} stroke="#3B2A4A" strokeWidth="2" strokeLinecap="round" />
          <line x1={cx + 20} y1={cy - 24} x2={cx + 20} y2={cy - 20} stroke="#3B2A4A" strokeWidth="2" strokeLinecap="round" />
          <line x1={cx + 24} y1={cy - 22} x2={cx + 22} y2={cy - 19} stroke="#3B2A4A" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* Mulut */}
      {config.mouth === 'thin' && (
        <line x1={cx - 8} y1={cy + 10} x2={cx + 8} y2={cy + 10} stroke="#3B2A4A" strokeWidth="3" strokeLinecap="round" />
      )}
      {config.mouth === 'smile' && (
        <path d={`M ${cx - 12} ${cy + 5} Q ${cx} ${cy + 18} ${cx + 12} ${cy + 5}`} stroke="#3B2A4A" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      {config.mouth === 'o' && (
        <ellipse cx={cx} cy={cy + 10} rx="6" ry="8" fill="#3B2A4A" />
      )}
      {config.mouth === 'wide' && (
        <path d={`M ${cx - 16} ${cy + 5} Q ${cx} ${cy + 25} ${cx + 16} ${cy + 5}`} stroke="#3B2A4A" strokeWidth="4" fill="#3B2A4A" strokeLinecap="round" />
      )}

      {/* Lipstik perempuan (titik merah kecil di mulut) */}
      {gender === 'female' && (config.mouth === 'smile' || config.mouth === 'thin') && (
        <circle cx={cx} cy={cy + 12} r="1.5" fill="#FF6FB5" />
      )}

      {/* Tangan kecil */}
      <circle cx={cx - config.bodyW / 2 - 2} cy={cy + 15} r="10" fill={config.color} stroke="#3B2A4A" strokeWidth="4" />
      <circle cx={cx + config.bodyW / 2 + 2} cy={cy + 15} r="10" fill={config.color} stroke="#3B2A4A" strokeWidth="4" />
    </motion.svg>
  );
}
