/**
 * Created by hanyong336 on 16/7/8.
 */


appModule.factory('default_srv', ['$http', '$q', function($http,$q){

    function query_transform_data(source, file){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/docsrv/api/transform/file.fetch.json',
            params: {
                source: source, file_name: file
            },
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).success(function(data, status, headers, config){
            deferred.resolve(data)
        }).error(function(data, status, headers, config){
            console.log('fail ',status)
        });
        return deferred.promise
    }

    return {
        query_transform_data:query_transform_data
    }

    }
]);