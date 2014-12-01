var chalk = require('chalk'),
	size = require('window-size'),
	sha1 = require('sha1');

function shortSha1(entry) {
	return '[' + sha1(entry.EntryKey).substr(0, 4) + ']';
}

function pad(str, length, padder, end) {
	padder = padder || ' ';

	if(end === undefined) {
		end = true;
	}

	while(str.length < length) {

		if(end) {
			str = str + padder;
		} else {
			str = padder + str;
		}
	}

	return str;
}

exports.pad = pad;

function wrap(str, padding) {
	padding = padding || 0;

	var maxLength = size.width - padding;

	if(str.length < maxLength) {
		return str;
	}

	return str.substr(0, maxLength) + '\n' + pad('', 14) + str.substr(maxLength);
}

function foundMark(entry, key, str) {
	if(entry.search === key) {
		return chalk.bgWhite(str).toString();
	}

	return str;
}

exports.entry = function(entry, index) {
	var str = '',
		fieldColor,
		hash = sha1(entry.EntryKey),
		key;

	str += foundMark(entry, 'Key', chalk.blue(pad('Key', 14)) + chalk.red(entry.EntryKey)) + '\n';
	str += foundMark(entry, 'Type', chalk.blue(pad('Type', 14)) + chalk.gray((entry.EntryType || 'not defined'))) + '\n';
	
	// Loop over fields
	for(key in entry.Fields) {
		if(entry.Fields.hasOwnProperty(key)) {
			switch(key) {
				case 'Title':
					fieldColor = chalk.yellow;
					break;
				case 'Url':
				case 'HowPublished':
					// Sanitize url
					entry.Fields[key] = entry.Fields[key].replace(/^url/, '');
					break;
				default:
					fieldColor = chalk.gray;
			}

			str += foundMark(entry, key, chalk.blue(pad(key, 14)) + fieldColor(wrap(entry.Fields[key], 16))) + '\n';
		}
	}

	// Show sha1
	str += foundMark(entry, 'Sha1', chalk.white(pad('Sha1*', 14)) + chalk.gray(hash)) + '\n';

	return str;
};

exports.entryShort = function(entry, index) {
	var str = '';

	str += chalk.gray(entry.EntryKey) + chalk.black(' (' + shortSha1(entry) + ')') + '\n';

	str += chalk.bold.blue(entry.Fields.Title) + '\n';

	return str;
};

exports.entryKey = function(entry, index) {
	var str = '';

	str += chalk.red(entry.EntryKey) + ' ';
	str += chalk.gray(shortSha1(entry));

	return str;
};
