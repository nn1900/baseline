ALTER TABLE `shopping_cart` ADD UNIQUE INDEX `session_id_UNIQUE` USING BTREE(`session_id`);