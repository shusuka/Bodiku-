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

export interface BmiInfo {
  value: number;
  category: BmiCategory;
  label: string;
  emoji: string;
  color: string;
  message: string;
}
