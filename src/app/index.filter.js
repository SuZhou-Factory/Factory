/* global filter */
(function() {
  'use strict';

  angular
    .module('suzhou')
    .filter("filterroute",function(){
        return function(input, parent){
            // console.log(input);
            if (!input) {
                return '.';
            }
            var out;
            if (parent) {
                if (parent == '.') {
                    out = '.' + input.substring(0,input.indexOf('/'));
                } else {
                    out = parent + '.' + input.substring(0,input.indexOf('/'));
                }
            } else {
                out = input.substring(0,input.indexOf('/'));
            }
            return out; 
        }
    })
    .filter("isarray",function(){
        return function(input){
            if (input instanceof Array) {
                return true;
            } else {
                return false;
            }
        }
    })
    .filter("getDataFromStr",function(){
        return function(input){
            return Date.parse(input);
        }
    });
    // .filter("fillBackRight",function(){
    //     return function(input, rightsStr, id){
    //         input = (_.indexOf(rightsStr.split('-'), id) != -1)
    //         return input;
    //     }
    // });

})();