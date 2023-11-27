import { createEl, fetchGraphQL, typeColors, injectCSS } from "../scripts/helpers.js"


export default class Pokedex {
    constructor() {
        this.pokemon = []

        this.init();
    }

    init() {

        this._registerSearchHandler();

        this.fetchPokedexGQL().then(() => {
            this.insertPokemon();
        })
    }

    async fetchPokedexGQL(limit = 649, offset = 0) {
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

    insertPokemon() {
        this.pokemon.forEach(pokemon => {
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
            const css = `#${pokemon.name}:hover { 
                box-shadow: -${max_inset / 2}px -${max_inset / 2}px inset ${typeColors[types[0]]},
                            -${max_inset}px -${max_inset}px inset ${types[1] ? typeColors[types[1]] : typeColors[types[0]]};
            }`

            injectCSS(css)

            a.appendChild(sprite)
            a.appendChild(number)
            a.appendChild(name)
            a.appendChild(typeRow)
            card.appendChild(a)

            document.querySelector(".c-pokedex__gridItems").appendChild(card)
        })
    }

    getTypes(pokemon) {
        let types = [];

        pokemon.pokemon_v2_pokemontypes.forEach(type => {
            types.push(type.pokemon_v2_type.name)
        })

        return types
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
                let types = this.getTypes(p)

                const css = `
                    #auto_${p.name}:hover a {
                        // color: ${typeColors[types[0]]};
                        // background-image: linear-gradient(45deg, ${typeColors[types[0]]}, ${types[1] ? typeColors[types[1]] : typeColors[types[0]]});
                        // -webkit-background-clip: text;
                        // -moz-background-clip: text;
                        // -webkit-text-fill-color: transparent; 
                        // -moz-text-fill-color: transparent;
                        // width: fit-content;
                    }
                `

                injectCSS(css);

                const li = createEl("li", { class: "c-pokedex__searchAutocompleteItem", id: `auto_${p.id}` });
                const a = createEl("a", { href: `pokemon.html?p=${p.id}`, innerHTML: p.name });

                li.appendChild(a);
                autoComplete.appendChild(li);
            })
        })
    }
}

new Pokedex();