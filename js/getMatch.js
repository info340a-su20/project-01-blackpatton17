"use strict";

const state = {
  search: {
    classTitle: "INFO340",
    section: "A",
    quizSection: "A",
  },
  newPost: {
    classTitle: "",
    section: "",
    quizSection: "",
    name: "",
    classStanding: "",
    Major: [],
    Email: "",
  },
  result: {
    "INFO340": [
      {
        name: "Joe Alan",
        academicStanding: "Junior",
        major: ["INFO", "CSE"],
        avatar: "../img/avatar-placeholder.png"
      },
      {
        name: "Jalan Some",
        academicStanding: "Junior",
        major: ["INFO", "CSE"],
        avatar: "../img/avatar-placeholder.png"
      },
      {
        name: "Zach Test",
        academicStanding: "Junior",
        major: ["INFO", "CSE"],
        avatar: "../img/avatar-placeholder.png"
      }
    ],
    "INFO201": [
      {
        name: "Test User",
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
}

window.addEventListener("load", () => init());

const init = () => {
  initInput();
  renderSearchResult();
  qs('#add-new-post').addEventListener("click", () => openNewPostForm());
  // qs('#submit-search').addEventListener("click", updateResearch);
};

const initInput = () => {
  let searchInputs = qsa('.search-condition input');
  for (let input of searchInputs) {
    input.addEventListener("input", (e) => {
      state.search[e.target.name] = input.name === 'major' ? e.target.value.split(",") : e.target.value;
    })
  }
  qs(".search-condition").addEventListener("submit", e => handleNewSearch(e));

  let addNewPostFormInputs = qsa('#new-post-form input');
  for (let input of addNewPostFormInputs) {
    if (input.type !== 'submit') {
      input.value = state.search[input.name] ? state.search[input.name] : "";
      input.addEventListener("input", (e) => {
        state.newPost[e.target.name] = input.name === 'major' ? e.target.value.split(",") : e.target.value;
      })
    }
  }
  qs("#new-post-form").addEventListener("submit", e => handleNewPost(e))
};

const handleNewPost = (e) => {
  e.preventDefault();
  state.result[state.search.classTitle] = [{
    name: state.newPost.name,
    academicStanding: state.newPost.classStanding,
    major: state.newPost.major,
    avatar: "../img/avatar-placeholder.png"
  }, ...state.result[state.search.classTitle]];
  renderSearchResult();
};

const handleNewSearch = (e) => {
  e.preventDefault();
  renderSearchResult();
}

const renderSearchResult = () => {
  qs("#search-result-wrapper").innerHTML = null;
  if (state.result[state.search.classTitle]) {
    for (let data of state.result[state.search.classTitle]) {
      qs("#search-result-wrapper").appendChild(genResultComponent(data));
    }
  } else {
    let output = crNewEl('p');
    output.innerText = "No one has posted a request yet."
    qs("#search-result-wrapper").appendChild(output);
  }
};

const genResultComponent = (data) => {
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
  return resultDiv;
}

const openNewPostForm = () => {
  qs('#new-post-form').classList.remove('collapse');
  qs('#add-new-post').classList.add('collapse');
  qs('#add-new-post-wrapper p').classList.add('collapse');
}

const handleSendMsg = () => {
  alert("Your message has been send via email, you can check reply via inbox or your registered email!")
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