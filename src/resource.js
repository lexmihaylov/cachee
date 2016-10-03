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