( function() {
    //factory
    splash
        .factory( "greeter", function() {
            return {
                greet: function( message ) {
                    console.log( "Greeter says:", message )
                }
            }
        } )
        .factory( "cook", function() {
            return {
                cook: function() {
                    console.log( "Cooking dinner" );
                }
            }
    } );


    // create
    function Messenger( dependencies ) {
        this.greeter = dependencies.greeter;
    }

    Messenger.prototype.say = function( message ) {
        this.greeter.greet( message );
    }

    Messenger.$deps = [ "greeter" ];

    splash.create( Messenger ).say( "Hello" );


    // get

    splash.get( "cook" ).cook();

    // invoke
    // splash.factory( "operation", function() {
    //     return function add( a, b ) {
    //         return a + b;
    //     }
    // } );


    // function calculate( dependencies, a, b ) {
    //     dependencies.operation( a, b );
    // }

    // calculate.$deps = [ "operation" ];

    // splash.invoke( calculate, 3, 5 );


} () );
