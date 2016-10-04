# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2016-10-05

### Added
- Support plain string in first arg. `orn 720p 1080p`
- Support arrow function in second arg. `orn '/\S+mp3$/g' 'x=>x.toLowerCase()'`

## [2.0.0] - 2016-09-27

### Changed
- Fully rewrite.
- New grammar: `orn <RegExp> <replacementString> [-d]`.
- Optimize output for lengthy filenames.

## 1.0.4 - 2015-07-28

### Added
- Original release.
- `orn '/<pattern>/<replaceString>/gi'`

[2.0.0]: https://github.com/amio/node-orn/compare/v1.0.4...v2.0.0
[2.1.0]: https://github.com/amio/node-orn/compare/v2.0.0...v2.1.0
