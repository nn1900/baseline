CREATE TABLE `eshop`.`user_html_content_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `title` varchar(200) NOT NULL, 
  `html` longtext NOT NULL, 
  `create_time` datetime NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the user html content templates. ';