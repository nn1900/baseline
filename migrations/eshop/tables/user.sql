CREATE TABLE `eshop`.`user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT, 
  `user_name` varchar(32) NOT NULL, 
  `password` char(32) NOT NULL, 
  `status` int(11) NOT NULL, 
  `is_system_user` tinyint(1) NOT NULL DEFAULT '1', 
  `is_super_user` tinyint(1) NOT NULL, 
  `is_disabled` tinyint(1) NOT NULL, 
  `screen_name` varchar(45), 
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;