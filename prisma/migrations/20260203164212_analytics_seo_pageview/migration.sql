-- AlterTable
ALTER TABLE "contact_submissions" ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "landing_pages" ADD COLUMN     "ga4_measurement_id" TEXT,
ADD COLUMN     "gsc_verification_tag" TEXT,
ADD COLUMN     "pagespeed_checked_at" TIMESTAMP(3),
ADD COLUMN     "pagespeed_desktop" INTEGER,
ADD COLUMN     "pagespeed_mobile" INTEGER;

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "landing_page_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_landing_page_id_idx" ON "page_views"("landing_page_id");

-- CreateIndex
CREATE INDEX "page_views_date_idx" ON "page_views"("date");

-- CreateIndex
CREATE UNIQUE INDEX "page_views_landing_page_id_date_key" ON "page_views"("landing_page_id", "date");

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "landing_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
