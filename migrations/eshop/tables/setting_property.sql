CREATE TABLE `eshop`.`setting_property` (
  `name` varchar(160) NOT NULL, 
  `display_name` varchar(200), 
  `value_type` varchar(20) NOT NULL, 
  `value` varchar(4000), 
  `description` varchar(200), 
  `category` varchar(45), 
  `sort_order` int(11) NOT NULL DEFAULT '0', 
  `read_only` tinyint(1) NOT NULL, 
  `hidden` tinyint(1) NOT NULL, 
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Defines the properties of system settings. ';