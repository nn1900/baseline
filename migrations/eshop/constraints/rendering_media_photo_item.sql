ALTER TABLE `rendering_media_photo_item` ADD CONSTRAINT `fk_rendering_media_photo_item_id` FOREIGN KEY (`item_id`) REFERENCES `rendering_media_item` (`id`)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rendering_media_photo_item` ADD CONSTRAINT `fk_rendering_media_photo_item_thumbnail_size_spec` FOREIGN KEY (`thumbnail_size_spec`) REFERENCES `image_size_spec` (`id`)  ON DELETE NO ACTION ON UPDATE NO ACTION;