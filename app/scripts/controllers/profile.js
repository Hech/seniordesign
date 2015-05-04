'use strict';

angular.module('projectsApp')
  .controller('ProfileCtrl',
    function ($scope, $stateParams, firebaseService, userService, $firebaseAuth, $state, $firebaseArray, $firebaseObject) {
      var ref = new Firebase(firebaseService.getFirebBaseURL());
      var authObj = $firebaseAuth(ref);
      var authData = authObj.$getAuth();
      console.log("Logged in as:" +  authData.uid);

      //get all parameters passed into this controller
      var param = $stateParams;
      // this profile's uid
      var profileUID = param.user;

      //get user profile Data
      var profileDataRef = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ profileUID);
      $scope.profileData = $firebaseObject(profileDataRef);

      //postData returns a list of post
      var profilePostRef = new Firebase("https://shining-torch-23.firebaseio.com/posts/"+ profileUID);
      $scope.postData = $firebaseArray(profilePostRef);
      console.log("Post data" + $scope.postData);

      //timestamp
      var getTime = function() {
        var date = new Date();
        return [date.getMonth()+1,
                  date.getDate(),
                  date.getFullYear()].join('/')+' '+
                  [date.getHours(),
                  date.getMinutes(),
                  date.getSeconds(),
                  date.getMilliseconds()].join(':');
      }

      //add a new post
      $scope.addTextPost = function(message) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: "text",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      };

      //add an image post
      $scope.addImagePost = function(message) {
        var time = getTime();
        $scope.postData.$add({
          senderID: authData.uid,
          messageType: "image",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      };


      //Add a comment to a post, pass in postID
      $scope.addComment = function(postID, message) {
        var time = getTime();
        var profilePostRef = new Firebase("https://shining-torch-23.firebaseio.com/posts/"+ authData.uid + "/" +  postID + "/comments/");
        $scope.postComment = $firebaseArray(profilePostRef);
        $scope.postComment.$add({
          senderID: authData.uid,
          messageType: "text",
          postDate: time,
          timeStamp: Firebase.ServerValue.TIMESTAMP,
          message: message
        });
      }

      //returns a boolean if the current profile page bellongs to the user
      $scope.profileOwner = function() {
        return authData == profileUID;
      }
});
