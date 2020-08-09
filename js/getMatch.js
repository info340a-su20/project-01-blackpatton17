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
  for (let data of FAKE_SEARCH_DATA.result) {
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
      return previousValue + " & " + currentValue;
    }))
    resultMajor.textContent = "Major: " + majorContent;
    resultSpecInfo.appendChild(resultMajor);

    resultDiv.appendChild(resultSpecInfo);

    // create send message btn
    let sendMsgBtn = crNewEl('button');
    sendMsgBtn.textContent = "Send a Message";
    sendMsgBtn.classList.add('send-massage');
    sendMsgBtn.addEventListener('click', () => handleSendMsg(data));
    resultDiv.appendChild(sendMsgBtn);

    qs("#search-result-wrapper").appendChild(resultDiv);
  }
}

const handleSendMsg = (data) => {
  console.log("foo" + data.name);
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