CREATE TABLE `eshop`.`role_permission` (
  `role_id` int(11) NOT NULL, 
  `permission_id` int(11) NOT NULL, 
  PRIMARY KEY (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;