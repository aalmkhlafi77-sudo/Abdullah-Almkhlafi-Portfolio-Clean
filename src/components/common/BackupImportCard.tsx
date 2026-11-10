import React, { useRef, useState } from 'react';

import { DEFAULT_MAX_SNAPSHOT_BYTES } from '../../../server/content/schema.js';
import { parseBackupForImport, type BackupPreview } from '../../lib/backupImport.js';
import type { ThemeMode } from '../../types.js';

interface Props {
  theme: ThemeMode;
  onImport(jsonText: string): Promise<boolean>;
}

export const BackupImportCard: React.FC<Props> = ({ theme, onImport }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pasteText, setPasteText] = useState('');
  const [fileText, setFileText] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const sourceText = fileText ?? pasteText;

  const chooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreview(null);
    setConfirmed(false);
    setError('');
    setFileText(null);
    setFileName('');
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > DEFAULT_MAX_SNAPSHOT_BYTES) {
      setError('حجم ملف JSON يتجاوز الحد المسموح (25 MB)');
      return;
    }
    try {
      setFileText(await file.text());
      setFileName(file.name);
      setPasteText('');
    } catch {
      setError('تعذرت قراءة ملف JSON من جهازك');
    }
  };

  const showPreview = () => {
    try {
      if (!sourceText.trim()) throw new Error('اختر ملف JSON أو ألصق النص أولًا');
      const result = parseBackupForImport(sourceText);
      setPreview(result.preview);
      setConfirmed(false);
      setError('');
    } catch (cause) {
      setPreview(null);
      setConfirmed(false);
      setError(cause instanceof Error ? cause.message : 'تعذرت معاينة النسخة');
    }
  };

  const importConfirmed = async () => {
    if (!preview || !confirmed || pending) return;
    setPending(true);
    setError('');
    try {
      if (await onImport(sourceText)) {
        setPasteText('');
        setFileText(null);
        setFileName('');
        setPreview(null);
        setConfirmed(false);
        if (inputRef.current) inputRef.current.value = '';
      } else {
        setError('لم يكتمل الاستيراد؛ راجع رسالة الخادم. بقيت المسودة السابقة دون استبدال.');
      }
    } finally {
      setPending(false);
    }
  };

  return <div className={`p-5 rounded-2xl border space-y-3 ${theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'}`}>
    <div className="font-bold text-sm text-[#C5A059]">استيراد واستعادة نسخة احتياطية</div>
    <p className="text-xs text-[#8E877D] leading-relaxed">اختر ملف JSON من جهازك أو ألصق محتواه. ستظهر معاينة قبل استبدال مسودة الخادم؛ لن يُنشر المحتوى تلقائيًا.</p>
    <input ref={inputRef} type="file" accept=".json,application/json" className="sr-only" onChange={(event) => { void chooseFile(event); }} aria-label="ملف النسخة الاحتياطية JSON" />
    <button type="button" onClick={() => inputRef.current?.click()} className="w-full py-2.5 rounded-xl border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold">اختيار ملف JSON</button>
    {fileName && <p className="text-xs break-all">الملف المختار: {fileName}</p>}
    <textarea
      rows={2}
      value={pasteText}
      onChange={(event) => {
        setPasteText(event.target.value);
        setFileText(null);
        setFileName('');
        setPreview(null);
        setConfirmed(false);
        setError('');
      }}
      placeholder="أو ألصق نص JSON هنا..."
      className={`w-full p-2.5 rounded-xl text-xs border outline-none font-mono ${theme === 'dark' ? 'bg-[#121110] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'}`}
    />
    <button id="backup-preview-button" type="button" onClick={showPreview} className="w-full py-2.5 rounded-xl border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold">معاينة النسخة</button>
    {preview && <div role="status" className="rounded-xl border border-[#C5A059]/40 p-3 text-xs leading-relaxed">
      <p>{preview.format === 'legacy' ? 'صيغة قديمة قابلة للتحويل' : 'صيغة النسخة الحالية'}</p>
      <p>{preview.pages} صفحات، {preview.elements} عنصرًا، {preview.projects} مشروعًا</p>
      <p>{preview.services} خدمات، {preview.solutions} حلول، {preview.articles} مقالات</p>
      <p>{preview.images} صور في المكتبة، {preview.embeddedImages} صور مضمّنة فريدة ستُنقل إلى التخزين الدائم</p>
      {preview.defaultedFields.length > 0 && <p>حقول غير موجودة في النسخة القديمة ستُستكمل من إعدادات المشروع: {preview.defaultedFields.join('، ')}</p>}
    </div>}
    {preview && <label className="flex gap-2 items-start text-xs cursor-pointer">
      <input id="backup-confirm-replace" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
      أؤكد استبدال المسودة الحالية بهذه النسخة. سيبقى المنشور كما هو حتى أضغط «نشر».
    </label>}
    {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
    <button id="backup-import-button" type="button" disabled={!preview || !confirmed || pending} onClick={() => { void importConfirmed(); }} className="w-full py-2.5 rounded-xl bg-[#C5A059] text-[#121212] text-xs font-bold disabled:opacity-50">
      {pending ? 'جارٍ نقل الصور وحفظ المسودة...' : 'استيراد إلى مسودة الخادم'}
    </button>
  </div>;
};
