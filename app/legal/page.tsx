import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Note Legali - SaaS Consulenti",
  description: "Note legali e termini di utilizzo del sito.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            &larr; Torna alla home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-6">Note Legali</h1>
          <p className="text-white/70 mt-2">Ultimo aggiornamento: Febbraio 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 prose prose-gray max-w-none">

          <h2>1. Informazioni Generali</h2>
          <p>
            Questo sito web è una piattaforma SaaS che consente ai consulenti MediaCom
            di creare e gestire la propria landing page professionale. La piattaforma è gestita
            in collaborazione tra MediaCom srls e i singoli consulenti.
          </p>

          <h2>2. Utilizzo del Sito</h2>
          <p>L&apos;utente si impegna a:</p>
          <ul>
            <li>Utilizzare il sito in modo lecito e conforme ai presenti termini</li>
            <li>Non diffondere contenuti illegali, offensivi o diffamatori</li>
            <li>Non tentare di accedere ad aree riservate senza autorizzazione</li>
            <li>Fornire dati veritieri nei moduli di contatto</li>
          </ul>

          <h2>3. Proprietà Intellettuale</h2>
          <p>
            I marchi, loghi e contenuti relativi a MediaCom sono di proprietà di
            MediaCom srls I contenuti delle singole landing page sono di proprietà
            dei rispettivi consulenti. La piattaforma tecnologica è di proprietà di Fodi S.r.l.
            È vietata la riproduzione senza autorizzazione scritta.
          </p>

          <h2>4. Disclaimer</h2>
          <p>
            Le informazioni presenti sulle landing page dei consulenti hanno carattere
            informativo e non costituiscono offerta al pubblico o consulenza finanziaria.
            Per qualsiasi decisione relativa a prodotti assicurativi o finanziari,
            si prega di contattare direttamente il consulente.
          </p>

          <h2>5. Limitazione di Responsabilità</h2>
          <p>
            La piattaforma è fornita &quot;così com&apos;è&quot;. Non garantiamo disponibilità
            continua del servizio. Non siamo responsabili per i contenuti pubblicati
            dai singoli consulenti sulle loro landing page.
          </p>

          <h2>6. Modifiche ai Termini</h2>
          <p>
            Ci riserviamo il diritto di modificare le presenti Note Legali in qualsiasi momento.
            Le modifiche saranno pubblicate su questa pagina.
          </p>

          <h2>7. Legge Applicabile</h2>
          <p>
            Le presenti Note Legali sono regolate dalla legge italiana.
            Per qualsiasi controversia è competente il Foro di Catanzaro.
          </p>

          <hr />
          <h2>Sviluppo e Gestione Tecnica del Sito</h2>
          <p>Questo sito web è stato realizzato e viene gestito da:</p>
          <p>
            <strong>FODI S.r.l. – Startup Innovativa</strong><br />
            Via Santicelli 18/A, 88068 Soverato (CZ)<br />
            P.IVA: 03856160793<br />
            Email: <a href="mailto:info@fodisrl.it">info@fodisrl.it</a><br />
            Tel: +39 0963 576433<br />
            Web: <a href="https://www.fodisrl.it" target="_blank" rel="noopener noreferrer">www.fodisrl.it</a>
          </p>
        </div>
      </div>
    </div>
  );
}
