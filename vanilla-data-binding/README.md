# vanilla-data-binding

[WORK IN PROGRESS]

This package pays tribute to [UI5](https://ui5.sap.com/) and its [data binding](https://ui5.sap.com/#/topic/68b9644a253741e8a4b9e4279a35c247) concept. It aims to provide similar functionality while being framework agnostic and free of dependencies. It is **not** meant to be used in production - in fact, it is more of an experiment and a personal learning project.

## How it works

When instantiating a new model ([i18nModel](#i18nmodel) or [JSONModel](#jsonmodel)), the model will look for HTML elements that have the  [`data-bind-list`](#list-bindings) or [`data-bind-property`](#property-bindings) attributes set. It will then modify the elements based on the syntax specified in the attributes and the current data in the model. This relationship between the model and HTML elements (also called "subscribers") is referred to as a "binding". Whenever the `model.setProperty("path/to/value", "myNewData")` method is called, all subscribers of a model will get notified - meaning their values change accordingly. In case bound HTML elements are input elements [or the like](/src/index.ts#L114), the binding is a [two-way data binding](https://sapui5.hana.ondemand.com/sdk/#/topic/c72b922fdb59422496661000165d7ff1). This means that elements are equipped with a corresponding event listener to notify the model upon change and therefore all other subscribers, too.

## List Bindings

List bindings duplicate their first child according to the data in the model, and then pass the corresponding subset of data to the new children. This is why the data for a list binding has to be an array and only works with [JSONModels](#jsonmodel).

You can create a `JSONModel` like this:
```javascript
import { JSONModel } from "vanilla-data-binding"
const model = new JSONModel("nameOfJSONModel", {
    path: {
        to: {
            value: "someData",
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
<ul data-bind-list="nameOfJSONModel>path/to/array">
    <li></li>
</ul>
```

A list binding can be used in combination with property bindings:
```html
<ul data-bind-list="nameOfJSONModel>path/to/array">
    <li data-bind-property="nameOfJSONModel>someProperty"></li>
</ul>
```

## Property Bindings



## JSONModel

## i18nModel

## Example

Initializing data models:
```javascript
import { i18nModel, JSONModel } from "vanilla-data-binding"

const i18n = new i18nModel(true) // set to true only if you want to manually initialize the i18nModel, perhaps if you want to await it
await i18n.initialize()

const data = {
	name: "Supermarket123 🛒 ",
	products: [
		{ name: i18n.data.VanillaIceCream, quantity: 100 },
		{ name: i18n.data.Bananas, quantity: 8 },
		{ name: i18n.data.Apples, quantity: 3 },
	]
}

const model = new JSONModel("supermarket", data)

document.querySelector("#demo-button").addEventListener("click", (e) => {
	let apples = i18n.data["Apples"]
	apples = apples.replace("🍎", "🍏")
	model.setProperty("products/2/name", apples)
})
```

Binding data models:
```html
<h1 data-bind-property="supermarket>name"></h1>

<ul data-bind-list="supermarket>products">
    <li>
        <span data-bind-property="supermarket>name"></span>
        <input type="number" data-bind-property="supermarket>quantity>value"></input>
    </li>
</ul>

<label data-bind-property="i18n>ChangeFirstProduct"></label>
<input
    type="number"
    data-bind-property="supermarket>products/0/quantity>value">
</input>
<br><br>
<button id="demo-button" data-bind-property="i18n>ChangeAppleColor"></button>
```

![example application](example.png)
![example application with language set to German](example_de.png)