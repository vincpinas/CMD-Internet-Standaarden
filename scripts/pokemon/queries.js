import { grab, fetchGraphQL } from "../helpers.js";
import { formatEvolutionChain } from "./helpers.js";

export async function fetchPokemonData(id, class_ref) {
  const query = `
    query pokemon_details($name: String) {
      species: pokemon_v2_pokemonspecies(where: {id: {_eq: ${id}}}) {
        name
        base_happiness
        is_legendary
        is_mythical
        evolution_chain_id
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
            pokemon_v2_pokemonsprites {
              sprites
            }
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
          }
        }
        flavorText: pokemon_v2_pokemonspeciesflavortexts(where: {pokemon_v2_language: {name: {_eq: "en"}}} limit:4) {
          flavor_text
          pokemon_v2_version {
            name
          }
        }
      }
    }`

  return fetchGraphQL(
    query,
  ).then(response => {
    let species = response.data.species[0];

    class_ref.pokemon = species.pokemon.nodes[0];
    class_ref.sprites = JSON.parse(species.pokemon.nodes[0].pokemon_v2_pokemonsprites[0].sprites)
    delete species.pokemon;
    class_ref.species = species;

    return response.data.species[0];
  })
}

export async function fetchEvolutionChain(id, class_ref) {
  let data;

  await grab(`https://pokeapi.co/api/v2/evolution-chain/${id}/`).then(response => {
    data = response;
  })

  return new Promise((resolve, reject) => {
    formatEvolutionChain(data.chain)
      .then(result => {
        class_ref.evolution_chain = result;
        resolve(result)
      });
  });

}

export async function fetchSprites(id) {
  const query = `
  query pokemon_details($id: String) {  
    pokemon: pokemon_v2_pokemon(where: {id: {_eq: ${id}}}) {
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }`

  return fetchGraphQL(
    query,
  ).then(response => {
    return JSON.parse(response.data.pokemon[0].pokemon_v2_pokemonsprites[0].sprites);
  })
}