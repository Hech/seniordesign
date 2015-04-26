'use strict';

/**
 * @ngdoc service
 * @name projectsApp.userService
 * @description
 * # userService
 * Service in the projectsApp.
 */
// AngularJS will instantiate a singleton by calling "new" on this function
angular.module('projectsApp')
  .factory('userService', function (firebaseService) {
    var user;
    return {
      setCurrentUser: function(val) {
        user = val;
      },
      getCurrentUser: function() {
        console.log(user);
        return user;
      },
      updateKey: function(key, value){
        user.key = value;
        return user;
      },
      getUserProvisionSetting: function() {
        console.log(user);
        return user;
      },
      setUserProvisionSetting: function() {
        console.log(user);
        return user;
      }
    };
  })
  .factory('provisionSettings', function ($firebaseAuth, $mdDialog) {
  	var firebaseURL = 'https://shining-torch-23.firebaseio.com/';
    var ref = new Firebase(firebaseURL);
    var authObj = $firebaseAuth(ref);
    var authData = authObj.$getAuth();


   var loginFB = function() {
        ref.authWithOAuthPopup('facebook', function(error, authData) {
          if (error) {
            console.log('Login Failed!', error);
          } else {

            console.log("Authenticated successfully with payload:", authData);


           Facebook.api('/me', function(response) {
              $scope.user = response;
              console.log("FirstName: " + response.first_name + 
                " LastName: " + response.last_name + 
                " Gender: " + response.gender + 
                " Birthday: " + response.birthday + 
                " SchoolName: " + response.education[1].school.name + 
                " Concentration: " + response.education[1].concentration[0].name + 
                " Year: " + response.education[1].year.name + 
                " FavoriteTeam: " + response.favorite_teams[0].name);

               var userInfo = {
                  firstName: response.first_name,
                  lastName: response.last_name,
                  birthday: response.birthday,
                  schoolName: response.education[1].school.name,
                  concentration: response.education[1].concentration[0].name,
                  schoolYear: response.education[1].year.name,
                  favoriteTeam: response.favorite_teams[0].name,
                  gender: response.gender,
               };

            });
            return userInfo;

            changeLocation('/home', true);
          }
        }, {
            scope: "user_likes,email,user_birthday,public_profile,user_education_history,user_about_me" // permission requests
          });
      };



    var saveMoreSettings = function(user, imageSrc) {
      console.log('saving more info...');
      if(user !== undefined){
        console.log(user);  
        // update the user with additional info that was submitted  
        if(user.birthday !== undefined){
          ref.child('users').child(authData.uid).update({
            birthday: user.birthday
          });
        }

        if(user.school !== undefined){
          ref.child('users').child(authData.uid).update({
            school: user.school
          });
        }

        if(user.movies !== undefined){
          ref.child('users').child(authData.uid).update({
            movies: user.movies
          });
        }

        if(user.music !== undefined){
          ref.child('users').child(authData.uid).update({
            music: user.music
          });
        }
      }

      if(imageSrc !== undefined){
          ref.child('users').child(authData.uid).update({
            profilePic: imageSrc
          });
      }
    };

    function readImage(input) {
        if ( input.files && input.files[0] ) {
            var FR= new FileReader();
            FR.onload = function(e) {
                 $('#img').attr( "src", e.target.result );
                 $('#base').text( e.target.result );
            };       
            FR.readAsDataURL( input.files[0] );
        }
    }

    var setUserProvision = function() {
      var provisionedData = ref.child('users').child(authData.uid);
      provisionedData.update({
        provisioned: 1
      });
    };

    function MoreInfoController($scope, $mdDialog, fileReader) {
      $scope.save = function(user, imageSrc) {
        $mdDialog.hide();
        setUserProvision();
        saveMoreSettings(user, imageSrc);
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.getFile = function (file) {
      $scope.progress = 0;
      fileReader.readAsDataUrl(file, $scope)
                    .then(function(result) {
                        $scope.imageSrc = result;
                    });
      };
   
      $scope.$on("fileProgress", function(e, progress) {
          $scope.progress = progress.loaded / progress.total;
      });
    }

    var showAboutForm = function() {
        $mdDialog.show({
          controller: MoreInfoController,
          templateUrl: 'views/about.tmpl.html'
        })
          .then(function(input){
            //Confirmed, pass input
            console.log('confirming...');
          }, function(){
            //Cancelled, do nothing
            console.log('canceling...');
          });
    };

    return {
      getMoreUserInfo: function(provision) {
        if (provision == '0') {
          showAboutForm();
        }
      },
      getUserProvision: function(callback) {
        var provisionedData = ref.child('users').child(authData.uid).child('provisioned').once('value', function (snapshot) {
          var val = snapshot.val();
          callback(val);
          return val;
        });
      },
      setUserProvision: function() {
        var provisionedData = ref.child('users').child(authData.uid);
        provisionedData.update({
          provisioned: 1
        });
      }
    };
  });
