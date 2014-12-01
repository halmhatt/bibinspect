var bib2json = require('./Parser.js'),
	FS = require('q-io/fs');

exports.read = function(filename) {
	return FS
		.read(filename)
		.then(function(contents) {
			return bib2json(contents);
		});
};
