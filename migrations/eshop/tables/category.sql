CREATE TABLE `eshop`.`category` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `cid` varchar(80) NOT NULL, 
  `name` varchar(45) NOT NULL, 
  `parent_category_id` int(11), 
  `sort_order` int(11) NOT NULL, 
  `meta_keyword` varchar(200), 
  `meta_description` varchar(500), 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;