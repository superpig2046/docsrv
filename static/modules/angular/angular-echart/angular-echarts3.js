/**
 * Created by hanyong336 on 16/3/3.
 */

(function(window, angular, undefined) {'use strict';
    var loadingEffert='spin';
    var loadingText='加载中，请稍候';

    angular.module('chartModule',[]).
        factory('ChartSrv', ['$http', '$rootScope', '$interval','$q',
        function($http, $rootScope, $interval,$q){
            function offline_chart(chartdom, option){
                console.log('offline_chart');
                var myChart = echarts.init(document.getElementById(chartdom),'infographic');
                myChart.setOption(option);
            }

            function single_callback(chartdom,chart_type,chart_para,response){
                var myChart = echarts.init(document.getElementById(chartdom),'infographic');
                myChart.on('dblclick', response);
                myChart.showLoading('default', {text: loadingText, color: '#fff', textColor: '#fff', maskColor: 'rgba(0,0,0,0.8)', textSize: 20});
                $http({
                    method: 'POST',
                    url: "/firefly/chart/chart.opt.json",
                    data: JSON.stringify({
                        inter: chart_type,
                        params: chart_para
                    }),
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                }).success(function(data, status, headers, config){
                    myChart.hideLoading();
                    if (data.resCode == 200){
                        console.log('success call')
                        myChart.setOption(data.data);
                    }else{
                        //growlService.growl("当前操作不可操作，错误代码："+data.mess+"。\n请联系系统管理员咨询一下哟。", 'warning');
                    }
                }).error(function(data, status, headers, config){
                    myChart.hideLoading()
                    //growlService.growl("当前操作不可操作，错误代码：服务器不可用:"+status+"。\n请联系系统管理员咨询一下哟。", 'warning');
                });
            }
            function single_chart(chartdom,chartType,chartPara,url){
                if(!arguments[3]) url = "/firefly/alarm/inter";
                var myChart = echarts.init(document.getElementById(chartdom),'infographic');
                myChart.showLoading('default', {text: loadingText, color: '#fff', textColor: '#fff', maskColor: 'rgba(0,0,0,0.8)', textSize: 20});
                $.ajax({
                    url:url,
                    type:"POST",
                    dataType:"json",
                    data:{
                        'chartType':chartType,
                        'chartPara':chartPara
                    },
                    timeout:60000,
                    success:function(data){
                        myChart.hideLoading()
                        //var dataJson=$.parseJSON(data)
                        var dataJson=data
                        console.log(dataJson)
                        if (dataJson['resCode']=='000'){
                            console.log('loading')
                            myChart.setOption(dataJson['Data']);
                        }else{
                            //growlService.growl("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", 'warning');
                        };
                    },
                    error:function(){
                        myChart.hideLoading()
                        //growlService.growl("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", 'warning');
                    }
                })
            }
            function single_chart_json(dom, chart_type, chart_para, url){
                if(!arguments[3]) url = "/firefly/chart/chart.opt.json";
                console.log('into single_chart_json echart-3,',dom,chart_type,chart_para)
                var myChart = echarts.init(document.getElementById(dom),'infographic');
                console.log('chart instance',myChart);
                myChart.showLoading('default', {text: loadingText, color: '#fff', textColor: '#fff', maskColor: 'rgba(0,0,0,0.8)', textSize: 20});

                $http({
                    method: 'POST',
                    url: "/firefly/chart/chart.opt.json",
                    data: JSON.stringify({
                        inter: chart_type,
                        params: chart_para
                    }),
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                }).success(function(data, status, headers, config){
                    myChart.hideLoading();
                    if (data.resCode == 200){
                        console.log('success call');
                        myChart.setOption(data.data);
                    }else{
                        //growlService.growl("当前操作不可操作，错误代码："+data.mess+"。\n请联系系统管理员咨询一下哟。", 'warning');
                    }
                }).error(function(data, status, headers, config){
                    myChart.hideLoading();
                    //growlService.growl("当前操作不可操作，错误代码：服务器不可用:"+status+"。\n请联系系统管理员咨询一下哟。", 'warning');
                });
            }
            function single_chart_json_response(dom, chart_type, chart_para, url){
                if(!arguments[3]) url = "/firefly/chart/chart.opt.json";
                console.log('into single_chart_json_response echart-3,',dom,chart_type,chart_para);
                var myChart = echarts.init(document.getElementById(dom),'infographic');
                console.log('chart instance',myChart);
                myChart.showLoading('default', {text: loadingText, color: '#fff', textColor: '#fff', maskColor: 'rgba(0,0,0,0.8)', textSize: 20});

                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: "/firefly/chart/chart.opt.json",
                    data: JSON.stringify({
                        inter: chart_type,
                        params: chart_para
                    }),
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                }).success(function(data, status, headers, config){
                    myChart.hideLoading();
                    if (data.resCode == 200){
                        console.log('success call');
                        myChart.setOption(data.data);
                    }else{
                        //growlService.growl("当前操作不可操作，错误代码："+data.mess+"。\n请联系系统管理员咨询一下哟。", 'warning');
                    }
                    deferred.resolve(data)
                }).error(function(data, status, headers, config){
                    myChart.hideLoading();
                    //growlService.growl("当前操作不可操作，错误代码：服务器不可用:"+status+"。\n请联系系统管理员咨询一下哟。", 'warning');

                });
                return deferred.promise
            }

            function single_chart_append_json(dom, chart_type, chart_para, time_itv){
                console.log('into single_chart_append_json',dom, chart_type, chart_para)
                var myChart = echarts.init(document.getElementById(dom),'infographic');
                myChart.showLoading('default', {text: loadingText, color: '#fff', textColor: '#fff', maskColor: 'rgba(0,0,0,0.8)', textSize: 20});
                $http({
                    method: 'POST',
                    url: '/firefly/alarm/inter.json',
                    data: JSON.stringify({
                        inter: chart_type,
                        params: chart_para
                    }),
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                }).success(function(data, status, headers, config){
                    myChart.hideLoading();
                    if (data.resCode == 200){
                        console.log('success call');
                        myChart.setOption(data.data);
                        /** sup */
                        $interval(function(){
                            myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                            $http({
                                method: 'POST',
                                url: '/firefly/alarm/inter.json',
                                data: JSON.stringify({
                                    inter: chart_type + '_sup',
                                    params: chart_para
                                }),
                                headers: {'Content-Type': 'application/json; charset=UTF-8'}
                            }).success(function(data, status, headers,config){
                                myChart.hideLoading();
                                if (data.resCode == 200){
                                    myChart.addData(data.data);
                                }else{
                                    //growlService.growl("当前操作不可操作，错误代码："+data.mess+"。\n请联系系统管理员咨询一下哟。", 'warning');
                                }
                            }).error(function(data, status, headers, config){
                                myChart.hideLoading();
                                //growlService.growl("当前操作不可操作，错误代码：服务器不可用:"+status+"。\n请联系系统管理员咨询一下哟。", 'warning');
                            });
                        }, time_itv)
                    }else{
                        //growlService.growl("当前操作不可操作，错误代码："+data.mess+"。\n请联系系统管理员咨询一下哟。", 'warning');
                    }
                }).error(function(data, status, headers, config){
                    myChart.hideLoading();
                    //growlService.growl("当前操作不可操作，错误代码：服务器不可用:"+status+"。\n请联系系统管理员咨询一下哟。", 'warning');
                });
            }

            return {
                single_callback:single_callback,
                single_chart:single_chart,
                single_chart_json:single_chart_json,
                single_chart_append_json:single_chart_append_json,
                offline_chart:offline_chart,
                single_chart_json_response:single_chart_json_response
            }

    }])
})(window, window.angular);