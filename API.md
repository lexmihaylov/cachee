<a name="cachee"></a>

## cachee : <code>object</code>
A namespace that holds methods to help cache data inside blob urls

**Kind**: global namespace  

* [cachee](#cachee) : <code>object</code>
    * [.cache(cacheRequests)](#cachee.cache) ⇒ <code>Promise</code>
    * [.load([elem])](#cachee.load)
    * [.request(opt)](#cachee.request) ⇒ <code>Promise</code>
    * [.resource(url, opt)](#cachee.resource) ⇒ <code>Promise</code>
    * [.readResource(url, [type])](#cachee.readResource) ⇒ <code>Promise</code>
    * [.writeResource(id, content, [mimeType])](#cachee.writeResource) ⇒ <code>Promise</code>
    * [.deleteResource(id)](#cachee.deleteResource)
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
<!-- Format: -->
<!-- <tag-name cachee="<attr>:<resource-url>"></tag-name> -->
<img cachee="src:/my-resource1" />
<img cachee="src:/my-resource2" />
<img cachee="src:/my-resource3" />
<img cachee="src:custom-resource" />

<script>
 cachee.cache([
     cachee.resource('/my-resource1'),
     cachee.resource('/my-resource2'),
     cachee.resource('/my-resource3'),
     cachee.writeResource('custom-resource', 'Custom Content', 'image/png')
 ]).then(function() {
     //resources loaded
     cachee.load(); or cache.load(myElem);
     // => <img src="blob:http://...1" />
     // => <img src="blob:http://...2" />
     // => <img src="blob:http://...3" />
     // => <img src="blob:http://...4" />
 });
</script>

<!-- Using deep attribute set and template attribute -->
<!-- Format -->
<!-- <tag-name cachee-tpl="my url resource ${<attr>}" cachee="<attr>:<resource-url"></tag-name> -->
<div cachee="style.backgroundImage:/my-resource1" cachee-tpl="url(${style.backgroundImage})"></div>

<script>
 cachee.cache([
     cachee.resource('/my-resource')
 ]).then(function() { 
     cachee.load(); // => <div style="background-image: url('blob:http://...')" cachee-tpl="url(${style.backgroundImage})"></div>
 });
</script>
```
<a name="cachee.load"></a>

### cachee.load([elem])
load specfic resources

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [elem] | <code>Element</code> | <code>document</code> | root element or document |

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

### cachee.readResource(url, [type]) ⇒ <code>Promise</code>
Reads a resource and returns a specific type

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | the resource url |
| [type] | <code>String</code> | <code>&quot;text&quot;</code> | http compliant responseType string |

**Example**  
```js
cachee.readResource('/my-resource', 'arraybuffer').then(function(data) {
 console.log(data);
});
```
<a name="cachee.writeResource"></a>

### cachee.writeResource(id, content, [mimeType]) ⇒ <code>Promise</code>
Write a resource to the cache table

**Kind**: static method of <code>[cachee](#cachee)</code>  
**Returns**: <code>Promise</code> - the blob url in a promise  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | unique identifyer |
| content | <code>Mixed</code> |  | the resource content |
| [mimeType] | <code>String</code> | <code>&quot;text/plain&quot;</code> | the resource's mime type |

**Example**  
```js
cachee.writeResource('hello-world', 'Hello, World', 'text/plain');

// reading the resource

cachee.readResource('hello-world', 'text').then(function(data) { 
 console.log(data); // => "Hello, World"
});
```
<a name="cachee.deleteResource"></a>

### cachee.deleteResource(id)
removes a resource form cache

**Kind**: static method of <code>[cachee](#cachee)</code>  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

**Example**  
```js
cachee.writeResource('hello-world', 'Hello, World', 'text/plain');
...
// delete the resource after we are done with it
cachee.deleteResource('hello-world');
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
