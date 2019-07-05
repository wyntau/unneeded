@unneeded/unneeded-cli
======================

find unneeded files

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@unneeded/unneeded-cli.svg)](https://npmjs.org/package/@unneeded/unneeded-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@unneeded/unneeded-cli.svg)](https://npmjs.org/package/@unneeded/unneeded-cli)
[![License](https://img.shields.io/npm/l/@unneeded/unneeded-cli.svg)](https://github.com/Wyntau/unneeded/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @unneeded/unneeded-cli
$ unneeded COMMAND
running command...
$ unneeded (-v|--version|version)
@unneeded/unneeded-cli/0.0.1 darwin-x64 node-v10.15.3
$ unneeded --help [COMMAND]
USAGE
  $ unneeded COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`unneeded help [COMMAND]`](#unneeded-help-command)
* [`unneeded list`](#unneeded-list)

## `unneeded help [COMMAND]`

display help for unneeded

```
USAGE
  $ unneeded help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `unneeded list`

list all unneeded files

```
USAGE
  $ unneeded list

OPTIONS
  -a, --audit=audit      (required) directory to audit
  -c, --context=context  [default: /Workspaces/me/unused/packages/unneeded-cli] context
  -e, --entry=entry      (required) entry file
  -h, --help             show CLI help

EXAMPLE
  $ unneeded list --entry /path/to/a.js --audit /path/to
  /path/to/b.js
```

_See code: [src/commands/list.ts](https://github.com/Wyntau/unneeded/blob/v0.0.1/src/commands/list.ts)_
<!-- commandsstop -->
