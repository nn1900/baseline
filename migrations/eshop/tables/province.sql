CREATE TABLE `eshop`.`province` (
  `id` int(11) NOT NULL, 
  `cid` varchar(30), 
  `name` varchar(45) NOT NULL, 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;