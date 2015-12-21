CREATE TABLE `test`.`costs` (
  `date` date NOT NULL, 
  `source` varchar(20) NOT NULL, 
  `item` varchar(45) NOT NULL, 
  `cost` int(11) NOT NULL, 
  `click` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;