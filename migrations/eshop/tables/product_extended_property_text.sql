CREATE TABLE `eshop`.`product_extended_property_text` (
  `product_id` int(11) NOT NULL, 
  `extended_properties_text` text, 
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the product extended property text for fts. ';