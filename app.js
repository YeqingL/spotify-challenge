var app = angular.module("myApp", []);

var ctrl = app.controller("myCtrl", function($scope, $http) {
    $scope.selectedType = $("#select").val();
    $scope.keyword = $('input').val();
    $scope.audioObject = {};
    $scope.dataInfo = false;
    $scope.displayInfo = 'hide';

    // Respond to the dropdown menu
    $("#select").change(function() {
        $scope.selectedType = $(this).val();
    });

    // Fetch data from Spotify API
    $scope.getData = function() {
        $http.get("https://api.spotify.com/v1/search?type=" + $scope.selectedType + "&query=" + $scope.keyword)
             .success(function(response) {
                if ($scope.selectedType == "album" && response.albums.items.length > 0) {
                    data = $scope.currentType = [response.albums.items[0],response.albums.items[1],response.albums.items[2]];
                } else if ($scope.selectedType == "artist") {
                    data = $scope.currentType = response.artists.items;
                } else if ($scope.selectedType == "playlist") {
                    data = $scope.currentType = response.playlists.items;
                } else if ($scope.selectedType == "track") {
                    data = $scope.currentType = response.tracks.items;
                } else {
                    $scope.currentType = [];
                }
             });
    };

    // Control the display of information of search results
    $scope.toggle = function() {
        $scope.dataInfo = !$scope.dataInfo;
        if (!$scope.dataInfo) {
            $scope.displayInfo = 'show';
        } else {
            $scope.displayInfo = 'hide';
        }
    };

    // Play the track when clicked
    $scope.play = function(song) {
        if($scope.currentSong == song) {
            $scope.audioObject.pause();
            $scope.currentSong = false;
            return;
        } else {
            if($scope.audioObject.pause != undefined) $scope.audioObject.pause();
            $scope.audioObject = new Audio(song);
            $scope.audioObject.play();  
            $scope.currentSong = song;
        }
    };
});

$('body').tooltip({
    selector: '[title]'
});