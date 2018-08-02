angular
    .module('hackney.ncc')
    .config(AppStates);

function AppStates($stateProvider) {
  var helloState = {
    name: 'home',
    url: '/',
    template: '<h3>Home Page!</h3>'
  }

  var aboutState = {
    name: 'call-log',
    url: '/call-log',
    template: '<h3>Call logging page!</h3>'
  }

  $stateProvider.state(helloState);
  $stateProvider.state(aboutState);
}
