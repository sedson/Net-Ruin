const SPAWN_TABLE = {
    soil: [
        { entity: "Flower", spawnRate: 10 }
    ],
    sand: [
        { entity: "Clover", spawnRate: 10 }
    ],
    grass: [
        { entity: "Clover", spawnRate: 10 },
        { entity: "Terminal", spawnRate: 1 }
    ]
}

const TRADES = [
    {
        input: "flower",
        quantity: 2,
        output: "AccessCard",
        accepted: false
    },
    {
        input: "clover",
        quantity: 2,
        output: "AccessCard2",
        accepted: false
    }
]
