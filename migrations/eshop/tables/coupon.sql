CREATE TABLE `eshop`.`coupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `code` varchar(20) NOT NULL, 
  `coupon_type` int(11) NOT NULL, 
  `owner` int(11), 
  `customer_id` int(11), 
  `is_activated` tinyint(1) NOT NULL, 
  `expire_time` datetime, 
  `value` decimal(10,3) NOT NULL, 
  `is_locked` tinyint(1) NOT NULL, 
  `is_used` tinyint(1) NOT NULL, 
  `lock_key` varchar(80), 
  `lock_time` datetime, 
  `used_time` datetime, 
  `value_percentage` double, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the coupons. ';