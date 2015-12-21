CREATE TABLE `eshop`.`order_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `order_id` int(11) NOT NULL, 
  `transaction_no` varchar(80) NOT NULL, 
  `create_time` datetime NOT NULL, 
  `finished` tinyint(1) NOT NULL, 
  `finish_time` datetime, 
  `tx` varchar(80), 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the transaction of the orders. ';