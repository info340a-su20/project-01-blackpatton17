"use strict";

window.addEventListener("load", () => {init()});

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