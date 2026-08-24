-- AlterTable
ALTER TABLE "Recording" ADD COLUMN     "pptUrl" TEXT,
ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "youtubeUrl" TEXT;
