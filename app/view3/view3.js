'use strict';

angular.module('myApp.view3', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view3', {
      templateUrl: 'view3/view3.html',
      controller: 'View3Ctrl'
    });
  }])

  .controller('View3Ctrl', View3Ctrl);


View3Ctrl.$inject = ['$scope', 'fCommon'];
function View3Ctrl($scope, fCommon) {

  $scope.deDupIn = "1, 3, 7, 7, 8, 9, 9, 9, 10, 11,11,12,11";
  $scope.deDupOut = "";

  $scope.rotateInput = "1,2,3,4,5,6,7,8,9,10, 11, 12";
  $scope.numericShift = 2;
  $scope.rotateOutput = "";

  $scope.leastCommonMultipleMin = 3;
  $scope.leastCommonMultipleMax = 4;
  $scope.leastCommonMultipleMaxOutput = "";

  $scope.leastCommonMultipleArray = "3,4,7";
  $scope.leastCommonMultipleArrayOutput = "";

  $scope.findCharsNNInput1 = "Luton";
  $scope.findCharsNNInput2 = "Wimbledon";
  $scope.findCharsNNOutput = "";

  $scope.findCharsNInput1 = "Luton";
  $scope.findCharsNInput2 = "Liverpool";
  $scope.findCharsNOutput = "";

  activate();

  function activate() {

    console.log("Start: activate")

    // New record needs unique id

    //var res = fCommon.getDeDuplicate([1, 3, 7, 7, 8, 9, 9, 9, 10, 11,11,12,11]);
    //alert(res)

    //var res = fCommon.getRotate([1,2,3,4,5,6,7,8,9,10], 2);
    //alert(res)

    //var res = fCommon.getLeastCommonMultiple(1,5);
    //alert(res)



    //var res = fCommon.find_char_NN("Start", "Finish");
    //alert(res)

    console.log("End: activate")

  }

  $scope.helloWorld = function () {

    $scope.arg1 = "helloWorld";
  }
  $scope.deDupPlicate = function () {
    //$scope.deDupIn = "1, 3, 7, 7, 8, 9, 9, 9, 10, 11, 11, 12, 11";
    // Remove spaces from input
    var temp = $scope.deDupIn.replace(/\s/g, '');
    var deDupIn = temp.split(',');

    var res = fCommon.getDeDuplicate(deDupIn);

    $scope.deDupOut = res;


  }

  $scope.rotate = function () {

    // Remove spaces from input

    var temp = $scope.rotateInput.replace(/\s/g, '');
    var rotateInput = temp.split(',');

    var shift = $scope.numericShift;

    var res = fCommon.getRotate(rotateInput, shift);

    $scope.rotateOutput = res;

    console.dir(rotateInput)
    console.dir(shift)

  }
  $scope.leastCommonMultiple = function () {

    var res = fCommon.getLeastCommonMultiple($scope.leastCommonMultipleMin, $scope.leastCommonMultipleMax);
    $scope.leastCommonMultipleMaxOutput = res;

  }
  $scope.leastCommonMultipleByArray = function () {

    // Remove spaces from input
    var temp = $scope.leastCommonMultipleArray.replace(/\s/g, '');
    var leastCommonMultipleArray = temp.split(',');

    var res = fCommon.getLeastCommonMultipleByArray(leastCommonMultipleArray);

    $scope.leastCommonMultipleArrayOutput = res;

  }

  $scope.findCharsNN = function () {

    // Remove spaces from input
    var findCharsNNInput1 = $scope.findCharsNNInput1.replace(/\s/g, '');
    var findCharsNNInput2 = $scope.findCharsNNInput2.replace(/\s/g, '');


    var res = fCommon.find_char_NN(findCharsNNInput1, findCharsNNInput2);

    $scope.findCharsNNOutput = res;

  }

  $scope.findCharsN = function () {
    var findCharsNInput1 = $scope.findCharsNInput1.replace(/\s/g, '');
    var findCharsNInput2 = $scope.findCharsNInput2.replace(/\s/g, '');


    var res = fCommon.find_char_N(findCharsNInput1, findCharsNInput2);

    $scope.findCharsNOutput = res;


  }
}


