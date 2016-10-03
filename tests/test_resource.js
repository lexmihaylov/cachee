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
        });
    }());
});