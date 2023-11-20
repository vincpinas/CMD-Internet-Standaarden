import { fetchGraphQL } from "../scripts/helpers.js"

const typeColors = {
    'normal': '#BCBCAC',
    'fighting': '#BC5442',
    'flying': '#669AFF',
    'poison': '#AB549A',
    'ground': '#DEBC54',
    'rock': '#BCAC66',
    'bug': '#ABBC1C',
    'ghost': '#6666BC',
    'steel': '#ABACBC',
    'fire': '#FF421C',
    'water': '#2F9AFF',
    'grass': '#78CD54',
    'electric': '#FFCD30',
    'psychic': '#FF549A',
    'ice': '#78DEFF',
    'dragon': '#7866EF',
    'dark': '#785442',
    'fairy': '#FFACFF',
    'shadow': '#0E2E4C'
};

export default class Pokemon {
    constructor() {
        this.baseUrl = "https://pokeapi.co/api/v2";
        this.species = {};
        this.pokemon = [];
        this.params = new URLSearchParams(window.location.search);

        this.init();
    }

    init() {
        this.fetchPokemonGQL(this.params.get("p")).then(() => {
            this.insertPokemon();
        })
    }

    insertPokemon() {
        console.log(this.pokemon, this.species)
    }

    fetchPokemonGQL(name) {
        const query = `
        query pokemon_details($name: String) {
          species: pokemon_v2_pokemonspecies(where: {name: {_eq: ${name}}}) {
            name
            base_happiness
            is_legendary
            is_mythical
            generation: pokemon_v2_generation {
              name
            }
            habitat: pokemon_v2_pokemonhabitat {
              name
            }
            pokemon: pokemon_v2_pokemons_aggregate(limit: 1) {
              nodes {
                height
                name
                id
                weight
                abilities: pokemon_v2_pokemonabilities_aggregate {
                  nodes {
                    ability: pokemon_v2_ability {
                      name
                    }
                  }
                }
                stats: pokemon_v2_pokemonstats {
                  base_stat
                  stat: pokemon_v2_stat {
                    name
                  }
                }
                types: pokemon_v2_pokemontypes {
                  slot
                  type: pokemon_v2_type {
                    name
                  }
                }
                levelUpMoves: pokemon_v2_pokemonmoves_aggregate(where: {pokemon_v2_movelearnmethod: {name: {_eq: "level-up"}}}, distinct_on: move_id) {
                  nodes {
                    move: pokemon_v2_move {
                      name
                    }
                    level
                  }
                }
                foundInAsManyPlaces: pokemon_v2_encounters_aggregate {
                  aggregate {
                    count
                  }
                }
                fireRedItems: pokemon_v2_pokemonitems(where: {pokemon_v2_version: {name: {_eq: "firered"}}}) {
                  pokemon_v2_item {
                    name
                    cost
                  }
                  rarity
                }
              }
            }
            flavorText: pokemon_v2_pokemonspeciesflavortexts(where: {pokemon_v2_language: {name: {_eq: "en"}}, pokemon_v2_version: {name: {_eq: "firered"}}}) {
              flavor_text
            }
          }
        }
      `

        return fetchGraphQL(
            query,
        ).then(response => {
            let temp = response.data.species[0];

            this.pokemon = temp.pokemon.nodes[0];
            delete temp.pokemon;
            this.species = temp;

            return response.data.species[0]
        })
    }
}

new Pokemon();