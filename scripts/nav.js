class Nav {
    constructor() {
        this.navElements = document.querySelectorAll(".c-nav__pageLink a");

        this.init();
    }

    init() {
        if (!this.navElements) return;

        this.navElements.forEach((element, index) => {
            if (!window.location.href.toLowerCase().includes(element.href.toLowerCase())) return;
            element.style.fontFamily = "Pokemon Solid"
            element.style.color = "#F50022"
        })
    }
}

new Nav();