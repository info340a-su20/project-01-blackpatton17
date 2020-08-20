"use strict";

const STATE = {};
const URL = "https://mpvl0452tj.execute-api.us-east-1.amazonaws.com/Prod/user"

window.addEventListener("load", () => {init()});

const init = () => {
    renderUserData().catch(error => {console.error("cannot render user data: ", error)});
}

const renderUserData = async () => {
    await queryUserData()
    renderClassCard();
};

const queryUserData = () => {
    let finalURL = `${URL}?user=testUser`
    return fetch(finalURL)
        .then(response => {
            if (response.status !== 200) {
                return new Error(response.json().message);
            }
            return response.json();
        })
        .then(response => {
            STATE.result = response.result;
        })
        .catch(error => {
            console.error("error: ", error);
        });
};

const renderClassCard = () => {
    STATE['result']['class'].forEach(item => {
        qs("#class-card-wrapper").appendChild(genClassCardComponent(item))
    });
};

const genClassCardComponent = (data) => {
    let card = crNewEl("div");
    card.textContent = data;
    card.classList.add("class-card");
    card.addEventListener("click", () => {
        window.location = `./Index.html?classTitle=${data}`;

    });
    return card;
}

/****************** helper functions *********************/

const qs = (el) => {
    return document.querySelector(el);
};

const qsa = (el) => {
    return document.querySelectorAll(el);
};

const crNewEl = (el) => {
    return document.createElement(el);
};