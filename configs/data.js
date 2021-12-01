const settlers = [
    {
        id: 'a',
        targetResourceId: 'resource-a',
        targetResourceAmount: 1,
        enemy: 'b',
    },
    {
        id: 'b',
        targetResourceId: 'resource-b',
        targetResourceAmount: 2,
        enemy: 'a',
    },
    {
        id: 'c',
        targetResourceId: 'resource-c',
        targetResourceAmount: 2,
        enemy: null,
    },
    {
        id: 'c',
        targetResourceId: 'resource-a',
        targetResourceAmount: 1,
        enemy: null,
    },
];

export default {
    settlers,
};
