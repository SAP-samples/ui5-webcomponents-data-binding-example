# vanilla-data-binding

This package pays tribute to [UI5](https://ui5.sap.com/) and its [data binding](https://ui5.sap.com/#/topic/68b9644a253741e8a4b9e4279a35c247) concept. It aims to provide similar functionality while being framework agnostic and free of dependencies. It is **not** meant to be used in production.

## How it works

When instantiating a new model ([i18nModel](#i18nmodel) or [JSONModel](#jsonmodel)), the model will look for HTML elements that have the  [`data-bind-list`](#list-bindings) or [`data-bind-property`](#property-bindings) attributes set. It will then modify the elements based on the syntax specified in the attributes and the current data in the model. This relationship between the model and HTML elements (also called "subscribers") is referred to as a "binding". Whenever the `model.setProperty("path/to/value", "myNewData")` method is called, all subscribers of a model will get notified - meaning their values change accordingly.

## Property Bindings

Property bindings bind a specific value from the data in the model to a element in the HTML DOM - more specifically to an attribute of this element. When the value in the data model changes (via the `model.setProperty("path/to/value", "myNewData")` method), all bound elements will automatically be updated accordingly. In case bound elements are input elements [or the like](/src/index.ts#L114), the binding is a [two-way data binding](https://sapui5.hana.ondemand.com/sdk/#/topic/c72b922fdb59422496661000165d7ff1). This means that elements are equipped with a corresponding event listener to notify the model upon change and therefore all other subscribers, too.

By default, property bindings bind a value in the data model to the `textContent` attribute of an HTML element. Omitting the attribute that is to be set therefore gives the same result as specifying it as `textContent`:
```html
<!-- These two examples give the same result: -->

<h1 data-bind-property="nameOfModel>path/to/value>textContent"></h1>

<h1 data-bind-property="nameOfModel>path/to/value"></h1>
```

You can also bind properties to any other attribute of an HTML element:
```html
<input data-bind-property="nameOfModel>path/to/value>value"></input>
```

Or you can specify multiple property bindings for one HTML element using an array-like syntax:
```html
<input data-bind-property="[
        nameOfModel>path/to/value>value,
        nameOfModel>path/to/anotherValue>placeholder
    ]"></input>
```

## List Bindings

List bindings duplicate their first child (think of it as a template) according to the data in the model, and then pass the corresponding subset of data to the new children. This is why the data for a list binding has to be an array and only works with [JSONModels](#jsonmodel).

See an [example of a list binding below](#jsonmodel).

## JSONModel

A JSONModel is a data model consisting of data in JSON format or in the form of a JavaScript object. It can include nested data, arrays, numbers, strings, etc. and can be used for property binding as well as for list bindings.

Create a JSONModel like this:
```javascript
import { JSONModel } from "vanilla-data-binding"
const model = new JSONModel("nameOfModel", {
    path: {
        to: {
            value: "someData",
            anotherValue: "someOtherData",
            array: [
                { someProperty: "someData1" },
                { someProperty: "someData2" }
            ]
        }
    }
})
```

The syntax for a list binding is as follows:
```html
<ul data-bind-list="nameOfModel>path/to/array">
    <li></li>
</ul>
```

A list binding can be used in combination with property bindings:
```html
<ul data-bind-list="nameOfModel>path/to/array">
    <li data-bind-property="nameOfModel>someProperty"></li>
</ul>
```

## i18nModel

In contrast to JSONModels, an i18nModel ("internationalization" model) is a data model consisting of simple key-value pairs that doesn't allow for any nested structure. It can therefore only be used for property bindings. It's specialty is that you can provide multiple datasets that represent translations for different languages. Based on the language set via the URL query parameter (e.g. `?language=de` for German) or the user's browser settings, the corresponding translations will be used for the model. The URL query parameter overrules the browser settings. The translations can be provided by creating files following the naming `i18n/i18n_de.properties` (for German). They will then automatically be picked up by the i18nModel. The file containing the default translations must be called `i18n/i18n.properties` (language code omitted).

> ⚠️ Do not provide a model name when creating an i18nModel - simply do `new i18nModel()`. i18nModels are always automatically named `i18n`.

Create an i18nModel like this:
```javascript
import { i18nModel } from "vanilla-data-binding"
const i18n = new i18nModel()
```

Provide a default translation file:
`i18n/i18n.properties`
```properties
helloWorld=Hello World!
```

Provide translations file using a language code like so:
`i18n/i18n_de.properties`
```properties
helloWorld=Hallo Welt!
```

Consume the i18nModel using property bindings:
```html
<h1 data-bind-property="i18n>helloWorld"></h1>
```

Set the URL query parameter `?language=de` to see the title in German.