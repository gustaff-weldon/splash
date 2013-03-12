/*
splash
    .factory( name, constructor )
    .create( dependant )
    .invoke( method, [params])
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
( function( undefined ) {

    function _resolve( dependant ) {
        return dependant.$deps ? dependant.$deps : [];
    }

    function Injector() {
        this.factories = {};
    }

    Injector.prototype = {

        factory: function( name, constructor ) {
            this.factories[ name ] = constructor;
            return this;
        },

        create: function( constructor ) {
            var deps = _resolve( constructor ),
                dependencies = {},
                name;
            for ( var i = 0, len = deps.length; i < len; i++ ) {
                name = deps[ i ];
                dependencies[ name ] = this.create( this.factories[ name ] );
            }
            return new constructor( dependencies )
        },

        get: function( name ) {
            return this.create( this.factories[ name ] );
        }

    };

    Injector.prototype.constructor = Injector

    var global = typeof module === "object" ? module.exports : this;

    global.splash = new Injector();

} () );

