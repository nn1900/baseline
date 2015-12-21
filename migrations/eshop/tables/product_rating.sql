CREATE TABLE `eshop`.`product_rating` (
  `product_id` int(11) NOT NULL, 
  `rating` double NOT NULL, 
  `count` int(11) NOT NULL, 
  PRIMARY KEY (`product_id`, `rating`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the product rating logs. ';