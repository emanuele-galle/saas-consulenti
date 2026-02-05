import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Backfilling PageView records from existing view counts...");

  const landingPages = await prisma.landingPage.findMany({
    where: { views: { gt: 0 } },
    select: { id: true, views: true, slug: true },
  });

  console.log(`Found ${landingPages.length} landing pages with views > 0`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let created = 0;
  let skipped = 0;

  for (const page of landingPages) {
    const existing = await prisma.pageView.findUnique({
      where: {
        landingPageId_date: { landingPageId: page.id, date: today },
      },
    });

    if (existing) {
      console.log(`  Skipping ${page.slug} (already has PageView for today)`);
      skipped++;
      continue;
    }

    await prisma.pageView.create({
      data: {
        landingPageId: page.id,
        date: today,
        views: page.views,
      },
    });

    console.log(`  Created PageView for ${page.slug}: ${page.views} views`);
    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
