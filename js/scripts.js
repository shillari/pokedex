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
        return pokemonList.filter(p => p.name.trim().toLowerCase().includes(pokemon));
    }

    // Initialize the pokemon list on the screen.
    function addListItem(pokemon) {
        // Create pokemon in a list.
        let elementPokemonGrid = document.querySelector('.grid');
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid__item');
        let button = document.createElement('button');

        // Create a button for each pokemon with its event listener.
        button.innerText = pokemon.name;
        button.classList.add('pokemon-button');
        button.addEventListener('click', function (event) {
            event.preventDefault();
            showDetails(pokemon);
        });

        // Add button into the list
        gridItem.appendChild(button);
        elementPokemonGrid.appendChild(gridItem);
    }

    // Show details about the pokemon selected.
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            let modalContainer = document.querySelector('#modal-container');
            // Clear all existing modal content
            modalContainer.innerHTML = '';
            modalContainer.addEventListener('click', (e) => {
                // Since this is also triggered when clicking INSIDE the modal
                // We only want to close if the user clicks directly on the overlay
                let target = e.target;
                if (target === modalContainer) {
                  hideModal();
                }
              });

            // Modal to show pokemon details.
            let modal = document.createElement('div');
            modal.classList.add('modal');

            // Button to close modal.
            let closeButton = document.createElement('button');
            closeButton.classList.add('modal-button__close');
            closeButton.innerHTML = '<i class="fa fa-times"></i>';
            closeButton.addEventListener('click', hideModal);

            // Modal's title.
            let modalTitle = document.createElement('h1');
            modalTitle.classList.add('modal-title', pokemon.types[0].type.name);
            modalTitle.innerText = pokemon.name;

            // Pokemon images
            let modalImgFront = document.createElement('img');
            modalImgFront.classList.add('modal-img');
            modalImgFront.src = pokemon.imageUrlFront;

            let modalImgBack = document.createElement('img');
            modalImgBack.classList.add('modal-img');
            modalImgBack.src = pokemon.imageUrlBack;

            // Some information about the selected Pokemon.
            let modalHeight = document.createElement('p');
            modalHeight.classList.add('modal-text');
            modalHeight.innerText = 'Height: ' + pokemon.height + ' m';

            let modalWeight = document.createElement('p');
            modalWeight.classList.add('modal-text');
            modalWeight.innerText = 'Weight: ' + pokemon.weight + ' kg';

            let modalTypes = document.createElement('p');
            modalTypes.classList.add('modal-types');
            if (pokemon.types.length === 2) {
                modalTypes.innerHTML = 'Types: <span class="'
                    + pokemon.types[0].type.name
                    + '">' + pokemon.types[0].type.name
                    + '</span> <span class="'
                    + pokemon.types[1].type.name
                    + '">' + pokemon.types[1].type.name
                    + '</span>';
            } else {
                modalTypes.innerHTML = 'Types: <span class="'
                    + pokemon.types[0].type.name
                    + '">' + pokemon.types[0].type.name
                    + '</span>';
            }

            modalContainer.appendChild(modal);
            modal.appendChild(closeButton);
            modal.appendChild(modalTitle);
            modal.appendChild(modalImgFront);
            modal.appendChild(modalImgBack);
            modal.appendChild(modalHeight);
            modal.appendChild(modalWeight);
            modal.appendChild(modalTypes);

            modalContainer.classList.add('is-visible');
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

// Hide the modal.
function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.remove('is-visible');
}

// Hide the modal when is visible and when the escape is pressed.
window.addEventListener('keydown', (e) => {
    let modalContainer = document.querySelector('#modal-container');
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();
    }
});

// Event that triggers when something is typed in the search bar.
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.form-search');

    // Function to handle the search
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredPokemon = pokemonRepository.findByName(searchTerm);
        displayFilteredPokemon(filteredPokemon);
    }

    // Event listener for the search input field
    searchInput.addEventListener('input', handleSearch);

    // Function to display the filtered Pokémon list
    function displayFilteredPokemon(filteredPokemon) {
        const gridContainer = document.querySelector('.grid');
        gridContainer.innerHTML = ''; // Clear previous Pokémon list

        // Add each filtered Pokémon to the grid
        filteredPokemon.forEach(function(pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
    }
});

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});