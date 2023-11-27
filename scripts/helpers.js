export const createEl = (type, options = {}) => {
  let element = document.createElement(type)

  options.class ? element.className = options.class : null;
  options.id ? element.id = options.id : null;
  options.innerHTML ? element.innerHTML = options.innerHTML : null;
  options.alt ? element.setAttribute("alt", options.alt) : null;
  options.src ? element.setAttribute("src", options.src) : null;
  options.href ? element.setAttribute("href", options.href) : null;
  options.type ? element.setAttribute("type", options.type) : null;
  options.blankTarget ? element.setAttribute("target", "_blank") : null;

  return element;
}

export const grab = async (url, options = {}) => {
  const response = await fetch(url, {
    method: options.method || "GET",
    mode: options.mode || "cors",
    cache: options.cache || "no-cache",
    credentials: options.credentials || "same-origin",
    headers: options.headers || {
      "Content-Type": "application/json",
    },
    redirect: options.redirect || "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(options.data),
  })

  return response.json();
}

export async function fetchGraphQL(query, variables, operationName) {
  const response = await fetch(
    "https://beta.pokeapi.co/graphql/v1beta",
    {
      method: "POST",
      body: JSON.stringify({
        query: query,
        variables: variables,
        operationName: operationName
      })
    }
  )

  return await response.json()
}

export const typeColors = {
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
  'fairy': '#EB97EB',
  'shadow': '#0E2E4C'
};

export const injectCSS = (css) => {
  let el = createEl("style", { type: "text/css" });
  el.innerText = css;
  document.head.appendChild(el);
  return el;
};