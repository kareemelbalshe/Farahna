export interface QuranicVersePreset {
  id: string;
  title: string;
  verse: string;
  surahInfo?: string;
  previewText: string;
}

export const QURANIC_VERSES_PRESETS: QuranicVersePreset[] = [
  {
    id: 'mawaddah',
    title: 'آية المودة والسكينة (سورة الروم)',
    surahInfo: 'سورة الروم - آية ٢١',
    verse: 'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\n«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ»',
    previewText: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا...',
  },
  {
    id: 'barakah',
    title: 'دعاء البركة النبوي الشريف',
    surahInfo: 'دعاء نبوي مأثور',
    verse: 'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\n«بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»\nيسعدنا ويشرفنا دعوتكم لمشاركتنا فرحتنا وتتويج قصة حبنا في ليلة العمر ❤️',
    previewText: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ...',
  },
  {
    id: 'qurrat-ayn',
    title: 'دعاء قرة الأعين والصالحين (سورة الفرقان)',
    surahInfo: 'سورة الفرقان - آية ٧٤',
    verse: 'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\n«رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا»\nفرحتنا تكتمل بوجودكم إلى جانبنا لتشاركونا أجمل لحظات العمر',
    previewText: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ...',
  },
  {
    id: 'azwajan',
    title: 'آية الزوجية المباركة (سورة النبأ)',
    surahInfo: 'سورة النبأ - آية ٨',
    verse: 'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\n«وَخَلَقْنَاكُمْ أَزْوَاجًا»\nتتشرف عائلاتنا بدعوتكم لحضور حفل زفافنا الميمون ومشاركتنا بهجة هذه الليلة المباركة 💍',
    previewText: 'وَخَلَقْنَاكُمْ أَزْوَاجًا...',
  },
  {
    id: 'egyptian-family',
    title: 'كلمات مصرية دافئة وعائلية',
    surahInfo: 'رسالة محبة وترحيب',
    verse: 'الليلة ليلتنا وفرحتنا متكملش إلا بحبايبنا ❤️\nيسعدنا ويشرفنا حضوركم لمشاركتنا أجمل ليالي العمر وتنوير فرحنا بزغاريدكم ودعواتكم الطيبة!',
    previewText: 'الليلة ليلتنا وفرحتنا متكملش إلا بحبايبنا...',
  },
  {
    id: 'custom',
    title: '✍️ كتابة آية أو نص خاص من اختياركم',
    surahInfo: 'نص مخصص',
    verse: '',
    previewText: 'اكتب رسالتك أو الآية الخاصة بك...',
  },
];

export interface WeddingMusicPreset {
  id: string;
  title: string;
  artist: string;
  category: 'romantic' | 'zaffa' | 'classic' | 'islamic' | 'none' | 'custom';
  url: string;
  durationHint?: string;
}

export const WEDDING_MUSIC_PRESETS: WeddingMusicPreset[] = [
  {
    id: 'piano-romance',
    title: 'موسيقى بيانو ليلة العمر الهادئة',
    artist: 'أوركسترا كلاسيك',
    category: 'romantic',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113264.mp3',
    durationHint: 'هادئة ورومانسية',
  },
  {
    id: 'royal-violin',
    title: 'عزف كمان ملكي ساحر (Royal Violin)',
    artist: 'كمان رومانسي',
    category: 'romantic',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b671a5ea.mp3?filename=wedding-violin-romance.mp3',
    durationHint: 'فخامة ملكية',
  },
  {
    id: 'egyptian-celebration',
    title: 'زفة مصرية كلاسيكية مبهجة',
    artist: 'تراث مصري أصيل',
    category: 'zaffa',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=arabic-oriental-celebration.mp3',
    durationHint: 'إيقاع شرقي احتفالي',
  },
  {
    id: 'islamic-duff',
    title: 'دف إسلامي هادئ ومبارك (بدون معازف)',
    artist: 'أناشيد إسلامية',
    category: 'islamic',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=islamic-peaceful-duff.mp3',
    durationHint: 'إيقاع دف وقور ومبارك',
  },
  {
    id: 'custom-link',
    title: '🔗 رابط أغنية أو مقطع صوتي مخصص',
    artist: 'من اختياركم',
    category: 'custom',
    url: '',
    durationHint: 'ضع رابطك الخاص (MP3)',
  },
  {
    id: 'silent',
    title: '🔇 بدون موسيقى (صامت)',
    artist: 'بدون صوت',
    category: 'none',
    url: '',
    durationHint: 'عرض الدعوة بهدوء بدون موسيقى',
  },
];
