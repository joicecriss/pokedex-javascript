
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type =  type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPodemonDetail = (pokemon) => {
    //novo fetch para o url do pokemon e convertendo a response que ele der em json
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    
    //buscando a nossa lista de pokemons
    return fetch(url)
        //isso nos da um http response, estamos convertendo para json
        .then((response) => response.json())
        //o json vem com muito conteúdo/detalhes, aqui pegamos apenas a lista de pokemons
        .then((jsonBody) => jsonBody.results)
        //aqui mapeamos a lista de pokemons em uma lista de requisições do detalhes dos pokemons (função)
        .then((pokemons) => pokemons.map(pokeApi.getPodemonDetail))
        //estamos com a lista de requisição
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
