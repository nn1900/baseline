CREATE TABLE `eshop`.`permission_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT, 
  `parent_category_id` int(11), 
  `name` varchar(45) NOT NULL, 
  `sort_order` int(11) NOT NULL, 
  `is_admin_permission_category` tinyint(1) NOT NULL, 
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;