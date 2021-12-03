import { component } from '../vendor/bidello';

export default class CanvasBackground extends component() {
    init(options) {
        this._width = options.width;
        this._height = options.height;

        this._canvas = this._createCanvas();
        this._ctx = this._canvas.getContext('2d');

        this._drawGradient();
    }

    /**
     * Getters
     */
    get canvas() {
        return this._canvas;
    }

    /**
     * Private
     */
    _createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this._width;
        canvas.height = this._height;
        canvas.style.width = `${this._width}px`;
        canvas.style.height = `${this._height}px`;
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.zIndex = '10000';
        canvas.style.display = 'none';

        document.body.appendChild(canvas);

        return canvas;
    }

    _drawGradient() {
        const gradient = this._ctx.createLinearGradient(0, 0, this._width, 0);
        gradient.addColorStop(0, '#F2C09E');
        gradient.addColorStop(0.2, '#F2C09E');
        gradient.addColorStop(0.4, '#EFEAE1');
        this._ctx.fillStyle = gradient;
        this._ctx.fillRect(0, 0, this._width, this._height);
    }

    /**
     * Resize
     */
    onResize({ width, height }) {
        this._width = width;
        this._height = height;   
        
        this._drawGradient();
    }
}