ALTER TABLE `permission` ADD CONSTRAINT `fk_permission_category_id` FOREIGN KEY (`category_id`) REFERENCES `permission_category` (`category_id`)  ON DELETE NO ACTION ON UPDATE NO ACTION;