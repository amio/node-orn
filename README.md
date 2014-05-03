# Oh-Rename

If you know [JavaScript RegExp](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions), you know `orn`. A super simple & easy renamer.

## Usage

```
$ orn '/<pattern>/<replaceString>/gi'
```

Examples:

```
$ orn '/(\.js)$/.source$1/g' -d
  -- Dry Run --
* application.js --> application.source.js
* express.js ------> express.source.js
* request.js ------> request.source.js
* response.js -----> response.source.js
* utils.js --------> utils.source.js
* view.js ---------> view.source.js
```

### Switches

  -d, --dry-run  
    Show how the files would be renamed, but don't actually do anything.
