// Controls where the entities will spawn
// Spawn rate is a percentage is X of 100 soil tiles will have a flower
const SPAWN_TABLE = {
    soil: [
        { entity: "Flower", spawnRate: 3 }
    ],
    sludge: [
        { entity: "Gem", spawnRate: 6 }
    ],
    ash: [
        { entity: "Ring", spawnRate: 4 }
    ],
    snow: [
        { entity: "Shine", spawnRate: 3}
    ],
    terra: [
        { entity: "Apple", spawnRate: 10 }
    ]
};

// These constants are helpful for looping through to make GUI stuff
// but all game data should exist in one place
// todo - clean this up
const ITEM_NAMES = ["apple", "flower", "gem", "ring", "shine"];

let OUTFIT_SCORE_MIN = 4;

const ITEM_CHARS = {
    apple: "•",
    flower: "*",
    gem: "♦",
    ring: "◦",
    shine: "☼"
}
const GARMENT_TYPES = ["head", "torso", "legs", "feet"];

// All of the options for the garment randomizer
const GARMENTS = {
    head: [
        "cap",
        "cyber goggles",
        "helmet",
        "beanie",
    ],
    torso: [
        "tee shirt",
        "track jacket",
        "sweater",
        "smock",
        "blazer"
    ],
    legs: [
        "jeans",
        "leggings",
        "cargo pants",
        "track pants",
        "gym shorts",
        "skirt",
    ],
    feet: [
        "sneakers",
        "cowboy boots",
        "sandals",
        "cyber boots"
    ],
    colors: [
        "pink",
        "black",
        "yellow",
        "nylon",
        "striped",
        "leather",
        "shiny",
        "glossy"
    ],
    specialWords: [
        "cool",
        "fancy",
        "designer",
        "vintage",
    ]
};
