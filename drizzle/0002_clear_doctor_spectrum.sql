CREATE TABLE `login_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`blocked_until` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`member_email` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`member_email`) REFERENCES `members`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `members` ADD `username` text;--> statement-breakpoint
ALTER TABLE `members` ADD `password_hash` text;--> statement-breakpoint
ALTER TABLE `members` ADD `password_salt` text;--> statement-breakpoint
ALTER TABLE `members` ADD `is_owner` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `members_username_unique` ON `members` (`username`);