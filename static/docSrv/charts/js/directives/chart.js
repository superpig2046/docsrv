/**
 * Created by hanyong336 on 16/7/8.
 */

appModule.directive('chartLine',['ChartSrv', 'default_srv',
    function(ChartSrv, default_srv){
    return {
        restrict:'A',
        scope: {
            file: '=', source: '=', category: '=', draw: '='
        },
        link:function(scope,element,attr){
            scope.data = {define: [], content: []};
            scope.option = {
                xAxis: [{data: ["a","b"], type: "category",axisLabel:{textStyle:{color: "#5e738b"}}}],
                color: ["rgba(0,93,172,0.8)","rgba(176,189,0,0.8)", "rgba(228,234,141,0.8)", "rgba(130,192,234,0.8)", "rgba(146,162,0,0.8)"],
                series: [
                    {data: [1,2], type: "line", name: "数量", label: {normal: {show: true,position: 'top'}}},
                    {data: [3,4], type: "line", name: "同期数量", label: {normal: {show: true,position: 'top'}}}],
                yAxis: [
                    {type: "value",axisLabel:{textStyle:{color: "#5e738b"}},splitLine:{lineStyle:{color: ["rgb(200,200,200)"]}}}],
                legend: {y: "bottom", data: ["数量","同期数量"],textStyle:{color: "#5e738b"}},
                tooltip: {axisPointer: {type: "shadow"}, trigger: "axis"},
                animation: false,
                showAllSymbol: true
            };

            scope.fetch_data = function(){
                default_srv.query_transform_data(scope.source, scope.file).then(function(ret){
                    if (ret.resCode==200){
                        scope.data = ret.data;
                        scope.transform();
                        scope.plot()
                    }
                })
            };

            scope.transform = function(){
                /** xAxis */
                var category_col = parseInt(scope.category) - 1 ;
                var tmp_xAxis = [];
                $.each(scope.data.content, function(n, val){
                    tmp_xAxis.push(val['COL_'+category_col])
                });
                console.log('xaxis',tmp_xAxis);
                scope.option.xAxis[0]['data'] = tmp_xAxis;

                /** legend */
                var plot_cols = scope.draw.split('|');
                var tmp_legend = [];
                $.each(plot_cols, function(n, val){
                    tmp_legend.push(scope.data.define[parseInt(val) - 1]['displayName'])
                });
                console.log(tmp_legend);
                scope.option.legend.data = tmp_legend;

                /** series */
                var tmp_series = [];
                $.each(plot_cols, function(n, col_index){
                    tmp_series.push(
                        {data: [], type: "line", name: tmp_legend[n], label: {normal: {show: true,position: 'top'}}}
                    )
                });

                console.log(tmp_series[0]['data']);

                $.each(scope.data.content, function(row_n, row){
                    $.each(plot_cols, function(n, col_index){
                        var tmp_index = parseInt(col_index) - 1;
                        //console.log(tmp_series);
                        var push_data = parseFloat(row['COL_'+tmp_index]);
                        if (isNaN(push_data)){
                            push_data = '-'
                        }
                        tmp_series[n]['data'].push(push_data)
                    })
                });
                console.log(tmp_series);
                scope.option.series = tmp_series;

            };

            scope.plot = function(){
                ChartSrv.offline_chart('chart', scope.option);
            };

            scope.init_chart_option = function(){
                console.log('init', scope.file, scope.source);
                scope.fetch_data()
            };

            scope.init_chart_option()
        }
    }
}]);

