import { createEl, typeColors } from "../helpers.js"
import { createItemUrl, getElements } from "./helpers.js";
import { fetchEvolutionChain, fetchPokemonData } from "./queries.js"

export default class Pokemon {
  constructor() {
    this.params = new URLSearchParams(window.location.search);
    this.pokemon = {};
    this.species = {};
    this.evolution_chain = [];

    this.init();
  }

  init() {
    let pokemon_name = this.params.get("p");

    getElements(this);

    fetchPokemonData(pokemon_name, this)
      .then(() => fetchEvolutionChain(this.species.evolution_chain_id, this))
      .then(() => this.insertPokemon())
      .then(() => this.removeLoadingScreen())
  }

  async insertPokemon() {
    if (!this.elements.sprite) return;

    // Insert details sprite
    this.elements.sprite.src = this.sprites.versions["generation-v"]["black-white"].animated.front_default||this.sprites.versions["generation-v"]["black-white"].front_default;
    this.elements.sprite.alt = "pokemon sprite";

    // Insert details info
    console.log(this)
    this.elements.details.name.td.innerHTML = this.pokemon.name;
    this.elements.details.id.td.innerHTML = `#${this.pokemon.id}`;
    this.elements.details.height.td.innerHTML = this.getHeight();
    this.elements.details.weight.td.innerHTML = this.getWeight();
    
    // Insert evolution chain.
    if (this.evolution_chain.length <= 1) return;
    if (this.elements.evolutions_placeholder) this.elements.evolutions_placeholder.remove();
    this.evolution_chain.forEach((evolution, index) => {
      const evo = createEl("li", { class: "c-pokemon__evolutionsStage" })
      evo.appendChild(createEl("img", { src: evolution.sprites.front_default }))
      evo.appendChild(createEl("p", { innerHTML: evolution.name }))

      const next = createEl("li", { class: "c-pokemon__evolutionsNext" })
      next.appendChild(createEl("img", { src: "./assets/icons/arrow.png" }))


      if (this.evolution_chain[index + 1] && this.evolution_chain[index + 1].details) {
        next.appendChild(createEl("p", { innerHTML: this.getEvolutionTrigger(this.evolution_chain[index + 1].details) }))
      }

      this.elements.evolutions.appendChild(evo)

      if (index + 1 >= this.evolution_chain.length) return;

      this.elements.evolutions.appendChild(next)
    })
  }

  getHeight() {
    return `${this.pokemon.height / 10}m (${Math.floor(((this.pokemon.height / 3.048) + Number.EPSILON) * 100) / 100}″)`;
  }

  getWeight() {
    return `${this.pokemon.weight / 10}kg (${Math.floor(((this.pokemon.weight / 10 * 2.205) + Number.EPSILON) * 10) / 10} lbs)`
  }

  getEvolutionTrigger(details) {
    if (!details) return;

    Object.keys(details).forEach((property) => details[property] == null && delete details[property]);

    switch (details.trigger.name) {
      case "level-up":
        if (details.min_happiness && details.held_item && details.min_level) return `Level ${details.min_level}, ${details.min_happiness} happinness & ${createItemUrl(details.held_item.name)} held`;
        else if (details.held_item && details.time_of_day) return `Level at ${details.time_of_day} holding ${createItemUrl(details.held_item.name)}`
        else if (details.held_item && details.min_level) return `Level ${details.min_level} holding ${details.held_item.replace("-", " ")}`;
        else if (details.min_happiness && details.min_level) return `Level ${details.min_level} with ${details.min_happiness} happiness`;
        else if (details.min_beauty && details.min_level) return `Level ${details.min_level} with ${details.min_beauty} beauty`;
        else if (details.location && details.min_level) return `Level ${details.min_level} at ${details.location.name.replace("-", " ")}`
        else if (details.min_beauty) return `${details.min_beauty} minimum beauty`;
        else if (details.location) return `Level up at ${details.location.name.replace("-", " ")}`;
        else if (details.min_level) return `Level ${details.min_level}`;
        else if (details.held_item) return `Level holding ${createItemUrl(details.held_item.name)}`
        else if (details.min_happiness) return `${details.min_happiness} minimum happiness`;
        break;
      case "trade":
        if(details.held_item) return `Trade holding ${createItemUrl(details.held_item.name)}`
        else return "Trade";
      case "use-item":
        if (details.item) return `Use ${createItemUrl(details.item.name)}`
        break;
      default: return "";
    }
  }

  removeLoadingScreen() {
    if (!this.elements.loading) return;

    this.elements.loading.classList.add("inactive");
  }
}

new Pokemon();