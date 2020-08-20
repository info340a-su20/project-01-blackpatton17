"use strict";

const state = {
  search: {
    classTitle: "INFO340",
    section: "A",
    quizSection: "",
  },
  newPost: {
    classTitle: "",
    section: "",
    quizSection: "",
    name: "",
    classStanding: "",
    major: [""],
    Email: "",
  }
}

const URL = "https://mpvl0452tj.execute-api.us-east-1.amazonaws.com/Prod/query"

window.addEventListener("load", () => init());

// initialize the page
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
      state.search[e.target.name] = input.name === 'major' ? (e.target.value.split(",") ? e.target.value.split(",") : [""]) : e.target.value;
    })
  }
  qs(".search-condition").addEventListener("submit", e => handleNewSearch(e));

  let addNewPostFormInputs = qsa('#new-post-form input');
  for (let input of addNewPostFormInputs) {
    if (input.type !== 'submit') {
      input.value = state.search[input.name] ? state.search[input.name] : "";
      state.newPost[input.name] = state.search[input.name] ? state.search[input.name] : "";
      input.addEventListener("input", (e) => {
        state.newPost[e.target.name] = input.name === 'major' ? e.target.value.split(",") : e.target.value;
      });
    }
  }
  qs("#new-post-form").addEventListener("submit", e => handleNewPost(e))
};

const handleNewPost = (e) => {
  e.preventDefault();
  if (state.newPost.name.length === 0) {
    alert("You have to enter your name!");
  } else if (state.newPost.name.classStanding === 0) {
    alert("You have to enter your name! (e.g.: Junior)");
  } else if (!state.newPost.email.indexOf("@") < 0) {
    alert("You have entered an invalid email address!");
  } else {
    setQueryFetcher({
      classTitle: state.newPost.classTitle,
      name: state.newPost.name,
      classStanding: state.newPost.classStanding,
      major: state.newPost.major,
      avatar: "placeholder"
    }).then(response => {
      qs('#new-post-form').classList.add('collapse');
      qs('#add-new-post-wrapper p').classList.remove('collapse');
      qs('#add-new-post-wrapper p').innerText = response['message'];
      renderSearchResult().catch(error => console.error(error));
    })
  }
};

const setQueryFetcher = (data) => {
  return fetch(URL, {method: 'POST', body: JSON.stringify(data)})
      .then(response => {
        return response.json();
      })
}

const handleNewSearch = (e) => {
  e.preventDefault();
  return renderSearchResult();
};

const renderSearchResult = () => {
  toggleAjaxLoadAnime();
  qs("#search-result-content").innerHTML = null;
  getQueryFetcher()
      .then(() => {
        toggleAjaxLoadAnime();
      })
      .catch(error => {
        console.log("error: ", error)
      });
};

const getQueryFetcher = () => {
  let finalURl = `${URL}?classTitle=${state.search.classTitle}`;
  return fetch(finalURl)
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (response.count === 0) {
          let output = crNewEl('p');
          output.innerText = "No one has posted a request yet."
          qs("#search-result-content").appendChild(output);
        } else {
          let result = response.result;
          result.forEach(x => {
            qs("#search-result-content").appendChild(genResultComponent(x));
          });
        }
      });
}

const genResultComponent = (data) => {
  let resultDiv = crNewEl('div');
  resultDiv.classList.add('search-result');

  // create img and append on the result div
  let resultImg = crNewEl('img');
  resultImg.src = data.avatar === 'placeholder' ? '../img/avatar-placeholder.png' : data.avatar;
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
  let majorContent = data.major.length < 1 ? data.major[0] : data.major.reduce(((previousValue, currentValue) => {
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

// hide or show the ajax loading anime
const toggleAjaxLoadAnime = () => {
  qs('#ajax-loading').classList.toggle('collapse');
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