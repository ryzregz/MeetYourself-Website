-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroBadge" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroSubtext" TEXT NOT NULL,
    "heroStats" JSONB NOT NULL,
    "aboutAuthorBio" JSONB NOT NULL,
    "aboutUsText" JSONB NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactLocation" TEXT NOT NULL,
    "socialInstagram" TEXT,
    "socialYoutube" TEXT,
    "socialLinkedin" TEXT,
    "socialFacebook" TEXT,
    "googleAnalyticsId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
