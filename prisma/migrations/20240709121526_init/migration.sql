-- AlterTable
ALTER TABLE `art` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `token` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `user` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();
