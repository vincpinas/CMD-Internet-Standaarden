import { createEl, typeColors } from "../helpers.js"
import { getElements } from "./helpers.js";
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

    fetchPokemonData(pokemon_name, this)
      .then(() => fetchEvolutionChain(this.species.evolution_chain_id, this))
      .then(() => getElements(this))
      .then(() => this.insertPokemon())
      .then(() => this.removeLoadingScreen())
  }

  insertPokemon() {
    if (!this.elements.sprite) return;

    this.elements.sprite.src = this.sprites.versions["generation-v"]["black-white"].animated.front_default

    setTimeout(() => {
      if (!this.evolution_chain[1]) return;

      const temp = document.querySelector(".c-pokemon__evolutionsList li p").parentElement

      if (temp) temp.remove();

      this.evolution_chain.forEach((evolution, index) => {
        const evo = createEl("li", { class: "c-pokemon__evolutionsStage" })
        evo.appendChild(createEl("img", { src: evolution.sprites.front_default }))

        const next = createEl("li", { class: "c-pokemon__evolutionsNext" })
        next.appendChild(createEl("img", { src: "./assets/icons/arrow.png" }))

        if (this.evolution_chain[index + 1] && this.evolution_chain[index + 1].details && this.evolution_chain[index + 1].details.min_level) {
          next.appendChild(createEl("p", { innerHTML: `level ${this.evolution_chain[index + 1].details.min_level}` }))
        }

        this.elements.evolutions.appendChild(evo)

        if (index + 1 >= this.evolution_chain.length) return;

        this.elements.evolutions.appendChild(next)
      })
    }, 400)
  }

  removeLoadingScreen() {
    if (!this.elements.loading) return;

    this.elements.loading.classList.add("inactive");
  }
}

new Pokemon();