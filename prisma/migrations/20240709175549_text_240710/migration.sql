-- DropForeignKey
ALTER TABLE `art` DROP FOREIGN KEY `Art_owner_id_fkey`;

-- AlterTable
ALTER TABLE `art` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `token` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `user` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- CreateTable
CREATE TABLE `gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `art_name` VARCHAR(255) NOT NULL DEFAULT 'Untitled',
    `art_description` VARCHAR(255) NOT NULL DEFAULT '-',
    `file_url` VARCHAR(255) NOT NULL DEFAULT '',
    `position_x` DOUBLE NOT NULL DEFAULT 0,
    `position_y` DOUBLE NOT NULL DEFAULT 0,
    `position_z` DOUBLE NOT NULL DEFAULT 0,
    `rotation_x` DOUBLE NOT NULL DEFAULT 0,
    `rotation_y` DOUBLE NOT NULL DEFAULT 0,
    `rotation_z` DOUBLE NOT NULL DEFAULT 0,
    `owner_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `art` ADD CONSTRAINT `art_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gallery` ADD CONSTRAINT `gallery_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
