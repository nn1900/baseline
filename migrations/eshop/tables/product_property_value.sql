CREATE TABLE `eshop`.`product_property_value` (
  `product_id` int(11) NOT NULL, 
  `property_id` int(11) NOT NULL, 
  `integer_value` int(11), 
  `floating_point_value` double, 
  `decimal_value` decimal(10,4), 
  `string_value` varchar(200), 
  PRIMARY KEY (`product_id`, `property_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the property values of product. ';