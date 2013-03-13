# Splash
A spattering dependency injection ;)

## Dependency injection

`splash.factory` to register depenency constructors. Dependencies can have their own dependencies. See [dependency annotation](#dependency-annotation).

```js
splash.factory( "greeter", function() {
    return {
        greet: function() {
            console.log( "hello" );
        }
    };
} );
```

`splash.create` to obtain instance with dependencies resolved. Dependencies are passed as a hash to provided constructor.

```js
function Messenger( dependencies ) {
    this.greeter = dependencies.greeter;
}

Messenger.prototype.talk = function() {
    this.greeter.greet();
}

splash.create( Messenger ).talk();
```

`splash.get` to obtain instance of given dependency

```js
var greeter = splash.get( "greeter" );
```


## Dependency annotation

Splash looks for `.$deps` on your constructor. It should be an array of dependency names, order does not matter.
If `.$deps` is not found, splash will assume that constructor has no dependencies.

```js
function Foo() {
}

Foo.$deps = [ "bar" ]
```

## API
splash

`.factory( name, constructor )`

`.create( constructor )`

`.get( name )`

