<script setup>
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


import "@ui5/webcomponents/dist/Assets.js"
import "@ui5/webcomponents/dist/generated/json-imports/Themes.js"
import "@ui5/webcomponents-fiori/dist/generated/json-imports/Themes.js"
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js"
setTheme("sap_horizon_dark")
</script>

<template>
	<ui5-flexible-column-layout id="fcl">
		<div class="column" slot="startColumn">

			<ui5-shellbar id="bar" :primary-title="supermarket.name">
				<!-- <img slot="logo" src="/sap.png"/> -->
			</ui5-shellbar>

			<div id="list-header">
				<ui5-button v-on:click="changeAppleColor">{{ i18n.ChangeAppleColor }}</ui5-button>

				<ui5-button v-on:click="addItemToList">{{ i18n.AddItemToList }}</ui5-button>
			</div>

			<ui5-table >

				<ui5-table-row type="Active" class="list-item" v-for="product in supermarket.products" v-on:click="openMidColumn(product)">

					<ui5-table-cell>
						<span>{{ product.name }}</span>
					</ui5-table-cell>

					<ui5-table-cell style="text-align: right">
						<span>{{ product.quantity }}</span>
					</ui5-table-cell>

					<ui5-table-cell style="text-align: right">
						<ui5-icon name="navigation-right-arrow"></ui5-icon>
					</ui5-table-cell>

				</ui5-table-row>

				<ui5-table-column slot="columns">
					<span>{{ i18n.Products }}</span>
				</ui5-table-column>

				<ui5-table-column slot="columns" class="list-header-text-alignment">
					<span>{{ i18n.Quantity }}</span>
				</ui5-table-column>

				<ui5-table-column slot="columns"></ui5-table-column>

			</ui5-table>

		</div>
		<div class="column" slot="midColumn">
			<div class="column-header">
				<div class="column-subheader">
					<ui5-button id="openMidColumn" design="Transparent" icon="full-screen" v-on:click="expandMidColumn"></ui5-button>
					<ui5-button design="Transparent" icon="decline" v-on:click="closeMidColumn"></ui5-button>
				</div>
				<ui5-title style="font-size: var(--sapObjectHeader_Title_FontSize);" v-if="supermarket.context">{{ supermarket.context.name }}</ui5-title>
			</div>


			<div class="title-wrapper">
				<ui5-title level="H4">{{ i18n.GeneralInformation }}</ui5-title>
			</div>
			<div class="facet-wrapper">
				<div>
					<ui5-label>{{ i18n.Quantity }}</ui5-label>
				</div>
				<span v-if="supermarket.context">{{ supermarket.context.quantity }}</span>
			</div>
		</div>
	</ui5-flexible-column-layout>
</template>

<script>
export default {
	data() {
		return {
			supermarket: {
				name: "Supermarket123 🛒 ",
				products: [
					{ name: "Vanilla Ice Cream 🍦", quantity: 100 },
					{ name: "Bananas 🍌", quantity: 8 },
					{ name: "Apples 🍎", quantity: 3 }
				]
			},
			i18n: {}
		}
	},
	async created() {
		this.i18n = await this.fetchI18n()
	},
	methods: {
		async fetchI18n() {
			const urlParams = new URLSearchParams(window.location.search)
			let languageParameter = urlParams.get("language")
			if (!languageParameter) {
				languageParameter = window.location.hash.split("=")[1]
			}
			if (!languageParameter) {
				languageParameter = navigator.language.substring(0, 2)
			}
			let fileName = `i18n_${languageParameter}.properties`
			let response = await fetch(`/i18n/${fileName}`)
			if (response.status === 404) {
				response = await fetch("/i18n/i18n.properties")
			}
			const result = await response.text()
			let i18nData = {}
			const keyValuePairs = result.split("\n")
			for (let i = 0; i < keyValuePairs.length; i++) {
				const keyOrValue = keyValuePairs[i].split("=")
				i18nData[keyOrValue[0]] = keyOrValue[1]
			}
			return i18nData
		},
		openMidColumn(contextData) {
			this.supermarket.context = contextData
			const fcl = document.querySelector("#fcl")
			fcl.layout = "TwoColumnsMidExpanded"
		},
		closeMidColumn() {
			const fcl = document.querySelector("#fcl")
			fcl.layout = "OneColumn"
			document.querySelector("#openMidColumn").icon = "full-screen"
		},
		expandMidColumn(e) {
			const fcl = document.querySelector("#fcl")
			if (fcl.layout === "MidColumnFullScreen") {
				fcl.layout = "TwoColumnsMidExpanded"
				e.target.icon = "full-screen"
			} else {
				fcl.layout = "MidColumnFullScreen"
				e.target.icon = "exit-full-screen"
			}
		},
		changeAppleColor() {
			this.supermarket.products[2].name = "Apples 🍏"
		},
		addItemToList() {
			this.supermarket.products.push({ name: "Apples 🍎", quantity: 4 })
		}
	}
}
</script>

<style>
body {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0;
	padding: 0;
	background-color: var(--sapBackgroundColor);
}

#fcl {
	height: 100vh;
	width: 100vw;
}

.column {
	display: flex;
	flex-direction: column;
	align-items: center;
}

#list-header {
	width: calc(100% - 2rem);
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 2rem;
	margin-bottom: .5rem;
}

ui5-table {
	width: calc(100% - 2rem);
}

ui5-table ui5-table-column.list-header-text-alignment::part(column) {
	text-align: end;
}

.column-header {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0.25rem 1rem 0.25rem 1rem;
	margin-bottom: 2rem;
	background: var(--sapList_Background);
	box-sizing: border-box;
}

.column-subheader {
	display: flex;
	justify-content: flex-end;
}

.title-wrapper {
	width: calc(100% - 2rem);
	padding: 1rem;
}

.facet-wrapper {
	width: calc(100% - 4rem);
	background-color: var(--sapGroup_TitleBackground);
	border-radius: 12px;
	padding: 2rem 1rem 2rem 1rem;
	display: flex;
	flex-direction: column;
	gap: .25rem;
}

.facet-wrapper span {
	color: var(--sapTextColor);
	font-family: var(--sapFontFamily);
}
</style>
