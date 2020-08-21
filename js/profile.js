"use strict";

const URL = "https://mpvl0452tj.execute-api.us-east-1.amazonaws.com/Prod/user";

window.addEventListener("load", () => {init()});

const init = () => {
    renderUserData().catch(error => {console.error("cannot render user data: ", error)});
};

const renderUserData = () => {
    queryUserData()
      .then(result => {
          renderClassCard(result);
      });
};

const queryUserData = () => {
    let finalURL = `${URL}?user=testUser`;
    return fetch(finalURL)
        .then(response => {
            if (response.status !== 200) {
                return new Error(response.json().message);
            }
            return response.json();
        })
        .then(response => {
            return response.result;
        })
        .catch(error => {
            console.error("error: ", error);
        });
};

const renderClassCard = (result) => {
    result.forEach(item => {
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
};

/****************** helper functions *********************/

const qs = (el) => {
    return document.querySelector(el);
};

const crNewEl = (el) => {
    return document.createElement(el);
};