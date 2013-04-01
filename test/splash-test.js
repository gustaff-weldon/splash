describe( "Splash", function() {

    describe( ".container", function() {
        var injector;

        beforeEach( function() {
            injector = splash.container();
        } );


        it( "should create new child container with parent factories", function() {
            var parent = splash.container(),
                name = "test",
                factory = function() {};

            parent.register( name, factory );

            var descendant = parent.container();
            assert.isObject( descendant );

            assert.isDefined( descendant._factories[ name ] );
            assert.isObject( descendant._factories[ name ] );
            assert.isDefined( descendant._factories[ name ].value );
            assert.equal( descendant._factories[ name ].value, factory );
            assert.isDefined( descendant._factories[ name ].deps );
        } )

        it( "should play nice with multiple deps chain", function() {

            function Messenger( greeter ) {
                this.greeter = greeter;
            }

            Messenger.prototype.say = function( message ) {
                return this.greeter.greet( message );
            }

            //factory
            injector
                .register( "greeter", function( level ) {
                    return {
                        greet: function( message ) {
                            return level + ": " + message;
                        }
                    }
                } )
                .register( "level", "INFO" )
                .register( "cook", function() {
                    return {
                        cook: function() {
                            return "Cooking dinner";
                        }
                    }
                } ).register( "messenger", [ "greeter", function( greeter ) {
                    return new Messenger( greeter );
                } ]);

            // get
            assert.equal( injector.get( "messenger" ).say( "Hello" ), "INFO: Hello" );

            // get
            assert.equal( injector.get( "cook" ).cook(), "Cooking dinner" );
        } );


        describe( "._resolve", function() {

            it( "should return object with dependencies and value", function() {
                var factory = function() {};
                factory.$deps = [ "foo", "bar" ];

                var result = injector._resolve( factory );
                assert.isDefined( result.deps );
                assert.isDefined( result.value );

                assert.deepEqual( result.deps, [ "foo", "bar" ] );
                assert.deepEqual( result.value, factory );
            } );


            it( "should work fine for plain objects", function() {
                var factory = {};

                var result = injector._resolve( factory );
                assert.deepEqual( result.deps, [] );
                assert.deepEqual( result.value, factory );
            } );


            it( "should work fine for primitives", function() {
                var factory = "test value"

                var result = injector._resolve( factory );
                assert.deepEqual( result.deps, [] );
                assert.deepEqual( result.value, factory );
            } );



            it( "should understand .$deps", function() {
                var factory = function() {};
                factory.$deps = [ "foo", "bar" ];

                var result = injector._resolve( factory );
                assert.deepEqual( result.deps, [ "foo", "bar" ] );
                assert.deepEqual( result.value, factory );
            } );


            it( "should understand [] syntax", function() {
                var factory = function() {};
                var result = injector._resolve( [ "foo", "bar", factory ] )

                assert.deepEqual( result.deps, [ "foo", "bar" ] );
                assert.deepEqual( result.value, factory );

                // no dependencies
                result = injector._resolve( [ factory ] )

                assert.deepEqual( result.deps, [] );
                assert.deepEqual( result.value, factory );

            } );


            it( "should extract from params and cache in $deps", function() {
                var factory = function( foo, bar ) {};

                var result = injector._resolve( factory );
                assert.deepEqual( result.deps, [ "foo", "bar" ] );
                assert.deepEqual( factory.$deps, [ "foo", "bar" ] );

                factory = function() {};
                result = injector._resolve( factory );
                assert.deepEqual( result.deps, [] );
                assert.deepEqual( factory.$deps, [] );

            } );

        } );


        describe( ".register", function() {

            it( "should register factory (various types)", function() {

                var withDeps = function() {};
                withDeps.$deps = [ "bar" ];

                var factories = [
                    withDeps,
                    function( foo, bar ) {},
                    [ "foo", function() {} ],
                    {},
                    1,
                    "text"
                ];

                for( var i = 0, len = factories.length; i < len; i++ ) {
                    var name = "test" + i;
                    injector.register( name, factories[ i ] );
                    assert.isDefined( injector._factories[ name ] );
                    assert.isObject( injector._factories[ name ] );
                    assert.isDefined( injector._factories[ name ].value );
                    assert.isDefined( injector._factories[ name ].deps );
                }

            } );

            it( "should store options", function() {
                var factory = function() {},
                    options = { scope: "singleton" };

                injector.register( "test", factory, options );
                assert.equal( injector._factories[ "test" ].options, options );
            } );


            it( "should allow chaining", function() {
                var res = injector.register( "test", function( foo, bar ) {} );
                assert.equal( res, injector );
            } );

        } );


        describe( ".get", function() {


            it( "should return value for function without $deps ", function() {
                var factory = function() { return "test result" };

                injector.register( "test", factory );
                assert.equal( injector.get( "test" ), "test result" );
            } );


            it( "should return value for function with $deps ", function() {
                var factory = function( f, b ) { return "test " + f + " " + b };
                factory.$deps = [ "foo", "bar" ];

                injector.register( "foo", function() { return "foo result" } );
                injector.register( "bar", function() { return "bar result" } );

                injector.register( "test", factory );
                assert.equal( injector.get( "test" ), "test foo result bar result" );
            } );


            it( "should return value for array syntax", function() {
                var factory = function( f, b ) { return "test " + f + " " + b };

                injector.register( "foo", function() { return "foo result" } );
                injector.register( "bar", function() { return "bar result" } );

                injector.register( "test", [ "foo", "bar", factory ] );
                assert.equal( injector.get( "test" ), "test foo result bar result" );
            } );


            it( "should return value for object", function() {
                var factory =  { name: "plain object" };

                injector.register( "test", factory );
                assert.equal( injector.get( "test" ), factory );
            } );

            it( "should return value for number", function() {
                var factory =  1;

                injector.register( "test", factory );
                assert.equal( injector.get( "test" ), factory );
            } );


            it( "should return value for string", function() {
                var factory =  "text";

                injector.register( "test", factory );
                assert.equal( injector.get( "test" ), factory );
            } );


            it( "should return cached value for singletons", function() {
                var count = 0;
                var factory = function() {
                    ++count;
                    return "count " + count;
                };

                injector.register( "test", factory, { scope: "singleton" } );
                assert.equal( injector.get( "test" ), "count 1" );
                assert.equal( injector.get( "test" ), "count 1" );
            } );

        } );

    } );
} );
