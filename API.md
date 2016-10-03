<a name="cachee"></a>

## cachee : <code>object</code>
A namespace that holds methods to help cache data inside blob urls

**Kind**: global namespace  

* [cachee](#cachee) : <code>object</code>
    * [.cache(cacheRequests)](#cachee.cache) ⇒ <code>Promise</code>
    * [.load(elem)](#cachee.load)
    * [.request(opt)](#cachee.request) ⇒ <code>Promise</code>
    * [.resource(url, opt)](#cachee.resource) ⇒ <code>Promise</code>
    * [.readResource(url, type)](#cachee.readResource) ⇒ <code>Promise</code>
    * [.$$(context, selector)](#cachee.$$) ⇒ <code>Array</code>

<a name="cachee.cache"></a>

### cachee.cache(cacheRequests) ⇒ <code>Promise</code>
cache resource requests

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cacheRequests | <code>Array</code> | list of chache requests |

**Example**  
```js
cachee.cache([
 cachee.resource('/my-resource1'),
 cachee.resource('/my-resource2'),
 cachee.resource('/my-resource3')
]).then(function() {
 //resources loaded
 cachee.load(); or cache.load(myElem);
});
```
<a name="cachee.load"></a>

### cachee.load(elem)
load specfic resources

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | (Optional) root element or document |

<a name="cachee.request"></a>

### cachee.request(opt) ⇒ <code>Promise</code>
send an http request

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type |
| --- | --- |
| opt | <code>Object</code> | 

**Example**  
```js
//get request
cachee.request({
 url: '/example/resource',
 method: 'GET',
 responseType: 'arraybuffer'
}).then(function(xhr) {
 console.log(xhr.response);
});

// post request
cachee.request({
 url: '/my-resource',
 method: 'POST',
 data: FormData,
 headers: {
     'Content-type': 'multipart/form-data'
 }
}).then(handle);
```
<a name="cachee.resource"></a>

### cachee.resource(url, opt) ⇒ <code>Promise</code>
Sends a resource request and if the resource is not in cache it will cache it 
and retun it's blob url

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | resource url |
| opt | <code>Object</code> | http request options |

<a name="cachee.readResource"></a>

### cachee.readResource(url, type) ⇒ <code>Promise</code>
Reads a resource and returns a specific type

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | the resource url |
| type | <code>String</code> | (optional) http compliant responseType string (default is 'text') |

**Example**  
```js
cachee.readResource('/my-resource', 'arraybuffer').then(function(data) {
 console.log(data);
});
```
<a name="cachee.$$"></a>

### cachee.$$(context, selector) ⇒ <code>Array</code>
Dom helper method

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type |
| --- | --- |
| context | <code>Element</code> | 
| selector | <code>String</code> | 

**Example**  
```js
cachee.$$(myElement, '.item-selected').forEach(...);
```
