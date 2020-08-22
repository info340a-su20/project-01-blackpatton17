"use strict";

window.addEventListener("load", () => {init()});

// make card can redirect to the search page
const init = () => {
    qsa("#class-card-wrapper").forEach(x => {
        x.addEventListener("click", (e) => {
            window.location = `./Index.html?classTitle=${e.target.id}`;
        });
    })
};

/****************** helper functions *********************/


const qsa = (el) => {
    return document.querySelectorAll(el);
};