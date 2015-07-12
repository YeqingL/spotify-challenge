var app = angular.module("myApp", []);

var ctrl = app.controller("myCtrl", function($scope, $http) {
    $scope.selectedType = $("#select").val();
    $scope.keyword = $('input').val();
    $scope.audioObject = {};
    $scope.dataInfo = false;
    $scope.displayInfo = 'show';

    // Respond to the dropdown menu
    $("#select").change(function() {
        $scope.selectedType = $(this).val();
    });

    // Fetch data from Spotify API
    $scope.getData = function() {
        $http.get("https://api.spotify.com/v1/search?type=" + $scope.selectedType + "&query=" + $scope.keyword)
             .success(function(response) {
                if ($scope.selectedType == "album" && response.albums.items.length > 0) {
                    $scope.currentType = [];
                    var index = 0;
                    for (var i = 0; i < response.albums.items.length; i++) {
                        $scope.albumObject = {};
                        $scope.albumObject.album = response.albums.items[i];
                        $scope.currentType.push($scope.albumObject);                  
                        $http.get("https://api.spotify.com/v1/albums/" + response.albums.items[i].id + "/tracks")
                             .success(function(data) {
                            $scope.currentType[index].tracks = data.items;
                            index++;
                        });
                    }
                } else if ($scope.selectedType == "artist") {
                    $scope.currentType = response.artists.items;
                } else if ($scope.selectedType == "playlist") {
                    $scope.currentType = response.playlists.items;
                } else if ($scope.selectedType == "track") {
                    $scope.currentType = response.tracks.items;
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