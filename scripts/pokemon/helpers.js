import { fetchSprites } from "./queries.js";

export function findNextEvolution(current_evolution) {
    if (current_evolution && current_evolution.evolves_to && current_evolution.evolves_to.length > 0) {
        return current_evolution.evolves_to[0];
    }

    return null;
}

export async function formatEvolutionChain(chain) {
    let baby = chain;
    let teen = findNextEvolution(baby);
    let adult = findNextEvolution(teen);
    let formatted_chain = [];

    let fetched_sprites = [];
    let evolution_chain_length = 0;

    [baby, teen, adult].forEach((evolution, index) => {
        if (!evolution) return;
        evolution_chain_length += 1;

        let details = evolution && evolution.evolution_details && evolution.evolution_details[0] ? evolution.evolution_details[0] : null;

        let id = evolution.species.url.replace("https://pokeapi.co/api/v2/pokemon-species/", "").replace("/", "")

        fetchSprites(id)
        .then(r => {
                if (typeof details === "undefined") return;
                formatted_chain[index] = {};
                formatted_chain[index].id = Number(id);
                formatted_chain[index].name = evolution.species.name;
                formatted_chain[index].sprites = r;
                formatted_chain[index].details = details;

                fetched_sprites.push(r);
            })
    });

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (fetched_sprites.length === evolution_chain_length) {
                clearInterval(interval);
                resolve(formatted_chain);
            }
        }, 10);
    })
}

export function createItemUrl(item_name) {
    return `<a href="https://pokemondb.net/item/${item_name}" target="_blank">${item_name.replace("-", " ")}</a>`
}