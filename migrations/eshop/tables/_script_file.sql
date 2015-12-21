CREATE TABLE `eshop`.`_script_file` (
  `db` varchar(64) NOT NULL, 
  `obj_type` varchar(10) NOT NULL, 
  `file_name` varchar(255) NOT NULL, 
  `md5` char(32) NOT NULL, 
  PRIMARY KEY (`db`, `obj_type`, `file_name`)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;