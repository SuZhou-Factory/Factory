/* global filter */
(function() {
  'use strict';

  angular
    .module('suzhou')
    .filter("filterroute",function(){
        return function(input, parent){
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
            input = input.replace(/CST/, '(CST)');
            return Date.parse(input);
        }
    });

})();