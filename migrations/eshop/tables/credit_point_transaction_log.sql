CREATE TABLE `eshop`.`credit_point_transaction_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `customer_id` int(11) NOT NULL, 
  `transaction_type` int(11) NOT NULL, 
  `action_type` int(11) NOT NULL, 
  `balance` int(11) NOT NULL, 
  `create_time` datetime NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the customer credit point transactions.';