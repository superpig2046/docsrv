/**
 * Created by lufax on 4/17/15.
 */

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
    "hideMethod": "fadeOut"}

var alarmtoa={"closeButton": true,
    "debug": false,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "55000",
    "extendedTimeOut": "1000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "show",
    "hideMethod": "fadeOut"}

var loadingEffert='spin'
var loadingText='加载中，请稍候'

function showAlarm(dom,entityname){
    $.ajax({
        url:"/firefly/alarm/alarm",
        type:"POST",
        data:{
            'alarmEntity':entityname
            },
        timeout:10000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            if (dataJson['resCode']=='000'){
                if (dataJson['data']['alarm']==0){}else{
                    toastr['error'](dataJson['data']['message'], dataJson['data']['title']);
                    toastr.options = alarmtoa;
                    $("#"+dom).parents(".well").css('background-color','rgba(189, 54, 47,0.6)');
                }
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd;
            };
        },
        error:function(){
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd;
        }
    });

}


function plotCharts_Reset(chartdom,chartType,timeouttime,chartPara){
    console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
    clearInterval(chartInterDict[chartdom])
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
            myChart.showLoading({
                text: loadingText,
                effect:loadingEffert,
                textStyle : {fontSize : 20}
            });
            $.ajax({
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    myChart.hideLoading()
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        myChart.setOption(dataJson['Data']);
                    }else{
                        toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    };
                    chartInterDict[chartdom]=setInterval(function(){
                        console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        $.ajax({
                            url:"/firefly/alarm/inter",
                            type:"POST",
                            data:{
                                'chartType':chartType,
                                'chartPara':chartPara
                            },
                            timeout:60000,
                            success:function(data){
                                myChart.hideLoading()
                                var dataJson=$.parseJSON(data)
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
                        });
                    },timeouttime);
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


function plotCharts_ResetWithResponse(chartdom,chartType,timeouttime,chartPara,response){
    console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
    clearInterval(chartInterDict[chartdom])
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
            var ecConfig = require('echarts/config');
            myChart.on(ecConfig.EVENT.DBLCLICK, response);
            $.ajax({
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        myChart.setOption(dataJson['Data']);

                    }else{
                        toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    };
                    chartInterDict[chartdom]=setInterval(function(){
                        console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        $.ajax({
                            url:"/firefly/alarm/inter",
                            type:"POST",
                            data:{
                                'chartType':chartType,
                                'chartPara':chartPara
                            },
                            timeout:60000,
                            success:function(data){
                                myChart.hideLoading()
                                var dataJson=$.parseJSON(data)
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
                        });
                    },timeouttime);
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

function plotChartsSingleWithResponse(chartdom,chartType,chartPara,response){
    console.log('into plotCharts,',chartdom,chartType,chartPara)
    clearInterval(chartInterDict[chartdom])
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
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
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



function plotCharts_ResetSup(chartdom,chartType,timeouttime,chartPara){
    console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
    clearInterval(chartInterDict[chartdom])
    require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
    require([
        'echarts',
        'echarts/theme/infographic',
        'echarts/chart/bar',
        'echarts/chart/line',
        'echarts/chart/gauge',
        'echarts/chart/scatter',
        'echarts/chart/chord',
        'echarts/chart/force'
    ],
        function (ec,theme) {
            var myChart = ec.init(document.getElementById(chartdom),theme);
            myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
            $.ajax({
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        myChart.setOption(dataJson['Data'],true);
                    }else{
                        toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    };

                    chartInterDict[chartdom]=setInterval(function(){
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
                        $.ajax({
                            url:"/firefly/alarm/inter",
                            type:"POST",
                            data:{
                                'chartType':chartType+'_sup',
                                'chartPara':chartPara
                            },
                            timeout:60000,
                            success:function(data){
                                myChart.hideLoading()
                                var dataJson=$.parseJSON(data)
                                console.log(dataJson)
                                if (dataJson['resCode']=='000'){
                                    console.log('loading')
                                    myChart.addData(dataJson['Data']);
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
                        });
                    },timeouttime);
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

function plotCharts_ResetSupWithResponse(chartdom,chartType,timeouttime,chartPara,response){
    console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
    clearInterval(chartInterDict[chartdom])
    require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
    require([
        'echarts',
        'echarts/theme/infographic',
        'echarts/chart/bar',
        'echarts/chart/line',
        'echarts/chart/gauge',
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
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        myChart.setOption(dataJson['Data'],true);
                    }else{
                        toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    };

                    chartInterDict[chartdom]=setInterval(function(){
                        console.log('into plotCharts,',chartdom,chartType,timeouttime,chartPara)
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        $.ajax({
                            url:"/firefly/alarm/inter",
                            type:"POST",
                            data:{
                                'chartType':chartType+'_sup',
                                'chartPara':chartPara
                            },
                            timeout:60000,
                            success:function(data){
                                myChart.hideLoading()
                                var dataJson=$.parseJSON(data)
                                console.log(dataJson)
                                if (dataJson['resCode']=='000'){
                                    console.log('loading')
                                    myChart.addData(dataJson['Data']);
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
                        });
                    },timeouttime);
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

function plotChartsSingleWithResponseNew(chartdom,chartType,chartPara,url,response){
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

function plotChartsSingleNew(chartdom,chartType,chartPara,url){
    if(!arguments[3]) url = "/firefly/alarm/inter";
    console.log('into plotCharts,',chartdom,chartType,chartPara,url)
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
                    dataJson=data
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        myChart.setOption(dataJson['Data'],true);
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
            });
        })

}



function plotChartsSingle(chartdom,chartType,chartPara){

    console.log('into plotCharts,',chartdom,chartType,chartPara)

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
                url:'/firefly/alarm/inter',
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        myChart.setOption(dataJson['Data'],true);
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
            });
        })

}


function plotCharts(chartdom,chartType,timouttime,chartPara){
    clearInterval(chartInterDict[chartdom])
    console.log('into plotCharts,',chartdom,chartType,timouttime)
    require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
    require([
        'echarts',
        'echarts/theme/infographic',
        'echarts/chart/bar',
        'echarts/chart/line',
        'echarts/chart/gauge',
        'echarts/chart/scatter',
        'echarts/chart/chord',
        'echarts/chart/force'
    ],
        function (ec,theme) {
            var myChart = ec.init(document.getElementById(chartdom),theme);
            myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
            $.ajax({
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        myChart.setOption(dataJson['Data'],true);
                    }else{
                        toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    };
                    chartInterDict[chartdom]=setInterval(function(){
                        console.log('start loading'+chartType)
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        $.ajax({
                            url:"/firefly/alarm/inter",
                            type:"POST",
                            data:{
                                'chartType':chartType,
                                'chartPara':chartPara
                            },
                            timeout:60000,
                            success:function(data){
                                myChart.hideLoading()
                                var dataJson=$.parseJSON(data)
                                console.log(dataJson)
                                if (dataJson['resCode']=='000'){
                                    console.log('loading')
                                    myChart.setOption(dataJson['Data'],true);
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
                        });
                    },timouttime);
                },
                error:function(){
                    myChart.hideLoading()
                    toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                    toastr.options = toasterd
                }
            });
        })
};





function plotMapChart(chartdom,chartType,timeouttime,chartPara){
    clearInterval(chartInterDict[chartdom]);
    require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
    require([
        'echarts',
        'echarts/theme/infographic',
        'echarts/chart/bar',
        'echarts/chart/line',
        'echarts/chart/map'],
        function (ec,theme) {
            var myChart = ec.init(document.getElementById(chartdom),theme);
            myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
            $.ajax({
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        var localoption=dataJson['Data']
                        localoption['series'][0]['geoCoord']=geoCoordAll
                        localoption['series'][1]['markPoint']['symbolSize']=function (v){return 10 + v/1000}
                        myChart.setOption(localoption,true);
                    }else{
                        toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    };
                    chartInterDict[chartdom]=setInterval(function(){
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        console.log('start loading'+chartType)
                        $.ajax({
                            url:"/firefly/alarm/inter",
                            type:"POST",
                            data:{
                                'chartType':chartType,
                                'chartPara':chartPara
                            },
                            timeout:60000,
                            success:function(data){
                                myChart.hideLoading()
                                var dataJson=$.parseJSON(data)
                                console.log(dataJson)
                                if (dataJson['resCode']=='000'){
                                    console.log('loading')
                                    var localoption=dataJson['Data']
                                    localoption['series'][0]['geoCoord']=geoCoordAll
                                    localoption['series'][1]['markPoint']['symbolSize']=function (v){return 10 + v/1000}
                                    myChart.setOption(localoption,true);
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
                        });
                    },timeouttime);
                },
                error:function(){
                    myChart.hideLoading()
                    toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                    toastr.options = toasterd
                }
            });
        })
};


function plotMapChartSingle(chartdom,chartType,chartPara){
    require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
    require([
        'echarts',
        'echarts/theme/infographic',
        'echarts/chart/map'],
        function (ec,theme) {
            var myChart = ec.init(document.getElementById(chartdom),theme);
            myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
            $.ajax({
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        var localoption=dataJson['Data']
                        localoption['series'][0]['geoCoord']=geoCoordAll
                        localoption['series'][1]['markPoint']['symbolSize']=function (v){return 10 + v/1000}
                        myChart.setOption(localoption,true);
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
            });
        })

};



function plotMapChart_Reset(chartdom,chartType,timeouttime,chartPara){
    clearInterval(chartInterDict[chartdom])
    require.config({paths:{echarts:'/firefly/static/echarts/build/dist'}});
    require([
        'echarts',
        'echarts/theme/infographic',
        'echarts/chart/bar',
        'echarts/chart/line',
        'echarts/chart/map'],
        function (ec,theme) {
            var myChart = ec.init(document.getElementById(chartdom),theme);
            myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
            $.ajax({
                url:"/firefly/alarm/inter",
                type:"POST",
                data:{
                    'chartType':chartType,
                    'chartPara':chartPara
                    },
                timeout:60000,
                success:function(data){
                    myChart.hideLoading()
                    var dataJson=$.parseJSON(data)
                    console.log(dataJson)
                    if (dataJson['resCode']=='000'){
                        console.log('loading')
                        var localoption=dataJson['Data']
                        myChart.setOption(localoption,true);
                    }else{
                        toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    };
                    chartInterDict[chartdom]=setInterval(function(){
                        myChart.showLoading({text: loadingText, effect:loadingEffert,textStyle : {fontSize : 20}});
                        console.log('start loading'+chartType)
                        $.ajax({
                            url:"/firefly/alarm/inter",
                            type:"POST",
                            data:{
                                'chartType':chartType,
                                'chartPara':chartPara
                            },
                            timeout:60000,
                            success:function(data){
                                myChart.hideLoading()
                                var dataJson=$.parseJSON(data)
                                console.log(dataJson)
                                if (dataJson['resCode']=='000'){
                                    console.log('loading')
                                    var localoption=dataJson['Data']
                                    myChart.setOption(localoption,true);
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
                        });
                    },timeouttime);
                },
                error:function(){
                    myChart.hideLoading()
                    toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                    toastr.options = toasterd
                }
            });
        })

};

function plotTips_Reset(chartdom,chartType,timeouttime,chartPara){
    console.log('into plotTips,',chartdom,chartType,timeouttime,chartPara)
    clearInterval(tipInterDict[chartdom])
    $.ajax({
        url:"/firefly/alarm/inter",
        type:"POST",
        data:{
            'chartType':chartType,
            'chartPara':chartPara
        },
        timeout:60000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            if (dataJson['resCode']=='000'){
                console.log('loading')
                $.each(dataJson['Data'],function(n,value){
                    var color=value['styleColor']
                    var data=value['value']
                    var localtip=$("#"+chartdom).parents(".well:first").find(".TipArea").children(".TipData")[n]
                    $(localtip).text(data)
                    $(localtip).css('color',color)

                })
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
            tipInterDict[chartdom]=setInterval(function(){
                console.log('into round plotTips,',chartdom,chartType,timeouttime,chartPara)
                $.ajax({
                    url:"/firefly/alarm/inter",
                    type:"POST",
                    data:{
                        'chartType':chartType,
                        'chartPara':chartPara
                    },
                    timeout:60000,
                    success:function(data){
                        var dataJson=$.parseJSON(data)
                        console.log(dataJson)
                        if (dataJson['resCode']=='000'){
                            console.log('loading')
                            $.each(dataJson['Data'],function(n,value){
                                var color=value['styleColor']
                                var data=value['value']
                                var localtip=$("#"+chartdom).parents(".well:first").find(".TipArea").children(".TipData")[n]
                                $(localtip).text(data)
                                $(localtip).css('color',color)

                            })

                        }else{
                            toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                            toastr.options = toasterd
                        };
                    },
                    error:function(){
                        toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    }
                });
            },timeouttime);
        },
        error:function(){
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    });
}

function plotTipsSingle(chartdom,chartType,chartPara){
    console.log('into plotTips,',chartdom,chartType,chartPara)
    $.ajax({
        url:"/firefly/alarm/inter",
        type:"POST",
        data:{
            'chartType':chartType,
            'chartPara':chartPara
        },
        timeout:60000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            if (dataJson['resCode']=='000'){
                console.log('loading')
                $.each(dataJson['Data'],function(n,value){
                    var color=value['styleColor']
                    var data=value['value']
                    var localtip=$("#"+chartdom).parents(".well:first").find(".TipArea").children(".TipData")[n]
                    $(localtip).text(data)
                    $(localtip).css('color',color)
                })
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
        },
        error:function(){
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    });
}


function addOneAlarmToSideBar(dom,type,content,time){
    var alarmdom_content=$("<div>").addClass("cont-col2")
    $("<div>").addClass("desc").html(content).appendTo(alarmdom_content)
    var alarmdom_type=$("<div>").addClass("cont-col1")
    $("<div>").addClass("label label-sm label-info").append($("<i>").addClass("fa fa-bell")).appendTo(alarmdom_type)
    var alarmdom_time=$("<div>").addClass("col2").append($("<div>").addClass("date").html(time))
    var alarmdom_main=$("<li>").append(
        [
            $("<div>").addClass("col1").append(
                $("<div>").addClass("cont").append([alarmdom_type,alarmdom_content])
            ),
            alarmdom_time
        ]

    )

    dom.append(alarmdom_main)
}

function hoverPopover(title,pageX,pageY,chartType,chartPara){
    var itemdiv=$("<div>").css({'position':"fixed",'top':pageY,'left':pageX}).draggable().appendTo($("body"))
    itemdiv.attr('id','hoverPopover_example')
    itemdiv.append([
        $("<h3>").addClass("popover-title").attr("id","hoverPopover_example_title").text(title),
        $("<div>").addClass("popover-content").attr("id","hoverPopover_example_content").text("数据加载中...")
    ])
    $.ajax({
        url:"/firefly/alarm/inter",
        type:"POST",
        data:{
            'chartType':chartType,//'SecureSpecificIp',
            'chartPara':chartPara//'time='+timeRange+'|ip='+ip
        },
        timeout:60000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            if (dataJson['resCode']=='000'){
                $("#hoverPopover_example_content").html(dataJson['Data']);
                var padheight=itemdiv.height()
                var winHeight=$(window).height()
                if ((pageY+padheight)>=winHeight){
                    itemdiv.css({'top':winHeight-padheight-20})
                }
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
        },
        error:function(){
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    })
}

function plotDataTable_Reset_New(chartdom,tableDefs,chartType,timeouttime,chartPara,url){
    if(!arguments[5]) url = "/firefly/alarm/inter";
    clearInterval(chartInterDict[chartdom])
    $("#"+chartdom).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="'+chartdom+'_example"></table>');
    var charttable=$('#'+chartdom+'_example').DataTable( tableDefs );
    $.ajax({
        url:url,
        type:"POST",
        data:{
            'chartType':chartType,
            'chartPara':chartPara
        },
        timeout:60000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            if (dataJson['resCode']=='000'){
                console.log('loading')
                $.each(dataJson['Data'],function(n,value){
                    charttable.row.add(value).draw();
                    })
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
            chartInterDict[chartdom]=setInterval(function(){
                console.log('start loading'+chartType)
                $.ajax({
                    url:url,
                    type:"POST",
                    data:{
                        'chartType':chartType,
                        'chartPara':chartPara
                    },
                    timeout:60000,
                    success:function(data){
                        var dataJson=$.parseJSON(data)
                        console.log(dataJson)
                        if (dataJson['resCode']=='000'){
                            console.log('loading');
                            charttable.clear();
                            $.each(dataJson['Data'],function(n,value){
                                charttable.row.add(value).draw();
                            })
                        }else{
                            toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                            toastr.options = toasterd
                        };
                    },
                    error:function(){
                        toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    }
                });
                },timeouttime);
            },
        error:function(){
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    });
};

function plotDataTableSingle_New(chartdom,tableDefs,chartType,chartPara,url){
    if(!arguments[4]) url = "/firefly/alarm/inter";
    $("#"+chartdom).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="'+chartdom+'_example"></table>');
    var shade=new tableShade()
    shade.init(chartdom)
    shade.cover()
    var charttable=$('#'+chartdom+'_example').DataTable( tableDefs );
    $.ajax({
        url:url,
        type:"POST",
        data:{
            'chartType':chartType,
            'chartPara':chartPara
        },
        timeout:60000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            shade.clear()
            if (dataJson['resCode']=='000'){
                console.log('loading')
                $.each(dataJson['Data'],function(n,value){
                    charttable.row.add(value).draw();
                    })
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
        },
        error:function(){
            shade.clear()
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    });
};

function plotDataTable_Reset(chartdom,tableDefs,chartType,timeouttime,chartPara){
    clearInterval(chartInterDict[chartdom])
    $("#"+chartdom).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="'+chartdom+'_example"></table>');
    var charttable=$('#'+chartdom+'_example').DataTable( tableDefs );
    $.ajax({
        url:"/firefly/alarm/inter",
        type:"POST",
        data:{
            'chartType':chartType,
            'chartPara':chartPara
        },
        timeout:60000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            if (dataJson['resCode']=='000'){
                console.log('loading')
                $.each(dataJson['Data'],function(n,value){
                    charttable.row.add(value).draw();
                    })
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
            chartInterDict[chartdom]=setInterval(function(){
                console.log('start loading'+chartType)
                $.ajax({
                    url:"/firefly/alarm/inter",
                    type:"POST",
                    data:{
                        'chartType':chartType,
                        'chartPara':chartPara
                    },
                    timeout:60000,
                    success:function(data){
                        var dataJson=$.parseJSON(data)
                        console.log(dataJson)
                        if (dataJson['resCode']=='000'){
                            console.log('loading');
                            charttable.clear();
                            $.each(dataJson['Data'],function(n,value){
                                charttable.row.add(value).draw();
                            })
                        }else{
                            toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                            toastr.options = toasterd
                        };
                    },
                    error:function(){
                        toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
                        toastr.options = toasterd
                    }
                });
                },timeouttime);
            },
        error:function(){
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    });
};

function plotDataTableSingle(chartdom,tableDefs,chartType,chartPara){
    $("#"+chartdom).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="'+chartdom+'_example"></table>');
    var shade=new tableShade()
    shade.init(chartdom)
    shade.cover()
    var charttable=$('#'+chartdom+'_example').DataTable( tableDefs );
    $.ajax({
        url:"/firefly/alarm/inter",
        type:"POST",
        data:{
            'chartType':chartType,
            'chartPara':chartPara
        },
        timeout:60000,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            shade.clear()
            if (dataJson['resCode']=='000'){
                console.log('loading')
                $.each(dataJson['Data'],function(n,value){
                    charttable.row.add(value).draw();
                    })
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
        },
        error:function(){
            shade.clear()
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    });
};

function changeCurrentButton(dom,n,content){
    var buttons=$('#'+dom).parents(".well:first").find(".portletActionButton")[n]
    var htmlcontext=buttons.innerHTML
    if (content.split(';').length >1){
        buttons.innerHTML=htmlcontext.split('</i>')[0]+'</i> 当前:'+content.split(';')[0]+' 等'
    }else{
        buttons.innerHTML=htmlcontext.split('</i>')[0]+'</i> 当前:'+content
    }
}


function tableShade(){
    var shadeInterval=setInterval(function(){},1000000)
    var localdomText
    this.init=function(domText){
        localdomText=domText
    }
    this.cover=function(){
        console.log('tableShade.cover')
        $("#"+localdomText).parents("div:first").append($('<div>').addClass("disabledWell").append($('<div>').addClass("disabledWellContent")))
        clearInterval(shadeInterval)
        var i=0
        shadeInterval=setInterval(function(){
            var textStr="查询中"
            for (var j=0;j<=i;j++){
                textStr+="."
            }
            $(".disabledWellContent").text(textStr)
            i+=1
            if (i > 10){i=0}
        },1000);
    }
    this.clear=function(){
        console.log('tableShade clear')
        clearInterval(shadeInterval)
        console.log($("#"+localdomText).parents("div:first").find(".disabledWell"))
        $("#"+localdomText).parents("div:first").find(".disabledWell").remove()
    }
}

/*
<div class="disabledWell">
                    <div class="disabledWellContent">
                    </div>
                </div>
 */

function generalDataTableSingle(chartdom,tableDefs,url,postData){
    $("#"+chartdom).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="'+chartdom+'_example"></table>');
    var shade=new tableShade()
    shade.init(chartdom)
    shade.cover()
    var charttable=$('#'+chartdom+'_example').DataTable( tableDefs );
    $.ajax({
        url:url,
        type:"POST",
        data:postData,
        timeout:60000*5,
        success:function(data){
            var dataJson=$.parseJSON(data)
            console.log(dataJson)
            shade.clear()
            if (dataJson['resCode']=='000'){
                console.log('loading')
                $.each(dataJson['Data'],function(n,value){
                    charttable.row.add(value).draw();
                    })
            }else{
                toastr['warning']("当前操作不可操作，错误代码："+dataJson['Data']+"。\n请联系系统管理员咨询一下哟。", "出错啦！");
                toastr.options = toasterd
            };
        },
        error:function(){
            shade.clear()
            toastr['warning']("服务响应异常，网站内部问题。\n请联系系统管理员咨询一下哟。", "出错啦！");
            toastr.options = toasterd
        }
    });
};