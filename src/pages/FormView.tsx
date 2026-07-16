import { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Download, RotateCcw, Loader2, AlertTriangle } from 'lucide-react';
import { getFormById } from '../data/forms';
import type { FormDefinition, FormField } from '../data/forms';
import SignatureCanvas from '../components/SignatureCanvas';
import { buildFormPDFBlob } from '../utils/pdfExport';
import { uploadToDrive } from '../utils/googleDrive';

export default function FormView() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  const form: FormDefinition | undefined = useMemo(
    () => (formId ? getFormById(formId) : undefined),
    [formId]
  );

  // Today's date in YYYY-MM-DD (timezone-safe)
  const todayStr = useMemo(() => new Date().toLocaleDateString('sv'), []);

  // Start fresh every time — date fields get today's date
  const initialValues = useMemo(() => {
    const vals: Record<string, string> = {};
    for (const field of form?.fields ?? []) {
      if (field.type === 'date') vals[field.id] = todayStr;
    }
    return vals;
  }, [form, todayStr]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [exporting, setExporting] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleReset = () => {
    if (window.confirm('Formdaki tum veriler silinecek. Emin misiniz?')) {
      setValues(initialValues);
    }
  };

  const getPatientInfo = () => ({
    tc: values['tc_kimlik_no'] ?? '',
    adSoyad: values['ad_soyad_onay'] ?? values['hasta_ad_soyad'] ?? '',
  });

  const handleExport = async () => {
    if (!formRef.current || !form) return;
    setExporting(true);
    setDriveError(null);
    const { tc, adSoyad } = getPatientInfo();
    try {
      const { blob, filename } = await buildFormPDFBlob(formRef.current, form.id, tc, adSoyad);
      await uploadToDrive(blob, filename);
      navigate(-1);
    } catch (err) {
      console.error('Drive upload failed:', err);
      setDriveError(err instanceof Error ? err.message : 'Drive yükleme başarısız');
    } finally {
      setExporting(false);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Form bulunamadi.</p>
          <button
            onClick={() => {
              try {
                navigate('/');
              } catch {
                window.location.href = '/';
              }
            }}
            className="text-teal-700 hover:text-teal-800 font-medium"
          >
            Ana sayfaya don
          </button>
        </div>
      </div>
    );
  }

  // Group fields by section
  const groupedFields = useMemo(() => {
    const groups: Record<string, FormField[]> = {};
    for (const field of form.fields) {
      const section = field.section || 'GENEL';
      if (!groups[section]) groups[section] = [];
      groups[section].push(field);
    }
    return groups;
  }, [form.fields]);

  const headerTitle = form.title
    .replace('BILGILENDIRILMIS ONAM FORMU', '')
    .replace('BILGILENDIRILMIS HASTA VE RIZA FORMU', '')
    .trim();

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 h-14 bg-teal-700 shadow-md flex items-center justify-between px-4 lg:px-6">
        <button
          onClick={() => {
            try {
              navigate(-1);
            } catch {
              window.history.back();
            }
          }}
          className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Geri</span>
        </button>
        <h2 className="text-white text-[15px] font-semibold truncate max-w-[50%]">
          {headerTitle}
        </h2>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 bg-white text-teal-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-60"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          PDF
        </button>
      </nav>

      {/* Form Content */}
      <div className="px-4 lg:px-6 pt-6">
        <div
          ref={formRef}
          className="max-w-[800px] mx-auto bg-white rounded-xl shadow-sm p-6 lg:p-10"
        >
          {/* Form Header */}
          <div className="text-center mb-8 pb-6 border-b border-slate-200">
            <p className="text-sm font-bold text-slate-900 tracking-wide uppercase">
              {form.institution}
            </p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">
              {form.unit}
            </p>
            <h1 className="text-xl lg:text-2xl font-bold text-teal-800 mt-4 leading-snug">
              {form.title}
            </h1>
          </div>

          {/* Description */}
          {form.description.map((paragraph, i) => (
            <p key={`desc-${i}`} className="text-sm text-slate-600 leading-relaxed mb-4 text-justify">
              {paragraph}
            </p>
          ))}

          {/* Sections */}
          {form.sections.map((section, si) => (
            <div key={`section-${si}`} className="mb-6">
              {section.title && (
                <div className={`mb-3 ${section.isWarning ? 'bg-amber-50 border border-amber-200 rounded-lg p-3' : ''}`}>
                  <h3
                    className={`text-sm font-semibold uppercase tracking-wide flex items-center gap-2 ${
                      section.isWarning
                        ? 'text-amber-800'
                        : 'text-teal-800 border-l-[3px] border-teal-700 pl-3'
                    }`}
                  >
                    {section.isWarning && <AlertTriangle size={16} />}
                    {section.title}
                  </h3>
                </div>
              )}
              {section.content?.map((paragraph, pi) => (
                <p
                  key={`sec-${si}-p-${pi}`}
                  className={`text-sm leading-relaxed mb-3 ${
                    section.isNote ? 'text-slate-500 italic' : 'text-slate-700 text-justify'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {/* Input Fields by Section */}
          <div className="mt-8 space-y-8">
            {Object.entries(groupedFields).map(([sectionName, fields]) => (
              <div key={sectionName} className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-semibold text-teal-800 uppercase tracking-wide border-l-[3px] border-teal-700 pl-3 mb-5">
                  {sectionName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => {
                    const isWide =
                      field.type === 'textarea' ||
                      field.type === 'signature' ||
                      field.type === 'handwriting';

                    return (
                      <div key={field.id} className={isWide ? 'md:col-span-2' : ''}>
                        {/* Text input */}
                        {field.type === 'text' && (
                          <div>
                            <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              value={values[field.id] ?? ''}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full h-11 px-3 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 transition-all"
                              style={{ color: '#1a3a6b' }}
                            />
                          </div>
                        )}

                        {/* Date input */}
                        {field.type === 'date' && (
                          <div>
                            <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                              {field.label}
                            </label>
                            <input
                              type="date"
                              value={values[field.id] ?? todayStr}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                              className="w-full h-11 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 transition-all"
                              style={{ color: '#1a3a6b' }}
                            />
                          </div>
                        )}

                        {/* Radio input */}
                        {field.type === 'radio' && (
                          <div>
                            <label className="block text-[13px] font-medium text-slate-900 mb-2">
                              {field.label}
                            </label>
                            <div className="flex gap-4">
                              {field.options?.map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={values[field.id] === option}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className="w-4 h-4 accent-teal-700 cursor-pointer"
                                  />
                                  <span className="text-sm text-slate-700">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Textarea - plain text multi-line (NOT handwriting) */}
                        {field.type === 'textarea' && (
                          <div>
                            <label className="block text-[13px] font-medium text-slate-900 mb-1.5">
                              {field.label}
                            </label>
                            <textarea
                              value={values[field.id] ?? ''}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              rows={field.rows || 3}
                              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 transition-all resize-none"
                              style={{ color: '#1a3a6b' }}
                            />
                          </div>
                        )}

                        {/* Signature canvas */}
                        {field.type === 'signature' && (
                          <SignatureCanvas
                            fieldId={field.id}
                            label={field.label}
                            value={values[field.id]}
                            onChange={handleChange}
                            height={160}
                          />
                        )}

                        {/* Handwriting canvas - for el yazisi areas */}
                        {field.type === 'handwriting' && (
                          <SignatureCanvas
                            fieldId={field.id}
                            label={field.label}
                            value={values[field.id]}
                            onChange={handleChange}
                            height={220}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Notes for Enjeksiyon form */}
          {form.id === 'enjeksiyon' && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-teal-800 uppercase tracking-wide border-l-[3px] border-teal-700 pl-3 mb-3">
                Notlar
              </h3>
              <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside">
                <li>Hasta 18 yasindan kucuk ise bilinci kapaliysa yada imza yetkisi yoksa onay vekili tarafindan verilir.</li>
                <li>Istenmesi durumunda bu formun bir nushasi hasta/yakini/varisi tarafindan imza karsiligi verilmelidir.</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Drive error feedback */}
      {driveError && (
        <div className="fixed bottom-[68px] left-0 right-0 flex justify-center px-4 z-40 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium bg-red-50 border border-red-200 text-red-700">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{driveError}</span>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 lg:px-6 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-[800px] mx-auto flex items-center justify-between gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors shrink-0"
          >
            <RotateCcw size={16} />
            Sifirla
          </button>

          <div />

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Drive'a Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
