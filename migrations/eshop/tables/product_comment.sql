CREATE TABLE `eshop`.`product_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `product_id` int(11) NOT NULL, 
  `customer_id` int(11) NOT NULL, 
  `title` varchar(100), 
  `content` text NOT NULL, 
  `rating` double NOT NULL, 
  `create_time` datetime NOT NULL, 
  `recommend_words` varchar(200), 
  `review_status` int(11) NOT NULL, 
  `review_time` datetime, 
  `reviewer` int(11), 
  `customer_name` varchar(45), 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci COMMENT 'Represents the comments of products. ';