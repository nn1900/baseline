CREATE TABLE `eshop`.`customer_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `customer_id` int(11) NOT NULL, 
  `province_id` int(11) NOT NULL, 
  `city_id` int(11) NOT NULL, 
  `district_id` int(11) NOT NULL, 
  `street` varchar(100) NOT NULL, 
  `apartment_address` varchar(100), 
  `is_default` tinyint(1) NOT NULL, 
  `create_time` datetime NOT NULL, 
  `update_time` datetime, 
  `contact` varchar(45), 
  `contact_phone` varchar(20), 
  `contact_email` varchar(45), 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;