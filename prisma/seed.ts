import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@saas-generali.it" },
    update: {},
    create: {
      email: "admin@saas-generali.it",
      password: adminPassword,
      name: "Admin Generali",
      role: "ADMIN",
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // Create demo consultant user
  const consultantPassword = await bcrypt.hash("consulente2026!", 12);
  const consultantUser = await prisma.user.upsert({
    where: { email: "giuseppe.guglielmo@generali.it" },
    update: {},
    create: {
      email: "giuseppe.guglielmo@generali.it",
      password: consultantPassword,
      name: "Giuseppe Guglielmo",
      role: "CONSULTANT",
    },
  });

  // Create consultant profile
  const consultant = await prisma.consultant.upsert({
    where: { userId: consultantUser.id },
    update: {},
    create: {
      userId: consultantUser.id,
      firstName: "Giuseppe",
      lastName: "Guglielmo",
      title: "Dott.",
      role: "Executive Manager",
      network: "Rete Private e Wealth",
      bio: "Trasparenza, serietà e professionalità: sono queste le qualità che un Executive Manager mette ogni giorno al servizio dei propri clienti. L'obiettivo è offrire soluzioni personalizzate di wealth management, con un approccio orientato all'innovazione e alla sostenibilità.",
      email: "giuseppe.guglielmo@generali.it",
      phone: "02/72436111",
      mobile: "3482290990",
      address: "Corso Italia 6",
      cap: "20122",
      city: "Milano",
      province: "MI",
      efpa: true,
      efpaEsg: true,
      sustainableAdvisor: true,
      linkedinUrl: "https://www.linkedin.com/in/giuseppe-guglielmo-4255b02a/",
    },
  });
  console.log(`Consultant created: ${consultant.firstName} ${consultant.lastName}`);

  // Create landing page for demo consultant
  const landingPage = await prisma.landingPage.upsert({
    where: { consultantId: consultant.id },
    update: {},
    create: {
      consultantId: consultant.id,
      slug: "giuseppe-guglielmo",
      status: "PUBLISHED",
      coverData: {
        headline: "Il tuo futuro finanziario, la nostra missione",
        subheadline: "Executive Manager - Banca Generali Private",
        ctaText: "Chiedi un appuntamento",
      },
      summaryData: {
        text: "Trasparenza, serietà e professionalità: sono queste le qualità che un Executive Manager di Banca Generali Private mette ogni giorno al servizio dei propri clienti. Con oltre 15 anni di esperienza nel wealth management, mi dedico a costruire soluzioni personalizzate per proteggere e far crescere il patrimonio dei miei clienti.",
        highlights: [
          "Oltre 15 anni di esperienza",
          "Gestione patrimoniale personalizzata",
          "Approccio orientato alla sostenibilità",
        ],
      },
      mapData: {
        lat: 45.459963,
        lng: 9.188121,
        address: "Corso Italia 6, 20122 Milano (MI)",
        zoomLevel: 15,
      },
      skillsData: {
        skills: [
          { name: "Consulenza patrimoniale", description: "Ottimizzazione dell'allocazione patrimoniale" },
          { name: "Pianificazione a lungo termine", description: "Gestione attiva di portafogli diversificati" },
          { name: "Protezione del patrimonio", description: "Pianificazione patrimoniale integrata" },
          { name: "Consulenza per imprenditori", description: "Analisi dei mercati finanziari globali" },
          { name: "Monitoraggio e revisione", description: "Investimenti sostenibili e responsabili" },
        ],
      },
      experiencesData: {
        experiences: [
          {
            company: "Banca Generali Private",
            role: "Executive Manager",
            period: "2018 - Presente",
            description: "Gestione di un portafoglio clienti HNWI con focus su soluzioni di investimento personalizzate.",
          },
          {
            company: "Banca Generali",
            role: "Senior Financial Advisor",
            period: "2012 - 2018",
            description: "Consulenza finanziaria per clienti private con patrimoni significativi.",
          },
          {
            company: "Universita di Messina",
            role: "Laurea in Scienze Bancarie e Assicurative",
            period: "",
            description: "",
          },
        ],
      },
      educationData: {
        items: [],
      },
      interestsData: {
        interests: [
          { name: "Finanza Sostenibile", icon: "leaf" },
          { name: "Tecnologia", icon: "cpu" },
          { name: "Vela", icon: "sailboat" },
          { name: "Arte Contemporanea", icon: "palette" },
        ],
      },
      bannerData: {
        imageUrl: "",
        linkUrl: "https://www.bancagenerali.it",
        altText: "Banca Generali Private - La tua banca privata",
      },
      focusOnData: {
        articles: [
          {
            title: "Mercati 2026: le prospettive per gli investitori",
            excerpt: "Un'analisi delle tendenze macroeconomiche e le opportunità di investimento per il nuovo anno.",
            imageUrl: "",
            url: "#",
          },
          {
            title: "ESG e investimenti sostenibili",
            excerpt: "Come integrare i criteri ambientali, sociali e di governance nelle scelte di portafoglio.",
            imageUrl: "",
            url: "#",
          },
          {
            title: "Pianificazione patrimoniale e passaggio generazionale",
            excerpt: "Strategie per proteggere e trasferire il patrimonio alle nuove generazioni.",
            imageUrl: "",
            url: "#",
          },
        ],
      },
      metaTitle: "Giuseppe Guglielmo - Executive Manager | Generali",
      metaDescription: "Giuseppe Guglielmo, Executive Manager presso Banca Generali Private a Milano. Consulenza finanziaria personalizzata, wealth management e investimenti sostenibili.",
    },
  });
  console.log(`Landing page created: ${landingPage.slug}`);

  console.log("Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
