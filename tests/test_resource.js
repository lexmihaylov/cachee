QUnit.test('Resource caching and reading', function(assert) {
    var resourceUrl = 'cat.jpg';
    (function() {
        var done = assert.async();
        cachee.resource(resourceUrl).then(function(blobUrl) {
            assert.ok(/^blob:/.test(blobUrl), 'Should return a blob url')
            assert.ok(resourceUrl in cachee._cacheTable(), 'Resource should be present in cache table');
            done();
        }).catch(function(err) {
            assert.ok(false, err.message);
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        cachee.readResource(resourceUrl, 'text').then(function(data) {
            assert.ok(typeof data === 'string', 'Resource data should be a string');
            assert.ok(data.length > 0, 'Resource data should not be empty');
            done();
        }).catch(function(err) {
            assert.ok(false, err.message);
            done();
        });
    }());
    
    (function() {
        var id = 'test-resource';
        var content = 'my test content';
        
        var done1 = assert.async();
        var url = cachee.writeResource(id, content).then(function(url) {
            assert.ok(/^blob:/.test(url), 'writeResource should return a blob url.');
            assert.ok(id in cachee._cacheTable(), 'writeResource should write in the cache table');
            done1();
        });
        
        
        var done2 = assert.async();
        cachee.readResource(id, 'text').then(function(data) {
            assert.ok(data === content, 'writeResource should be readable multiple times');
            done2();
        }).catch(function(err) {
            assert.ok(false, err.message);
            done2();
        });
    }());
});