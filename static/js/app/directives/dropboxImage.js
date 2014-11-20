angular.module('app')

.directive("dropboxImage", function ($timeout, dropboxChooser) {
    
    var THUMB_SIZE = 75;
    
    function getImdDU(URL, cb) {
        var img = document.createElement('img');
        img.onload = function () {
    		var canvas = document.createElement("canvas");
    		canvas.width = THUMB_SIZE;
    		canvas.height = THUMB_SIZE;
    		var ctx = canvas.getContext("2d");
    		ctx.drawImage(this, 0, 0, THUMB_SIZE, THUMB_SIZE);
    		var du = canvas.toDataURL("image/png");
    		cb( du );
        }
    	img.crossOrigin = 'anonymous';
    	img.src = URL;
    }
    
    return {
        restrict: 'E',
        templateUrl: '/html/partials/dropboxImage.html',
        scope: {
            src: "=",
            title: '@'
        },
        link: function (scope, element, attributes) {
            scope.chooseImage = function () {
                dropboxChooser({
                    linkType: 'direct',
                    multiselect: false,
                    extensions: ['.png', '.jpg', '.jpeg', '.bmp']
                }).then(function(files) {
                    var thumbUrl = files[0].thumbnailLink;
                    getImdDU(thumbUrl, function (dataUrl) {
                        scope.$apply(function() {
                            scope.src = dataUrl;    
                        });
                    });
                });
            }
        }
    }
});