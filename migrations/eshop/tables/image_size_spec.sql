CREATE TABLE `eshop`.`image_size_spec` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(45) NOT NULL, 
  `width` int(11) NOT NULL, 
  `height` int(11), 
  `cid` varchar(80) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;