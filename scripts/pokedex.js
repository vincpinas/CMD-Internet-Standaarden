import { createEl, fetchGraphQL, typeColors, injectCSS } from "../scripts/helpers.js"


export default class Pokedex {
    constructor() {
        this.pokemon = [];
        this.lastViewed = JSON.parse(localStorage.getItem("lastViewed"));

        this.init();
    }

    init() {

        this._registerSearchHandler();

        if(this.lastViewed && this.lastViewed.length > 0) {
            this.insertLastViewed(this.lastViewed, document.querySelector(".c-pokedex__recentList"));
        }

        this.fetchPokedexGQL()
            .then(() => this.insertPokemon(this.pokemon, document.querySelector(".c-pokedex__gridItems")));
    }

    async fetchPokedexGQL(limit = 151, offset = 0) {
        const query = `
            query PokedexListQuery {
                    pokemon_v2_pokemon(limit: ${limit}, offset: ${offset}) {
                        id
                        name
                    pokemon_v2_pokemontypes {
                        pokemon_v2_type {
                            name
                        }
                    }
                    pokemon_v2_pokemonsprites {
                        sprites
                    }
                }
            }
        `

        return fetchGraphQL(
            query,
        ).then(response => {
            this.pokemon = response.data.pokemon_v2_pokemon
            return response.data.pokemon_v2_pokemon;
        })
    }

    insertLastViewed(recents, container) {
        const recents_css = `.c-pokedex__recentList{grid-template-columns: repeat(${recents.length}, minmax(15rem, 1fr));}`;

        injectCSS(recents_css);

        const sorted_recents = recents.sort((a, b) => {
            return new Date(b.dateViewed) - new Date(a.dateViewed);
        })

        sorted_recents.forEach(recent => {
            const types = this.getTypes(recent.pokemon);

            const li = createEl("li", { class: "c-pokedex__cardWrapper" })

            const card = createEl("div", { class: "c-pokedex__card", id: `recent__${recent.pokemon.name}` });

            const a = createEl("a", { class: "", href: `pokemon.html?p=${recent.id}` })
            const sprite = createEl("img", { class: "c-pokedex__cardSprite", alt: `${recent.pokemon.name} sprite`, src: this.getSprite(recent.pokemon) });

            let number_string = "#" + recent.id
            const number = createEl("p", { class: "c-pokedex__cardNumber", innerHTML: number_string })
            const name = createEl("p", { class: "c-pokedex__cardName", innerHTML: recent.pokemon.name })
            const typeRow = createEl("ul", { class: "c-pokedex__cardTypes" })

            types.forEach(type => {
                let li = createEl("li")
                let typeSlot = createEl("p", { innerHTML: type })
                typeSlot.style.background = typeColors[type]

                li.appendChild(typeSlot)
                typeRow.appendChild(li)
            })

            let max_inset = 6;
            const css = `#recent__${recent.pokemon.name}:hover{box-shadow: -${max_inset / 2}px -${max_inset / 2}px inset ${typeColors[types[0]]},-${max_inset}px -${max_inset}px inset ${types[1] ? typeColors[types[1]] : typeColors[types[0]]};}`

            injectCSS(css)

            a.appendChild(sprite)
            a.appendChild(number)
            a.appendChild(name)
            a.appendChild(typeRow)
            card.appendChild(a)
            li.appendChild(card)

            container.appendChild(li);
        })
    }

    insertPokemon(pokemons, container) {
        pokemons.forEach(pokemon => {
            const card = createEl("li", { class: "c-pokedex__card", id: pokemon.name });

            const a = createEl("a", { class: "", href: `pokemon.html?p=${pokemon.id}` })
            const sprite = createEl("img", { class: "c-pokedex__cardSprite", alt: `${pokemon.name} sprite`, src: this.getSprite(pokemon) });

            let number_string = "#" + pokemon.id
            const number = createEl("p", { class: "c-pokedex__cardNumber", innerHTML: number_string })
            const name = createEl("p", { class: "c-pokedex__cardName", innerHTML: pokemon.name })
            const typeRow = createEl("ul", { class: "c-pokedex__cardTypes" })

            this.getTypes(pokemon).forEach(type => {
                let li = createEl("li")
                let typeSlot = createEl("p", { innerHTML: type })
                typeSlot.style.background = typeColors[type]

                li.appendChild(typeSlot)
                typeRow.appendChild(li)
            })

            let max_inset = 6;
            let types = this.getTypes(pokemon);
            const css = `#${pokemon.name}:hover{box-shadow: -${max_inset / 2}px -${max_inset / 2}px inset ${typeColors[types[0]]},-${max_inset}px -${max_inset}px inset ${types[1] ? typeColors[types[1]] : typeColors[types[0]]};}`

            injectCSS(css)

            a.appendChild(sprite)
            a.appendChild(number)
            a.appendChild(name)
            a.appendChild(typeRow)
            card.appendChild(a)

            container.appendChild(card)
        })
    }

    getTypes(pokemon) {
        let types = [];

        if(pokemon.pokemon_v2_pokemontypes) {
            pokemon.pokemon_v2_pokemontypes.forEach(type => {
                types.push(type.pokemon_v2_type.name)
            })
        } else {
            pokemon.types.forEach(type => {
                types.push(type.type.name)
            })
        }
        
        return types;
    }

    getSprite(pokemon) {
        return JSON.parse(pokemon.pokemon_v2_pokemonsprites[0].sprites).front_default
    }

    _registerSearchHandler() {
        const search = document.querySelector("#search");
        const autoComplete = document.querySelector("#autoComplete");
        const max_length = 10;

        search.addEventListener("input", (e) => {
            let filter = this.pokemon.filter(p => {
                return p.name.toLowerCase().includes(e.target.value.toLowerCase());
            });

            if (filter.length > max_length) filter.splice(max_length, filter.length - max_length);

            autoComplete.innerHTML = "";

            if (e.target.value.length < 1) return;

            filter.forEach(p => {
                const li = createEl("li", { class: "c-pokedex__searchAutocompleteItem", id: `auto_${p.id}` });
                const a = createEl("a", { href: `pokemon.html?p=${p.id}`, innerHTML: p.name });

                li.appendChild(a);
                autoComplete.appendChild(li);
            })
        })
    }
}

new Pokedex();