appModule.directive('chartArea',['ChartSrv', 'default_srv',
    function(ChartSrv, default_srv){
    return {
        restrict:'A',
        scope: {
            file: '=', source: '=', category: '=', draw: '='
        },
        link:function(scope,element,attr){
            scope.data = {define: [], content: []};
            scope.option = {
                xAxis: [{data: ["a","b"], type: "category",axisLabel:{textStyle:{color: "#5e738b"}}}],
                color: ["rgba(0,93,172,0.8)","rgba(176,189,0,0.8)", "rgba(228,234,141,0.8)", "rgba(130,192,234,0.8)", "rgba(146,162,0,0.8)"],
                series: [
                    {data: [1,2], type: "line", name: "数量", label: {normal: {show: true,position: 'top'}}},
                    {data: [3,4], type: "line", name: "同期数量", label: {normal: {show: true,position: 'top'}}}],
                yAxis: [
                    {type: "value",axisLabel:{textStyle:{color: "#5e738b"}},splitLine:{lineStyle:{color: ["rgb(200,200,200)"]}}}],
                legend: {y: "bottom", data: ["数量","同期数量"],textStyle:{color: "#5e738b"}},
                tooltip: {axisPointer: {type: "shadow"}, trigger: "axis"},
                animation: false,
                showAllSymbol: true
            };

            scope.fetch_data = function(){
                default_srv.query_transform_data(scope.source, scope.file).then(function(ret){
                    if (ret.resCode==200){
                        scope.data = ret.data;
                        scope.transform();
                        scope.plot()
                    }
                })
            };

            scope.transform = function(){
                /** xAxis */
                var category_col = parseInt(scope.category) - 1 ;
                var tmp_xAxis = [];
                $.each(scope.data.content, function(n, val){
                    tmp_xAxis.push(val['COL_'+category_col])
                });
                console.log('xaxis',tmp_xAxis);
                scope.option.xAxis[0]['data'] = tmp_xAxis;

                /** legend */
                var plot_cols = scope.draw.split('|');
                var tmp_legend = [];
                $.each(plot_cols, function(n, val){
                    tmp_legend.push(scope.data.define[parseInt(val) - 1]['displayName'])
                });
                console.log(tmp_legend);
                scope.option.legend.data = tmp_legend;

                /** series */
                var tmp_series = [];
                $.each(plot_cols, function(n, col_index){
                    tmp_series.push(
                        {data: [], type: "line", stack:'all', name: tmp_legend[n],
                            label: {normal: {show: true,position: 'top'}},
                            areaStyle: {normal: {}}
                        }
                    )
                });

                console.log(tmp_series[0]['data']);

                $.each(scope.data.content, function(row_n, row){
                    $.each(plot_cols, function(n, col_index){
                        var tmp_index = parseInt(col_index) - 1;
                        //console.log(tmp_series);
                        var push_data = parseFloat(row['COL_'+tmp_index]);
                        if (isNaN(push_data)){
                            push_data = '-'
                        }
                        tmp_series[n]['data'].push(push_data)
                    })
                });
                console.log(tmp_series);
                scope.option.series = tmp_series;

            };

            scope.plot = function(){
                ChartSrv.offline_chart('chart', scope.option);
            };

            scope.init_chart_option = function(){
                console.log('init', scope.file, scope.source);
                scope.fetch_data()
            };

            scope.init_chart_option()
        }
    }

}]);


