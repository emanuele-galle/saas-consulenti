import type { PrismaClient } from "@prisma/client";

/**
 * Track a page view: increments LandingPage.views (backward compat)
 * and upserts a PageView record for today's date.
 */
export function trackView(db: PrismaClient, landingPageId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  Promise.all([
    db.landingPage.update({
      where: { id: landingPageId },
      data: {
        views: { increment: 1 },
        lastViewedAt: new Date(),
      },
    }),
    db.pageView.upsert({
      where: {
        landingPageId_date: { landingPageId, date: today },
      },
      update: {
        views: { increment: 1 },
      },
      create: {
        landingPageId,
        date: today,
        views: 1,
      },
    }),
  ]).catch(() => {
    // Silently ignore view tracking errors
  });
}
