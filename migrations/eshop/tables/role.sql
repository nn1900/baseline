CREATE TABLE `eshop`.`role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(32) NOT NULL, 
  `display_name` varchar(64) NOT NULL, 
  `description` varchar(255), 
  `sort_order` int(11) NOT NULL DEFAULT '0', 
  `is_system_role` tinyint(1) NOT NULL, 
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;