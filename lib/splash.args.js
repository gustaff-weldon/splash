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
        this.factories = {};
    }

    Injector.prototype = {

        _resolve: function( factory ) {
            var $deps, code, args;
            if ( !( $deps = factory.$deps ) ) {
                if ( typeof factory === "function" ) {
                    $deps = [];
                    code = factory.toString();
                    args = code.match( ARGS )[ 1 ].split( ARGS_SEP );
                    for ( var i = 0, len = args.length; i < len; i++ ) {
                        var name = args[ i ].match( ARG )[ 1 ];
                        if ( name ) {
                            $deps.push( name );
                        }
                    }
                    factory.$deps = $deps;
                }
                else if ( toString.call( factory ) == "[object Array]" ) {
                    $deps = factory.slice( 0, factory.length - 1 )
                }
            }
            return $deps;
        },


        factory: function( name, factory ) {
            this.factories[ name ] = factory;
            return this;
        },

        create: function( factory ) {
            var deps = _resolve( factory ),
                dependencies = [],
                name;
            for ( var i = 0, len = deps.length; i < len; i++ ) {
                name = deps[ i ];
                dependencies.push( this.create( this.factories[ name ] ) );
            }
            return factory.apply( null, dependencies );
        },


        get: function( name ) {
            return this.create( this.factories[ name ] );
        },


        invoke: function( factory ) {

        }

    };

    Injector.prototype.constructor = Injector;

    var exports = typeof global.module === "object" ? module.exports : global;

    exports.splash = new Injector();
    exports.Injector = Injector;

} ( this ) );

