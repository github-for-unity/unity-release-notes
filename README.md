## Release notes generator for GitHub for Unity

This script will grab all the issues that have been closed since the last tag was created and list them by Features/Enhancements/Bugs (plus all the PRs that were closed in case something was missed).

To make this work, you need to:

- Create folder `scratch`
- Create file `scratch\user` with the username
- Create file `scratch\token` with a personal token

You need node installed, and then on first run do `yarn install`

Then run `yarn start > notes.txt 2>errorlog`

