ALTER TABLE `lots` ADD `block` text;--> statement-breakpoint
ALTER TABLE `lots` ADD `source` text;--> statement-breakpoint
ALTER TABLE `lots` ADD `review_reason` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `map_asset` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `map_height` real DEFAULT 650 NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `details` text;