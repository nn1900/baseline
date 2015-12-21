CREATE TABLE `eshop`.`product_unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(45) NOT NULL, 
  `is_default` tinyint(1) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;