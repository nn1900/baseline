CREATE TABLE `eshop`.`reset_password_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `customer_id` int(11) NOT NULL, 
  `email` varchar(45) NOT NULL, 
  `token` varchar(32) NOT NULL, 
  `rand` varchar(20) NOT NULL, 
  `sign` char(32) NOT NULL, 
  `create_time` datetime NOT NULL, 
  `expire_time` datetime NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;