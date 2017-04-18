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
     * <img cachee="src:custom-resource" />
     * 
     * <script>
     *  cachee.cache([
     *      cachee.resource('/my-resource1'),
     *      cachee.resource('/my-resource2'),
     *      cachee.resource('/my-resource3'),
     *      cachee.writeResource('custom-resource', 'Custom Content', 'image/png')
     *  ]).then(function() {
     *      //resources loaded
     *      cachee.load(); or cache.load(myElem);
     *      // => <img src="blob:http://...1" />
     *      // => <img src="blob:http://...2" />
     *      // => <img src="blob:http://...3" />
     *      // => <img src="blob:http://...4" />
     *  });
     * </script>
     * 
     * <!-- Using deep attribute set and template attribute -->
     * <!-- Format -->
     * <!-- <tag-name cachee-tpl="my url resource ${<attr>}" cachee="<attr>:<resource-url"></tag-name> -->
     * <div cachee="style.backgroundImage:/my-resource1" cachee-tpl="url(${style.backgroundImage})"></div>
     *
     * <script>
     *  cachee.cache([
     *      cachee.resource('/my-resource')
     *  ]).then(function() { 
     *      cachee.load(); // => <div style="background-image: url('blob:http://...')" cachee-tpl="url(${style.backgroundImage})"></div>
     *  });
     * </script>
     */
    cache: function(cacheRequests) {
        return Promise.all(cacheRequests);
    },
    
    /**
     * load specfic resources
     * @memberof cachee
     * @param {Element} [elem=document] root element or document
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
    
    opt.method = opt.method || 'GET';
    
    xhr.open(opt.method.toUpperCase(), opt.url, 'async' in opt? opt.async: true);
    
    var promise = new Promise(function(resolve, reject) {
        xhr.addEventListener("load", function onLoad() {
            if (xhr.status === 200) {  
                resolve(xhr);
            } else {
                reject(new Error('Failed to load: ' + xhr.status + " ("+xhr.statusText+")"));
            }
            
            xhr.removeEventListener('load', onLoad);
        });
    });
    
    
    
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
        deferred.reject(err);
    });
    
    return promise;
};

/**
 * Reads a resource and returns a specific type
 * @memberof cachee
 * 
 * @param {String} url the resource url
 * @param {String} [type="text"] http compliant responseType string
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
                url: blobUrl,
                responseType: type
            });    
        }
        
        deferred.reject(new Error('cant load resource `'+url+'`'));
    }.bind(this)).then(function(xhr) {
        deferred.resolve(xhr.response);
    }).catch(deferred.reject);
    
    return promise;
};

/**
 * Write a resource to the cache table
 * @memberof cachee
 * 
 * @param {String} id unique identifyer 
 * @param {Mixed} content the resource content
 * @param {String} [mimeType="text/plain"] the resource's mime type
 * @returns {Promise} the blob url in a promise
 * 
 * @example
 * cachee.writeResource('hello-world', 'Hello, World', 'text/plain');
 * 
 * // reading the resource
 * 
 * cachee.readResource('hello-world', 'text').then(function(data) { 
 *  console.log(data); // => "Hello, World"
 * });
 */
cachee.writeResource = function(id, content, mimeType) {
    mimeType = mimeType || 'text/plain';
    
    return new Promise(function(resolve) {
        cacheTable[id] = window.URL.createObjectURL(new Blob([content], {type: mimeType}));
        resolve(cacheTable[id]);
    });
};

/**
 * removes a resource form cache
 * @memberof cachee
 * 
 * @param {String} id
 * 
 * @example
 * cachee.writeResource('hello-world', 'Hello, World', 'text/plain');
 * ...
 * // delete the resource after we are done with it
 * cachee.deleteResource('hello-world');
 */
cachee.deleteResource = function(id) {
    if(id in cacheTable) {
        var blobUrl = cacheTable[id];
        delete cacheTable[id];
        window.URL.revokeObjectURL(blobUrl);
    }
};
var RegExpEscape = function(str) {
    return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
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
            var template = item.getAttribute('cachee-tpl');
            var attribute = resource.substring(0, resource.indexOf(':'));
            var attributePath = attribute.split('.')
            var url = resource.substring(resource.indexOf(':') + 1);
            
            this.resource(url).then(function(url) {
                var itemAttr = item;
                
                for(var i = 0; i < attributePath.length - 1; i++) {
                    itemAttr = itemAttr[attributePath[i]];
                }
                
                if(template) {
                    url = template.replace(new RegExp("\\$\\{"+RegExpEscape(attribute)+"\\}", 'g'), url);    
                }
                
                itemAttr[attributePath[attributePath.length - 1]] = url;
                item.removeAttribute('cachee');
            });
           
        }.bind(this));
    }.bind(this);
    
    manageCacheeElements();
};
return cachee;
}));
