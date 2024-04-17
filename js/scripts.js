let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    // Adds a new pokemon.
    function add(newPokemon) {
        // Define the expected keys
        const expectedKeys = ['name'];
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
        button.classList.add('pokemon-button');
        button.addEventListener('click', function (event) {
            event.preventDefault();
            showDetails(pokemon);
        });

        // Add button into the list
        listItem.appendChild(button);
        elementPokemonlist.appendChild(listItem);
    }

    // Show details about the pokemon selected.
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            console.log(pokemon);
        });
    }

    // Fetch pokemon list from external API.
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let capitalized =
                    item.name.charAt(0).toUpperCase()
                    + item.name.slice(1);
                let pokemon = {
                    name: capitalized,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        });
    }

    // Fetch pokemon information from external API.
    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // Now we add the details to the item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        }).catch(function (e) {
            console.error(e);
        });
    }

    return {
        add: add,
        getAll: getAll,
        findByName: findByName,
        addListItem: addListItem,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails
    };
})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});