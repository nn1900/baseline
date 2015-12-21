CREATE TABLE `eshop`.`product_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `product_id` int(11) NOT NULL, 
  `image_path` varchar(255) NOT NULL, 
  `width` int(11) NOT NULL, 
  `height` int(11) NOT NULL, 
  `thumbnail_path` varchar(255) NOT NULL, 
  `thumbnail_image_cords` varchar(45) NOT NULL, 
  `original_image_path` varchar(255) NOT NULL, 
  `file_name` varchar(45) NOT NULL, 
  `creator` int(11) NOT NULL, 
  `create_time` datetime NOT NULL, 
  `update_time` datetime, 
  `update_user` int(11), 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the images of the product. ';