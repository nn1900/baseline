CREATE TABLE `eshop`.`customer_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `customer_id` int(11) NOT NULL, 
  `login_time` datetime NOT NULL, 
  `platform` varchar(20) NOT NULL, 
  `platform_version` varchar(10) NOT NULL, 
  `app_version` varchar(10), 
  `login_method` varchar(10), 
  `device_model` varchar(30), 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;