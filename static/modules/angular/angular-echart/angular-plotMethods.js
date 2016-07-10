/**
 * Created by lufax on 8/3/15.
 */



(function(window, angular, undefined) {'use strict';
    var toasterd={"closeButton": true,
    "debug": false,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"};

    var loadingEffert='spin';
    var loadingText='加载中，请稍候';

    angular.module('chartModule',[]).
        factory('ChartSrv',['$http','$rootScope','$interval', function($http,$rootScope, $interval){
            function single_callback(chartdom,chartType,chartPara,url,response){
                if(!arguments[3]) url = "/firefly/alarm/inter";
                console.log('into plotChartsSingleWithResponseNew,',chartdom,chartType,chartPara)
                require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
                require([
                    'echarts',
                    'echarts/theme/infographic',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/gauge',
                    'echarts/chart/funnel',
                    'echarts/chart/pie',
                    'echarts/chart/scatter',
                    'echarts/chart/chord',
                    'echarts/chart/force'
                    ],
                    function (ec,theme) {
                        var myChart = ec.init(document.getElementById(chartdom),theme);
                        var ecConfig = require('echarts/config');
                        myChart.on(ecConfig.EVENT.DBLCLICK, response);
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
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
                                    toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                                    toastr.options = toasterd
                                };
                            },
                            error:function(){
                                myChart.hideLoading()
                                toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                                toastr.options = toasterd
                            }
                        })
                    }
                );
            }
            function single_chart(chartdom,chartType,chartPara,url){
                if(!arguments[3]) url = "/firefly/alarm/inter";
                console.log('into plotChartsSingleWithResponseNew,',chartdom,chartType,chartPara)
                require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
                require([
                    'echarts',
                    'echarts/theme/infographic',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/gauge',
                    'echarts/chart/funnel',
                    'echarts/chart/pie',
                    'echarts/chart/scatter',
                    'echarts/chart/chord',
                    'echarts/chart/force'
                    ],
                    function (ec,theme) {
                        var myChart = ec.init(document.getElementById(chartdom),theme);
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
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
                                    toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                                    toastr.options = toasterd
                                };
                            },
                            error:function(){
                                myChart.hideLoading()
                                toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                                toastr.options = toasterd
                            }
                        })
                    }
                );
            }
            function single_chart_json(dom, chart_type, chart_para, url){
                if(!arguments[3]) url = "/firefly/alarm/inter.json";
                console.log('into single_chart_json,',dom,chart_type,chart_para)
                require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
                require([
                    'echarts',
                    'echarts/theme/infographic',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/gauge',
                    'echarts/chart/funnel',
                    'echarts/chart/pie',
                    'echarts/chart/scatter',
                    'echarts/chart/chord',
                    'echarts/chart/force'
                    ],
                    function (ec,theme) {
                        var myChart = ec.init(document.getElementById(dom),theme);
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        $http({
                            method: 'POST',
                            url: url,
                            data: JSON.stringify({
                                inter: chart_type,
                                params: chart_para
                            }),
                            headers: {'Content-Type': 'application/json; charset=UTF-8'}
                            }).success(function(data, status, headers, config){
                                myChart.hideLoading()
                                if (data.resCode == 200){
                                    console.log('success call')
                                    myChart.setOption(data.data);
                                }else{
                                    console.log('fail call', data.mess)
                                }
                            }).error(function(data, status, headers, config){
                                myChart.hideLoading()
                                console.log('fail call', status)
                            });
                    }
                );
            }

            function single_chart_append_json(dom, chart_type, chart_para, time_itv){
                console.log('into single_chart_append_json',dom, chart_type, chart_para)
                require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
                require([
                    'echarts',
                    'echarts/theme/infographic',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/gauge',
                    'echarts/chart/funnel',
                    'echarts/chart/pie',
                    'echarts/chart/scatter',
                    'echarts/chart/chord',
                    'echarts/chart/force'
                    ],
                    function (ec,theme) {
                        var myChart = ec.init(document.getElementById(dom),theme);
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
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
                                                console.log('fail call', data);
                                            }
                                        }).error(function(data, status, headers, config){
                                            myChart.hideLoading();
                                            console.log('fail call', status);
                                        });
                                    }, time_itv)
                                }else{
                                    console.log('fail call', data.mess);
                                }
                            }).error(function(data, status, headers, config){
                                myChart.hideLoading();
                                console.log('fail call', status);
                            });
                    }
                );
            }

            return {
                single_callback:single_callback,
                single_chart:single_chart,
                single_chart_json:single_chart_json,
                single_chart_append_json:single_chart_append_json
            }
        }
    ]);

})(window, window.angular);


