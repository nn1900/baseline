CREATE TABLE `eshop`.`customer_oauth_binding` (
  `party_type` varchar(20) NOT NULL, 
  `party_user_id` varchar(32) NOT NULL, 
  `customer_id` int(11) NOT NULL, 
  `bind_time` datetime NOT NULL, 
  PRIMARY KEY (`party_type`, `party_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;