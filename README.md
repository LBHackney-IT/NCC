# NCC CRM Front End

[![Known Vulnerabilities](https://snyk.io/test/github/LBHackney-IT/NCC/badge.svg?targetFile=ng-ncc-app%2Fpackage.json)](https://snyk.io/test/github/LBHackney-IT/NCC?targetFile=ng-ncc-app%2Fpackage.json)
[![GitHub license](https://img.shields.io/github/license/LBHackney-IT/NCC.svg)](https://github.com/LBHackney-IT/NCC/blob/master/LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/LBHackney-IT/NCC.svg)](https://github.com/LBHackney-IT/NCC/network)

A modern JavaScript front end for Hackney Council's Neighbourhood Contact Centre (NCC) CRM.

https://sites.google.com/hackney.gov.uk/ncccrm/home

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

[Node Package Manager (npm)](https://npmjs.com) is required to run this project.

### Installing

Install this project's dependencies:

```
# using npm
npm install

# using yarn
yarn install
```

Run the app locally:

```
ng serve --open
```

## Deployment

**TEST Dev site**
```
ng build -c dev-test
```
Resulting project will be placed in the `dist/dev-test` folder.

Single Sign On (SSO): http://lbhwebintd01:1010
Front end: http://lbhwebintd01:2020

**TEST Live site**
```
ng build -c live-test
```
Resulting project will be placed in the `dist/live-test` folder.

Single Sign On (SSO): http://lbhwebintd01:3030
Front end: http://lbhwebintd01:4040

**Live site**
```
ng build --prod
```
Resulting project will be placed in the `dist/ng-ncc-app` folder.

Single Sign On (SSO): http://ncc.hackney.gov.uk
Front end: http://lbhwsappp01:3030

## Built With

* [Angular](https://angular.io) - modern JavaScript framework
* [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) - CSS framework

## Authors

* **Drew Maughan** - *Front End Developer*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
