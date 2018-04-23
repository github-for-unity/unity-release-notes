## Release notes generator for GitHub for Unity

This script will grab all the issues that have been closed since the last tag was created and list them by Features/Enhancements/Bugs (plus all the PRs that were closed in case something was missed).

To make this work, you need to:

- Create an application on github.com
- Set the following environment variables:

```
APP_NAME="Name of application"
APP_CLIENT_ID=application-client-id
APP_CLIENT_SECRET=application-client-secret
```

This script will try to login for you, with 2FA. If that fails or you don't want to use 2FA, do the following to set the credentials:

- Create folder `scratch`
- Create file `scratch\user` with the username
- Create file `scratch\token` with a personal token

You need node installed, and then on first run do `npm install`

Then run `node generate.js > notes.txt 2>errorlog`

If bash on windows complains about this command with the error `output is not a tty`, then run 

`npm start > notes.txt 2>errorlog` instead

