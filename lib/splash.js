/*
splash
    .factory( name, constructor )
    .create( factory )
    .invoke( method, context, [params])
    .get( name )
    .register( name, object )
    .inject( object )

All dependencies are injected as a hashmap, not as parameters.
Dependency resolution:
- $deps
- param names (r2)



r1
    .factory
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

    var toString = Object.prototype.toString
        ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        ARGS_SEP = /,/,
        ARG = /^\s*(\S+)?\s*$/;


    function Injector() {
        this._factories = {};
    }

    Injector.prototype = {

        _resolve: function( factory ) {
            var provider = {}, deps, code, args,
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

            provider.deps = deps;
            provider.value = value;
            return provider;
        },


        factory: function( name, factory ) {
            this._factories[ name ] = factory;
            return this;
        },


        invoke: function( factory ) {
            var provider = this._resolve( factory ),
                dependencies = [];

            for ( var i = 0, len = provider.deps.length; i < len; i++ ) {
                dependencies.push( this.get( provider.deps[ i ] ) );
            }

            return typeof provider.value === "function"
                ? provider.value.apply( null, dependencies )
                : provider.value;
        },


        get: function( name ) {
            if ( !this._factories[ name ] ) {
                throw new Error( "cannot find factory for \"" + name + "\"");
            }
            return this.invoke( this._factories[ name ] );
        }

    };

    Injector.prototype.constructor = Injector;

    var exports = typeof global.module === "object" ? module.exports : global;

    exports.splash = new Injector();
    exports.splash.Injector = Injector;

} ( this ) );

