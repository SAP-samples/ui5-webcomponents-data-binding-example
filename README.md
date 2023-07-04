[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/ui5-webcomponents-data-binding-example)](https://api.reuse.software/info/github.com/SAP-samples/ui5-webcomponents-data-binding-example)

# UI5 Web Components Data Binding Example

This repository contains two sample applications that use the [UI5 Web Components](https://sap.github.io/ui5-webcomponents/) in a very lightweight and performant way. While taking an as-lightweight-as-possible approach is great for performance, user and developer experience are just as important. To satisfy those needs, the application additionally show how to implement **data binding** with UI5 Web Components using

1. [a custom approach](/extensions/vanilla-data-binding/) (see [vite application](#vite-application))
2. [the Vue framework](https://vuejs.org/guide/essentials/template-syntax.html) (see [vue application](#vue-application)).

[Data Binding](https://sapui5.hana.ondemand.com/sdk/#/topic/68b9644a253741e8a4b9e4279a35c247) is a much beloved feature of the UI5 framework, which the applications in this repository do not use. This repository aims to showcase the performance, power, flexibility, compatibility and ease of use of the UI5 Web Components on their own.

## Overview

Both applications in this repository have the same content. They display a simple list of products with a few interactive buttons. It has similarities to the [SAP Fiori list report](https://experience.sap.com/fiori-design-web/list-report-floorplan-sap-fiori-element/) and [object page](https://experience.sap.com/fiori-design-web/object-page/) floorplans.

![screen shot](/application.png)

### Vite Application

The [vite application](/applications/vite/) does not use any framework - [vite](https://vitejs.dev/) is only used as a web server and build tool. This makes the application very lightweight and performant - reaching a lighthouse performance score of up to 97. The application implements custom data binding - including list bindings, property bindings and i18n (internationalization). For more information visit the [vanilla-data-binding](/extensions/vanilla-data-binding/) section.

### Vue Application

The [Vue application](/applications/vue/) uses the built-in data binding capabilities of [Vue 3](https://vuejs.org/). Vue's [template syntax](https://vuejs.org/guide/essentials/template-syntax.html) is similar to property bindings and its [list rendering](https://vuejs.org/guide/essentials/list.html) is similar to list bindings. A component's [reactive state](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) can be a data object, which is similar to creating data model.

## Requirements

[Node.js](https://nodejs.org/en/download) version 16 or higher is required to run this project.

## Download and Installation

1. Clone this repository (or a forked version of it).
1. In the project's root directory, run `npm install`.
1. To start the dev server of one application, run `npm run vite` or `npm run vue`.

The best performance can be achieved when the applications get built:

1. To build both applications, run `npm run build`.
1. To serve the static build result of one application, run `npm run vite:dist` or `npm run vue:dist`.

## Support
[Create an issue](https://github.com/SAP-samples/ui5-webcomponents-data-binding-example/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
