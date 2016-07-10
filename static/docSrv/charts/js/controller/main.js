/**
 * Created by hanyong336 on 16/7/8.
 */


appModule.controller('mainCtrl', ['$scope', '$timeout','$window', '$interval', 'ChartSrv','$location', '$compile',
    function($scope, $timeout,$window, $interval, ChartSrv, $location, $compile){
        console.log('init');
        $scope.params = {source: 'undefined', file: '', chart: 'line', category: '1', plot: '2'};

        $scope.init = function(){
            if ($location.search().source != ''){
                $scope.params.source = $location.search().source
            }
            if ($location.search().file != ''){
                $scope.params.file = $location.search().file
            }
            if ($location.search().chart != ''){
                $scope.params.chart = $location.search().chart
            }

            if ($location.search().category != ''){
                $scope.params.category = $location.search().category
            }

            if ($location.search().plot != ''){
                $scope.params.plot = $location.search().plot
            }

            if ($scope.params.chart == 'line'){
                console.log('week report summary lines');
                var ele = $compile('<div id="chart" chart_line style="width: 800px;height: 360px;" ' +
                    'file="params.file" source="params.source" category="params.category" draw="params.plot"></div>')($scope);
                $("#container").append(ele)
            }else if ($scope.params.chart == 'stack'){
                console.log('week report summary stack');
                var ele = $compile('<div id="chart" chart_stack style="width: 800px;height: 360px;" ' +
                    'file="params.file" source="params.source" category="params.category" draw="params.plot"></div>')($scope);
                $("#container").append(ele)
            }else if ($scope.params.chart == 'bar'){
                console.log('week report summary bar');
                var ele = $compile('<div id="chart" chart_bar style="width: 800px;height: 360px;" ' +
                    'file="params.file" source="params.source" category="params.category" draw="params.plot"></div>')($scope);
                $("#container").append(ele)
            }else if ($scope.params.chart == 'area'){
                console.log('week report summary bar');
                var ele = $compile('<div id="chart" chart_area style="width: 800px;height: 360px;" ' +
                    'file="params.file" source="params.source" category="params.category" draw="params.plot"></div>')($scope);
                $("#container").append(ele)
            }


        };

        $scope.init();
    }
]);
