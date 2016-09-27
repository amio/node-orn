# Oh-Rename

If you know [JavaScript RegExp](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions), you know `orn`. A super simple & easy batch renamer.

## Usage

Use it like what you would do with `String.prototype.replace(<RegExp>, <replacementString>)`

```
Usage: orn <RegExp> <replacementString> [-d]

Options:

  -h, --help         Output usage information
  -v, --version      Output the version number
  -d, --dry-run      Show how the files will be renamed, but actually do nothing.
```

Examples:

```
$ orn '/(\.js)$/g' '.source$1' -d
  -- Dry Run --
* application.js --> application.source.js
* express.js ------> express.source.js
* request.js ------> request.source.js
* response.js -----> response.source.js
* utils.js --------> utils.source.js
* view.js ---------> view.source.js
```

or:
![orn usage screenshot](https://cloud.githubusercontent.com/assets/215282/8894168/1189fa66-33df-11e5-8191-9dae0e49c0bd.png)

### Switches

  -d, --dry-run  
    Show how the files will be renamed, but actually do nothing.
