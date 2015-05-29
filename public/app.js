var app = angular.module("myapp", ['ui.router'])

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');


  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "/views/home.html",
      controller: "mainControl",
      resolve: {
        locations: function(mainService) {
          return mainService.getLocations();
        }
      }
    })
    .state("login", {
      url: '/login',
      templateUrl: "/views/login.html",
      controller: "loginControl"
    })
    .state("landing", {
      url: '/landing',
      templateUrl: '/views/landing.html',
      controller: "landingControl"
    })
    .state("profile", {
      url: '/user',
      templateUrl: "/views/user.html",
      controller: "userControl"
    })
    .state("myLocations", {
      url: '/mylocations',
      templateUrl: "/views/mylocations.html",
      controller: "myLocationsControl"
    })
    .state('myReviews', {
      url: "/myreviews",
      templateUrl: "/views/myreviews.html",
      controller: "myReviewsControl"
    })
    .state('wantToTryList', {
      url: "/myWantToTry",
      templateUrl: "/views/wantToTry.html",
      controller: "myWantToTryControl"
    })
    .state('register', {
      url: "/register",
      templateUrl: "/views/register.html",
      controller: "RegisterControl"
    })
    .state("addNewLocation", {
      url: "/addNewLocation",
      templateUrl: "/views/addNewLocation.html",
      controller: "addNewLocationControl"
    })



});
