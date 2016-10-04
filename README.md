# Oh-Rename [![npm-version][npm-badge]][npm-link]

If you know [JavaScript RegExp](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions), you know `orn`, a super simple batch renamer.

## Usage

Just like `String.prototype.replace(<pattern>, <replacement>)` in cli,
which `<pattern>` could be a `RegExp` or `String`,
and `<replacement>` could be a `String` or `Arrow Function`:

```
Usage: orn <pattern> <replacement> [-d]

Arguments:

  <pattern>          The pattern to be replaced, could be a String or RegExp.
  <replacement>      The String to be replace with, Arrow Function is supported.

Options:

  -h, --help         Output usage information
  -v, --version      Output the version number
  -d, --dry-run      Show how the files will be renamed, but actually do nothing

Examples:

  orn 720p 1080P                        # Replace "720p" with "1080P".
  orn /720p/i 1080P                     # Replace "720p" or "720P" with "1080P".
  orn '/(\.js)$/i' '.min$1' -d          # Add ".min" to js files, in dry-run.
  orn '/\S+mp3$/' 'x=>x.toLowerCase()'  # Change mp3 filename to lowercase.
```

<p align="center"><img height="181" width="537" src="https://cloud.githubusercontent.com/assets/215282/18861799/8bc3a9e4-84ba-11e6-992c-6ad8483b78b8.png" /></p>

### Switches

- `-d, --dry-run`  
    Show how the files will be renamed, but actually do nothing.

### License

MIT © [Amio][author]

[npm-badge]:https://img.shields.io/npm/v/orn.svg?style=flat-square
[npm-link]: https://www.npmjs.com/package/orn
[author]:   https://github.com/amio
