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