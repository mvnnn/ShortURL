var app=angular.module("Acont",[]);

app.directive("ssc",function(){
  return{
    restrict:'A',
    controller:function($scope,$http){
      $scope.long_url='';
      $scope.short_url='';

      // $scope.open=function(short_url){
      //   $http.post('/bbb',{'short_url':short_url})
      //   .error(function(data){
      //     console.log("something is wrong");
      //   });
      // }

      $scope.short=function(long_url){
        console.log(long_url);
        if($scope.form.isvalid){
          $scope.form.$setPristine();
          $scope.form.setValidity("invalid url", false);
          return;
        }
        $http.post('/aaa',{'long_url':long_url})
        .success(function(data){
          $scope.short_url=data["short_url"];
          console.log($scope.short_url);
          $scope.long_url = long_url;
          $scope.form.$setPristine();
        })
        .error(function(data){
          console.log("something is wrong");
        });
      };
    },
    link: function (scope, elem, attrs) {
            elem.bind("click", function () {
                scope.$apply(scope.short(scope.long_url));
            });
        }
  };
});
