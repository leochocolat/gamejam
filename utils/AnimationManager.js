import * as THREE from 'three';
import gsap from 'gsap';

export default class AnimationManager {
    constructor(options) {
        this.model = options.model;
        this.animations = options.animations;
        this.actions = [];
        this.actionType = {};
        this.mixer = null;
        this.currentAnim = null;
        this._firstPlaying = true;
        this._setupMixer(options.skinnedMesh);

        for (let index = 0; index < this.animations.length; index++) {
            const animation = this.animations[index];
            this._setupMultipleAnimations(animation, animation.name, index);
        }

        this._activateAllActions();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    playAnimation(options) {
        this.currentAnim = this.actionType[options.animation].getClip();
        this.actionType[options.animation].time = 0;

        if (!options.loop) {
            this.actionType[options.animation].clampWhenFinished = true;
            this.actionType[options.animation].loop = THREE.LoopOnce;
        }
        if (options.yoyo) {
            this.actionType[options.animation].clampWhenFinished = true;
            this.actionType[options.animation].loop = THREE.LoopPingPong;
            this.actionType[options.animation].repetitions = 2;
        }

        this._setWeight(this.actionType[options.animation], 1.0);

        this.actionType[options.animation].paused = false;
        this.actionType[options.animation].play();
        if (this._firstPlaying) {
            this._firstPlaying = false;
            gsap.ticker.add((time, deltaTime, frame) => this._update(time, deltaTime, frame));
        }
    }

    revertAnimation(options) {
        this.actionType[options.animation].timeScale = -1;
        this.actionType[options.animation].loop = THREE.LoopOnce;
        // this.actionType[options.animation].paused = true;
    }

    pauseAnimation(options) {
        this.actionType[options.animation].paused = true;
    }

    pauseAllActions() {
        this.actions.forEach((action) => {
            action.paused = true;
        });
    }

    unPauseAllActions() {
        this.actions.forEach((action) => {
            action.paused = false;
        });
    }

    animFade(options) {
        if (!options.loop) {
            this.actionType[options.endAnimation].loop = THREE.LoopOnce;
            this.actionType[options.endAnimation].clampWhenFinished = true;
        }

        this.unPauseAllActions();
        this._setWeight(this.actionType[options.endAnimation], 1);
        this.actionType[options.endAnimation].time = 0;
        this.actionType[options.startAnimation].crossFadeTo(this.actionType[options.endAnimation], options.duration, true);
        this.playAnimation({ animation: options.endAnimation });
    }

    setAnimationProgress(options) {
        this.playAnimation(options);

        const duration = this.currentAnim.duration;
        const progress = duration * options.progress;
        this.actionType[options.animation].paused = true;

        options.animation.time = progress;
    }

    getAnimationProgress(options) {
        return options.animation.time;
    }

    getCurrentAnim() {
        return this.currentAnim.name;
    }

    _update(time, deltaTime, frame) {
        this.mixer.update(deltaTime * 0.001);
    }

    onAnimationComplete(func) {
        this.completeCallback = func;
    }

    /**
     * Private
     */

    _setupMixer(skinnedMesh) {
        this.mixer = new THREE.AnimationMixer(skinnedMesh || this.model.scene);
    }

    _setupMultipleAnimations(action, actionName, animationNumber) {
        this.actionType[actionName] = this.mixer.clipAction(this.animations[animationNumber]);
        this.actions.push(this.actionType[actionName]);
    }

    _setupAnimations(animations) {
        animations.forEach((animation) => {
            this.actionType[animation.name] = this.mixer.clipAction(animation);
            this.actions.push(this.actionType[animation.name]);
        });
    }

    _setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    _activateAllActions(action, actionWeight) {
        this.actions.forEach((action) => {
            this._setWeight(action, 1.0);
            // action.play();
            // action.paused = true;
        });
    }

    _setupEventListeners() {
        this.mixer.addEventListener('finished', (e) => {
            if (this.completeCallback) {
                this.completeCallback(e);
            }
        });
    }
}
