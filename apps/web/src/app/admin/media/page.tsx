'use client';

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
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
  Eye,
  Download,
  Copy,
  Check,
  RefreshCw,
  LayoutGrid,
  List,
  Play,
  Pause,
  Layers,
  Sparkles,
  Phone,
  User,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Maximize2,
  Info,
} from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { formatArabicDate, formatArabicTime } from '@/lib/date';

interface MediaItem {
  id: string;
  filePath: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  type: 'image' | 'audio';
  category: string;
  isPublic: boolean;
  caption?: string | null;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  invitation?: {
    id: string;
    title: string;
    slug: string;
    type: string;
    coupleGroomAr?: string;
    coupleBrideAr?: string;
  } | null;
  customer?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  event?: {
    id: string;
    titleAr: string;
    type: string;
  } | null;
}

interface MediaStats {
  totalFiles: number;
  totalSizeBytes: number;
  imagesCount: number;
  audioCount: number;
  paymentProofsCount: number;
}

const CATEGORY_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  all: { label: 'جميع الأقسام', color: 'text-stone-800', bg: 'bg-stone-100', border: 'border-stone-300' },
  cover: { label: 'أغلفة الدعوات', color: 'text-sky-800', bg: 'bg-sky-50', border: 'border-sky-200' },
  gallery: { label: 'معرض صور العروسين', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  music: { label: 'المقاطع الصوتية', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' },
  payment_proof: { label: 'إيصالات إنستاباي 🛡️', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-300' },
  theme: { label: 'أصول الثيمات', color: 'text-teal-800', bg: 'bg-teal-50', border: 'border-teal-200' },
  event: { label: 'صور الفعاليات', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' },
};

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStats>({
    totalFiles: 0,
    totalSizeBytes: 0,
    imagesCount: 0,
    audioCount: 0,
    paymentProofsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Upload state
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('gallery');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // Notifications
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal / Preview state
  const [inspectItem, setInspectItem] = useState<MediaItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Admin token for secure payment proof access
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('farahna_token');
      setAuthToken(token);
    }
  }, []);

  // Fetch all media from API
  const fetchMedia = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      else setRefreshing(true);
      setErrorMsg('');

      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') {
          queryParams.set('category', selectedCategory);
        }
        if (selectedType && selectedType !== 'all') {
          queryParams.set('type', selectedType);
        }
        if (searchQuery.trim()) {
          queryParams.set('search', searchQuery.trim());
        }
        queryParams.set('limit', '150');

        const res = await adminFetch(`/media?${queryParams.toString()}`);
        if (res.success && res.data) {
          setMediaList(res.data.media || []);
          if (res.data.stats) {
            setStats(res.data.stats);
          }
        } else {
          setErrorMsg(res.message || 'فشل جلب ملفات الوسائط');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'حدث خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedCategory, selectedType, searchQuery]
  );

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Construct valid preview or download URL (with auth token for secure media)
  const getMediaUrl = (item: MediaItem): string => {
    if (!item?.url) return '';
    let fullUrl = item.url;
    if (!item.isPublic && authToken) {
      const sep = fullUrl.includes('?') ? '&' : '?';
      fullUrl = `${fullUrl}${sep}token=${encodeURIComponent(authToken)}`;
    }
    return fullUrl;
  };

  // Copy link to clipboard with feedback
  const handleCopyLink = async (item: MediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const relativeOrFull = getMediaUrl(item);
      const fullUrl = relativeOrFull.startsWith('http')
        ? relativeOrFull
        : `${window.location.origin}${relativeOrFull}`;

      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(item.id);
      setToastMsg('تم نسخ رابط الملف إلى الحافظة بنجاح! 📋');
      setTimeout(() => {
        setCopiedId(null);
        setToastMsg('');
      }, 3000);
    } catch {
      setErrorMsg('تعذر نسخ الرابط');
    }
  };

  // Direct download
  const handleDownload = (item: MediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = getMediaUrl(item);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.originalName || item.fileName || 'file';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Audio play/pause toggle
  const togglePlayAudio = (item: MediaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audioUrl = getMediaUrl(item);

    if (playingAudioId === item.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play().catch((err) => {
        console.error('Audio playback error:', err);
        setErrorMsg('تعذر تشغيل الملف الصوتي');
      });
      newAudio.onended = () => {
        setPlayingAudioId(null);
      };
      setPlayingAudioId(item.id);
    }
  };

  // Upload handler
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
      if (uploadCaption.trim()) {
        formData.append('caption', uploadCaption.trim());
      }

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
        setToastMsg(`تم رفع الملف بنجاح وتخزينه محلياً: ${data.data.originalName}`);
        setFileToUpload(null);
        setUploadCaption('');
        setShowUploadDrawer(false);
        // Refresh media list
        fetchMedia(true);
      } else {
        setErrorMsg(data.message || 'فشل رفع الملف');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setUploading(false);
    }
  };

  // Delete media item
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete.id);
    try {
      const res = await adminFetch(`/media/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setToastMsg('تم حذف الملف بنجاح من التخزين وقاعدة البيانات 🗑️');
        setMediaList((prev) => prev.filter((m) => m.id !== itemToDelete.id));
        setStats((prev) => ({
          ...prev,
          totalFiles: Math.max(0, prev.totalFiles - 1),
          totalSizeBytes: Math.max(0, prev.totalSizeBytes - (itemToDelete.sizeBytes || 0)),
          imagesCount: itemToDelete.type === 'image' ? Math.max(0, prev.imagesCount - 1) : prev.imagesCount,
          audioCount: itemToDelete.type === 'audio' ? Math.max(0, prev.audioCount - 1) : prev.audioCount,
          paymentProofsCount:
            itemToDelete.category === 'payment_proof'
              ? Math.max(0, prev.paymentProofsCount - 1)
              : prev.paymentProofsCount,
        }));
        if (inspectItem?.id === itemToDelete.id) {
          setInspectItem(null);
        }
        if (playingAudioId === itemToDelete.id && audioRef.current) {
          audioRef.current.pause();
          setPlayingAudioId(null);
        }
      } else {
        setErrorMsg(res.message || 'فشل حذف الملف');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'تعذر الاتصال بالخادم لحذف الملف');
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white text-xs font-bold flex items-center gap-3 shadow-2xl border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="p-1 hover:bg-emerald-800 rounded-lg mr-2">
            <X className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              استوديو وإشراف الوسائط الشامل 📁
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
              <span>تخزين محلي مباشر 100% (No Cloudinary)</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
            إشراف مركزي كامل على جميع الصور، المقاطع الموسيقية، أصول الثيمات، وإيصالات إنستاباي المحمية
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Refresh Button */}
          <button
            onClick={() => fetchMedia(true)}
            disabled={refreshing || loading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            title="تحديث القائمة"
          >
            <RefreshCw className={`w-4 h-4 text-stone-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="عرض الشبكة (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">شبكة</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="عرض الجدول (Table)"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">جدول</span>
            </button>
          </div>

          {/* Upload Toggle Button */}
          <button
            onClick={() => setShowUploadDrawer(!showUploadDrawer)}
            className="px-4 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{showUploadDrawer ? 'إغلاق الرفع' : 'رفع وسائط جديدة +'}</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-[#720925]/30 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold text-stone-500">إجمالي الملفات</span>
            <Layers className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">{stats.totalFiles}</div>
          <span className="text-[10px] text-stone-400">ملف مسجل في النظام</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold text-stone-500">مساحة التخزين</span>
            <HardDrive className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {formatBytes(stats.totalSizeBytes)}
          </div>
          <span className="text-[10px] text-emerald-600/80">على القرص المحلي</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold text-stone-500">معرض الصور والأغلفة</span>
            <FileImage className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-sky-800">{stats.imagesCount}</div>
          <span className="text-[10px] text-sky-600">صور تم تحسينها بـ Sharp</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold text-stone-500">المقاطع الصوتية</span>
            <Music className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-800">{stats.audioCount}</div>
          <span className="text-[10px] text-purple-600">موسيقى MP3 عالية الجودة</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-2xl border border-amber-300 shadow-2xs hover:border-amber-400 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[11px] font-bold text-amber-900">إيصالات إنستاباي 🛡️</span>
            <ShieldCheck className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-950">
            {stats.paymentProofsCount}
          </div>
          <span className="text-[10px] text-amber-800 font-bold">محمية بصلاحية المشرف</span>
        </div>
      </div>

      {/* Upload Drawer / Panel */}
      {showUploadDrawer && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#720925]" />
              <span>رفع وسائط جديدة ومعالجتها محلياً</span>
            </h2>
            <button
              onClick={() => setShowUploadDrawer(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">قسم الوسائط المستهدف:</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:ring-1 focus:ring-[#720925] focus:outline-hidden bg-white text-xs font-bold"
                >
                  <option value="cover">غلاف الدعوة الرئيسية (invitations/cover)</option>
                  <option value="gallery">معرض صور العروسين (invitations/gallery)</option>
                  <option value="music">مقطع موسيقي MP3 (invitations/music)</option>
                  <option value="theme">أصول وزخارف الثيم (themes/assets)</option>
                  <option value="event">صور مناسبة خاصة (invitations/events)</option>
                  <option value="payment_proof">
                    إثبات تحويل إنستاباي 🛡️ (customers/payment-proofs - محمي)
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">وصف أو تعليق (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: غلاف دعوة كلاسيكي / مقطع موسيقي هادئ..."
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:ring-1 focus:ring-[#720925] focus:outline-hidden bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">اختيار الملف من جهازك:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/mp3,audio/wav"
                  onChange={handleFileSelect}
                  className="w-full p-1.5 rounded-xl border border-stone-300 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#720925] file:text-white hover:file:opacity-90 cursor-pointer"
                />
              </div>
            </div>

            {fileToUpload && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center font-bold text-stone-700">
                    {fileToUpload.type.startsWith('audio') ? (
                      <Music className="w-5 h-5 text-purple-700" />
                    ) : (
                      <FileImage className="w-5 h-5 text-sky-700" />
                    )}
                  </div>
                  <div>
                    <span className="font-black text-stone-900 block">{fileToUpload.name}</span>
                    <span className="text-stone-500 text-[11px] font-mono">
                      {formatBytes(fileToUpload.size)} • {fileToUpload.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFileToUpload(null)}
                    className="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري المعالجة بـ Sharp والحفظ...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>تأكيد الرفع والمعالجة 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث باسم الملف، العميل، الدعوة، أو القسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-stone-200 focus:border-[#720925] focus:ring-1 focus:ring-[#720925] focus:outline-hidden text-xs bg-stone-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 shrink-0">النوع:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-bold bg-white focus:outline-hidden focus:border-[#720925]"
            >
              <option value="all">الكل (صور وصوتيات)</option>
              <option value="image">صور فقط 🖼️</option>
              <option value="audio">مقاطع صوتية 🎵</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {Object.entries(CATEGORY_MAP).map(([key, item]) => {
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#720925] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Loading, Empty, Grid, or Table */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-video bg-stone-100 rounded-2xl w-full" />
              <div className="h-4 bg-stone-100 rounded-md w-3/4" />
              <div className="h-3 bg-stone-100 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Folder className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-800">لا توجد وسائط مطابقة للبحث</h3>
            <p className="text-xs text-stone-500 mt-1">
              جرب تغيير كلمات البحث أو اختيار قسم مختلف أو قم برفع وسائط جديدة
            </p>
          </div>
          {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mediaList.map((item) => {
            const isAudio = item.type === 'audio' || item.mimeType?.startsWith('audio');
            const isProtected = !item.isPublic || item.category === 'payment_proof';
            const catInfo = CATEGORY_MAP[item.category] || {
              label: item.category,
              color: 'text-stone-800',
              bg: 'bg-stone-100',
              border: 'border-stone-200',
            };
            const mediaUrl = getMediaUrl(item);

            return (
              <div
                key={item.id}
                onClick={() => setInspectItem(item)}
                className={`group bg-white rounded-3xl border overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative ${
                  isProtected
                    ? 'border-amber-300/80 hover:border-amber-400'
                    : 'border-stone-200 hover:border-[#720925]/30'
                }`}
              >
                {/* Media Preview Container */}
                <div className="relative aspect-video bg-stone-900/5 overflow-hidden flex items-center justify-center">
                  {isAudio ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-950 to-stone-950 p-4 flex flex-col items-center justify-center text-center text-white relative">
                      <div
                        className={`w-14 h-14 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-2 transition-transform duration-500 ${
                          playingAudioId === item.id ? 'scale-110 animate-pulse' : 'group-hover:scale-105'
                        }`}
                      >
                        <Music className="w-7 h-7 text-purple-300" />
                      </div>
                      <span className="text-[11px] font-bold text-purple-200 truncate max-w-[200px]">
                        {item.originalName || item.fileName}
                      </span>
                      <span className="text-[9px] text-purple-300/70 font-mono mt-0.5">MP3 Audio</span>

                      {/* Floating Play/Pause Button */}
                      <button
                        onClick={(e) => togglePlayAudio(item, e)}
                        className="absolute bottom-3 left-3 p-2 rounded-full bg-white text-stone-900 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        title={playingAudioId === item.id ? 'إيقاف مؤقت' : 'تشغيل المقطع'}
                      >
                        {playingAudioId === item.id ? (
                          <Pause className="w-4 h-4 text-purple-900 fill-purple-900" />
                        ) : (
                          <Play className="w-4 h-4 text-purple-900 fill-purple-900 translate-x-[1px]" />
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Image preview */
                    <div className="w-full h-full relative group">
                      <img
                        src={mediaUrl}
                        alt={item.caption || item.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback on broken image
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />

                      {/* Hover Overlay with Quick Actions */}
                      <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectItem(item);
                          }}
                          className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-900 shadow-md transition-transform hover:scale-110 cursor-pointer"
                          title="معاينة كاملة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleCopyLink(item, e)}
                          className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-900 shadow-md transition-transform hover:scale-110 cursor-pointer"
                          title="نسخ الرابط"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleDownload(item, e)}
                          className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-900 shadow-md transition-transform hover:scale-110 cursor-pointer"
                          title="تحميل الملف"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item);
                          }}
                          className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                          title="حذف الملف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${catInfo.bg} ${catInfo.color} ${catInfo.border}`}
                    >
                      {catInfo.label}
                    </span>
                  </div>

                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    {isProtected ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>محمي</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                        عام
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3
                      className="font-black text-stone-900 text-xs truncate"
                      title={item.originalName || item.fileName}
                    >
                      {item.originalName || item.fileName}
                    </h3>
                    {item.caption && (
                      <p className="text-[11px] text-stone-500 line-clamp-1">{item.caption}</p>
                    )}
                  </div>

                  {/* Linked Relations (Invitation or Customer) */}
                  <div className="space-y-1 pt-1 text-[11px]">
                    {item.invitation && (
                      <Link
                        href={`/admin/invitations/${item.invitation.id}/builder`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[#720925] hover:underline font-bold bg-[#720925]/5 px-2 py-0.5 rounded-md"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="truncate max-w-[170px]">
                          دعوة: {item.invitation.title || item.invitation.slug}
                        </span>
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                      </Link>
                    )}

                    {item.customer && (
                      <div className="flex items-center gap-1 text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <User className="w-3 h-3 text-amber-700" />
                        <span className="truncate">
                          عميل: {item.customer.name} ({item.customer.phone})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>{formatBytes(item.sizeBytes)}</span>
                    <span className="font-sans text-[11px]">
                      {formatArabicDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold">
                <tr>
                  <th className="p-3.5 pr-4">المعاينة</th>
                  <th className="p-3.5">اسم الملف</th>
                  <th className="p-3.5">القسم والتصنيف</th>
                  <th className="p-3.5">الجهة المرتبطة</th>
                  <th className="p-3.5">الحجم</th>
                  <th className="p-3.5">النوع والأمان</th>
                  <th className="p-3.5">تاريخ الرفع</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mediaList.map((item) => {
                  const isAudio = item.type === 'audio' || item.mimeType?.startsWith('audio');
                  const isProtected = !item.isPublic || item.category === 'payment_proof';
                  const catInfo = CATEGORY_MAP[item.category] || {
                    label: item.category,
                    color: 'text-stone-800',
                    bg: 'bg-stone-100',
                    border: 'border-stone-200',
                  };
                  const mediaUrl = getMediaUrl(item);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setInspectItem(item)}
                      className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <td className="p-3 pr-4">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                          {isAudio ? (
                            <button
                              onClick={(e) => togglePlayAudio(item, e)}
                              className="w-full h-full bg-purple-900 text-white flex items-center justify-center hover:bg-purple-800"
                              title="تشغيل المقطع"
                            >
                              {playingAudioId === item.id ? (
                                <Pause className="w-4 h-4 fill-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white translate-x-[1px]" />
                              )}
                            </button>
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={item.originalName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </td>

                      {/* File name & caption */}
                      <td className="p-3">
                        <div className="max-w-[220px]">
                          <span
                            className="font-black text-stone-900 block truncate"
                            title={item.originalName || item.fileName}
                          >
                            {item.originalName || item.fileName}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono block truncate">
                            {item.filePath}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${catInfo.bg} ${catInfo.color} ${catInfo.border}`}
                        >
                          {catInfo.label}
                        </span>
                      </td>

                      {/* Relations */}
                      <td className="p-3">
                        {item.invitation ? (
                          <Link
                            href={`/admin/invitations/${item.invitation.id}/builder`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[#720925] hover:underline font-bold text-[11px]"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span className="truncate max-w-[140px]">
                              {item.invitation.title || item.invitation.slug}
                            </span>
                          </Link>
                        ) : item.customer ? (
                          <div className="text-stone-700 text-[11px] font-bold">
                            <span>{item.customer.name}</span>
                            <span className="text-stone-400 block font-mono text-[10px]">
                              {item.customer.phone}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Size */}
                      <td className="p-3 font-mono text-[11px] text-stone-600">
                        {formatBytes(item.sizeBytes)}
                      </td>

                      {/* Security */}
                      <td className="p-3">
                        {isProtected ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-700" />
                            <span>محمي (إدارة)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            عام (Public)
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-3 text-[11px] text-stone-500 whitespace-nowrap">
                        {formatArabicDate(item.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setInspectItem(item)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="تفاصيل ومعاينة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleCopyLink(item, e)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="نسخ الرابط"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleDownload(item, e)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="تحميل"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECTION / LIGHTBOX MODAL */}
      {inspectItem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setInspectItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 text-right space-y-0 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl burgundy-gradient-bg text-white flex items-center justify-center">
                  {inspectItem.type === 'audio' ? (
                    <Music className="w-5 h-5" />
                  ) : (
                    <FileImage className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-sm sm:text-base">
                    فحص وتفاصيل الملف الكاملة
                  </h3>
                  <span className="text-[11px] text-stone-500 font-mono">
                    ID: {inspectItem.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setInspectItem(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Left preview, Right metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-stone-200 max-h-[75vh] overflow-y-auto">
              {/* Media Preview Box */}
              <div className="p-6 bg-stone-950 flex flex-col items-center justify-center min-h-[300px]">
                {inspectItem.type === 'audio' || inspectItem.mimeType?.startsWith('audio') ? (
                  <div className="w-full space-y-4 text-center text-white py-6">
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-400/40 mx-auto flex items-center justify-center">
                      <Music className="w-10 h-10 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-purple-100">
                        {inspectItem.originalName || inspectItem.fileName}
                      </h4>
                      <p className="text-xs text-purple-300/70 font-mono mt-1">
                        {inspectItem.mimeType} • {formatBytes(inspectItem.sizeBytes)}
                      </p>
                    </div>

                    <audio
                      src={getMediaUrl(inspectItem)}
                      controls
                      autoPlay
                      className="w-full rounded-xl mt-4"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={getMediaUrl(inspectItem)}
                      alt={inspectItem.originalName}
                      className="max-h-[55vh] max-w-full object-contain rounded-xl shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* File Information Sheet */}
              <div className="p-6 space-y-4 text-xs">
                <div className="space-y-3 pb-3 border-b border-stone-200">
                  <div>
                    <label className="text-stone-400 font-bold block text-[10px]">
                      اسم الملف الأصلي:
                    </label>
                    <span className="font-black text-stone-900 text-sm break-all">
                      {inspectItem.originalName || inspectItem.fileName}
                    </span>
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block text-[10px]">
                      المسار المحلي على خادم المشروع:
                    </label>
                    <span className="font-mono text-stone-700 bg-stone-100 p-2 rounded-lg block text-[11px] break-all dir-ltr text-right">
                      apps/api/storage/{inspectItem.filePath}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-400 font-bold block text-[10px]">
                        الحجم والنوع:
                      </label>
                      <span className="font-mono font-bold text-stone-800">
                        {formatBytes(inspectItem.sizeBytes)} ({inspectItem.mimeType})
                      </span>
                    </div>

                    <div>
                      <label className="text-stone-400 font-bold block text-[10px]">
                        مستوى الحماية:
                      </label>
                      {inspectItem.isPublic ? (
                        <span className="text-emerald-700 font-bold">عام (Public API)</span>
                      ) : (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>محمي (Admin Only)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block text-[10px]">
                      تاريخ وتوقيت الرفع:
                    </label>
                    <span className="text-stone-700 font-bold">
                      {formatArabicDate(inspectItem.createdAt)} •{' '}
                      {formatArabicTime(inspectItem.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Linked Invitation / Customer Card */}
                {(inspectItem.invitation || inspectItem.customer) && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-amber-200/80 space-y-2">
                    <span className="text-[10px] font-black text-amber-900 block">
                      الارتباط بالنظام:
                    </span>
                    {inspectItem.invitation && (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-stone-500 block text-[10px]">الدعوة المرتبطة:</span>
                          <span className="font-bold text-stone-900">
                            {inspectItem.invitation.title || inspectItem.invitation.slug}
                          </span>
                        </div>
                        <Link
                          href={`/admin/invitations/${inspectItem.invitation.id}/builder`}
                          className="px-3 py-1.5 rounded-lg burgundy-gradient-bg text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs hover:opacity-95"
                        >
                          <span>فتح المنشئ</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}

                    {inspectItem.customer && (
                      <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
                        <div>
                          <span className="text-stone-500 block text-[10px]">العميل:</span>
                          <span className="font-bold text-stone-900">
                            {inspectItem.customer.name} ({inspectItem.customer.phone})
                          </span>
                        </div>
                        <a
                          href={`https://wa.me/${inspectItem.customer.phone.replace(/\+/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-emerald-700"
                        >
                          <Phone className="w-3 h-3" />
                          <span>واتساب</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Inside Modal */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(inspectItem)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {copiedId === inspectItem.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-stone-600" />
                          <span>نسخ الرابط المباشر</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(inspectItem)}
                      className="py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      title="تحميل الملف"
                    >
                      <Download className="w-4 h-4 text-stone-600" />
                      <span>تحميل</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setItemToDelete(inspectItem);
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-700" />
                    <span>حذف هذا الملف نهائياً من التخزين وقاعدة البيانات</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-right space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-stone-900 text-base">تأكيد حذف الملف نهائياً</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                هل أنت متأكد من حذف الملف{' '}
                <strong className="text-stone-900">
                  &ldquo;{itemToDelete.originalName || itemToDelete.fileName}&rdquo;
                </strong>
                ؟ سيتم حذفه فورياً من القرص المحلي وقاعدة البيانات ولا يمكن استرجاعه.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                إلغاء التراجع
              </button>

              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deletingId ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>نعم، احذف نهائياً</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directory Storage Architectural Info */}
      <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-stone-200 space-y-2 text-xs">
        <h3 className="font-black text-stone-900 flex items-center gap-1.5">
          <Folder className="w-4 h-4 text-amber-700" />
          <span>هيكلية التخزين المحلي الآمن والمباشر داخل الخادم (/apps/api/storage/):</span>
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
              * محجوبة عن المسار العام ومحمية بصلاحية المشرف مع الرمز المميز
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
