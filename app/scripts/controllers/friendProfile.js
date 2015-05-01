'use strict';

/**
 * @ngdoc function
 * @name projectsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projectsApp
**/
angular.module('projectsApp')
.controller('FriendProfileCtrl',  function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject, $stateParams , firebaseService, profileService, $state) {
	var param = $stateParams;
	console.log(param.user);
	$scope.username = param.user;

	//query firebase for info
  	var friendFirebaseRef = new Firebase("https://shining-torch-23.firebaseio.com/profileInfo/"+ param.user);

  	// query firebase for posts
  	//$scope.friendProfile = $firebaseObject(friendFirebaseRef);
  	var ref = new Firebase(firebaseService.getFirebBaseURL());
    var auth = $firebaseAuth(ref);

    $scope.authData = auth.$getAuth();
    $scope.userCurrentID = $scope.authData.uid;
  	$scope.userCurrentFirstName;
    $scope.userCurrentLastName;
    $scope.posts = [];

    $scope.loadPosts = function(profileID){  
      ref.child('posts').once('value', function (snapshot) {
        console.log('...fetching posts...');
        // profileID loop
        
        snapshot.forEach(function(profileFire) {
          if(profileFire.exists()){
            if(profileFire.key() === profileID){
              //if(profileFire.exists()){
                // postID loop
                profileFire.forEach(function(postFire){
                  if(postFire.key() !== "ignore"){
                    var post = {sender: postFire.val().senderName, senderID: postFire.val().senderID, text: postFire.val().text, postID: postFire.key(), timestamp: postFire.val().timestamp, comments: []};
                    // commentID loop
                    postFire.forEach(function(commentFire){
                    if(commentFire.val().senderName !== undefined && commentFire.val().text !== undefined){
                        var comment = {sender: commentFire.val().senderName, text: commentFire.val().text, timestamp: commentFire.val().timestamp};
                        post.comments.push(comment);
                      }
                    }) 
                    $scope.posts.push(post);
                  }
                })
              //}
            }
          }
        })
      });
      // store profile information
      ref.child('profileInfo').once('value', function (snapshot){
        snapshot.forEach(function(profileInfoFire){
          if(profileInfoFire.key() === $scope.userCurrentID){
          	console.log("PROFILEID: " + profileInfoFire.key());

            $scope.userCurrentFirstName = profileInfoFire.val().firstName;
            $scope.userCurrentLastName = profileInfoFire.val().lastName;
          }
        })
      });
    };



      $scope.sendPost = function(postText, profileID, firstName, lastName){
      console.log("PostText: " + postText);
      ref.child('posts').once('value', function (snapshot) {
        var pathFire = ref.child(snapshot.key());
        // profileID loop
        snapshot.forEach(function(profileFire){
          if(profileFire.key() === profileID){ // profileID GOES HERE!!
            pathFire = pathFire.child(profileFire.key());
            var d = new Date();
            var time = [d.getMonth()+1,
                       d.getDate(),
                       d.getFullYear()].join('/')+' '+
                      [d.getHours(),
                       d.getMinutes(),
                       d.getSeconds()].join(':');
            // push a post
            var fullName = $scope.userCurrentFirstName + " " + $scope.userCurrentLastName;
            console.log('Pushing a new post to Firebase...');
            pathFire.push({ 'senderID': $scope.userCurrentID, /* CHANGE */
                            'senderName': fullName,
                            'text': postText,
                            'timestamp': time});
            $state.reload();
          }
        })
      });
    };

});
