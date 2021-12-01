export default class Settler {
    constructor({ id, targetResourceId, targetResourceAmount, enemy }) {
        this._id = id;
        this._targetResourceId = targetResourceId;
        this._targetResourceAmount = targetResourceAmount;
        this._enemy = enemy;

        this._chunks = [];
        this._territories = [];
    }
}
