"use strict";

const state = {
  search: {
    classTitle: "",
    section: "",
    quizSection: "",
  },
  newPost: {
    classTitle: "",
    section: "",
    quizSection: "",
    name: "",
    classStanding: "",
    Major: "",
    Email: "",
  },
  result: [
    {
      id: 0,
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      name: "Joe",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    },
    {
      name: "Joe Alan",
      academicStanding: "Junior",
      major: ["INFO", "CSE"],
      avatar: "../img/avatar-placeholder.png"
    }
    ]
}

window.addEventListener("load", () => init());

const init = () => {
  bindInput();
  renderSearchResult();
  qs('#add-new-post').addEventListener("click", () => openNewPostForm());
  qs('#new-post-form').addEventListener("submit", (e) => handleNewPost(e));
  // qs('#submit-search').addEventListener("click", updateResearch);
};

const bindInput = () => {

};

const handleNewPost = (e) => {
  e.preventDefault();
  console.log(e.target.dataset);
};

const renderSearchResult = () => {
  for (let data of state.result) {
    let resultDiv = crNewEl('div');
    resultDiv.classList.add('search-result');

    // create img and append on the result div
    let resultImg = crNewEl('img');
    resultImg.src = data.avatar;
    resultImg.alt = data.name;
    resultImg.classList.add("result-avatar");
    resultDiv.appendChild(resultImg);

    // create spec info and append on the result div
    let resultSpecInfo = crNewEl('div');
    let resultName = crNewEl('p');
    resultName.textContent = "Name: " + data.name;
    resultSpecInfo.appendChild(resultName);

    let resultStanding = crNewEl('p');
    resultStanding.textContent = "Academic Standing: " + data.academicStanding;
    resultSpecInfo.appendChild(resultStanding);

    let resultMajor = crNewEl('p');
    let majorContent = data.major.length === 1 ? data.major[0] : data.major.reduce(((previousValue, currentValue) => {
      return previousValue + ", " + currentValue;
    }))
    resultMajor.textContent = "Major: " + majorContent;
    resultSpecInfo.appendChild(resultMajor);

    resultDiv.appendChild(resultSpecInfo);

    // create send message btn
    let sendMsgBtn = crNewEl('button');
    sendMsgBtn.textContent = "Send a Message";
    sendMsgBtn.classList.add('send-message');
    sendMsgBtn.addEventListener('click', () => handleSendMsg(data));
    resultDiv.appendChild(sendMsgBtn);

    qs("#search-result-wrapper").appendChild(resultDiv);
  }
};

const openNewPostForm = () => {
  qs('#new-post-form').classList.remove('collapse');
  qs('#add-new-post').classList.add('collapse');
  qs('#add-new-post-wrapper p').classList.add('collapse');
}

const handleSendMsg = (data) => {
  console.log("foo " + data.name);
};

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