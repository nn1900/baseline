CREATE TABLE `eshop`.`district` (
  `id` int(11) NOT NULL, 
  `cid` varchar(32), 
  `name` varchar(32), 
  `city_id` int(11) NOT NULL, 
  `province_id` int(11) NOT NULL, 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;