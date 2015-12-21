CREATE TABLE `eshop`.`media_library_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `item_id` varchar(32) NOT NULL, 
  `name` varchar(200) NOT NULL, 
  `file_name` varchar(512), 
  `item_type` varchar(128), 
  `item_path` varchar(512) NOT NULL, 
  `folder_id` int(11), 
  `description` varchar(200), 
  `create_time` datetime NOT NULL, 
  `creator` int(11) NOT NULL, 
  `poster` varchar(255), 
  `is_video` tinyint(1) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;