# Hackney Neighbourhood Contact Centre (NCC) CRM project.

[![Known Vulnerabilities](https://snyk.io/test/github/LBHackney-IT/NCC/badge.svg?targetFile=ng-ncc-app%2Fpackage.json)](https://snyk.io/test/github/LBHackney-IT/NCC?targetFile=ng-ncc-app%2Fpackage.json)

Making use of:

- Angular 6 (via Angular CLI)
- [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend).

## Angular app

The Angular app is currently stored in the ng-ncc-app subfolder.

```
cd ng-ncc-app
npm install (or yarn install)
ng serve
```

## *DEVELOPMENT* test site

Single Sign On (SSO): http://lbhwebintd01:1010

Front end: http://lbhwebintd01:2020

```
npm build -c dev-site
```

## *LIVE* test site

Single Sign On (SSO): http://lbhwebintd01:3030

Front end: http://lbhwebintd01:4040

```
npm build -c live-site
```
