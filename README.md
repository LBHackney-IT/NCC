# Hackney Neighbourhood Contact Centre (NCC) CRM project.

[![Known Vulnerabilities](https://snyk.io/test/github/LBHackney-IT/NCC/badge.svg?targetFile=ng-ncc-app%2Fpackage.json)](https://snyk.io/test/github/LBHackney-IT/NCC?targetFile=ng-ncc-app%2Fpackage.json)

Making use of:

- [Angular 6](https://angular.io) (via Angular CLI)
- [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend).

## Angular app
The Angular app is currently stored in the `ng-ncc-app` subfolder.

```
cd ng-ncc-app
npm install (or yarn install)
ng serve
```

## App version number

### What's the current version number?
```
npm version
```

### Update the current version number...
```
npm version major # increment the version major number
npm version minor # increment the version minor number
npm version patch # increment the version patch number
```

### If building the app throws an error with a missing `versioning.js` file:
```
cd ng-ncc-app
node src/versioning.js
```
This creates a `versioning.js` file used by the app to obtain the current version number.

## BUILDING site versions
When copying files over to the host folders, **be careful not to remove the `web.config` file** Everything else should be safe to delete or replace.

### The main app

#### DEVELOPMENT test site

This is no longer used, but while available it might be useful for testing scenarios that require non-*localhost* URLs (e.g. payments via Paris).

```
npm build -c dev-site
```

Build folder: `ng-ncc-app/dist/dev-test`

Server folder: `\\lbhwebintd01\c$\ng-ncc-app-dev-test`

Single Sign On (SSO): http://lbhwebintd01:1010

View Only mode: http://lbhwebintd01:1010/default.aspx?viewonly

Front end: http://lbhwebintd01:2020

#### LIVE test site

```
npm build -c live-site
```

Build folder: `ng-ncc-app/dist/live-test`

Server folder: `\\lbhwebintd01\c$\ng-ncc-app-live-test`

Single Sign On (SSO): http://lbhwebintd01:3030

View Only mode: http://lbhwebintd01:3030/default.aspx?viewonly

Front end: http://lbhwebintd01:4040

#### PRODUCTION/LIVE site

```
npm build --prod
```

Build folder: `ng-ncc-app/dist/ng-ncc-app`

Folder: `\\lbhwsappp01\c$\ng-ncc-app`

Single Sign On (SSO): http://lbhwsappp01:3030

View Only mode: http://lbhwsappp01:3030/default.aspx?viewonly

Front end: http://secure.ncc.hackney.gov.uk:4040

### The callback response app

**NOTE: this also has a `web.config` file.**

#### Test site

```
npm build ng-ncc-callback -c live-test
```
(this will use *live-test* settings.)

Build folder: `ng-ncc-app/dist/live-test/callback`

Server folder: \\lbhwebintd01\c$\ng-ncc-callback

http://lbhwebintd01:6060/[callback id]/[email address]
