CREATE TABLE `eshop`.`order_detail` (
  `order_id` int(11) NOT NULL, 
  `product_id` int(11) NOT NULL, 
  `product_cid` varchar(100) NOT NULL, 
  `product_name` varchar(200) NOT NULL, 
  `unit_price` decimal(10,3) NOT NULL, 
  `discount_price` decimal(10,3), 
  `qty` int(11) NOT NULL, 
  `sub_total` decimal(10,3) NOT NULL, 
  `customer_email` varchar(45) NOT NULL, 
  `has_commented` tinyint(1) NOT NULL, 
  PRIMARY KEY (`order_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;