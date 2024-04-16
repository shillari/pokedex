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
        },
        {
            name: 'Pidgey',
            height: 0.3,
            types: [
                'flying', 'normal'
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

    // Initialize the pokemon list on the screen.
    function addListItem(pokemon) {
        // Create pokemon in a list.
        let elementPokemonlist = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        
        // Create a button for each pokemon with its event listener.
        button.innerText = pokemon.name;
        button.classList.add('pokemon-button', pokemon.types[0]);
        button.addEventListener('click', function(event) {
            event.preventDefault();
            showDetails(pokemon);
        });
        
        // Add button into the list
        listItem.appendChild(button);
        elementPokemonlist.appendChild(listItem);
    }

    // Show details about the pokemon selected.
    function showDetails(pokemon) {
        console.log(`${pokemon.name} (height: ${pokemon.height})`);
    }

    return {
        add: add,
        getAll: getAll,
        findByName: findByName,
        addListItem: addListItem,
        showDetails: showDetails
    };
})();

function initializePokemonList(pokemons) {
    pokemons.forEach(pokemon => {
        pokemonRepository.addListItem(pokemon);
    });
}

initializePokemonList(pokemonRepository.getAll());