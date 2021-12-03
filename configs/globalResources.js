const textures = [
    // {
    //     name: 'test',
    //     type: 'texture',
    //     path: 'https://picsum.photos/200/300',
    // },
];
const models = [
    {
        name: 'gamejam_test',
        type: 'gltf',
        path: '/models/gamejam_test.gltf',
    },
    {
        name: 'map-test-materials',
        type: 'gltf',
        path: '/models/map-test-v4.gltf',
    },
    {
        name: 'map-test-perso',
        type: 'gltf',
        path: '/models/map-test-perso-v2.gltf',
    },
    // War items
    {
        name: 'pin-bombe-anim',
        type: 'gltf',
        path: '/models/pin-bombe-anim.glb',
    },
    {
        name: 'pin-revolution-anim',
        type: 'gltf',
        path: '/models/pin-revolution-anim.glb',
    },
    {
        name: 'pin-guerre-anim',
        type: 'gltf',
        path: '/models/pin-guerre-anim.glb',
    },

];
const sounds = [];

export default [...textures, ...models, ...sounds];