appModule.directive('chartStack',['ChartSrv', 'default_srv',
    function(ChartSrv, default_srv){
    return {
        restrict:'A',
        scope: {
            file: '=', source: '=', category: '=', draw: '='
        },
        link:function(scope,element,attr){
            scope.data = {define: [], content: []};
            scope.option = {
                xAxis: [{data: ["a","b"], type: "category",axisLabel:{textStyle:{color: "#5e738b"}}}],
                color: ["rgba(0,93,172,0.8)","rgba(176,189,0,0.8)", "rgba(228,234,141,0.8)", "rgba(130,192,234,0.8)", "rgba(146,162,0,0.8)"],
                series: [
                    {data: [1,2], type: "bar", stack: 'all', name: "数量", label: {normal: {show: true,position: 'top'}}},
                    {data: [3,4], type: "bar", stack: 'all', name: "同期数量", label: {normal: {show: true,position: 'top'}}}],
                yAxis: [
                    {type: "value",axisLabel:{textStyle:{color: "#5e738b"}},splitLine:{lineStyle:{color: ["rgb(200,200,200)"]}}}],
                legend: {y: "bottom", data: ["数量","同期数量"],textStyle:{color: "#5e738b"}},
                tooltip: {axisPointer: {type: "shadow"}, trigger: "axis"},
                animation: false,
                showAllSymbol: true
            };

            scope.fetch_data = function(){
                default_srv.query_transform_data(scope.source, scope.file).then(function(ret){
                    if (ret.resCode==200){
                        scope.data = ret.data;
                        scope.transform();
                        scope.plot()
                    }
                })
            };

            scope.transform = function(){
                /** xAxis */
                var category_col = parseInt(scope.category) - 1 ;
                var tmp_xAxis = [];
                $.each(scope.data.content, function(n, val){
                    tmp_xAxis.push(val['COL_'+category_col])
                });
                console.log('xaxis',tmp_xAxis);
                scope.option.xAxis[0]['data'] = tmp_xAxis;

                /** legend */
                var plot_cols = scope.draw.split('|');
                var tmp_legend = [];
                $.each(plot_cols, function(n, val){
                    tmp_legend.push(scope.data.define[parseInt(val) - 1]['displayName'])
                });
                console.log(tmp_legend);
                scope.option.legend.data = tmp_legend;

                /** series */
                var tmp_series = [];
                $.each(plot_cols, function(n, col_index){
                    tmp_series.push(
                        {data: [], type: "bar", stack: 'all',name: tmp_legend[n], label: {normal: {show: true,position: 'inside', textStyle: {color: '#fff'}}}}
                    )
                });

                console.log(tmp_series[0]['data']);

                $.each(scope.data.content, function(row_n, row){
                    $.each(plot_cols, function(n, col_index){
                        var tmp_index = parseInt(col_index) - 1;
                        //console.log(tmp_series);
                        var push_data = parseFloat(row['COL_'+tmp_index]);
                        if (isNaN(push_data)){
                            push_data = '-'
                        }
                        tmp_series[n]['data'].push(push_data)
                    })
                });
                console.log(tmp_series);
                scope.option.series = tmp_series;

            };

            scope.plot = function(){
                ChartSrv.offline_chart('chart', scope.option);
            };

            scope.init_chart_option = function(){
                console.log('init', scope.file, scope.source);
                scope.fetch_data()
            };

            scope.init_chart_option()
        }
    }

}]);

appModule.directive('chartBar',['ChartSrv', 'default_srv',
    function(ChartSrv, default_srv){
    return {
        restrict:'A',
        scope: {
            file: '=', source: '=', category: '=', draw: '='
        },
        link:function(scope,element,attr){
            scope.data = {define: [], content: []};
            scope.option = {
                xAxis: [{data: ["a","b"], type: "category",axisLabel:{textStyle:{color: "#5e738b"}}}],
                color: ["rgba(0,93,172,0.8)","rgba(176,189,0,0.8)", "rgba(228,234,141,0.8)", "rgba(130,192,234,0.8)", "rgba(146,162,0,0.8)"],
                series: [
                    {data: [1,2], type: "bar",  name: "数量", label: {normal: {show: true,position: 'top'}}},
                    {data: [3,4], type: "bar",  name: "同期数量", label: {normal: {show: true,position: 'top'}}}],
                yAxis: [
                    {type: "value",axisLabel:{textStyle:{color: "#5e738b"}},splitLine:{lineStyle:{color: ["rgb(200,200,200)"]}}}],
                legend: {y: "bottom", data: ["数量","同期数量"],textStyle:{color: "#5e738b"}},
                tooltip: {axisPointer: {type: "shadow"}, trigger: "axis"},
                animation: false,
                showAllSymbol: true
            };

            scope.fetch_data = function(){
                default_srv.query_transform_data(scope.source, scope.file).then(function(ret){
                    if (ret.resCode==200){
                        scope.data = ret.data;
                        scope.transform();
                        scope.plot()
                    }
                })
            };

            scope.transform = function(){
                /** xAxis */
                var category_col = parseInt(scope.category) - 1 ;
                var tmp_xAxis = [];
                $.each(scope.data.content, function(n, val){
                    tmp_xAxis.push(val['COL_'+category_col])
                });
                console.log('xaxis',tmp_xAxis);
                scope.option.xAxis[0]['data'] = tmp_xAxis;

                /** legend */
                var plot_cols = scope.draw.split('|');
                var tmp_legend = [];
                $.each(plot_cols, function(n, val){
                    tmp_legend.push(scope.data.define[parseInt(val) - 1]['displayName'])
                });
                console.log(tmp_legend);
                scope.option.legend.data = tmp_legend;

                /** series */
                var tmp_series = [];
                $.each(plot_cols, function(n, col_index){
                    tmp_series.push(
                        {data: [], type: "bar",name: tmp_legend[n], label: {normal: {show: true,position: 'top'}}}
                    )
                });

                console.log(tmp_series[0]['data']);

                $.each(scope.data.content, function(row_n, row){
                    $.each(plot_cols, function(n, col_index){
                        var tmp_index = parseInt(col_index) - 1;
                        //console.log(tmp_series);
                        var push_data = parseFloat(row['COL_'+tmp_index]);
                        if (isNaN(push_data)){
                            push_data = '-'
                        }
                        tmp_series[n]['data'].push(push_data)
                    })
                });
                console.log(tmp_series);
                scope.option.series = tmp_series;

            };

            scope.plot = function(){
                ChartSrv.offline_chart('chart', scope.option);
            };

            scope.init_chart_option = function(){
                console.log('init', scope.file, scope.source);
                scope.fetch_data()
            };

            scope.init_chart_option()
        }
    }

}]);


