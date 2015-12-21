CREATE TABLE `eshop`.`rendering_block_directory` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(45) NOT NULL, 
  `parent_directory_id` int(11), 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the rendering block directory. ';