const settlers = [
    {
        id: 'a',
        targetResourceId: 'resource-a',
        targetResourceAmount: 1,
        enemy: 'b',
        color: 'red',
    },
    {
        id: 'b',
        targetResourceId: 'resource-b',
        targetResourceAmount: 2,
        enemy: 'a',
        color: 'green',
    },
    {
        id: 'c',
        targetResourceId: 'resource-c',
        targetResourceAmount: 2,
        enemy: null,
        color: 'blue',
    },
    {
        id: 'c',
        targetResourceId: 'resource-a',
        targetResourceAmount: 1,
        enemy: null,
        color: 'yellow',
    },
];

const resources = [
    { id: 'resource-a' },
    { id: 'resource-b' },
    { id: 'resource-c' },
    { id: 'resource-d' },
];

const populations = [
    {
        id: 'population-a',
        properties: {
            religion: 'religion-a',
            language: 'language-a',
            culture: 'culture-a',
        },
    },
    {
        id: 'population-b',
        properties: {
            religion: 'religion-a',
            language: 'language-b',
            culture: 'culture-b',
        },
    },
    {
        id: 'population-c',
        properties: {
            religion: 'religion-b',
            language: 'language-a',
            culture: 'culture-b',
        },
    },
    {
        id: 'population-d',
        properties: {
            religion: 'religion-c',
            language: 'language-b',
            culture: 'culture-b',
        },
    },
    {
        id: 'population-e',
        properties: {
            religion: 'religion-b',
            language: 'language-c',
            culture: 'culture-a',
        },
    },
];

export default {
    settlers,
    resources,
    populations,
};
