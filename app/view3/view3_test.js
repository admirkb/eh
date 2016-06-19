'use strict';

var $controller;
var $scope = {};
var fCommon = {};


describe('myApp.view3 module', function () {

  beforeEach(module('myApp.view3'));

  beforeEach(inject(function (_$controller_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));


  it('testing the service', inject(function (fCommon) {

    expect(fCommon).toBeDefined();

  }));







  describe('view3 controller', function () {


    it('tests if arg1 = helloWorld after call to helloWorld', function () {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });

      $scope.helloWorld();
      expect($scope.arg1).toEqual('helloWorld');
    });

    it('tests if rotate method shifts input by 2', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });

      $scope.rotateInput = "1,2,3,4,5,6,7,8,9,10, 11, 12";
      $scope.numericShift = 2;
      $scope.rotateOutput = "";

      var temp = $scope.rotateInput.replace(/\s/g, '');
      var rotateInput = temp.split(',').map(Number);

      var shift = $scope.numericShift;

      $scope.rotateOutput = fCommon.getRotate(rotateInput, shift);

      expect($scope.rotateOutput).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]);

    }));

    it('tests if rotate method shifts input by 4', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });

      $scope.rotateInput = "1,2,3,4,5,6,7,8,9,10, 11, 12";
      $scope.numericShift = 4;
      $scope.rotateOutput = "";

      var temp = $scope.rotateInput.replace(/\s/g, '');
      var rotateInput = temp.split(',').map(Number);
      console.dir(rotateInput)

      var shift = $scope.numericShift;


      $scope.rotateOutput = fCommon.getRotate(rotateInput, shift);

      expect($scope.rotateOutput).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4]);

    }));

    it('tests if rotate method shifts Jade to the end', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });


      $scope.rotateInput = "Jade, Elita, Giselle";
      $scope.numericShift = 1;
      $scope.rotateOutput = "";

      var temp = $scope.rotateInput.replace(/\s/g, '');
      var rotateInput = temp.split(',').map(function (n) {

        return n.replace("\"", null);
      });

      var shift = $scope.numericShift;

      $scope.rotateOutput = fCommon.getRotate(rotateInput, shift);

      expect($scope.rotateOutput).toEqual(['Elita', 'Giselle', 'Jade']);

    }));

    it('tests removal of duplicate number in an array', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });


      $scope.deDupIn = "1, 3, 7, 7, 8, 9, 9, 9, 10, 11,11,12,11";
      $scope.deDupOut = "";

      var temp = $scope.deDupIn.replace(/\s/g, '');
      var deDupIn = temp.split(',').map(Number);

      var res = fCommon.getDeDuplicate(deDupIn);

      $scope.deDupOut = res;

      expect($scope.deDupOut).toEqual([1, 3, 7, 8, 9, 10, 11, 12]);

    }));

    it('tests getLeastCommonMultiple by range of integers', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });

      $scope.leastCommonMultipleMin = 1;
      $scope.leastCommonMultipleMax = 13;
      $scope.leastCommonMultipleMaxOutput = "";

      var res = fCommon.getLeastCommonMultiple($scope.leastCommonMultipleMin, $scope.leastCommonMultipleMax);
      $scope.leastCommonMultipleMaxOutput = res;


      expect($scope.leastCommonMultipleMaxOutput).toEqual(360360);

    }));

    it('tests getLeastCommonMultipleByArray with array of integers', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });

      $scope.leastCommonMultipleArray = "3,4,7";
      $scope.leastCommonMultipleArrayOutput = "";

      var temp = $scope.leastCommonMultipleArray.replace(/\s/g, '');
      var leastCommonMultipleArray = temp.split(',');

      var res = fCommon.getLeastCommonMultipleByArray(leastCommonMultipleArray);

      $scope.leastCommonMultipleArrayOutput = res;


      expect($scope.leastCommonMultipleArrayOutput).toEqual(84);

    }));

    it('tests find_char_NN with order = n*n', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });

      $scope.findCharsNNInput1 = "Luton";
      $scope.findCharsNNInput2 = "Wimbledon";
      $scope.findCharsNNOutput = "";

      var findCharsNNInput1 = $scope.findCharsNNInput1.replace(/\s/g, '');
      var findCharsNNInput2 = $scope.findCharsNNInput2.replace(/\s/g, '');


      var res = fCommon.find_char_NN(findCharsNNInput1, findCharsNNInput2);

      $scope.findCharsNNOutput = res;


      expect($scope.findCharsNNOutput).toEqual('on');

    }));

    it('tests find_char_N with order = n', inject(function (fCommon) {

      var controller = $controller('View3Ctrl', { $scope: $scope, fCommon: fCommon });

      $scope.findCharsNInput1 = "Luton";
      $scope.findCharsNInput2 = "Liverpool";
      $scope.findCharsNOutput = "";

      var findCharsNInput1 = $scope.findCharsNInput1.replace(/\s/g, '');
      var findCharsNInput2 = $scope.findCharsNInput2.replace(/\s/g, '');

      var res = fCommon.find_char_N(findCharsNInput1, findCharsNInput2);

      $scope.findCharsNOutput = res;

      expect($scope.findCharsNOutput).toEqual('Lo');

    }));

  });
});