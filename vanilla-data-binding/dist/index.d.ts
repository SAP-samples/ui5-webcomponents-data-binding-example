/**
 * Class representing a data model that is constructed by passing data manually.
 */
export class JSONModel extends Model {
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
    constructor(manualInitialization: boolean);
    /**
     * Async method that initializes a new i18n data model.
     * Calls `this.initializeSubscribers("property")` to continue with regular model creation flow.
     */
    initialize(): Promise<{}>;
}
/**
 * Base class representing a data model.
 */
declare class Model {
    /**
     * Creates a new data model.
     * @param {string} name - The name of the data model.
     * @param {object} data - The data of the data model.
     */
    constructor(name: string, data: object);
    name: string;
    capitalizedName: string;
    data: any;
    subscribers: {
        list: any[];
        property: any[];
    };
    /**
     * Updates the model data and notifies all subscribers of the model.
     * @param {string} property - The property path in the data object. The path delimiter must be "/".
     * @param {any} data - The data that is to be set.
     * @returns {object} the updated data object.
     */
    setProperty(property: string, data: any): object;
    /**
     * Appends a list item to an existing lists.
     * WARNING: Does not work for lists where the parent list element is bound to more than one property or list of this model.
     * @param {string} property  - The property path in the model pointing to the list.
     * @param {object} data - The data to attach to the list.
     * @returns {object} the updated data object.
     */
    appendListItem(property: string, data: object): object;
    /**
     * Binds an element to a property in the model. The element is then subscribed to the model.
     * WARNING: Overwrites any existing bindings of the element to this model.
     * @param {HTMLElement} element - The element to bind.
     * @param {string} property - The property path in the model to bind the element to.
     */
    bindElementAndProperty(element: HTMLElement, property: string): void;
    /**
     * Initializes all subscribers of the model for a binding type by populating `this.subscribers[bindingType]`.
     * Also saves the full property path in the `data-bound-paths-${modelName}` attribute.
     * Calls `this.#updateSubscribers()`.
     * @param {"list"|"property"} bindingType - The type of binding.
     */
    initializeSubscribers(bindingType: "list" | "property"): void;
    #private;
}
export {};
