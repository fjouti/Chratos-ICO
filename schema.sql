CREATE TABLE `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `referral` varchar(255) NOT NULL UNIQUE,
  `referred` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `currency_rate`;
CREATE TABLE `currency_rate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `currency` varchar(7) COLLATE utf8_general_ci NOT NULL,
  `base_currency` varchar(7) COLLATE utf8_general_ci NOT NULL,
  `buy` double NOT NULL DEFAULT '0' COMMENT 'current rate',
  `sell` double NOT NULL DEFAULT '0' COMMENT 'current rate',
  `taken_from` varchar(32) COLLATE utf8_general_ci DEFAULT NULL,
  `autoupdate_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `require_recalculate` tinyint(1) NOT NULL DEFAULT '0',
  `stock` varchar(16) COLLATE utf8_general_ci DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `currency_pair_uniq` (`currency`,`base_currency`),
  KEY `currency_rate_currency_idx` (`currency`),
  KEY `currency_rate_stock_idx` (`stock`),
  KEY `currency_rate_autoupdate_idx` (`autoupdate_enabled`),
  KEY `currency_rate_recalculate_idx` (`require_recalculate`),
  KEY `currency_rate_buy_idx` (`buy`),
  KEY `currency_rate_sell_idx` (`sell`),
  KEY `currency_rate_base_currency_idx` (`base_currency`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

DROP TABLE IF EXISTS `currency`;
CREATE TABLE `currency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(8) COLLATE utf8_general_ci NOT NULL,
  `name` varchar(16) COLLATE utf8_general_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_server` tinyint(1) NOT NULL DEFAULT '0',
  `currency_type` smallint(6) NOT NULL DEFAULT '1' COMMENT 'BITCOIN=1 or FIAT=0',
  `dsn` varbinary(256) DEFAULT NULL ,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `settings` text COLLATE utf8_general_ci ,
  `comment` text COLLATE utf8_general_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `symbol_uidx` (`symbol`),
  KEY `currency_type_idx` (`currency_type`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;