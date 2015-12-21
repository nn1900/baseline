CREATE TABLE `eshop`.`user_role` (
  `user_id` int(11) NOT NULL, 
  `role_id` int(11) NOT NULL, 
  PRIMARY KEY (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;