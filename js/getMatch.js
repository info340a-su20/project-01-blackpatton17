"use strict";

const FAKE_SEARCH_DATA = {
  result: [
    {
      id: 0,
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      id: 1,
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      id: 2,
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      id: 3,
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      id: 4,
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    }
    ]
}

window.addEventListener("load", () => init());

const init = () => {
  renderSearchResult();
  // qs('#submit-search').addEventListener("click", updateResearch);
};

const updateResearch = () => {
  qs();
};

const renderSearchResult = () => {
  for (let i = 0; i <FAKE_SEARCH_DATA.result; i++) {
    
  }
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
}