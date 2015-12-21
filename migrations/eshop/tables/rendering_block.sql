CREATE TABLE `eshop`.`rendering_block` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `identifier` varchar(100) NOT NULL, 
  `name` varchar(45) NOT NULL, 
  `directory_id` int(11), 
  `template_type` varchar(80), 
  `custom_template_id` varchar(100), 
  `data_type` varchar(45) NOT NULL, 
  `data` longtext, 
  `parent_block_id` int(11), 
  `size` varchar(80) NOT NULL, 
  `thumbnail_size` varchar(80), 
  `layout` varchar(20), 
  `sort_order` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the rendering block in application. ';