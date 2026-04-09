import { BmiCategory, BmiInfo } from './types';

export function calcBmi(weightKg: number, heightCm?: number): BmiInfo | null {
  if (!heightCm || heightCm <= 0 || !weightKg) return null;
  const h = heightCm / 100;
  const value = weightKg / (h * h);
  return getBmiInfo(value);
}

export function getBmiInfo(value: number): BmiInfo {
  let category: BmiCategory;
  let label: string;
  let emoji: string;
  let color: string;
  let message: string;

  if (value < 18.5) {
    category = 'underweight';
    label = 'Kurus';
    emoji = '🌱';
    color = '#74D0F1';
    message = 'Makan yang banyak yaa~ masih kurus nih!';
  } else if (value < 25) {
    category = 'normal';
    label = 'Ideal';
    emoji = '✨';
    color = '#7EEBC1';
    message = 'Mantap! Berat badan kamu ideal banget 💚';
  } else if (value < 30) {
    category = 'overweight';
    label = 'Gemuk';
    emoji = '🍩';
    color = '#FFE66D';
    message = 'Hmm agak gembul nih, yuk olahraga!';
  } else {
    category = 'obese';
    label = 'Obesitas';
    emoji = '🎈';
    color = '#FF6FB5';
    message = 'Waduh, perlu banget nih dietnya! Semangat!';
  }

  return { value: Math.round(value * 10) / 10, category, label, emoji, color, message };
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getCurrentWeek(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}
