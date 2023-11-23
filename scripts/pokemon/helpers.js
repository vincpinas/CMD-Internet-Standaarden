import { fetchSprites } from "./queries.js";

export function findNextEvolution(current_evolution) {
    if (current_evolution && current_evolution.evolves_to && current_evolution.evolves_to.length > 0) {
        return current_evolution.evolves_to[0];
    }

    return null;
}

export function formatEvolutionChain(chain) {
    let baby = chain;
    let teen = findNextEvolution(chain);
    let adult = findNextEvolution(teen);
    let formatted_chain = [{}, {}, {}];

    [baby, teen, adult].forEach((evolution, index) => {
        if (!evolution) return;

        let details = evolution && evolution.evolution_details && evolution.evolution_details[0] ? evolution.evolution_details[0] : null;

        let id = evolution.species.url.replace("https://pokeapi.co/api/v2/pokemon-species/", "").replace("/", "")

        fetchSprites(id)
            .then(r => {
                formatted_chain[index].sprites = r
                if(typeof details === "undefined") return;
                formatted_chain[index].details = details
            })
    });


    formatted_chain = [
        { name: baby.species.name },
    ];
    teen ? formatted_chain.push({ name: teen.species.name }) : null,
    adult ? formatted_chain.push({ name: adult.species.name }) : null
    
    return formatted_chain;
}

export function getElements(classRef) {
    classRef.elements = {
        loading: document.querySelector(".c-loading"),
        sprite: document.querySelector(".c-pokemon__detailsSprite img"),
        evolutions: document.querySelector(".c-pokemon__evolutionsList"),
    }
}