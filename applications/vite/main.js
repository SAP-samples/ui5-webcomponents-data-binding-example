import { i18nModel, JSONModel } from "vanilla-data-binding"

import "@ui5/webcomponents-fiori/dist/FlexibleColumnLayout.js"
import "@ui5/webcomponents-fiori/dist/ShellBar"
import "@ui5/webcomponents/dist/Title.js"
import "@ui5/webcomponents/dist/Label.js"
import "@ui5/webcomponents/dist/Button.js"
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";

import "@ui5/webcomponents-icons/dist/full-screen";
import "@ui5/webcomponents-icons/dist/exit-full-screen";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow";

const init = async () => {
	const i18n = new i18nModel(true) // set to true so we can await the init
	await i18n.initialize()

	const data = {
		name: "Supermarket123 🛒 ",
		products: [
			{ name: i18n.data.VanillaIceCream, quantity: 100 },
			{ name: i18n.data.Bananas, quantity: 8 },
			{ name: i18n.data.Apples, quantity: 3 }
		]
	}
	
	const model = new JSONModel("supermarket", data)

	const fcl = document.querySelector("#fcl")
	const openMidColumn = (e) => {
		fcl.layout = "TwoColumnsMidExpanded"
		const boundData = model.getBoundData(e.target)
		model.setProperty("context", boundData)
	}

	document.querySelector("#change-button").addEventListener("click", (e) => {
		let apples = i18n.data["Apples"]
		apples = apples.replace("🍎", "🍏")
		model.setProperty("products/2/name", apples)
	})

	document.querySelector("#add-button").addEventListener("click", (e) => {
		const newNode = model.appendListItem("products", { name: i18n.data.Apples, quantity: 4 })
		newNode.addEventListener("click", openMidColumn)
	})

	document.querySelectorAll(".list-item").forEach(item => item.addEventListener("click", openMidColumn))

	document.querySelector("#closeMidColumn").addEventListener("click", (e) => {
		fcl.layout = "OneColumn"
		document.querySelector("#openMidColumn").icon = "full-screen"
	})

	document.querySelector("#openMidColumn").addEventListener("click", (e) => {
		if (fcl.layout === "MidColumnFullScreen") {
			fcl.layout = "TwoColumnsMidExpanded"
			e.target.icon = "full-screen"
		} else {
			fcl.layout = "MidColumnFullScreen"
			e.target.icon = "exit-full-screen"
		}	
	})

	document.querySelector("#bar").addEventListener("click", (e) => {
		console.log(model.getBoundData(e.target))
	})
}
init()

import "@ui5/webcomponents/dist/Assets.js"
import "@ui5/webcomponents/dist/generated/json-imports/Themes.js"
import "@ui5/webcomponents-fiori/dist/generated/json-imports/Themes.js"
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js"
setTheme("sap_horizon_dark")

