ALTER TABLE `order` ADD UNIQUE INDEX `guid_UNIQUE` USING BTREE(`guid`);
ALTER TABLE `order` ADD INDEX `idx_order_customer_email` USING BTREE(`customer_email`);
ALTER TABLE `order` ADD UNIQUE INDEX `order_no_UNIQUE` USING BTREE(`order_no`);