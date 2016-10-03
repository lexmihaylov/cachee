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
     *      // => <img src="blob:http://...1" />
     *      // => <img src="blob:http://...2" />
     *      // => <img src="blob:http://...3" />
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