let pokemonList = [
    {
        name: 'Bulbasaur',
        height: 0.7,
        types: [
            'grass', 'poison'
        ]
    },
    {
        name: 'Charmander',
        height: 0.6,
        types: [
            'fire'
        ]
    },
    {
        name: 'Charizard',
        height: 1.7,
        types: [
            'fire', 'flying'
        ]
    },
    {
        name: 'Pikachu',
        height: 0.4,
        types: [
            'electric'
        ]
    },
    {
        name: 'Squirtle',
        height: 0.5,
        types: [
            'water'
        ]
    }
];

for (let i = 0; i < pokemonList.length; i++) {
    let bigOne = '';
    // Check if the height is bigger or equal than 1.0m.
    if (pokemonList[i].height >= 1.0) {
        bigOne = ' - Wow, that\'s big!';
    }

    let types = ''
    // Iterates through the types and sets a background color accordingly.
    for (let j = 0; j < pokemonList[i].types.length; j++) {
        let type = pokemonList[i].types[j];
        types += ' ' + `<span class="type ${type}">${type}</span>`;
    }

    // Prints out the Pokemon's name and its height.
    document.write(`${pokemonList[i].name} (height: ${pokemonList[i].height}) (types: ${types})${bigOne}`);
    // Adds breakline after each Pokemon.
    document.body.appendChild(document.createElement("br"));
}