appModule.directive('chartPie',['ChartSrv', 'default_srv',
    function(ChartSrv, default_srv){
    return {
        restrict:'A',
        scope: {
            file: '=', source: '=', category: '=', draw: '='
        },
        link:function(scope,element,attr){
            scope.data = {define: [], content: []};
            scope.option = {
                color: ["rgba(0,93,172,0.8)","rgba(176,189,0,0.8)", "rgba(228,234,141,0.8)", "rgba(130,192,234,0.8)", "rgba(146,162,0,0.8)"],
                series: [
                    {radius: ['0%', '85%'], type: 'pie', name: '', data: [], calculable: false,
                        label: {normal:{show: true, position: 'inside', formatter: '{d}%', textStyle: {color: '#fff'}}}}
                ],
                legend: {x: "left", orient: 'vertical', data: ["数量","同期数量"],textStyle:{color: "#5e738b"}},
                animation: false,
                showAllSymbol: true
            };

            scope.fetch_data = function(){
                default_srv.query_transform_data(scope.source, scope.file).then(function(ret){
                    if (ret.resCode==200){
                        scope.data = ret.data;
                        scope.transform();
                        scope.plot()
                    }
                })
            };

            scope.transform = function(){
                /** legend */
                var plot_cols = scope.draw.split('|');
                var tmp_legend = [];
                $.each(plot_cols, function(n, val){
                    tmp_legend.push(scope.data.define[parseInt(val) - 1]['displayName'])
                });
                console.log(tmp_legend);
                scope.option.legend.data = tmp_legend;

                /** series */
                var tmp_series = [];
                $.each(plot_cols, function(n, col_index){
                    tmp_series.push(
                        {data: [], type: "bar",name: tmp_legend[n], label: {normal: {show: true,position: 'top'}}}
                    )
                });

                console.log(tmp_series[0]['data']);

                $.each(scope.data.content, function(row_n, row){
                    $.each(plot_cols, function(n, col_index){
                        var tmp_index = parseInt(col_index) - 1;
                        //console.log(tmp_series);
                        var push_data = parseFloat(row['COL_'+tmp_index]);
                        if (isNaN(push_data)){
                            push_data = '-'
                        }
                        tmp_series[n]['data'].push(push_data)
                    })
                });
                console.log(tmp_series);
                scope.option.series = tmp_series;

            };

            scope.plot = function(){
                ChartSrv.offline_chart('chart', scope.option);
            };

            scope.init_chart_option = function(){
                console.log('init', scope.file, scope.source);
                scope.fetch_data()
            };

            scope.init_chart_option()
        }
    }

}]);