var format = require('./lib/format.js'),
	Q = require('q'),
	program = require('commander'),
	helper = require('./lib/helper.js'),
	chalk = require('chalk'),
	sha1 = require('sha1');

program
	.version('0.0.0')
	.parse(process.argv);

if(program.args.length !== 2) {
	console.error('You need to provide a key or short sha1 and a filename');
	process.exit(1);
}


console.log(chalk.yellow.italic('* The sha1 key is used to faster find the entry, this is not present in the bibliography file but is calculated from the EntryKey \n'))

var search = program.args[1];

helper.read(program.args[0])
	.then(function(entries) {

		// First try to find by entry key
		var result = entries.entries.filter(function(entry) {
			return entry.EntryKey === search;
		});

		if(result.length > 0) {
			return printResult(entries);
		}

		// Try to find sha1
		result = entries.entries.filter(function(entry) {
			return sha1(entry.EntryKey).substr(0, 4) === search;
		});

		if(result.length > 0) {
			return printResult(result);
		}

		// If nothing is found, try a more fuzzy search
		result = entries.entries.filter(function(entry) {
			return fuzzySearch(entry, search);
		});

		if(result.length > 0) {
			return printResult(result);
		} else {
			console.log('Didnt find any entries');
		}
	});

function printResult(entries) {
	entries.forEach(function(entry) {
		console.log(format.entry(entry));
	});
}

// Returns true if search matches entry
function fuzzySearch(entry, search) {
	var key;

	if(search === '*') {
		entry.search = 'global search *';
		return true;
	}

	// Test key
	if((new RegExp(search, 'i')).test(entry.EntryKey)) { // entry.EntryKey.test(new RegExp(search))
		entry.search = 'Key';
		return true;
	}

	// Test SHA1
	if((new RegExp('^' + search)).test(sha1(entry.EntryKey))) {
		entry.search = 'Sha1';
		return true;
	}

	// Test type
	if((new RegExp(search)).test(entry.EntryType)) {
		entry.search = 'Type';
		return true;
	}

	// Find in any field
	for(key in entry.Fields) {
		if(entry.Fields.hasOwnProperty(key)) {
			if((new RegExp(search, 'i')).test(entry.Fields[key])) {
				entry.search = key;
				return true;
			}
		}
	}

	return false;
}
