CREATE TABLE `eshop`.`permission` (
  `permission_id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(80) NOT NULL, 
  `text` varchar(80) NOT NULL, 
  `category_id` int(11), 
  `sort_order` int(11) NOT NULL, 
  `is_admin_permission` tinyint(1) NOT NULL, 
  PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;