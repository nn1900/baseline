ALTER TABLE `customer` ADD UNIQUE INDEX `email_UNIQUE` USING BTREE(`email`);
ALTER TABLE `customer` ADD INDEX `idx_mobile_phone` USING BTREE(`mobile_phone`);
ALTER TABLE `customer` ADD UNIQUE INDEX `user_name_UNIQUE` USING BTREE(`login_name`);