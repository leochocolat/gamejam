;(function() {
    'use strict';

    const root = this;

    const has_require = typeof require !== 'undefined';

    const THREE = root.THREE || (has_require && require('three'));
    if (!THREE) throw new Error('MeshLine requires three.js');

    function memcpy(src, srcOffset, dst, dstOffset, length) {
        let i;

        src = src.subarray || src.slice ? src : src.buffer;
        dst = dst.subarray || dst.slice ? dst : dst.buffer;

        src = srcOffset
            ? src.subarray
                ? src.subarray(srcOffset, length && srcOffset + length)
                : src.slice(srcOffset, length && srcOffset + length)
            : src;

        if (dst.set) {
            dst.set(src, dstOffset);
        } else {
            for (i = 0; i < src.length; i++) {
                dst[i + dstOffset] = src[i];
            }
        }

        return dst;
    }

    class MeshLine extends THREE.BufferGeometry {
        constructor() {
            super();

            this.raycast = MeshLineRaycast;

            this.type = 'MeshLine';
            this.isMeshLine = true;

            this.positions = [];

            this.previous = [];
            this.next = [];
            this.side = [];
            this.width = [];
            this.indices_array = [];
            this.uvs = [];
            this.counters = [];
            this._points = [];
            this._geom = null;

            this.widthCallback = null;

            // Used to raycast
            this.matrixWorld = new THREE.Matrix4();

            Object.defineProperties(this, {
            // this is now a bufferGeometry
            // add getter to support previous api
                geometry: {
                    enumerable: true,
                    get() {
                        return this;
                    },
                },
                geom: {
                    enumerable: true,
                    get() {
                        return this._geom;
                    },
                    set(value) {
                        this.setGeometry(value, this.widthCallback);
                    },
                },
                // for declaritive architectures
                // to return the same value that sets the points
                // eg. this.points = points
                // console.log(this.points) -> points
                points: {
                    enumerable: true,
                    get() {
                        return this._points;
                    },
                    set(value) {
                        this.setPoints(value, this.widthCallback);
                    },
                },
            });
        }

        setMatrixWorld(matrixWorld) {
            this.matrixWorld = matrixWorld;
        }

        // setting via a geometry is rather superfluous
        // as you're creating a unecessary geometry just to throw away
        // but exists to support previous api
        setGeometry(g, c) {
            // as the input geometry are mutated we store them
            // for later retreival when necessary (declaritive architectures)
            this._geometry = g;
            if (g instanceof THREE.Geometry) {
                this.setPoints(g.vertices, c);
            } else if (g instanceof THREE.BufferGeometry) {
                this.setPoints(g.getAttribute('position').array, c);
            } else {
                this.setPoints(g, c);
            }
        }

        setPoints(points, wcb) {
            if (!(points instanceof Float32Array) && !(points instanceof Array)) {
                console.error(
                    'ERROR: The BufferArray of points is not instancied correctly.',
                );
                return;
            }
            // as the points are mutated we store them
            // for later retreival when necessary (declaritive architectures)
            this._points = points;
            this.widthCallback = wcb;
            this.positions = [];
            this.counters = [];
            if (points.length && points[0] instanceof THREE.Vector3) {
                // could transform Vector3 array into the array used below
                // but this approach will only loop through the array once
                // and is more performant
                for (var j = 0; j < points.length; j++) {
                    const p = points[j];
                    var c = j / points.length;
                    this.positions.push(p.x, p.y, p.z);
                    this.positions.push(p.x, p.y, p.z);
                    this.counters.push(c);
                    this.counters.push(c);
                }
            } else {
                for (var j = 0; j < points.length; j += 3) {
                    var c = j / points.length;
                    this.positions.push(points[j], points[j + 1], points[j + 2]);
                    this.positions.push(points[j], points[j + 1], points[j + 2]);
                    this.counters.push(c);
                    this.counters.push(c);
                }
            }

            this.process();
        }

        compareV3(a, b) {
            const aa = a * 6;
            const ab = b * 6;
            return (
                this.positions[aa] === this.positions[ab] &&
            this.positions[aa + 1] === this.positions[ab + 1] &&
            this.positions[aa + 2] === this.positions[ab + 2]
            );
        }

        copyV3(a) {
            const aa = a * 6;
            return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
        }

        process() {
            const l = this.positions.length / 6;

            // this.previous = [];
            // this.next = [];
            this.side = [];
            this.width = [];
            this.indices_array = [];
            this.uvs = [];

            let w;

            // let v;
            // // initial previous points
            // if (this.compareV3(0, l - 1)) {
            //     v = this.copyV3(l - 2);
            // } else {
            //     v = this.copyV3(0);
            // }
            // this.previous.push(v[0], v[1], v[2]);
            // this.previous.push(v[0], v[1], v[2]);

            for (let j = 0; j < l; j++) {
            // sides
                this.side.push(1);
                this.side.push(-1);

                // widths
                if (this.widthCallback) w = this.widthCallback(j / (l - 1));
                else w = 1;
                this.width.push(w);
                this.width.push(w);

                // uvs
                this.uvs.push(j / (l - 1), 0);
                this.uvs.push(j / (l - 1), 1);

                if (j < l - 1) {
                    // points previous to poisitions
                    // v = this.copyV3(j);
                    // this.previous.push(v[0], v[1], v[2]);
                    // this.previous.push(v[0], v[1], v[2]);

                    // indices
                    const n = j * 2;
                    this.indices_array.push(n, n + 1, n + 2);
                    this.indices_array.push(n + 2, n + 1, n + 3);
                }
                // if (j > 0) {
                //     // points after poisitions
                //     v = this.copyV3(j);
                //     this.next.push(v[0], v[1], v[2]);
                //     this.next.push(v[0], v[1], v[2]);
                // }
            }

            // // last next point
            // if (this.compareV3(l - 1, 0)) {
            //     v = this.copyV3(1);
            // } else {
            //     v = this.copyV3(l - 1);
            // }
            // this.next.push(v[0], v[1], v[2]);
            // this.next.push(v[0], v[1], v[2]);

            // redefining the attribute seems to prevent range errors
            // if the user sets a differing number of vertices
            if (!this._attributes || this._attributes.position.count !== this.positions.length) {
                this._attributes = {
                    // position: new THREE.BufferAttribute(new Float32Array(this.positions), 3),
                    // previous: new THREE.BufferAttribute(new Float32Array(this.previous), 3),
                    // next: new THREE.BufferAttribute(new Float32Array(this.next), 3),
                    side: new THREE.BufferAttribute(new Float32Array(this.side), 1),
                    width: new THREE.BufferAttribute(new Float32Array(this.width), 1),
                    uv: new THREE.BufferAttribute(new Float32Array(this.uvs), 2),
                    index: new THREE.BufferAttribute(new Uint16Array(this.indices_array), 1),
                    counters: new THREE.BufferAttribute(new Float32Array(this.counters), 1),
                };
            } else {
                // this._attributes.position.copyArray(new Float32Array(this.positions));
                // this._attributes.position.needsUpdate = true;
                // this._attributes.previous.copyArray(new Float32Array(this.previous));
                // this._attributes.previous.needsUpdate = true;
                // this._attributes.next.copyArray(new Float32Array(this.next));
                // this._attributes.next.needsUpdate = true;
                this._attributes.side.copyArray(new Float32Array(this.side));
                this._attributes.side.needsUpdate = true;
                this._attributes.width.copyArray(new Float32Array(this.width));
                this._attributes.width.needsUpdate = true;
                this._attributes.uv.copyArray(new Float32Array(this.uvs));
                this._attributes.uv.needsUpdate = true;
                this._attributes.index.copyArray(new Uint16Array(this.indices_array));
                this._attributes.index.needsUpdate = true;
            }

            // this.setAttribute('position', this._attributes.position);
            // this.setAttribute('previous', this._attributes.previous);
            // this.setAttribute('next', this._attributes.next);
            this.setAttribute('side', this._attributes.side);
            this.setAttribute('width', this._attributes.width);
            this.setAttribute('uv', this._attributes.uv);
            this.setAttribute('counters', this._attributes.counters);
            this.setIndex(this._attributes.index);

            this.computeBoundingSphere();
            this.computeBoundingBox();
        }

        /**
         * Fast method to advance the line by one position.  The oldest position is removed.
         * @param position
         */
        advance(position) {
            const positions = this._attributes.position.array;
            const previous = this._attributes.previous.array;
            const next = this._attributes.next.array;
            const l = positions.length;

            // PREVIOUS
            memcpy(positions, 0, previous, 0, l);

            // POSITIONS
            memcpy(positions, 6, positions, 0, l - 6);

            positions[l - 6] = position.x;
            positions[l - 5] = position.y;
            positions[l - 4] = position.z;
            positions[l - 3] = position.x;
            positions[l - 2] = position.y;
            positions[l - 1] = position.z;

            // NEXT
            memcpy(positions, 6, next, 0, l - 6);

            next[l - 6] = position.x;
            next[l - 5] = position.y;
            next[l - 4] = position.z;
            next[l - 3] = position.x;
            next[l - 2] = position.y;
            next[l - 1] = position.z;

            this._attributes.position.needsUpdate = true;
            this._attributes.previous.needsUpdate = true;
            this._attributes.next.needsUpdate = true;
        }
    }

    class MeshLineRaycast {
        constructor(raycaster, intersects) {
            const inverseMatrix = new THREE.Matrix4();
            const ray = new THREE.Ray();
            const sphere = new THREE.Sphere();
            const interRay = new THREE.Vector3();
            const geometry = this.geometry;
            // Checking boundingSphere distance to ray

            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(this.matrixWorld);

            if (raycaster.ray.intersectSphere(sphere, interRay) === false) {
                return;
            }

            inverseMatrix.getInverse(this.matrixWorld);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

            const vStart = new THREE.Vector3();
            const vEnd = new THREE.Vector3();
            const interSegment = new THREE.Vector3();
            const step = this instanceof THREE.LineSegments ? 2 : 1;
            const index = geometry.index;
            const attributes = geometry.attributes;

            if (index !== null) {
                const indices = index.array;
                const positions = attributes.position.array;
                const widths = attributes.width.array;

                for (let i = 0, l = indices.length - 1; i < l; i += step) {
                    const a = indices[i];
                    const b = indices[i + 1];

                    vStart.fromArray(positions, a * 3);
                    vEnd.fromArray(positions, b * 3);
                    const width = widths[Math.floor(i / 3)] != undefined ? widths[Math.floor(i / 3)] : 1;
                    const precision = raycaster.params.Line.threshold + (this.material.lineWidth * width) / 2;
                    const precisionSq = precision * precision;

                    const distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);

                    if (distSq > precisionSq) continue;

                    interRay.applyMatrix4(this.matrixWorld); // Move back to world space for distance calculation

                    const distance = raycaster.ray.origin.distanceTo(interRay);

                    if (distance < raycaster.near || distance > raycaster.far) continue;

                    intersects.push({
                        distance,
                        // What do we want? intersection point on the ray or on the segment??
                        // point: raycaster.ray.at( distance ),
                        point: interSegment.clone().applyMatrix4(this.matrixWorld),
                        index: i,
                        face: null,
                        faceIndex: null,
                        object: this,
                    });
                    // make event only fire once
                    i = l;
                }
            }
        }
    }

    THREE.ShaderChunk.meshline_vert = [
        '',
        THREE.ShaderChunk.logdepthbuf_pars_vertex,
        THREE.ShaderChunk.fog_pars_vertex,
        '',
        // 'attribute vec3 previous;',
        // 'attribute vec3 next;',
        'attribute float side;',
        'attribute float width;',
        'attribute float counters;',
        // 'attribute vec3 color;',
        'attribute float lineId;',
        '',
        'attribute vec2 positionUv;',
        'attribute vec2 previousUv;',
        'attribute vec2 nextUv;',
        '',
        'uniform vec2 resolution;',
        'uniform float lineWidth;',
        'uniform vec3 color;',
        'uniform float opacity;',
        'uniform float sizeAttenuation;',
        'uniform highp sampler2D positionMap;',
        'uniform float amount;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying float vCounters;',
        '',
        'vec2 fix( vec4 i, float aspect ) {',
        '',
        '    vec2 res = i.xy / i.w;',
        '    res.x *= aspect;',
        '	 vCounters = counters;',
        '    return res;',
        '',
        '}',
        '',
        'void main() {',
        '',
        '    float aspect = resolution.x / resolution.y;',
        '',
        '    vColor = vec4( color, opacity );',
        '    vUV = uv;',
        '',
        '    mat4 m = projectionMatrix * modelViewMatrix;',

        '    float y = (lineId + 1.0) / amount;',
        '    vec2 pUv = vec2(positionUv.x, y);',
        '    vec3 pos = texture2D(positionMap, pUv).rgb;',
        '    vec4 finalPosition = m * vec4( pos, 1.0 );',

        '    vec2 prevUv = vec2(previousUv.x, y);',
        '    vec3 prev = texture2D(positionMap, prevUv).rgb;',

        '    vec2 nexUv = vec2(nextUv.x, y);',
        '    vec3 nex = texture2D(positionMap, nexUv).rgb;',

        '    vec4 prevPos = m * vec4( prev, 1.0 );',
        '    vec4 nextPos = m * vec4( nex, 1.0 );',
        '',
        '    vec2 currentP = fix( finalPosition, aspect );',
        '    vec2 prevP = fix( prevPos, aspect );',
        '    vec2 nextP = fix( nextPos, aspect );',
        '',
        '    float w = lineWidth * width;',
        '',
        '    vec2 dir;',
        '    if( nextP == currentP ) dir = normalize( currentP - prevP );',
        '    else if( prevP == currentP ) dir = normalize( nextP - currentP );',
        '    else {',
        '        vec2 dir1 = normalize( currentP - prevP );',
        '        vec2 dir2 = normalize( nextP - currentP );',
        '        dir = normalize( dir1 + dir2 );',
        '',
        '        vec2 perp = vec2( -dir1.y, dir1.x );',
        '        vec2 miter = vec2( -dir.y, dir.x );',
        '        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );',
        '',
        '    }',
        '',
        '    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;',
        '    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );',
        '    normal.xy *= .5 * w;',
        '    normal *= projectionMatrix;',
        '    if( sizeAttenuation == 0. ) {',
        '        normal.xy *= finalPosition.w;',
        '        normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;',
        '    }',
        '',
        '    finalPosition.xy += normal.xy * side;',
        '',
        '    gl_Position = finalPosition;',
        '',
        THREE.ShaderChunk.logdepthbuf_vertex,
        THREE.ShaderChunk.fog_vertex && '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        THREE.ShaderChunk.fog_vertex,
        '}',
    ].join('\n');

    THREE.ShaderChunk.meshline_frag = [
        '',
        THREE.ShaderChunk.fog_pars_fragment,
        THREE.ShaderChunk.logdepthbuf_pars_fragment,
        '',
        // 'uniform sampler2D map;',
        // 'uniform sampler2D alphaMap;',
        // 'uniform float useMap;',
        // 'uniform float useAlphaMap;',
        'uniform float useDash;',
        'uniform float dashArray;',
        'uniform float dashOffset;',
        'uniform float dashRatio;',
        'uniform float visibility;',
        'uniform float alphaTest;',
        'uniform vec2 repeat;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying float vCounters;',
        '',
        'void main() {',
        '',
        THREE.ShaderChunk.logdepthbuf_fragment,
        '',
        '    vec4 c = vColor;',
        // '    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );',
        // '    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;',
        '    if( c.a < alphaTest ) discard;',
        '    if( useDash == 1. ){',
        '        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));',
        '    }',
        '    gl_FragColor = c;',
        '    gl_FragColor.a *= step(vCounters, visibility);',
        '',
        THREE.ShaderChunk.fog_fragment,
        '}',
    ].join('\n');

    class MeshLineMaterial extends THREE.ShaderMaterial {
        constructor(parameters) {
            super({
                uniforms: Object.assign({}, THREE.UniformsLib.fog, {
                    lineWidth: { value: parameters.lineWidth || 1 },
                    map: { value: parameters.map },
                    useMap: { value: parameters.useMap },
                    alphaMap: { value: null },
                    useAlphaMap: { value: 0 },
                    color: { value: parameters.color ? new THREE.Color(parameters.color) : new THREE.Color(0xffffff) },
                    opacity: { value: 1 },
                    resolution: { value: new THREE.Vector2(1, 1) },
                    sizeAttenuation: { value: 1 },
                    dashArray: { value: 0 },
                    dashOffset: { value: 0 },
                    dashRatio: { value: 0.5 },
                    useDash: { value: 0 },
                    visibility: { value: 1 },
                    alphaTest: { value: 0 },
                    repeat: { value: new THREE.Vector2(1, 1) },
                    positionMap: { value: parameters.positionMap },
                    amount: { value: parameters.amount },
                }),

                vertexShader: THREE.ShaderChunk.meshline_vert,

                fragmentShader: THREE.ShaderChunk.meshline_frag,
            });

            this.type = 'MeshLineMaterial';
            this.isMeshLineMaterial = true;
            this.transparent = parameters.transparent;
            this.blending = parameters.blending || THREE.NormalBlending;
            this.depthWrite = parameters.depthWrite;
            this.depthTest = parameters.depthTest;
        }

        get lineWidth() {
            return this.uniforms.lineWidth.value;
        }

        set lineWidth(value) {
            this.uniforms.lineWidth.value = value;
        }

        get map() {
            return this.uniforms.map.value;
        }

        set map(value) {
            this.uniforms.map.value = value;
        }

        get useMap() {
            return this.uniforms.useMap.value;
        }

        set useMap(value) {
            this.uniforms.useMap.value = value;
        }

        get alphaMap() {
            return this.uniforms.alphaMap.value;
        }

        set alphaMap(value) {
            this.uniforms.alphaMap.value = value;
        }

        get useAlphaMap() {
            return this.uniforms.useAlphaMap.value;
        }

        set useAlphaMap(value) {
            this.uniforms.useAlphaMap.value = value;
        }

        get color() {
            return this.uniforms.color.value;
        }

        set color(value) {
            this.uniforms.color.value = value;
        }

        // get opacity() {
        //     return this.uniforms.opacity.value;
        // }

        // set opacity(value) {
        //     this.uniforms.opacity.value = value;
        // }

        get resolution() {
            return this.uniforms.resolution.value;
        }

        set resolution(value) {
            this.uniforms.resolution.value = value;
        }

        get sizeAttenuation() {
            return this.uniforms.sizeAttenuation.value;
        }

        set sizeAttenuation(value) {
            this.uniforms.sizeAttenuation.value = value;
        }

        get dashArray() {
            return this.uniforms.dashArray.value;
        }

        set dashArray(value) {
            this.uniforms.dashArray.value = value;
        }

        get dashOffset() {
            return this.uniforms.dashOffset.value;
        }

        set dashOffset(value) {
            this.uniforms.dashOffset.value = value;
        }

        get dashRatio() {
            return this.uniforms.dashRatio.value;
        }

        set dashRatio(value) {
            this.uniforms.dashRatio.value = value;
        }

        get useDash() {
            return this.uniforms.useDash.value;
        }

        set useDash(value) {
            this.uniforms.useDash.value = value;
        }

        get visibility() {
            return this.uniforms.visibility.value;
        }

        set visibility(value) {
            this.uniforms.visibility.value = value;
        }

        // get alphaTest() {
        //     return this.uniforms.alphaTest.value;
        // }

        // set alphaTest(value) {
        //     this.uniforms.alphaTest.value = value;
        // }

        get repeat() {
            return this.uniforms.repeat.value;
        }

        set repeat(value) {
            this.uniforms.repeat.value = value;
        }

        copy(source) {
            this.super(source);

            this.lineWidth = source.lineWidth;
            this.map = source.map;
            this.useMap = source.useMap;
            this.alphaMap = source.alphaMap;
            this.useAlphaMap = source.useAlphaMap;
            this.color.copy(source.color);
            this.opacity = source.opacity;
            this.resolution.copy(source.resolution);
            this.sizeAttenuation = source.sizeAttenuation;
            this.dashArray.copy(source.dashArray);
            this.dashOffset.copy(source.dashOffset);
            this.dashRatio.copy(source.dashRatio);
            this.useDash = source.useDash;
            this.visibility = source.visibility;
            this.alphaTest = source.alphaTest;
            this.repeat.copy(source.repeat);

            return this;
        }
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = {
                MeshLine,
                MeshLineMaterial,
                MeshLineRaycast,
            };
        }
        exports.MeshLine = MeshLine;
        exports.MeshLineMaterial = MeshLineMaterial;
        exports.MeshLineRaycast = MeshLineRaycast;
    } else {
        root.MeshLine = MeshLine;
        root.MeshLineMaterial = MeshLineMaterial;
        root.MeshLineRaycast = MeshLineRaycast;
    }
}.call(this));
