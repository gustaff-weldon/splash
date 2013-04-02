/*
splash
    .register( name, object )
    .create( factory )
    .invoke( method, context, [params])
    .get( name )
    .inject( object )

All dependencies are injected as a hashmap, not as parameters.
Dependency resolution:
- $deps
- param names (r2)



r1
    .register
    .create
    deps = .$deps
r2
    .get
    deps = param names
r3
    .inject
r3
    .register
r4
    .invoke


*/
( function( global, undefined ) {
    // 'use strict';


    var toString = Object.prototype.toString,
        slice = Array.prototype.slice,
        ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        ARGS_SEP = /,/,
        ARG = /^\s*(\S+)?\s*$/;

    var extend = function( dest ) {
        var sources = slice.call( arguments, 1 );
        for ( var i = 0, len = sources.length; i < len; i++ ) {
            var source = sources[ i ];
            for ( var prop in source ) {
                if ( source.hasOwnProperty( prop ) ) {
                    dest[ prop ] = source[ prop ];
                }
            }
        }

        return dest;
    }

    var defaults = {
        scope: "container"
    };


    function Injector( parent ) {
        this._factories = {};
        this._cache = [];

        if ( parent ) {
            var factories = parent._factories;
            for ( name in factories ) {
                if ( parent._factories.hasOwnProperty( name ) ) {
                    this._factories[ name ] = factories[ name ];
                }
            }
        }
    }


    Injector.prototype = {

        _resolve: function( factory ) {
            var spec = {}, deps, code, args,
                value = factory;
            // check if dependencies are explicitly defined
            if ( !( deps = factory.$deps ) ) {
                deps = [];
                // function extract from args
                if ( typeof factory === "function" ) {
                    code = factory.toString();
                    args = code.match( ARGS )[ 1 ].split( ARGS_SEP );
                    for ( var i = 0, len = args.length; i < len; i++ ) {
                        var name = args[ i ].match( ARG )[ 1 ];
                        if ( name ) {
                            deps.push( name );
                        }
                    }
                    factory.$deps = deps;
                }
                // array notation
                else if ( toString.call( factory ) == "[object Array]" ) {
                    deps = factory.slice( 0, factory.length - 1 );
                    value = factory[ factory.length - 1 ];
                }
            }

            spec.deps = deps;
            spec.value = value;
            return spec;
        },


        register: function( name, factory, options ) {
            var factorySpec = this._resolve( factory );
            factorySpec.options = extend( {}, defaults, options );

            this._factories[ name ] = factorySpec;
            return this;
        },


        invoke: function( factory ) {
            var factorySpec = this._resolve( factory );
            this._invoke( factorySpec );
        },


        get: function( name ) {

            if ( this._cache[ name ] ) {
                return this._cache[ name ];
            }

            var spec = null;
            // TODO allow local dependency overrides
            // TODO allow injector injection into factory method
            if ( !(spec = this._factories[ name ] ) ) {
                throw new Error( "cannot find factory for \"" + name + "\"");
            }
            var value =  this._invoke( this._factories[ name ] );

            if ( spec.options.scope === "container" ) {
                this._cache[ name ] = value;
            }
            return value;
        },


        _invoke: function( factorySpec ) {
            var dependencies = [];

            for ( var i = 0, len = factorySpec.deps.length; i < len; i++ ) {
                dependencies.push( this.get( factorySpec.deps[ i ] ) );
            }

            return typeof factorySpec.value === "function"
                ? factorySpec.value.apply( null, dependencies )
                : factorySpec.value;
        },


        container: function() {
            return new Injector( this );
        }
    };

    Injector.prototype.constructor = Injector;

    var api = new Injector();

    if ( typeof exports !== "undefined" && module.exports ) {
        module.exports = api;
    }
    else {
        global.splash = api;
    }

} ( this ) );

