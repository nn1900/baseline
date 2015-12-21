CREATE TABLE `eshop`.`rendering_media_video_item` (
  `item_id` int(11) NOT NULL, 
  `mp4_url` varchar(255), 
  `webm_url` varchar(255), 
  `ogg_url` varchar(255), 
  `poster` varchar(255), 
  `poster_cords` varchar(45), 
  `original_poster` varchar(255), 
  `original_poster_width` int(11), 
  `original_poster_height` int(11), 
  `show_controls` tinyint(1) NOT NULL, 
  `auto_play` tinyint(1) NOT NULL, 
  `preload` varchar(10), 
  `loop` tinyint(1) NOT NULL, 
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;