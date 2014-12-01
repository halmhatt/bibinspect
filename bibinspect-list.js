var format = require('./lib/format.js'),
	Q = require('q'),
	program = require('commander'),
	helper = require('./lib/helper.js'),
	chalk = require('chalk');

program
	.version('0.0.0')
	.option('-k, --keys', 'List only keys')
	.option('-s, --short', 'List shorter')
	.parse(process.argv);

if(program.args.length !== 1) {
	console.error('You need to provide a filename');
	process.exit(1);
}


console.log(chalk.yellow.italic('* The sha1 key is used to faster find the entry, this is not present in the bibliography file but is calculated from the EntryKey\n'))

helper.read(program.args[0])
	.then(function(entries) {

		if(program.keys) {
			entries.entries.sort(function(a, b) {
				return (a.EntryKey > b.EntryKey ? 1 : -1);
			})
			.forEach(function(entry, i) {
				console.log(format.entryKey(entry, i));
			});

		} else if(program.short) {
			entries.entries.forEach(function(entry, i) {
				console.log(format.entryShort(entry, i));
			});
		} else {
			// Default output unsorted
			entries.entries.forEach(function(entry, i) {
				console.log(format.entry(entry, i));
			});
		}
	});
