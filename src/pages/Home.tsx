import { Link } from 'react-router';
import { ShieldPlus, TestTubes, Syringe, ArrowRight } from 'lucide-react';
import { forms } from '../data/forms';

const iconMap: Record<string, React.ReactNode> = {
  ShieldPlus: <ShieldPlus size={48} strokeWidth={1.5} />,
  TestTubes: <TestTubes size={48} strokeWidth={1.5} />,
  Syringe: <Syringe size={48} strokeWidth={1.5} />,
};

const descriptions: Record<string, string> = {
  'hpv-serviks': 'Rahim agzi (serviks) kanseri taramasi bilgilendirilmis onam formu. HPV ve smear testi hakkinda bilgilendirme ve hasta onayi.',
  'kalin-bagirsak': 'Ulusal Kolorektal Kanser Tarama Programi kapsaminda gaitada gizli kan testi bilgilendirilmis onam formu.',
  'enjeksiyon': 'Kas ici enjeksiyon islemi bilgilendirilmis hasta ve riza formu. Islem tanimi, riskler ve hasta onayi.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFA]">
      {/* Header */}
      <header className="pt-12 pb-8 px-6">
        <div className="max-w-[960px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-700 mb-6">
            <ShieldPlus size={32} className="text-white" />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 mb-2">
            Aile Hekimligi Onam Formlari
          </h1>
          <p className="text-slate-500 text-base mb-4">
            T.C. Saglik Bakanligi — Dijital Onam Formu Sistemi
          </p>
          <div className="w-[120px] h-[2px] bg-teal-700 mx-auto" />
        </div>
      </header>

      {/* Cards Grid */}
      <main className="px-6 pb-12">
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map((form) => (
              <div
                key={form.id}
                className="group bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(15,118,110,0.12)] hover:border-teal-700 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-center mb-5 text-teal-700 group-hover:scale-110 transition-transform duration-300">
                  {iconMap[form.icon]}
                </div>
                <h2 className="text-[22px] font-semibold text-center text-teal-800 mb-3 tracking-tight leading-tight">
                  {form.title
                    .replace('BILGILENDIRILMIS ONAM FORMU', '')
                    .replace('RAHIM AGZI (SERVIKS) ', 'Serviks ')
                    .replace('KALIN BAGIRSAK KANSER TARAMASI ', 'Kalin Bagirsak ')
                    .replace('KAS ICI (I.M.) ENJEKSIYON BILGILENDIRILMIS HASTA VE RIZA FORMU', 'Kas Ici Enjeksiyon')
                    .trim()}
                </h2>
                <p className="text-sm text-slate-500 text-center leading-relaxed mb-6 flex-grow">
                  {descriptions[form.id]}
                </p>
                <Link
                  to={`/form/${form.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-[10px] transition-colors duration-200"
                >
                  <span>Formu Ac</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 pt-4 px-6">
        <p className="text-center text-xs text-slate-400">
          T.C. Saglik Bakanligi | Aile Hekimligi Birimi
        </p>
      </footer>
    </div>
  );
}
