CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`budget` text NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`details` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'upstack-website' NOT NULL,
	`notified_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
