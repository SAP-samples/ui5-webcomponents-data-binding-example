import { i18nModel, JSONModel } from "./vanilla-data-binding/src/index.js"

import "@ui5/webcomponents-fiori/dist/ShellBar"

import "@ui5/webcomponents/dist/Panel.js"

import "@ui5/webcomponents/dist/List.js"
import "@ui5/webcomponents/dist/StandardListItem.js" 

import "@ui5/webcomponents/dist/Label.js"
import "@ui5/webcomponents/dist/Input.js"

import "@ui5/webcomponents/dist/Button.js"

import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";

const init = async () => {
	const i18n = new i18nModel(true)
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

	document.querySelector("#change-button").addEventListener("click", (e) => {
		let apples = i18n.data["Apples"]
		apples = apples.replace("🍎", "🍏")
		model.setProperty("products/2/name", apples)
	})
	
	document.querySelector("#add-button").addEventListener("click", (e) => {
		model.appendListItem("products", { name: i18n.data.Apples, quantity: 3 })
	})
}
init()

import "@ui5/webcomponents/dist/Assets.js"
import "@ui5/webcomponents/dist/generated/json-imports/Themes.js"
import "@ui5/webcomponents-fiori/dist/generated/json-imports/Themes.js"
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js"
setTheme("sap_horizon_dark")

