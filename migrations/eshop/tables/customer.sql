CREATE TABLE `eshop`.`customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `login_name` varchar(32) NOT NULL, 
  `password` char(32) NOT NULL, 
  `nick_name` varchar(45), 
  `mobile_phone` char(11), 
  `email` varchar(45), 
  `create_time` datetime NOT NULL, 
  `last_login_time` datetime, 
  `last_login_ip` varchar(15), 
  `profile_picture` varchar(255), 
  `is_disabled` tinyint(1) NOT NULL, 
  `login_count` int(11) NOT NULL, 
  `credit_point` int(11) NOT NULL, 
  `birth` date, 
  `gender` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;