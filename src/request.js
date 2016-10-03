
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
        
        xhr.addEventListener("error", function onError() {
            reject(new Error('can`t execute request'));
            
            xhr.removeEventListener('error', onError);
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
                
                xhr.removeEventListener(type, handle);
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