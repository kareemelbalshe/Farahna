'use client';

import React, { useEffect, useState } from 'react';
import {
  Image,
  UploadCloud,
  Folder,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Music,
  FileImage,
  HardDrive,
  X,
} from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { formatArabicDate } from '@/lib/date';

export default function AdminMediaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadCategory, setUploadCategory] = useState<string>('gallery');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      setErrorMsg('');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) return;

    setUploading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('category', uploadCategory);

      // Call API upload endpoint
      const token = typeof window !== 'undefined' ? localStorage.getItem('farahna_token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/media/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMsg(`تم رفع الملف بنجاح وتخزينه محلياً في: ${data.data.filePath}`);
        setUploadedFiles((prev) => [data.data, ...prev]);
        setFileToUpload(null);
      } else {
        setErrorMsg(data.message || 'فشل رفع الملف');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Toast & Error Alerts */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">
              التخزين المحلي للوسائط (Local Media Storage) 📁
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
              <span>تخزين محلي 100% (No Cloudinary)</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة ملفات الوسائط وصور الدعوات وإيصالات التحويل المخزنة داخل مجلد المشروع المنظم
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-[#720925]" />
          <span>رفع وسائط جديدة إلى التخزين المحلي</span>
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">قسم الوسائط المستهدف:</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white text-xs"
              >
                <option value="cover">غلاف الدعوة الرئيسية (invitations/cover)</option>
                <option value="gallery">معرض صور العروسين (invitations/gallery)</option>
                <option value="event">صور مناسبة خاصة (invitations/events)</option>
                <option value="music">مقطع موسيقي MP3 (invitations/music)</option>
                <option value="theme">أصول وزخارف الثيم (themes/assets)</option>
                <option value="payment_proof">
                  إثبات تحويل إنستاباي 🛡️ (customers/payment-proofs - محمي للإدارة فقط)
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">اختيار الملف من جهازك:</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/mp3,audio/wav"
                onChange={handleFileSelect}
                className="w-full p-2 rounded-xl border border-stone-300 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#720925] file:text-white hover:file:opacity-90 cursor-pointer"
              />
            </div>
          </div>

          {fileToUpload && (
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-800">{fileToUpload.name}</span>
                <span className="text-stone-400 mr-2 text-[11px]">
                  ({(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {uploading ? 'جاري المعالجة والتخزين...' : 'تأكيد الرفع والمعالجة بـ Sharp 🚀'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Directory Structure Explanation Card */}
      <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-stone-200 space-y-2 text-xs">
        <h3 className="font-black text-stone-900 flex items-center gap-1.5">
          <Folder className="w-4 h-4 text-amber-700" />
          <span>هيكلية التخزين المحلي الآمن داخل الخادم (/apps/api/storage/):</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-stone-700 font-mono text-[11px] pt-1">
          <div className="p-3 bg-white rounded-xl border border-stone-200/80">
            <strong className="text-stone-900 block font-sans">1. وسائط الدعوات (عامة):</strong>
            <p className="text-stone-500 mt-1">invitations/{'{id}'}/cover/</p>
            <p className="text-stone-500">invitations/{'{id}'}/gallery/</p>
            <p className="text-stone-500">invitations/{'{id}'}/music/</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200/80">
            <strong className="text-stone-900 block font-sans">2. أصول الثيمات (عامة):</strong>
            <p className="text-stone-500 mt-1">themes/{'{slug}'}/assets/</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-amber-300">
            <strong className="text-amber-900 block font-sans">3. إثباتات الدفع (محمية):</strong>
            <p className="text-amber-800 mt-1">customers/{'{id}'}/payment-proofs/</p>
            <span className="text-[10px] text-rose-700 font-bold font-sans">
              * محجوبة عن المسار العام ومحمية بصلاحية المشرف فقط
            </span>
          </div>
        </div>
      </div>

      {/* Recently Uploaded Files in this session */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 font-bold text-stone-800 text-xs">
            الملفات المرفوعة حديثاً في هذه الجلسة ({uploadedFiles.length})
          </div>
          <div className="divide-y divide-stone-100">
            {uploadedFiles.map((f, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-stone-900">{f.originalName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                      {f.mimeType}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                      {f.isPublic ? 'عام (Public)' : 'محمي (Protected 🛡️)'}
                    </span>
                  </div>
                  <p className="font-mono text-stone-500 text-[11px] dir-ltr text-right">
                    المسار المحلي: {f.filePath}
                  </p>
                </div>

                <div className="text-left font-mono text-stone-600">
                  <span>{(f.sizeBytes / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
