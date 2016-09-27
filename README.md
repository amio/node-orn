# Oh-Rename

If you know [JavaScript RegExp](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions), you know `orn`, a super simple batch renamer.

## Usage

Just like `String.prototype.replace(<RegExp>, <replacementString>)` in cli:

```
Usage: orn <RegExp> <replacementString> [-d]

Options:

  -h, --help         Output usage information
  -v, --version      Output the version number
  -d, --dry-run      Show how the files will be renamed, but actually do nothing

Examples:

  orn /720p/i 1080P              # Replace "720p" or "720P" with "1080P".
  orn '/(\.js)$/i' '.min$1' -d   # Add ".min" to js files, in dry-run.
```

<img src="https://cloud.githubusercontent.com/assets/215282/18861799/8bc3a9e4-84ba-11e6-992c-6ad8483b78b8.png" height="181" width="537" />

### Switches

  -d, --dry-run  
    Show how the files will be renamed, but actually do nothing.
