CREATE TABLE `eshop`.`order_process_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `order_id` int(11) NOT NULL, 
  `op` int(11) NOT NULL, 
  `op_data` varchar(200), 
  `op_time` datetime NOT NULL, 
  `op_user` int(11), 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the order progress log. ';