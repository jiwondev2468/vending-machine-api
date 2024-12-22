/*
  Warnings:

  - You are about to drop the column `art_description` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `art_name` on the `gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `art` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `gallery` DROP COLUMN `art_description`,
    DROP COLUMN `art_name`,
    ADD COLUMN `gallery_description` VARCHAR(255) NOT NULL DEFAULT '-',
    ADD COLUMN `gallery_name` VARCHAR(255) NOT NULL DEFAULT 'Untitled',
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `token` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `user` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();
