const textures = [
    // {
    //     name: 'test',
    //     type: 'texture',
    //     path: 'https://picsum.photos/200/300',
    // },
];
const models = [
    {
        name: 'map-test',
        type: 'gltf',
        path: '/models/gamejam_test.gltf',
    }, 
    {
        name:'map-test2',
        type: 'fbx',
        path: '/models/map-test.fbx',
    },
    {
        name: 'gamejam_test',
        type: 'gltf',
        path: '/models/gamejam_test.gltf',
    },
    {
        name: 'map-test-materials',
        type: 'gltf',
        path: '/models/map-test-v2.glb',
    },
];
const sounds = [];

export default [...textures, ...models, ...sounds];
