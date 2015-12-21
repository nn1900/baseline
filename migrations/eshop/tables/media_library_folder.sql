CREATE TABLE `eshop`.`media_library_folder` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `node_id` varchar(32) NOT NULL, 
  `name` varchar(45) NOT NULL, 
  `parent_folder_id` int(11), 
  `item_count` int(11) NOT NULL, 
  `creator` int(11) NOT NULL, 
  `create_time` datetime NOT NULL, 
  `update_user` int(11), 
  `update_time` datetime, 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;