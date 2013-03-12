( function() {
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


    function Messenger( dependencies ) {
        this.greeter = dependencies.greeter;
    }

    Messenger.prototype.say = function( message ) {
        this.greeter.greet( message );
    }

    Messenger.$deps = [ "greeter" ];

    splash.create( Messenger ).say( "Hello" );
} () );
