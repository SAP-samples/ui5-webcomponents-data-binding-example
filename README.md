[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/ui5-webcomponents-data-binding-example)](https://api.reuse.software/info/github.com/SAP-samples/ui5-webcomponents-data-binding-example)

# UI5 Web Components Data Binding Example

The repository contains a sample application that uses the UI5 Web Components in a very lightweight and performant way. Additionally, the application shows how to [implement data binding](/vanilla-data-binding/) with UI5 Web Components, which is a feature that is usually only available when using the more heavyweight UI5 framework. This showcases the power, flexibility, compatibility and ease of use of the UI5 Web Components.

## Overview

The application in this repository is a simple list of products with a few interactive buttons. The application has similarities to the [SAP Fiori list report](https://experience.sap.com/fiori-design-web/list-report-floorplan-sap-fiori-element/).

![screen shot](/application.png)

The application does not use any framework, instead it runs on [vite](https://vitejs.dev/) and uses the [UI5 Web Components](https://sap.github.io/ui5-webcomponents/). This makes the application very lightweight and performant - reaching a lighthouse performance score of 99.

[Data binding](https://sapui5.hana.ondemand.com/sdk/#/topic/68b9644a253741e8a4b9e4279a35c247) is a much beloved feature of the UI5 framework, which the application in this repository does not use. To achieve a somewhat similar developer experience, the application implements custom data binding - including list bindings, property bindings and i18n (internationalization). For more information visit the [vanilla-data-binding](/vanilla-data-binding/) section.

## Requirements

[Node.js](https://nodejs.org/en/download) version 16 or higher is required to run this project.

## Download and Installation

1. Clone this repository (or a forked version of it).
1. In the project's root directory, run `npm install`.
1. To start the dev server, run `npm run dev`.

The best performance can be achieved when the project gets built:

1. To build the project, run `npm run build`.
1. To serve the static build result, run `npm run serve:dist`.

## Support
[Create an issue](https://github.com/SAP-samples/ui5-webcomponents-data-binding-example/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
