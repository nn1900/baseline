CREATE TABLE `eshop`.`product_detail` (
  `product_id` int(11) NOT NULL, 
  `details` longtext, 
  `create_time` datetime NOT NULL, 
  `creator` int(11) NOT NULL, 
  `update_time` datetime, 
  `update_user` int(11), 
  `package_items` text, 
  `service_support` text, 
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;