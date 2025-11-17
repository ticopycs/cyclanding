-- Replace siteurl and home to localhost after import
UPDATE `wp_options` SET `option_value` = 'http://localhost:8080' WHERE `option_name` IN ('siteurl','home');



