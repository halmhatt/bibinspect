Bibinspect
=============

Inspect bibtext files from command line. 

# Usage
There are 2 commands: `list` and `search`.

```bash
$ bibinspect list references.bib
// Lists all entries

$ bibinspect search references.bib "hello"
// Searches for the query "hello" in everything, first tries to match with key and short (4 chars) sha1 of key
```

```bash
$ bibinspect --help
```

# Licence
MIT

Im using the lib [bib2json](https://github.com/mayanklahiri/bib2json) by [mayanklahiri](https://github.com/mayanklahiri) which uses BSD license. 