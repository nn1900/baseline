CREATE TABLE `eshop`.`rendering_media_photo_item` (
  `item_id` int(11) NOT NULL, 
  `original_image` varchar(255) NOT NULL, 
  `original_image_width` int(11) NOT NULL, 
  `original_image_height` int(11) NOT NULL, 
  `thumbnail_image` varchar(255), 
  `thumbnail_image_cords` varchar(45), 
  `image` varchar(255), 
  `image_cords` varchar(45), 
  `thumbnail_size_spec` int(11) NOT NULL, 
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;