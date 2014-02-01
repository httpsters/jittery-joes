var jitteryApp = angular.module('jitteryApp', []);

jitteryApp.controller('ReviewListCtrl', function ($scope, $http) {

    $scope.coffees = [
        'After Dinner',
        'CN Tower of Power',
        'Connoisseur Estates',
        'Columbian',
        'Dutch Trader',
        'Fordnation Blend',
        'French Roast',
        'Hawaii Kona',
        'House Blend',
        'Italian Roast',
        'Lionel Roastie',
        'Mocca-Java',
        'Reggae Blend',
        'Ruth Roast',
        'Toronto Blend',
        'Tropic of Coffee',
        'World Tour Blend'
    ];

    // Set our reviews object to be empty by default.
    $scope.reviews = [];

    // JSONP to get the current ratings.
    $http.jsonp('http://jitteryjoes.myplanetfellowship.com/api/ratings.jsonp?callback=JSON_CALLBACK').
    success(function(data, status) {
        $scope.reviews = data;

        $scope.reviews.forEach(function(rev) {
            rev.date = new Date(rev.node_created * 1000);
        });
    });

    // Set our "signupSent" flag to false by default.
    $scope.signupSent = false;

    // Add a newsletter signup.
    $scope.addNewSignup = function () {
        // Get the form data from the scope.
        var user = $scope.user;

        // Prepare the data.
        var nodeData = {
            'type': 'signup',
            'field_user_name': {'und': [{'value': user.name} ]},
            'field_user_email': {'und': [{'value': user.email} ]},
            'field_origin_app': {'und': [{'value': 'httpsters'}]}
        };

        // POST the data and create a node.
        $http({url: 'http://jitteryjoes.myplanetfellowship.com/api/node.json', method: 'POST', data: nodeData}).
        success(function(data, status) {
            // Set our "signupSent" flag.
            $scope.signupSent = true;
        });
    }
});

jitteryApp.controller('CoffeeLoversCtrl', function($scope, $http) {

    // initialize reviews. will get updated with jsonp call
    $scope.reviews = [];
    
    $scope.coffees = [
        'Columbian',
        'Fordnation Blend',
        'Coffee Lover Blend'
    ]

    $http.jsonp('http://jitteryjoes.myplanetfellowship.com/api/ratings.jsonp?callback=JSON_CALLBACK').
    success(function(data, status) {
        $scope.reviews = data;
    });

    // get reviews for a specific blend
    $scope.getReviews = function(blendName) {
        reviews = $scope.reviews;

        filtered = reviews.filter(function(review) {
            return review.item === blendName;
        });

        return filtered;
    };

    $scope.addReview = function(coffee) {
        // initialize review to be empty
        $scope.myReview = {}
        $scope.myReview.item = coffee;
        $('.reviewForm').trigger('openModal');
    };

    $scope.submitReview = function() {
        // Get the form data from the scope.
        var review = $scope.myReview;

        // Prepare the data.
        var nodeData = {
            'type': 'review',
            'field_review_comment': {'und': [{'value': review.comment} ]},
            'field_review_rating': {'und': [{'value': review.rating} ]},
            'field_review_item': {'und': {'value': review.item}},
            'field_origin_app': {'und': [{'value': 'httpsters'}]}
        };

        // POST the data and create a node.
        $http({url: 'http://jitteryjoes.myplanetfellowship.com/api/node.json', method: 'POST', data: nodeData})
        .success(function(data, status) {
            // Setup data object.
            var review = $scope.myReview;
            // Add our app id and date in seconds.
            review.app = 'httpsters';
            var d = new Date();
            review.node_created = (d.getTime() / 1000);

            // Add the review to the reviews array.
            $scope.reviews.unshift (review);

            // Reset form vars.
            $scope.myReview = {};
            console.log('submit success');
        });
    }

});

$('.reviewForm').easyModal();
