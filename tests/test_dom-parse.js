QUnit.test('Updating the dom with cached resources', function(assert) {
    (function() {
        var div = document.createElement('div');
        var img = new Image();
        img.setAttribute('cachee', 'src:cat.jpg');
        div.appendChild(img);
        
        var bg = document.createElement('div');
        bg.setAttribute('cachee', 'style.backgroundImage:cat.jpg');
        bg.setAttribute('cachee-tpl', 'url(${style.backgroundImage})');
        div.appendChild(bg);
        
        cachee.load(div);
        var done = assert.async();
        setTimeout(function() {
            assert.ok(/^blob:/.test(img.src), 'Should replace cachee resource url in the src attribute');
            assert.ok(/^url\("blob:/.test(bg.style.backgroundImage), 'Sould replace cachee resource url with in style.backgroundImage using a template.');
            done();
        }, 100)
        
    }());
});