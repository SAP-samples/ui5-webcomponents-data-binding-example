var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Model_instances, _Model_handleCloningOfListElements, _Model_updateSubscribers, _Model_addPossibleTwoWayBinding, _Model_getDataToSetOnElement, _Model_getFullPropertyPath, _Model_setElementAttribute, _Model_dynamicDeepSetOfObject, _Model_parseDatasetAttribute, _Model_setListBindingMarker, _Model_readAndRemoveListBindingMarker, _Model_capitalizeFirstCharacter, _Model_replaceLastOccurrenceOfNumber;
/**
 * Base class representing a data model.
 */
class Model {
    /**
     * Creates a new data model.
     * @param {string} name - The name of the data model.
     * @param {object} data - The data of the data model.
     */
    constructor(name, data) {
        _Model_instances.add(this);
        this.name = name;
        this.capitalizedName = __classPrivateFieldGet(this, _Model_instances, "m", _Model_capitalizeFirstCharacter).call(this, name);
        this.data = data;
        this.subscribers = {
            list: [],
            property: []
        };
    }
    /**
     * Updates the model data and notifies all subscribers of the model.
     * @param {string} property - The property path in the data object. The path delimiter must be "/".
     * @param {any} data - The data that is to be set.
     * @returns {object} the updated data object.
     */
    setProperty(property, data) {
        __classPrivateFieldGet(this, _Model_instances, "m", _Model_dynamicDeepSetOfObject).call(this, this.data, property, data);
        __classPrivateFieldGet(this, _Model_instances, "m", _Model_updateSubscribers).call(this);
        return this.data;
    }
    /**
     * Appends a list item to an existing lists.
     * WARNING: Does not work for lists where the parent list element is bound to more than one property or list of this model.
     * @param {string} property  - The property path in the model pointing to the list.
     * @param {object} data - The data to attach to the list.
     * @returns {object} the updated data object.
     */
    appendListItem(property, data) {
        for (let i = 0; i < this.subscribers.list.length; i++) {
            const element = this.subscribers.list[i];
            let allSubscribersAndChildren = Array.from(element.querySelectorAll(`[data-bound-paths-${this.name}]`));
            allSubscribersAndChildren.push(element);
            allSubscribersAndChildren.forEach(boundElementInsideList => {
                const boundPath = boundElementInsideList.dataset[`boundPaths${this.capitalizedName}`];
                if (boundPath == property) {
                    const newIndex = boundElementInsideList.children.length;
                    const newNode = boundElementInsideList.lastElementChild.cloneNode(true);
                    boundElementInsideList.appendChild(newNode);
                    Array.from(newNode.children).forEach(child => {
                        const boundPath = child.dataset[`boundPaths${this.capitalizedName}`];
                        if (boundPath) {
                            child.dataset[`boundPaths${this.capitalizedName}`] = __classPrivateFieldGet(this, _Model_instances, "m", _Model_replaceLastOccurrenceOfNumber).call(this, boundPath, (newIndex - 1), newIndex);
                            this.subscribers.property.push(child);
                            __classPrivateFieldGet(this, _Model_instances, "m", _Model_addPossibleTwoWayBinding).call(this, child);
                        }
                    });
                    this.setProperty(`${property}/${newIndex}`, data);
                }
            });
        }
        return this.data;
    }
    /**
     * Binds an element to a property in the model. The element is then subscribed to the model.
     * WARNING: Overwrites any existing bindings of the element to this model.
     * @param {HTMLElement} element - The element to bind.
     * @param {string} property - The property path in the model to bind the element to.
     */
    bindElementAndProperty(element, property) {
        element.dataset.bindProperty = `${this.name}>${property}`;
        element.dataset[`boundPaths${this.capitalizedName}`] = property;
        if (!this.subscribers.property.includes(element)) {
            this.subscribers.property.push(element);
        }
        __classPrivateFieldGet(this, _Model_instances, "m", _Model_updateSubscribers).call(this);
    }
    /**
     * Initializes all subscribers of the model for a binding type by populating `this.subscribers[bindingType]`.
     * Also saves the full property path in the `data-bound-paths-${modelName}` attribute.
     * Calls `this.#updateSubscribers()`.
     * @param {"list"|"property"} bindingType - The type of binding.
     */
    initializeSubscribers(bindingType) {
        const allPossibleSubscribers = document.querySelectorAll(`[data-bind-${bindingType}]`);
        allPossibleSubscribers.forEach(element => {
            const propertyArrays = __classPrivateFieldGet(this, _Model_instances, "m", _Model_parseDatasetAttribute).call(this, element, bindingType);
            for (let i = 0; i < propertyArrays.length; i++) {
                if (propertyArrays[i][0] == this.name) {
                    this.subscribers[bindingType].push(element);
                    if (!element.dataset[`boundPaths${this.capitalizedName}`]) {
                        element.dataset[`boundPaths${this.capitalizedName}`] = __classPrivateFieldGet(this, _Model_instances, "m", _Model_getFullPropertyPath).call(this, element, bindingType, i);
                    }
                    else {
                        element.dataset[`boundPaths${this.capitalizedName}`] += "+" + __classPrivateFieldGet(this, _Model_instances, "m", _Model_getFullPropertyPath).call(this, element, bindingType, i);
                    }
                    __classPrivateFieldGet(this, _Model_instances, "m", _Model_addPossibleTwoWayBinding).call(this, element);
                }
            }
        });
        if (bindingType === "list") {
            for (let i = 0; i < this.subscribers.list.length; i++) {
                const element = this.subscribers.list[i];
                __classPrivateFieldGet(this, _Model_instances, "m", _Model_handleCloningOfListElements).call(this, element);
            }
        }
        __classPrivateFieldGet(this, _Model_instances, "m", _Model_updateSubscribers).call(this);
    }
}
_Model_instances = new WeakSet(), _Model_handleCloningOfListElements = function _Model_handleCloningOfListElements(element) {
    __classPrivateFieldGet(this, _Model_instances, "m", _Model_setListBindingMarker).call(this, element);
    const firstChild = element.firstElementChild;
    if (!firstChild) {
        console.error(`Whops! Looks like ${element} has a list binding, but doesn't have any children. This relates to the "${this.name}" data model.`);
    }
    const listData = __classPrivateFieldGet(this, _Model_instances, "m", _Model_getDataToSetOnElement).call(this, element, 0);
    for (let i = 0; i < listData.length; i++) {
        const newNode = firstChild.cloneNode(true);
        element.appendChild(newNode);
        const nestedLists = element.lastElementChild.querySelectorAll("[data-bind-list]");
        nestedLists.forEach(nestedList => {
            const oldBoundPaths = nestedList.dataset[`boundPaths${this.capitalizedName}`];
            nestedList.dataset[`boundPaths${this.capitalizedName}`] = __classPrivateFieldGet(this, _Model_instances, "m", _Model_replaceLastOccurrenceOfNumber).call(this, oldBoundPaths, 0, i);
            __classPrivateFieldGet(this, _Model_instances, "m", _Model_handleCloningOfListElements).call(this, nestedList);
        });
    }
    firstChild.remove();
}, _Model_updateSubscribers = function _Model_updateSubscribers() {
    for (let i = 0; i < this.subscribers.property.length; i++) {
        const element = this.subscribers.property[i];
        const propertyArrays = __classPrivateFieldGet(this, _Model_instances, "m", _Model_parseDatasetAttribute).call(this, element, "property");
        // only keep properties from this model
        let relevantPropertyArrays = [];
        for (let j = 0; j < propertyArrays.length; j++) {
            if (propertyArrays[j][0] === this.name) {
                relevantPropertyArrays.push(propertyArrays[j]);
            }
        }
        for (let k = 0; k < relevantPropertyArrays.length; k++) {
            // account for possible offset in lookup of properties `data-bound-paths-${modelName}` if element also has list binding   
            let offset = __classPrivateFieldGet(this, _Model_instances, "m", _Model_readAndRemoveListBindingMarker).call(this, relevantPropertyArrays[k]).listBinding ? 1 : 0;
            relevantPropertyArrays[k] = __classPrivateFieldGet(this, _Model_instances, "m", _Model_readAndRemoveListBindingMarker).call(this, relevantPropertyArrays[k]).propertyArray;
            const dataToSet = __classPrivateFieldGet(this, _Model_instances, "m", _Model_getDataToSetOnElement).call(this, element, k + offset);
            let attributeToSet = relevantPropertyArrays[k][2];
            __classPrivateFieldGet(this, _Model_instances, "m", _Model_setElementAttribute).call(this, element, dataToSet, attributeToSet);
        }
    }
}, _Model_addPossibleTwoWayBinding = function _Model_addPossibleTwoWayBinding(element) {
    if (element.tagName.includes('INPUT') || element.tagName.includes('TEXTAREA') || element.tagName.includes('DATE-PICKER')) {
        const boundPaths = element.dataset[`boundPaths${this.capitalizedName}`].split("+");
        for (let i = 0; i < boundPaths.length; i++) {
            element.addEventListener("change", (e) => {
                const element = e.target;
                const property = boundPaths[i];
                const value = element.value;
                this.setProperty(property, value);
            });
        }
    }
}, _Model_getDataToSetOnElement = function _Model_getDataToSetOnElement(element, pathIndex) {
    let dataToSet = this.data;
    const boundPaths = element.dataset[`boundPaths${this.capitalizedName}`].split("+");
    const propertyArray = boundPaths[pathIndex].split("/");
    for (let j = 0; j < propertyArray.length; j++) {
        dataToSet = dataToSet[propertyArray[j]];
        if (!dataToSet) {
            break;
        }
    }
    if (dataToSet === null || dataToSet === undefined) {
        console.warn(`Whops! The property "${propertyArray.join("/")}" couldn't be found in the "${this.name}" data model.`);
        return "";
    }
    return dataToSet;
}, _Model_getFullPropertyPath = function _Model_getFullPropertyPath(element, bindingType, pathIndex) {
    let propertyPath = __classPrivateFieldGet(this, _Model_instances, "m", _Model_parseDatasetAttribute).call(this, element, bindingType)[pathIndex][1];
    const closestElementWithListBinding = element.parentElement.closest("[data-bind-list]");
    const parentHasListBinding = closestElementWithListBinding && closestElementWithListBinding != element;
    if (parentHasListBinding) {
        let propertyArray = [];
        propertyArray.push(propertyPath);
        let childIndex = -1;
        const allClonedItems = closestElementWithListBinding.children;
        for (let i = 0; i < allClonedItems.length; i++) {
            if (allClonedItems[i].contains(element)) {
                childIndex = i;
            }
        }
        propertyArray.push(childIndex.toString());
        const parentPropertyPath = __classPrivateFieldGet(this, _Model_instances, "m", _Model_getFullPropertyPath).call(this, closestElementWithListBinding, "list", 0);
        propertyArray.push(parentPropertyPath);
        propertyArray.reverse();
        propertyPath = propertyArray.join("/");
    }
    return propertyPath;
}, _Model_setElementAttribute = function _Model_setElementAttribute(element, value, attribute) {
    if (attribute) {
        element[attribute] = value;
    }
    else {
        element.textContent = value;
    }
}, _Model_dynamicDeepSetOfObject = function _Model_dynamicDeepSetOfObject(object, property, data) {
    const propertyArray = property.split("/");
    let i;
    for (i = 0; i < propertyArray.length - 1; i++) {
        object = object[propertyArray[i]];
    }
    object[propertyArray[i]] = data;
    return object;
}, _Model_parseDatasetAttribute = function _Model_parseDatasetAttribute(element, bindingType) {
    const capitalizedBindingType = __classPrivateFieldGet(this, _Model_instances, "m", _Model_capitalizeFirstCharacter).call(this, bindingType);
    const rawDataset = element.dataset[`bind${capitalizedBindingType}`];
    if (!rawDataset) {
        return;
    }
    const isArray = rawDataset.includes("[") && rawDataset.includes("]");
    // remove whitespace
    let dataset = rawDataset.replace(/\s/g, '');
    // prepare for JSON.parse()
    dataset = dataset.replace(/\[/g, "[\"");
    dataset = dataset.replace(/,/g, "\",\"");
    dataset = dataset.replace(/\]/g, "\"]");
    if (isArray) {
        const datasetsArray = JSON.parse(dataset);
        for (let i = 0; i < datasetsArray.length; i++) {
            datasetsArray[i] = datasetsArray[i].split(">");
        }
        return datasetsArray;
    }
    else {
        const datasetsArray = [];
        datasetsArray.push(rawDataset.replace(/['"]+/g, "").split(">"));
        return datasetsArray;
    }
}, _Model_setListBindingMarker = function _Model_setListBindingMarker(element) {
    // set marker showing that element has list binding
    let bindProperty = element.dataset.bindProperty || "";
    if (bindProperty && bindProperty.slice(-1) === "]") {
        bindProperty = bindProperty.replace(/\]/g, "*]");
        bindProperty = bindProperty.replace(/,/g, "*,");
    }
    else {
        bindProperty += "*";
    }
    element.dataset.bindProperty = bindProperty;
}, _Model_readAndRemoveListBindingMarker = function _Model_readAndRemoveListBindingMarker(propertyArray) {
    let listBinding = false;
    if (propertyArray[propertyArray.length - 1].includes("*")) {
        listBinding = true;
        propertyArray[propertyArray.length - 1] = propertyArray[propertyArray.length - 1].replace(/\*/g, "");
    }
    return {
        listBinding: listBinding,
        propertyArray: propertyArray
    };
}, _Model_capitalizeFirstCharacter = function _Model_capitalizeFirstCharacter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}, _Model_replaceLastOccurrenceOfNumber = function _Model_replaceLastOccurrenceOfNumber(string, oldNumber, newNumber) {
    const index = string.lastIndexOf(oldNumber);
    const array = string.split("");
    array[index] = newNumber;
    for (let i = 1; i < oldNumber.toString().length; i++) {
        array[index + i] = "";
    }
    return array.join("");
};
/**
 * Class representing a data model that is constructed by passing data manually.
 */
export class JSONModel extends Model {
    /**
     * Creates a new data model.
     * @param {string} name - The name of the data model.
     * @param {data} data - The data of the data model.
     */
    constructor(name, data) {
        super(name, data);
        this.initializeSubscribers("list");
        this.initializeSubscribers("property");
    }
}
/**
 * Class representing a data model that is constructed with data that is read from files in a `i18n/` directory.
 */
export class i18nModel extends Model {
    /**
     * Creates a new data model with data that is read from files in a `i18n/` directory.
     * Example for a translation files is `i18n/i18n_de.properties` (`de` for German).
     * Sets the language by reading the URL parameter `language` (e.g. `?language=de` for German).
     * If no URL parameter is present, it gets the browser language.
     * Fallback in all cases is to the read the `i18n/i18n.properties` file.
     * @param {boolean} manualInitialization - Do you want to call `this.initialize()` manually, perhaps if you want to `await` it?
     */
    constructor(manualInitialization) {
        super("i18n", { status: "about to load i18n files..." });
        if (!manualInitialization) {
            this.initialize();
        }
    }
    /**
     * Async method that initializes a new i18n data model.
     * Calls `this.initializeSubscribers("property")` to continue with regular model creation flow.
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const urlParams = new URLSearchParams(window.location.search);
            let languageParameter = urlParams.get("language");
            if (!languageParameter) {
                languageParameter = window.location.hash.split("=")[1];
            }
            if (!languageParameter) {
                languageParameter = navigator.language.substring(0, 2);
            }
            let fileName = `i18n_${languageParameter}.properties`;
            let response = yield fetch(`/i18n/${fileName}`);
            if (response.status === 404) {
                response = yield fetch("/i18n/i18n.properties");
            }
            const result = yield response.text();
            let i18nData = {};
            const keyValuePairs = result.split("\n");
            for (let i = 0; i < keyValuePairs.length; i++) {
                const keyOrValue = keyValuePairs[i].split("=");
                i18nData[keyOrValue[0]] = keyOrValue[1];
            }
            this.data = i18nData;
            this.initializeSubscribers("property");
            return i18nData;
        });
    }
}
