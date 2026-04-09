import { motion } from 'framer-motion';
import { BmiCategory } from '../lib/types';

interface Props {
  category: BmiCategory;
  size?: number;
}

/**
 * Karakter SVG lucu yang bentuk badannya berubah sesuai kategori BMI.
 * - underweight: kurus, gemeter
 * - normal: ideal, senyum + sparkle
 * - overweight: agak bulat, wobble
 * - obese: bulat banget, bouncy
 */
export default function BmiCharacter({ category, size = 160 }: Props) {
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

      {/* Keringet buat obese */}
      {category === 'obese' && (
        <motion.text x="145" y="55" fontSize="22"
          animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}>💦</motion.text>
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

      {/* Pipi */}
      <circle cx={cx - config.bodyW * 0.28} cy={cy + 5} r="8" fill={config.cheek} opacity="0.7" />
      <circle cx={cx + config.bodyW * 0.28} cy={cy + 5} r="8" fill={config.cheek} opacity="0.7" />

      {/* Mata */}
      <circle cx={cx - 18} cy={cy - 15} r="6" fill="#3B2A4A" />
      <circle cx={cx + 18} cy={cy - 15} r="6" fill="#3B2A4A" />
      <circle cx={cx - 16} cy={cy - 17} r="2" fill="white" />
      <circle cx={cx + 20} cy={cy - 17} r="2" fill="white" />

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

      {/* Tangan kecil */}
      <circle cx={cx - config.bodyW / 2 - 2} cy={cy + 15} r="10" fill={config.color} stroke="#3B2A4A" strokeWidth="4" />
      <circle cx={cx + config.bodyW / 2 + 2} cy={cy + 15} r="10" fill={config.color} stroke="#3B2A4A" strokeWidth="4" />
    </motion.svg>
  );
}
