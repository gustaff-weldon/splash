# Splash
A spattering dependency injection ;)

## Dependency injection

`splash.register` to register dependency providers. A provider may be a factory function or object or even primitive value ( excluding array ). Providers can have their own dependencies. See [dependency annotation](#dependency-annotation).

```js
splash.register( "greeter", function() {
    return {
        greet: function() {
            console.log( "hello" );
        }
    };
} );
```

`splash.get` to obtain instance of given dependency with all it's dependencies resolved.
```js
var greeter = splash.get( "greeter" ).greet();
```

`splash.invoke` to call given factory with dependencies resolved. Dependencies are passed in same order they were declared.

```js
function messenger( greeter ) {
    return {
        talk: function() {
            greeter.greet();
        }
    }
}

splash.invoke( messenger ).talk();
```

`splash.Injector` to obtain contructor for creating injector objects. `splash` itself is an instance of Injector.

```js
var myInjector =  new splash.Injector();
myInjector.register( "foo", function( bar ) {
    bar.sth();
} )
```


## Dependency annotation

Factories might depend on other factories. Splash supports three ways of defining such dependencies when registering factory via `.register` method.

### parameters name
By default splash will extract parameter names from factory function and assume they are dependencies

```js
splash.register( "foo", function( bar ) {
    bar.sth();
} )
```

This method is fine for quick prototyping, but will not work when code is minified, since parameter names are renamed by minifiers. It is recommended to use either of the two other methods.

### .$deps
Splash looks for `.$deps` on your factory. It should be an array of dependency names. Splash will pass the dependencies to factory in order they are defined in array.
If `.$deps` is not found, splash will assume that factory has no dependencies.

```js
function foo( b ) {
    b.sth(); // b will be instance of bar
}

foo.$deps = [ "bar" ]

splash.register( "foo", foo )

```

### array syntax
It is possible to define dependencies by passing them to `splash.register`  along with the function in one array.
Actual function is the last element in such array.

```js
splash.register( "foo", [ "foo", function( bar ) {
    bar.sth();
} ] );
```

## API
splash

`.register( name, factory )`

`.get( name )`

`.invoke( factory )`

`.Injector`

