export interface Member {
  id: string;
  name: string;
  photoUrl?: string;
  heightCm?: number;
  createdAt?: number;
}

export interface Weighing {
  id: string;
  memberId: string;
  date: string; // yyyy-mm-dd (tanggal penimbangan mingguan)
  weightKg: number;
  createdAt: number;
}

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';
export type Gender = 'male' | 'female';

export interface BmiInfo {
  value: number;
  category: BmiCategory;
  label: string;
  emoji: string;
  color: string;
  message: string;
}

// Anggota perempuan - sisanya otomatis laki-laki
const FEMALE_NAMES = new Set([
  'sinta', 'yola', 'siska', 'dyah', 'diah', 'bu desi', 'desi', 'yovanka', 'yovan'
]);

export function getGender(name: string): Gender {
  const key = name.trim().toLowerCase();
  return FEMALE_NAMES.has(key) ? 'female' : 'male';
}

