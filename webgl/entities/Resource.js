export default class Resource {
    constructor({ id }) {
        this._id = id;
    }

    /**
     * Getters & Getters
     */
    get id() {
        return this._id;
    }
}
