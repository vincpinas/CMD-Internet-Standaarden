export const createEl = (type, options = {}) => {
    let element = document.createElement(type)
    
    options.class ? element.className = options.class : null;
    options.id? element.id = options.id : null;
    options.innerHTML ? element.innerHTML = options.innerHTML : null;
    options.alt ? element.setAttribute("alt", options.alt) : null;
    options.src ? element.setAttribute("src", options.src) : null;
    options.href ? element.setAttribute("href", options.href) : null;
    options.type ? element.setAttribute("type", options.type) : null;

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
    const result = await fetch(
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
  
    return await result.json()
  }