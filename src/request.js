
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