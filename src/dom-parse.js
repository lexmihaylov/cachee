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