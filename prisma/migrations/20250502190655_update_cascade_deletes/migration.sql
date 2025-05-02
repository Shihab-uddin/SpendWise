-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_walletId_fkey`;

-- DropForeignKey
ALTER TABLE `income` DROP FOREIGN KEY `Income_walletId_fkey`;

-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `Transfer_fromWalletId_fkey`;

-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `Transfer_toWalletId_fkey`;

-- DropIndex
DROP INDEX `Expense_walletId_fkey` ON `expense`;

-- DropIndex
DROP INDEX `Income_walletId_fkey` ON `income`;

-- DropIndex
DROP INDEX `Transfer_fromWalletId_fkey` ON `transfer`;

-- DropIndex
DROP INDEX `Transfer_toWalletId_fkey` ON `transfer`;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_fromWalletId_fkey` FOREIGN KEY (`fromWalletId`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_toWalletId_fkey` FOREIGN KEY (`toWalletId`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
