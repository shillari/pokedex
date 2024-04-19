let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

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
        return pokemonList.filter(p => p.name.trim().toLowerCase().includes(pokemon));
    }

    // Initialize the pokemon list on the screen.
    function addListItem(pokemon) {
        // Create pokemon in a list.
        let elementPokemonGrid = $('.pokemon-list');
        let gridItem = $('<li></li>');
        gridItem.addClass('pokemon-list-item list-group-item');
        // Create a button for each pokemon with its event listener.
        let button = $('<button></button>')
                    .attr('data-toggle', 'modal')
                    .attr('data-target', '#exampleModal')
                    .text(pokemon.name)
                    .addClass('btn btn-primary pokemon-button');
        button.on('click', function (event) {
            event.preventDefault();
            showDetails(pokemon);
        });

        // Add button into the list
        gridItem.append(button);
        elementPokemonGrid.append(gridItem);
    }

    // Show details about the pokemon selected.
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            let modalTitle = $('.modal-title');
            let modalBody = $('.modal-body');

            // Clear all existing modal content
            modalTitle.empty();
            modalBody.empty();

            // Modal to show pokemon details.
            modalTitle.removeClass()
                        .addClass('modal-title ' 
                            + pokemon.types[0].type.name)
                        .text(pokemon.name);

            // Pokemon images
            let modalImgFront = $('<img></img>')
                                .addClass('modal-img')
                                .attr('src', pokemon.imageUrlFront);

            let modalImgBack = $('<img></img>')
                               .addClass('modal-img')
                               .attr('src', pokemon.imageUrlBack);

            // Some information about the selected Pokemon.
            let modalHeight = $('<p></p>')
                              .addClass('modal-text')
                              .text('Height: ' + pokemon.height + ' m');

            let modalWeight = $('<p></p>')
                              .addClass('modal-text')
                              .text('Weight: ' + pokemon.weight + ' kg');

            let modalTypes = $('<p>Types: </p>')
                             .addClass('modal-types');
            if (pokemon.types.length === 2) {
                let types = $('<span class="'
                            + pokemon.types[0].type.name
                            + '">' + pokemon.types[0].type.name
                            + '</span> <span class="'
                            + pokemon.types[1].type.name
                            + '">' + pokemon.types[1].type.name
                            + '</span>');
                modalTypes.append(types);
            } else {
                let type = $('<span class="'
                           + pokemon.types[0].type.name
                           + '">' + pokemon.types[0].type.name
                           + '</span>');
                modalTypes.append(type);
            }

            modalBody.append(modalImgFront);
            modalBody.append(modalImgBack);
            modalBody.append(modalHeight);
            modalBody.append(modalWeight);
            modalBody.append(modalTypes);
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
            item.imageUrlFront = details.sprites.front_default;
            item.imageUrlBack = details.sprites.back_default;
            item.height = details.height / 10;
            item.types = details.types;
            item.weight = details.weight / 10;
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

// Event that triggers when something is typed in the search bar.
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = $('.form-search');

    // Function to handle the search
    function handleSearch() {
        const searchTerm = searchInput.val().trim().toLowerCase();
        const filteredPokemon = pokemonRepository.findByName(searchTerm);
        displayFilteredPokemon(filteredPokemon);
    }

    // Event listener for the search input field
    searchInput.on('input', handleSearch);

    // Function to display the filtered Pokémon list
    function displayFilteredPokemon(filteredPokemon) {
        const gridContainer = $('.pokemon-list')
                              .html(''); // Clear previous Pokémon list

        // Add each filtered Pokémon to the grid
        filteredPokemon.forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
    }
});

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});