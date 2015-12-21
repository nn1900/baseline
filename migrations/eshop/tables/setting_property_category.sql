CREATE TABLE `eshop`.`setting_property_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(32) NOT NULL, 
  `text` varchar(150) NOT NULL, 
  `sort_order` int(11) NOT NULL DEFAULT '0', 
  `view_permission` varchar(80), 
  `change_permission` varchar(80), 
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Defines the setting property categories. ';