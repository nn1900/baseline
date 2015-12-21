CREATE TABLE `eshop`.`product_property_value_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `property_id` int(11) NOT NULL, 
  `integer_value` int(11), 
  `floating_point_value` double, 
  `decimal_value` decimal(10,4), 
  `string_value` varchar(200), 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the options of product property. ';