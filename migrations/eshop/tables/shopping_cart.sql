CREATE TABLE `eshop`.`shopping_cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `session_id` varchar(32) NOT NULL, 
  `customer_id` int(11), 
  `last_updated` datetime NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the shopping cart stored in sessions. ';