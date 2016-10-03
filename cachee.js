;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.cachee = factory();
  }
}(this, function() {
/**
 * Holds the chached data
 * @type {Object}
 */
var cacheTable = {};

/**
 * A namespace that holds methods to help cache data inside blob urls
 * @namespace cachee
 */
var cachee = {
    /**
     * cache resource requests
     * @memberof cachee
     * 
     * @param {Array} cacheRequests list of chache requests
     * 
     * @returns {Promise}
     * 
     * @example
     * <!-- Format: -->
     * <!-- <tag-name cachee="<attr>:<resource-url>"></tag-name> -->
     * <img cachee="src:/my-resource1" />
     * <img cachee="src:/my-resource2" />
     * <img cachee="src:/my-resource3" />
     * 
     * <script>
     *  cachee.cache([
     *      cachee.resource('/my-resource1'),
     *      cachee.resource('/my-resource2'),
     *      cachee.resource('/my-resource3')
     *  ]).then(function() {
     *      //resources loaded
     *      cachee.load(); or cache.load(myElem);
     *  });
     * </script>
     * 
     */
    cache: function(cacheRequests) {
        return Promise.all(cacheRequests);
    },
    
    /**
     * load specfic resources
     * @memberof cachee
     * @param {Element} elem (Optional) root element or document
     */
    load: function(elem) {
        elem = elem || document;
        
        this._parseDom(elem);
    },
    
    /**
     * get the cache table for debug info
     * @returns {Object}
     */
    _cacheTable: function() {
        return cacheTable;
    }
};

/**
 * send an http request
 * @memberof cachee
 * @param {Object} opt
 * @returns {Promise}
 * 
 * @example 
 * //get request
 * cachee.request({
 *  url: '/example/resource',
 *  method: 'GET',
 *  responseType: 'arraybuffer'
 * }).then(function(xhr) {
 *  console.log(xhr.response);
 * });
 * 
 * // post request
 * cachee.request({
 *  url: '/my-resource',
 *  method: 'POST',
 *  data: FormData,
 *  headers: {
 *      'Content-type': 'multipart/form-data'
 *  }
 * }).then(handle);
 * 
 */
cachee.request = function(opt) {
    var xhr = new XMLHttpRequest();
    var promise = new Promise(function(resolve, reject) {
        xhr.addEventListener("load", function onLoad() {
            if (xhr.status === 200) {  
                resolve(xhr);
            } else {
                reject(new Error(xhr.status + " ("+xhr.statusText+")"));
            }
            
            xhr.removeEventListener('load', onLoad);
        });
    });
    
    opt.method = opt.method || 'GET';
    
    if(opt.method.toUpperCase() === 'POST') xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.responseType = opt.responseType || 'blob';
    if(opt.timeout) xhr.timeout = opt.timeout;
    if(opt.overrideMimeType) opt.overrideMimeType(opt.overrideMimeType);
    
    if(opt.headers) {
        for(var header in opt.headers) {
             xhr.setRequestHeader(header, opt.headers[header]);
        }
    }
    
    if(opt.listeners) {
        var bindListeners = function(type, handle) {
            xhr.addEventListener(type, function() {
                handle.apply(null, arguments);
            });
        };
        
        for(var listener in opt.listeners) {
            bindListeners(listener, opt.listeners[listener]);
        }
    }
    
    
    xhr.open(opt.method.toUpperCase(), opt.url);
    xhr.send(opt.data || null);
    
    return promise;
};
/**
 * Sends a resource request and if the resource is not in cache it will cache it 
 * and retun it's blob url
 * @memberof cachee
 * 
 * @param {String} url resource url
 * @param {Object} opt http request options
 * 
 * @returns {Promise}
 */
cachee.resource = function(url, opt) {
    var deferred = {};
    var promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    
    if(url in cacheTable) {
        deferred.resolve(cacheTable[url]);
        
        return promise;
    }
    
    opt = opt || {};
    opt.url = url;
    opt.responseType = 'blob';
    opt.method = opt.method || 'GET';
    
    this.request(opt).then(function(xhr) {
        cacheTable[opt.url] = window.URL.createObjectURL(xhr.response);
        deferred.resolve(cacheTable[opt.url]);
    }).catch(function(err) {
        console.warn(err);
        deferred.resolve(null);
    });
    
    return promise;
};

/**
 * Reads a resource and returns a specific type
 * @memberof cachee
 * 
 * @param {String} url the resource url
 * @param {String} type (optional) http compliant responseType string (default is 'text')
 * 
 * @returns {Promise}
 * 
 * @example
 * cachee.readResource('/my-resource', 'arraybuffer').then(function(data) {
 *  console.log(data);
 * });
 */
cachee.readResource = function(url, type) {
    type = type || 'text';
    
    var deferred = {};
    var promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    
    this.resource(url).then(function(blobUrl) {
        if(blobUrl) {
            return this.request({
                url: url,
                responseType: type
            });    
        }
        
        deferred.reject(new Error('cant load resource `'+url+'`'));
    }.bind(this)).then(function(xhr) {
        deferred.resolve(xhr.response);
    });
    
    return promise;
};
/**
 * Dom helper method
 * @memberof cachee
 * @param {Element} context
 * @param {String} selector
 * @returns {Array}
 * 
 * @example
 * cachee.$$(myElement, '.item-selected').forEach(...);
 */
cachee.$$ = function(context, selector) {
    return Array.prototype.slice.call(context.querySelectorAll(selector));
};

/**
 * Look for cachee attribute, parse the attribute value and set the approproiate element attribute
 * @memberof cachee
 * @private
 * @param {Element} rootElement root element or document
 */
cachee._parseDom = function(rootElem) {
    
    var manageCacheeElements = function() {
        var element = cachee.$$(rootElem, '[cachee]');
        element.forEach(function(item) {
            var resource = item.getAttribute('cachee');
            var attribute = resource.substring(0, resource.indexOf(':'));
            var url = resource.substring(resource.indexOf(':') + 1);
            
            this.resource(url).then(function(url) {
                item[attribute] = url;
                item.removeAttribute('cachee');
            });
           
        }.bind(this));
    }.bind(this);
    
    if (document.readyState == "complete" || document.readyState == "loaded") {
        manageCacheeElements();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            manageCacheeElements();
        }, false);
    }
};
return cachee;
}));
