QUnit.test('Precache', function(assert) {
    var done = assert.async();
    
    cachee.cache([
        'cat.jpg'
    ]).then(function() {
        assert.ok('cat.jpg' in cachee._cacheTable(), 'Resource should be cached')
        return cachee.readResource('cat.jpg', 'text')
    }).then(function(data) {
        assert.ok(typeof data == 'string', 'Resource data should be string');
        assert.ok(data.length > 0, 'Resource data should not be empty');
        done();
    });
});