CREATE TABLE `eshop`.`delivery_method` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(80) NOT NULL, 
  `query_api` varchar(200), 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the delivery methods. ';