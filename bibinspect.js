#!/usr/bin/env node

var program = require('commander'),
	Q = require('q'),
	chalk = require('chalk');

program
	.version('0.0.0')
	.command('list <filename>', 'List all entries in file')
	.command('search <filename> <search>', 'Find entry based on key or sha1 hash')
	.parse(process.argv);
