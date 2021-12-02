const settlers = [
    {
        id: 'Pellatarte',
        targetResourceId: 'bois',
        targetResourceAmount: 4,
        enemy: null,
        color: 'red',
    },
    {
        id: 'Prespuré',
        targetResourceId: 'bétail',
        targetResourceAmount: 4,
        enemy: 'Moulacake',
        color: 'green',
    },
    {
        id: 'Moulacake',
        targetResourceId: 'minerai',
        targetResourceAmount: 4,
        enemy: 'Prespuré',
        color: 'blue',
    },
    {
        id: 'Spatulia',
        targetResourceId: 'culture',
        targetResourceAmount: 4,
        enemy: null,
        color: 'yellow',
    },
];

const resources = [
    { id: 'bois' },
    { id: 'bétail' },
    { id: 'minerai' },
    { id: 'culture' },
];

const populations = [
    {
        id: 'choucremien',
        properties: {
            religion: 'Selish',
            language: 'Kuri',
            culture: 'Furnisme',
        },
    },
    {
        id: 'baklavien',
        properties: {
            religion: 'Selish',
            language: 'Kurkum',
            culture: 'Furnisme',
        },
    },
    {
        id: 'crumblien',
        properties: {
            religion: 'Selish',
            language: 'Kuri',
            culture: 'Spathisme',
        },
    },
    {
        id: 'flaonien',
        properties: {
            religion: 'Selish',
            language: 'Kurkum',
            culture: 'Spathisme',
        },
    },
    {
        id: 'kouignien',
        properties: {
            religion: 'Sucran',
            language: 'Kuri',
            culture: 'Furnisme',
        },
    },
    
     {
        id: 'loukoumien',
        properties: {
            religion: 'Selish',
            language: 'Kurkum',
            culture: 'Furnisme',
        },
    },
    
     {
        id: 'panettien',
        properties: {
            religion: 'Sucran',
            language: 'Kurkum',
            culture: 'Furnisme',
        },
    },
    
     {
        id: 'spéculien',
        properties: {
            religion: 'Sucran',
            language: 'Kuri',
            culture: 'Spathisme',
        },
    },
    
     {
        id: 'tartatien',
        properties: {
            religion: 'Sucran',
            language: 'Kurkum',
            culture: 'Spathisme',
        },
    },
];

export default {
    settlers,
    resources,
    populations,
};
