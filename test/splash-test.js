describe( "Splash", function() {

    describe( "_resolve", function() {

        it( "should understand .$deps", function() {
            var factory = function() {};
            factory.$deps = [ "foo", "bar" ];

            assert.deepEqual( splash._resolve( factory ), [ "foo", "bar" ] );
        } );


        it( "should understand [] syntax", function() {
            assert.deepEqual( splash._resolve( [ "foo", "bar", function() {} ] ), [ "foo", "bar" ] );
        } );


        it( "should extract from params and cache in $deps", function() {
            var factory = function( foo, bar ) {};
            assert.deepEqual( splash._resolve( factory ), [ "foo", "bar" ] );
            assert.deepEqual( factory.$deps, [ "foo", "bar" ] );

            factory = function() {};
            assert.deepEqual( splash._resolve( factory ), [] );
            assert.deepEqual( factory.$deps, [] );

        } );

    } );


    describe( "factory", function() {

        it( "should register factory", function() {
            var factory = function( foo, bar ) {};
            splash.factory( "test", factory );
            assert.isDefined( splash.factories[ "test" ] );
            assert.equal( splash.factories[ "test" ], factory );

        } );


        it( "should allow chaining", function() {
            var res = splash.factory( "test", function( foo, bar ) {} );
            assert.equal( res, splash );
        } );


    } );
} );
