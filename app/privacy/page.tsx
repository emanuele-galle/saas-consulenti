import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - SaaS Consulenti",
  description: "Informativa sulla privacy e trattamento dei dati personali.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            &larr; Torna alla home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-6">Privacy Policy</h1>
          <p className="text-white/70 mt-2">Ultimo aggiornamento: Febbraio 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 prose prose-gray max-w-none">

          <h2>1. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati personali è <strong>MediaCom srls</strong>,
            con sede legale in Mogliano Veneto (TV), Via Marocchesa 14.
          </p>
          <p>
            Ciascun consulente è responsabile del trattamento dei dati raccolti tramite
            la propria landing page personale, in qualità di sub-responsabile.
          </p>

          <h2>2. Dati Raccolti</h2>
          <ul>
            <li><strong>Dati di contatto:</strong> nome, cognome, email, telefono (tramite form contatto)</li>
            <li><strong>Dati di navigazione:</strong> indirizzo IP, browser, pagine visitate, tempi di permanenza</li>
            <li><strong>Dati analitici:</strong> interazioni con la pagina (anonimi e aggregati)</li>
          </ul>

          <h2>3. Finalità del Trattamento</h2>
          <ul>
            <li>Gestione delle richieste di contatto</li>
            <li>Fornitura di informazioni sui servizi assicurativi e finanziari</li>
            <li>Analisi statistiche anonime per il miglioramento del servizio</li>
            <li>Adempimento degli obblighi di legge</li>
          </ul>

          <h2>4. Base Giuridica</h2>
          <p>
            Il trattamento si basa su: consenso dell&apos;interessato (GDPR Art. 6.1.a),
            esecuzione di misure precontrattuali (GDPR Art. 6.1.b),
            legittimo interesse del Titolare (GDPR Art. 6.1.f).
          </p>

          <h2>5. Diritti dell&apos;Interessato</h2>
          <p>Ai sensi degli artt. 15-22 del GDPR, hai diritto di:</p>
          <ul>
            <li>Accedere ai tuoi dati personali</li>
            <li>Richiedere la rettifica o la cancellazione</li>
            <li>Limitare o opporti al trattamento</li>
            <li>Richiedere la portabilità dei dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
            <li>Proporre reclamo al <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">Garante Privacy</a></li>
          </ul>

          <h2>6. Conservazione Dati</h2>
          <p>
            I dati di contatto vengono conservati per il tempo necessario alla finalità del trattamento
            e comunque non oltre 24 mesi dall&apos;ultimo contatto. I dati di navigazione vengono
            conservati in forma anonima per fini statistici.
          </p>

          <h2>7. Modifiche</h2>
          <p>
            Ci riserviamo il diritto di modificare questa policy. Le modifiche saranno
            pubblicate su questa pagina.
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
