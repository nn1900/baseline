ALTER TABLE `product_property_value` ADD INDEX `idx_property_id_dval` USING BTREE(`decimal_value`);
ALTER TABLE `product_property_value` ADD INDEX `idx_property_id_fval` USING BTREE(`floating_point_value`);
ALTER TABLE `product_property_value` ADD INDEX `idx_property_id_ival` USING BTREE(`integer_value`);
ALTER TABLE `product_property_value` ADD INDEX `idx_property_id_sval` USING BTREE(`string_value`);