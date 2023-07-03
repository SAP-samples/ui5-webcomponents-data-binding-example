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
        this.name = name
        this.capitalizedName = this.#capitalizeFirstCharacter(name)
        this.data = data
        this.subscribers = {
            list: [],
            property: []
        }
    }

    /**
     * Updates the model data and notifies all subscribers of the model.
     * @param {string} property - The property path in the data object. The path delimiter must be "/". 
     * @param {any} data - The data that is to be set.
     * @returns {object} the updated data object.
     */
    setProperty(property, data) {
        this.#dynamicDeepSetOfObject(this.data, property, data)
        this.#updateSubscribers()
        return this.data
    }

    /**
     * Appends a list item to an existing lists.
     * WARNING: Does not work for lists where the parent list element is bound to more than one property or list of this model.
     * @param {string} property  - The property path in the model pointing to the list.
     * @param {object} data - The data to attach to the list.
     * @returns {HTMLElement} the newly appended list item node.
     */
    appendListItem(property, data) {
        let newNode
        for (let i = 0; i < this.subscribers.list.length; i++) {
            const element = this.subscribers.list[i]
            let allSubscribersAndChildren = Array.from(element.querySelectorAll(`[data-bound-paths-${this.name}]`))
            allSubscribersAndChildren.push(element)
            allSubscribersAndChildren.forEach(boundElementInsideList => {
                const boundPath = boundElementInsideList.dataset[`boundPaths${this.capitalizedName}`]
                if (boundPath == property) {
                    const newIndex = boundElementInsideList.children.length
                    newNode = boundElementInsideList.firstElementChild.cloneNode(true)
                    boundElementInsideList.appendChild(newNode)
                    newNode.querySelectorAll(`[data-bound-paths-${this.name}]`).forEach(element => {
                        const boundPath = element.dataset[`boundPaths${this.capitalizedName}`]
                        if (boundPath) {
                            element.dataset[`boundPaths${this.capitalizedName}`] = this.#replaceLastOccurrenceOfNumber(boundPath, 0, newIndex)
                            this.subscribers.property.push(element)
                            this.#addPossibleTwoWayBinding(element)
                        }
                    })
                    this.setProperty(`${property}/${newIndex}`, data)
                }
            })
        }
        return newNode
    }

    /**
     * Binds an element to a property in the model. The element is then subscribed to the model. 
     * WARNING: Overwrites any existing bindings of the element to this model.
     * @param {HTMLElement} element - The element to bind.
     * @param {string} property - The property path in the model to bind the element to.
     */
    bindElementAndProperty(element, property) {
        element.dataset.bindProperty = `${this.name}>${property}`
        element.dataset[`boundPaths${this.capitalizedName}`] = property
        if (!this.subscribers.property.includes(element)) {
            this.subscribers.property.push(element)
        }
        this.#updateSubscribers()
    }

    /**
     * Initializes all subscribers of the model for a binding type by populating `this.subscribers[bindingType]`.
     * Also saves the full property path in the `data-bound-paths-${modelName}` attribute.
     * Calls `this.#updateSubscribers()`.
     * @param {"list"|"property"} bindingType - The type of binding.
     */
    initializeSubscribers(bindingType) {
        const allPossibleSubscribers = document.querySelectorAll(`[data-bind-${bindingType}]`)
        allPossibleSubscribers.forEach(element => {
            const propertyArrays = this.#parseDatasetAttribute(element, bindingType)
            for (let i = 0; i < propertyArrays.length; i++) {
                if (propertyArrays[i][0]  == this.name) {
                    this.subscribers[bindingType].push(element)
                    if (!element.dataset[`boundPaths${this.capitalizedName}`]) {
                        element.dataset[`boundPaths${this.capitalizedName}`] = this.#getFullPropertyPath(element, bindingType, i)
                    } else {
                        element.dataset[`boundPaths${this.capitalizedName}`] += "+" + this.#getFullPropertyPath(element, bindingType, i)
                    }
                    this.#addPossibleTwoWayBinding(element)
                }
            }
        })
        if (bindingType === "list") {
            for (let i = 0; i < this.subscribers.list.length; i++) {
                const element = this.subscribers.list[i]
                this.#handleCloningOfListElements(element)
            }
        }
        
        this.#updateSubscribers()
    }

    /**
     * Gets the bound data of an item inside a list binding.
     * @param {HTMLElement} The element that is inside a list binding. 
     * @returns {object} the bound data object
     */
    getBoundData(element) {
        let elementWithPath
        while (!elementWithPath) {
            elementWithPath = element.querySelector(`[data-bound-paths-${this.name}]`)
            element = element.parentNode
        }
        const fullPropertyPath = elementWithPath.dataset[`boundPaths${this.capitalizedName}`]
        const pathContainsNumber = /\/\d+\//.test(fullPropertyPath)
        if (!pathContainsNumber) {
            console.error(`The getBoundData() method should only be called for items inside a list binding. This relates to the "${this.name}" data model.`)
            return
        }        
        let lastCharacterIsNumber
        let relevantPropertyString = fullPropertyPath
        while (!lastCharacterIsNumber) {
            relevantPropertyString = relevantPropertyString.split("/").slice(0, -1).join("/")
            lastCharacterIsNumber = /^\d$/.test(relevantPropertyString.charAt(relevantPropertyString.length - 1))
        }
        let relevantPropertyArray = relevantPropertyString.split("/")
        let boundData = this.data
        for (let i = 0; i < relevantPropertyArray.length ; i++) {
            boundData = boundData[relevantPropertyArray[i]]
        }
        return boundData
    }

    /**
     * Handles the cloning elements (items) inside a list. Also considers nested lists.
     * @param {HTMLElement} element - The parent list element.
     */
    #handleCloningOfListElements(element) {
        this.#setListBindingMarker(element)
        const firstChild = element.firstElementChild
        if (!firstChild) {
            console.error(`Whops! Looks like ${element} has a list binding, but doesn't have any children. This relates to the "${this.name}" data model.`)
        }
        const listData = this.#getDataToSetOnElement(element, 0)
        for (let i = 0; i < listData.length; i++) {
            const newNode = firstChild.cloneNode(true)
            // element.appendChild(newNode)
            firstChild.parentNode.insertBefore(newNode, firstChild.nextSibling);
            
            const nestedLists = element.lastElementChild.querySelectorAll("[data-bind-list]")
            nestedLists.forEach(nestedList => {
                const oldBoundPaths = nestedList.dataset[`boundPaths${this.capitalizedName}`]
                nestedList.dataset[`boundPaths${this.capitalizedName}`] = this.#replaceLastOccurrenceOfNumber(oldBoundPaths, 0, i)                
                this.#handleCloningOfListElements(nestedList)
            })
        }
        firstChild.remove()
    }

    /**
     * Updates the properties of all subscribers of the model.
     */
    #updateSubscribers() {
        for (let i = 0; i < this.subscribers.property.length; i++) {
            const element = this.subscribers.property[i]

            const propertyArrays = this.#parseDatasetAttribute(element, "property")      
            // only keep properties from this model
            let relevantPropertyArrays = []
            for (let j = 0; j < propertyArrays.length; j++) {
                if (propertyArrays[j][0] === this.name) {
                    relevantPropertyArrays.push(propertyArrays[j])
                }
            }
            
            for (let k = 0; k < relevantPropertyArrays.length; k++) {
                // account for possible offset in lookup of properties `data-bound-paths-${modelName}` if element also has list binding   
                let offset = this.#readAndRemoveListBindingMarker(relevantPropertyArrays[k]).listBinding ? 1 : 0
                relevantPropertyArrays[k] = this.#readAndRemoveListBindingMarker(relevantPropertyArrays[k]).propertyArray
                const dataToSet = this.#getDataToSetOnElement(element, k + offset)
                let attributeToSet = relevantPropertyArrays[k][2]
                this.#setElementAttribute(element, dataToSet, attributeToSet)
            }
        }
    }

    /**
     * Adds an event listener to an element, if it is of type input, resulting in a two way binding.
     * @param {HTMLElement} element - the element to check and add possibly add an event listener to.
     */
    #addPossibleTwoWayBinding(element) {
        if (element.tagName.includes('INPUT') || element.tagName.includes('TEXTAREA') || element.tagName.includes('DATE-PICKER')) {
            const boundPaths = element.dataset[`boundPaths${this.capitalizedName}`].split("+")
            for (let i = 0; i < boundPaths.length; i++) {
                element.addEventListener("change", (e) => {
                    const element = e.target
                    const property = boundPaths[i]
                    const value = element.value
                    this.setProperty(property, value)
                })
            }
        }
    }

    /**
     * Gets the data from `this.data` that is to be set on an element.
     * @param {HTMLElement} element - The element whose data is to be set.
     * @param {number} pathIndex - The index of the binding in the `data-bind-${bindingType}` attribute array, which is used to get the full property path from `data-bound-paths-${modelName}`.
     * `pathIndex` must always be `0` for list bindings.
     * @returns {any} the data that is to bet set on an element. This can be an array (list binding) or a specific value (property binding).
     */
    #getDataToSetOnElement(element, pathIndex) {
        let dataToSet = this.data
        const boundPaths = element.dataset[`boundPaths${this.capitalizedName}`].split("+")
        const propertyArray = boundPaths[pathIndex].split("/")
        for (let j = 0; j < propertyArray.length; j++) {
            dataToSet = dataToSet[propertyArray[j]]
            if (!dataToSet) {
                break
            }
        }
        if (dataToSet === null || dataToSet === undefined) {
            console.warn(`Whops! The property "${propertyArray.join("/")}" couldn't be found in the "${this.name}" data model.`)
            return ""
        }
        return dataToSet
    }

    /**
     * Gets the full property path in the model that the element is bound to.
     * @param {HTMLElement} element - The element that is bound to the model.
     * @param {"list"|"property"} bindingType - The type of binding.
     * @param {number} pathIndex - The index of the binding in the `data-bind-${bindingType}` attribute array, which is used to get the full property path from `data-bound-paths-${modelName}`.
     * `pathIndex` must always be `0` for list bindings.
     * @returns {string} a string representing the full property path in the model that the element is bound to.
     */
    #getFullPropertyPath(element, bindingType, pathIndex) {
        let propertyPath = this.#parseDatasetAttribute(element, bindingType)[pathIndex][1]
        const closestElementWithListBinding = element.parentElement.closest("[data-bind-list]")
        const parentHasListBinding = closestElementWithListBinding && closestElementWithListBinding != element
        const ignoreItem = element.dataset[`bindListIgnore`]
        if (parentHasListBinding && !ignoreItem) {
            let propertyArray = []
            propertyArray.push(propertyPath)
            
            let childIndex = -1
            const allClonedItems = closestElementWithListBinding.children
            for (let i = 0; i < allClonedItems.length; i++) {
                if (allClonedItems[i].contains(element)) {
                    childIndex = i
                }
            }
            propertyArray.push(childIndex.toString())
            
            const parentPropertyPath = this.#getFullPropertyPath(closestElementWithListBinding, "list", 0)
            propertyArray.push(parentPropertyPath)
            propertyArray.reverse()
            propertyPath = propertyArray.join("/")
            
        }
        return propertyPath
    }

    /**
     * Sets an attribute on an element.
     * @param {HTMLElement} element - The element whose value is to be set.
     * @param {string} value - The value that is to be set.
     * @param {string} attribute - The attribute that is to be set on the element. Defaults to `textContent` if not provided.
     */
    #setElementAttribute(element, value, attribute) {
        if (attribute) {
            element[attribute] = value
        } else {
            element.textContent = value
        }
    }

    /**
     * Dynamically sets a new value for a property path in an object.
     * Custom implementation of https://lodash.com/docs/4.17.15set.
     * @param {object} object - The data object that is to be changed.
     * @param {string} property - The property path in the data object. The path delimiter must be "/".
     * @param {string} data - The data that is to be set.
     * @returns {object} the updated data object.
     */
    #dynamicDeepSetOfObject(object, property, data) {
        const propertyArray = property.split("/")
        let i
        for (i = 0; i < propertyArray.length - 1; i++) {
            object = object[propertyArray[i]]
        }
        object[propertyArray[i]] = data
        return object
    }

    /**
     * Parses the `data-bind-${bindingType}` attribute of an element.
     * @param {HTMLElement} element - The element whose `data-bind-${bindingType}` attribute is to be split.
     * @param {"list"|"property"} bindingType - The type of binding.
     * @returns {Array.<Array.<string>>} an array of arrays. The top-level arrays include the model name [0], property path [1], and optionally the target attribute [2]. 
     */
    #parseDatasetAttribute(element, bindingType) {
        const capitalizedBindingType = this.#capitalizeFirstCharacter(bindingType)
        const rawDataset = element.dataset[`bind${capitalizedBindingType}`]
        if (!rawDataset) {
            return
        }
        const isArray = rawDataset.includes("[") && rawDataset.includes("]")
        // remove whitespace
        let dataset = rawDataset.replace(/\s/g,'')
        // prepare for JSON.parse()
        dataset = dataset.replace(/\[/g, "[\"")
        dataset = dataset.replace(/,/g, "\",\"")
        dataset = dataset.replace(/\]/g, "\"]") 
        if (isArray) {
            const datasetsArray = JSON.parse(dataset)
            for (let i = 0; i < datasetsArray.length; i++) {
                datasetsArray[i] = datasetsArray[i].split(">")
            }
            return datasetsArray
        } else {
            const datasetsArray = []
            datasetsArray.push(rawDataset.replace(/['"]+/g, "").split(">"))
            return datasetsArray
        }
    }

    /**
     * Adds "*" as a marker for an existing list binding on an element's "data-bind-property" attribute.
     * @param {HTMLElement} element - The element that is to be marked.
     */
    #setListBindingMarker(element) {
        // set marker showing that element has list binding
        let bindProperty = element.dataset.bindProperty || ""
        if (bindProperty && bindProperty.slice(-1) === "]") {
            bindProperty = bindProperty.replace(/\]/g, "*]")
            bindProperty = bindProperty.replace(/,/g, "*,")
        } else {
            bindProperty += "*"
        }
        element.dataset.bindProperty = bindProperty
    }

    /**
     * Checks if a list binding marker ("*") exists in the parameter and removes it.
     * @param {string[]} propertyArray - An array representing property path.
     * @returns {{listBinding: boolean, propertyArray: string[]}} an object that includes the `propertyArray` and indicates whether a list binding existed (`listBinding`).
     */
    #readAndRemoveListBindingMarker(propertyArray) {
        let listBinding = false
        if (propertyArray[propertyArray.length - 1].includes("*")) {
            listBinding = true
            propertyArray[propertyArray.length - 1] = propertyArray[propertyArray.length - 1].replace(/\*/g, "")
        }
        return {
            listBinding: listBinding,
            propertyArray: propertyArray
        }
    }

    /**
     * Capitalizes the first character of a string.
     * @param {string} string - The string whose first character is to be capitalized.
     * @returns {string} the capitalized string.
     */
    #capitalizeFirstCharacter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    /**
     * Replaces the last occurrence of the number inside a string with the new number. 
     * @param {string} string - The string containing a number
     * @param {number} oldNumber - The number that is to be replaced.
     * @param {number} newNumber - The new number.
     * @returns {string} the string containing the new number.
     */
    #replaceLastOccurrenceOfNumber(string, oldNumber, newNumber) {
        const index = string.lastIndexOf(oldNumber)
        const array = string.split("")
        array[index] = newNumber
        for (let i = 1; i < oldNumber.toString().length; i++) {
            array[index + i] = ""
        }
        return array.join("")
    }
}

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
        super(name, data)
        this.initializeSubscribers("list")
        this.initializeSubscribers("property")
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
        super("i18n", { status: "about to load i18n files..." })
        if (!manualInitialization) {
            this.initialize()
        }
    }

    /**
     * Async method that initializes a new i18n data model.
     * Calls `this.initializeSubscribers("property")` to continue with regular model creation flow.
     */
    async initialize() {
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
        this.data = i18nData
        this.initializeSubscribers("property")
        return i18nData
    }
}