CREATE TABLE `eshop`.`city` (
  `id` int(11) NOT NULL, 
  `cid` varchar(30), 
  `name` varchar(32) NOT NULL, 
  `province_id` int(11) NOT NULL, 
  `area_code` varchar(8), 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;