import { createEl } from "../helpers.js";
import { fetchSprites } from "./queries.js";

export function findNextEvolution(current_evolution) {
    if (current_evolution && current_evolution.evolves_to && current_evolution.evolves_to.length > 0) {
        return current_evolution.evolves_to[0];
    }

    return null;
}

export async function formatEvolutionChain(chain, class_ref) {
    let baby = chain;
    let teen = findNextEvolution(chain);
    let adult = findNextEvolution(teen);
    let formatted_chain = [];

    console.log(chain)

    let fetched_sprites = [];
    let evolution_chain_length = 0;

    [baby, teen, adult].forEach((evolution, index) => {
        if (!evolution) return;
        evolution_chain_length += 1;

        let details = evolution && evolution.evolution_details && evolution.evolution_details[0] ? evolution.evolution_details[0] : null;

        let id = evolution.species.url.replace("https://pokeapi.co/api/v2/pokemon-species/", "").replace("/", "")

        fetchSprites(id)
            .then(r => {
                formatted_chain[index] = {};
                formatted_chain[index].name = evolution.species.name
                formatted_chain[index].sprites = r
                if (typeof details === "undefined") return;
                formatted_chain[index].details = details

                fetched_sprites.push(r);
            })
    });

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (fetched_sprites.length === evolution_chain_length) {
                class_ref.evolution_chain_length = evolution_chain_length;
                class_ref.evolution_chain_sprites = fetched_sprites;
                clearInterval(interval);
                resolve(formatted_chain);
            }
        }, 10);
    })
}

export function getElements(class_ref) {
    class_ref.elements = {
        loading: document.querySelector(".c-loading"),
        sprite: document.querySelector(".c-pokemon__detailsSprite img"),
        evolutions: document.querySelector(".c-pokemon__evolutionsList"),
        evolutions_placeholder: document.querySelector(".c-pokemon__evolutionsList li p").parentElement,
        details: {
            name: { td: document.querySelector(".c-pokemon__detailsName td"), th: document.querySelector(".c-pokemon__detailsName th") },
            id: { td: document.querySelector(".c-pokemon__detailsId td"), th: document.querySelector(".c-pokemon__detailsId th") },
            types: { td: document.querySelector(".c-pokemon__detailsTypes td"), th: document.querySelector(".c-pokemon__detailsTypes th") },
            height: { td: document.querySelector(".c-pokemon__detailsHeight td"), th: document.querySelector(".c-pokemon__detailsHeight th") },
            weight: { td: document.querySelector(".c-pokemon__detailsWeight td"), th: document.querySelector(".c-pokemon__detailsWeight th") },
            abilities: { td: document.querySelector(".c-pokemon__detailsAbilities td"), th: document.querySelector(".c-pokemon__detailsAbilities th") },
        },
    }
}

export function createItemUrl(item_name) {
    return `<a href="https://pokemondb.net/item/${item_name}" target="_blank">${item_name.replace("-", " ")}</a>`
}