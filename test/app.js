( function() {

    function Messenger( greeter ) {
        this.greeter = greeter;
    }

    Messenger.prototype.say = function( message ) {
        this.greeter.greet( message );
    }

    //factory
    splash
        .register( "greeter", function() {
            return {
                greet: function( message ) {
                    console.log( "Greeter says:", message )
                }
            }
        } )
        .register( "cook", function() {
            return {
                cook: function() {
                    console.log( "Cooking dinner" );
                }
            }
        } ).register( "messenger", [ "greeter" ], function( greeter ) {
            return new Messenger( greeter );
        });


    // get
    splash.get( "messenger" ).say( "Hello" );


    // create
    // splash.create( [ "greeter", function( greeter ) {
    //     return new Messenger( greeter );
    // } ).say( "Hello" );


    // get

    splash.get( "cook" ).cook();

    // invoke
    // splash.register( "operation", function() {
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
