ALTER TABLE `order_detail` ADD CONSTRAINT `fk_order_detail_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `order_detail` ADD CONSTRAINT `fk_order_detail_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)  ON DELETE NO ACTION ON UPDATE NO ACTION;