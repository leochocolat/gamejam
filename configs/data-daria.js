const settlers = [
    {
        id: 'Pellatarte',
        targetResourceId: 'bois',
        targetResourceAmount: 4,
        enemy: null,
        color: '#AD79B3',
    },
    {
        id: 'Prespuré',
        targetResourceId: 'bétail',
        targetResourceAmount: 4,
        enemy: 'Moulacake',
        color: '#5EB16F',
    },
    {
        id: 'Moulacake',
        targetResourceId: 'minerai',
        targetResourceAmount: 4,
        enemy: 'Prespuré',
        color: '#E08C5C',
    },
    {
        id: 'Spatulia',
        targetResourceId: 'culture',
        targetResourceAmount: 4,
        enemy: null,
        color: '#666EB2',
    },
];

const resources = [
    { id: 'bois', color: '#274213', index: 0 }, // Vert
    { id: 'bétail', color: '#899237', index: 1 }, // Jaune
    { id: 'minerai', color: '#755447', index: 2 }, // Marron
    { id: 'culture', color: '#FFD478', index: 3 }, // Jaune
];

// #402e0a : Marron
// #0a2e3e : Bleu
// #2d1610 : Marron foncé rouge
// #3f4909 : Vert
// #ffa72f : Jaune

const populations = [
    {
        id: 'choucremien',
        properties: {
            religion: {
                name: 'Selish',
                id: 0,
            },
            language: {
                name: 'Kuri',
                id: 0,
            },
            culture: {
                name: 'Furnisme',
                id: 0,
            },
        },
    },
    {
        id: 'baklavien',
        properties: {
            religion: {
                name: 'Selish',
                id: 0,
            },
            language: {
                name: 'Kurkum',
                id: 1,
            },
            culture: {
                name: 'Furnisme',
                id: 0,
            },
        },
    },
    {
        id: 'crumblien',
        properties: {
            religion: {
                name: 'Selish',
                id: 0,
            },
            language: {
                name: 'Kuri',
                id: 0,
            },
            culture: {
                name: 'Spathisme',
                id: 1,
            },
        },
    },
    {
        id: 'flaonien',
        properties: {
            religion: {
                name: 'Selish',
                id: 0,
            },
            language: {
                name: 'Kurkum',
                id: 1,
            },
            culture: {
                name: 'Spathisme',
                id: 1,
            },
        },
    },
    {
        id: 'kouignien',
        properties: {
            religion: {
                name: 'Sucran',
                id: 1,
            },
            language: {
                name: 'Kuri',
                id: 0,
            },
            culture: {
                name: 'Furnisme',
                id: 0,
            },
        },
    },

    {
        id: 'loukoumien',
        properties: {
            religion: {
                name: 'Selish',
                id: 0,
            },
            language: {
                name: 'Kurkum',
                id: 1,
            },
            culture: {
                name: 'Furnisme',
                id: 0,
            },
        },
    },

    {
        id: 'panettien',
        properties: {
            religion: {
                name: 'Sucran',
                id: 1,
            },
            language: {
                name: 'Kurkum',
                id: 1,
            },
            culture: {
                name: 'Furnisme',
                id: 0,
            },
        },
    },

    {
        id: 'spéculien',
        properties: {
            religion: {
                name: 'Sucran',
                id: 1,
            },
            language: {
                name: 'Kuri',
                id: 0,
            },
            culture: {
                name: 'Spathisme',
                id: 1,
            },
        },
    },

    {
        id: 'tartatien',
        properties: {
            religion: {
                name: 'Sucran',
                id: 1,
            },
            language: {
                name: 'Kurkum',
                id: 1,
            },
            culture: {
                name: 'Spathisme',
                id: 1,
            },
        },
    },
];

export default {
    settlers,
    resources,
    populations,
};
