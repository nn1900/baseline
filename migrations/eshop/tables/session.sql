CREATE TABLE `eshop`.`session` (
  `session_id` char(32) NOT NULL, 
  `session_data` longblob, 
  `create_time` datetime NOT NULL, 
  `last_modified` datetime, 
  `last_accessed` datetime, 
  `expire_time` datetime NOT NULL, 
  `flags` bigint(20) NOT NULL, 
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;