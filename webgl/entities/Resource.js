export default class Resource {
    constructor({ id, index }) {
        this._id = id;
        this._index = index;
    }

    /**
     * Getters & Getters
     */
    get id() {
        return this._id;
    }

    get index() {
        return this._index;
    }
}
