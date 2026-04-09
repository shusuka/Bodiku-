import {
  collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Member, Weighing } from './types';

// ---------- MEMBERS ----------
export async function getMembers(): Promise<Member[]> {
  const snap = await getDocs(collection(db, 'members'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }));
}

export async function seedMembers(names: string[]): Promise<void> {
  const existing = await getMembers();
  if (existing.length > 0) return;
  await Promise.all(
    names.map(name =>
      setDoc(doc(collection(db, 'members')), {
        name,
        heightCm: 165,
        createdAt: Date.now(),
      })
    )
  );
}

export async function updateMember(id: string, data: Partial<Member>): Promise<void> {
  await updateDoc(doc(db, 'members', id), data);
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(db, 'members', id));
}

export async function addMember(name: string): Promise<void> {
  await addDoc(collection(db, 'members'), {
    name,
    heightCm: 165,
    createdAt: Date.now(),
  });
}

/**
 * Kompres foto ke base64 (max 400px, JPEG 70% quality).
 * Hasil ~30-60 KB per foto, aman di bawah limit Firestore 1 MB per doc.
 * Ga perlu Firebase Storage (Storage butuh Blaze plan / kartu kredit).
 */
export async function uploadPhoto(memberId: string, file: File): Promise<string> {
  const dataUrl = await compressImageToBase64(file, 400, 0.7);
  await updateMember(memberId, { photoUrl: dataUrl });
  return dataUrl;
}

function compressImageToBase64(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = (height * maxDim) / width;
          width = maxDim;
        } else if (height > maxDim) {
          width = (width * maxDim) / height;
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas ga support'));
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal load gambar'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal baca file'));
    reader.readAsDataURL(file);
  });
}

// ---------- WEIGHINGS ----------
export async function getWeighings(memberId?: string): Promise<Weighing[]> {
  let q;
  if (memberId) {
    q = query(collection(db, 'weighings'), where('memberId', '==', memberId), orderBy('date', 'asc'));
  } else {
    q = query(collection(db, 'weighings'), orderBy('date', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Weighing, 'id'>) }));
}

export async function addWeighing(memberId: string, date: string, weightKg: number): Promise<void> {
  await addDoc(collection(db, 'weighings'), {
    memberId, date, weightKg,
    createdAt: Date.now(),
  });
}

export async function deleteWeighing(id: string): Promise<void> {
  await deleteDoc(doc(db, 'weighings', id));
}
