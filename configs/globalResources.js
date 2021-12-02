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
];
const sounds = [];

export default [...textures, ...models, ...sounds];
