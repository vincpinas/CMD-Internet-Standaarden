class Nav {
    constructor() {
        this.nav = document.querySelector("nav");
        this.navLinks = document.querySelectorAll(".c-nav__pageLink a");
        this.lastOffset = 0;
        this.window_href =  window.location.href.toLowerCase();

        this.init();
        this._registerScrollListener();
    }

    init() {
        if (!this.navLinks) return;

        this.navLinks.forEach(link => {
            // if(this.window_href.includes("pokemon.html") && link.innerHTML.toLowerCase() === "pokédex") {
            //     link.style.fontFamily = "Pokemon Solid"
            //     link.style.color = "#F50022"
            // }

            if (!this.window_href.includes(link.href.toLowerCase())) return;
            link.style.fontFamily = "Pokemon Solid"
            link.style.color = "#F50022"
        })
    }

    _registerScrollListener() {
        document.addEventListener("scroll", () => {
            const scroll = document.documentElement.scrollTop;

            if(scroll < 50) return;
            
            if(scroll > this.lastOffset) {
                this.nav.classList.add("inactive")
            } else {
                this.nav.classList.remove("inactive")
            }

            this.lastOffset = scroll;
        })
    }
}

new Nav();