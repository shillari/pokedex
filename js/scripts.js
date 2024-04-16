let pokemonRepository = (function () {
    let pokemonList = [
        {
            name: 'Bulbasaur',
            height: 0.7,
            types: [
                'grass', 'poison'
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

    // Adds a new pokemon.
    function add(newPokemon) {
        // Define the expected keys
        const expectedKeys = ['name', 'height', 'types'];
        if (typeof newPokemon !== 'object'
            || !expectedKeys.every(key => Object.keys(newPokemon).includes(key))) {
            console.warn('Invalid Pokemon.');
            return;
        }
        pokemonList.push(newPokemon);
    }

    // Gets all pokemon in the list.
    function getAll() {
        return pokemonList;
    }

    // Finds a single pokemon by name.
    function findByName(pokemon) {
        return pokemonList.filter(p => p.name === pokemon);
    }

    return {
        add: add,
        getAll: getAll,
        findByName: findByName
    };
})();

function printPokemonDetails(pokemons) {
    pokemons.forEach(pokemon => {
        // Check if the height is bigger or equal than 1.0m.
        let bigOne = checkIfBigPokemon(pokemon.height);
        // Iterates through the types and sets a background color accordingly.
        let types = getTypesFormatted(pokemon.types);
        // Prints out the Pokemon's name and its height.
        document.write(`${pokemon.name} (height: ${pokemon.height}) (types: ${types})${bigOne}`);
        // Adds breakline after each Pokemon.
        document.body.appendChild(document.createElement("br"));
    });
}

function getTypesFormatted(types) {
    let t = ''
    types.forEach(type => 
        t += ` <span class="type ${type}">${type}</span>`);
    return t;
}

function checkIfBigPokemon(height) {
    if (height >= 1.0) {
        return ' - Wow, that\'s big!';
    }
    return '';
}

/*
    Exemple to add a new pokemon.
let p = {
    name: 'Pidgey',
    height: 0.3,
    types: [
        'flying', 'normal'
    ]
};
pokemonRepository.add(p);
*/
printPokemonDetails(pokemonRepository.getAll());
//console.log(pokemonRepository.findByName('Pikachu'));