"use strict";

const STATE = {
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
    classStanding: "Freshman",
    major: [""],
    Email: "",
    workTimeInterval: {
      start:"",
      end:"",
    }
  },
  result: [],
  filter: {
    workTimeInterval: {
      start:"",
      end:"",
    },
    sortBy:"",
  }
};

const DATABASE_API_ENDPOINT = "https://mpvl0452tj.execute-api.us-east-1.amazonaws.com/Prod/query";

window.addEventListener("load", () => init());

// initialize the page
const init = ()=> {
  initInput();
  setInitSearch();
};

// bind input with global const state
const initInput = () => {
  let searchInputs = qsa('.search-condition input');
  for (let input of searchInputs) {
    input.addEventListener("input", (e) => {
      STATE.search[e.target.name] = input.name === 'major' ?
          (e.target.value.split(",") ? e.target.value.split(",") :[""]) : e.target.value;
    })
  }
  qs(".search-condition").addEventListener("submit", e => handleNewSearch(e));

  let addNewPostFormInputs = qsa('#new-post-form input');
  for (let input of addNewPostFormInputs) {
    if (input.type !== 'submit') {
      input.addEventListener("input", (e) => {
        if (input.name === 'workTime') {
          STATE.newPost['workTimeInterval']['start'] = e.target.value.split('-')[0];
          STATE.newPost['workTimeInterval']['end'] = e.target.value.split('-')[1];
        } else {
          STATE.newPost[e.target.name] = input.name === 'major' ? e.target.value.split(",") : e.target.value;
        }
      });
    }
  }
  let addNewPostFormSelect = qs('#new-post-form select');
  addNewPostFormSelect.addEventListener('change', e => {
    STATE.newPost['classStanding'] = e.target.value;
  });
  qs("#new-post-form").addEventListener("submit", e => handleNewPost(e));

  bindFilterWithState();

  qs("#result-filter-wrapper").addEventListener("submit", e => handleNewSearch(e));

  qs('#add-new-post').addEventListener("click", () => openNewPostForm());
};

// callback function for submit a new match_up request
const handleNewPost = (e) => {
  e.preventDefault();
  if (STATE.newPost.name.classStanding === 0) {
    alert("You have to enter your name! (e.g.: Junior)");
  } else {
    let data = {
      classTitle: STATE.newPost.classTitle,
      name: STATE.newPost.name,
      classStanding: STATE.newPost.classStanding,
      major: STATE.newPost.major,
      avatar: "placeholder",
      workTime: STATE.newPost.workTimeInterval
    };
    setQueryFetcher(data).then(response => {
      qs('#new-post-form').classList.toggle('collapse');
      qs('#add-new-post-wrapper p').classList.toggle('collapse');
      qs('#add-new-post-wrapper p').innerText = response['message'];
      if (STATE.newPost.classTitle === STATE.search.classTitle) {
        qs("#search-result-content").appendChild(genResultComponent(data));
      }
    });
  }
};

// fetch for post data to server
const setQueryFetcher = (data) => {
  return fetch(DATABASE_API_ENDPOINT, {method: 'POST', body: JSON.stringify(data)})
      .then(response => {
        return response.json();
      });
};

// callback function for submit a new search, re-render search result components
const handleNewSearch = (e) => {
  e.preventDefault();
  return renderSearchResult();
};

// render search result components
const renderSearchResult = () => {
  qs("#search-result-content").innerHTML = null;
  return getQueryFetcher()
    .then(result => {
      result = handleFilter(result);
      if (result.length === 0) {
        let output = crNewEl('p');
        output.innerText = "No one has posted a request yet.";
        qs("#search-result-content").appendChild(output);
      } else {
        result.forEach(x => {
          qs("#search-result-content").appendChild(genResultComponent(x));
        });
      }
    });
};

// fetch for send query for get data from server
const getQueryFetcher = () => {
  qs('#ajax-loading').classList.toggle('collapse');
  let finalURl = `${DATABASE_API_ENDPOINT}?classTitle=${STATE.search.classTitle}`;
  return fetch(finalURl)
      .then(response => {
        return response.json();
      })
      .then(response => {
        qs('#ajax-loading').classList.toggle('collapse');
        return response.result;
      });
};

// generate new search result component DOM
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
  resultStanding.textContent = "Academic Standing: " + (data['academicStanding'] ?
    data['academicStanding']: (data['classStanding'] ? data['classStanding'] : 'Unknown'));
  resultSpecInfo.appendChild(resultStanding);

  let resultMajor = crNewEl('p');
  let majorContent = data.major.length < 1 ? "Unknown" : data.major.reduce(((previousValue, currentValue) => {
    return previousValue + ", " + currentValue;
  }));
  resultMajor.textContent = "Major: " + majorContent;
  resultSpecInfo.appendChild(resultMajor);

  let resultWorkTime = crNewEl('p');
  resultWorkTime.textContent = `Work Time: ${data['workTime']['start'] ? data['workTime']['start'] : "unavailable"} - 
  ${data['workTime']['end'] ? data['workTime']['end'] : "unavailable"}`;
  resultSpecInfo.appendChild(resultWorkTime);

  resultDiv.appendChild(resultSpecInfo);

  // create send message btn
  let sendMsgBtn = crNewEl('button');
  sendMsgBtn.textContent = "Send a Message";
  sendMsgBtn.classList.add('send-message');
  sendMsgBtn.addEventListener('click', (e) => handleSendMsg(e));
  resultDiv.appendChild(sendMsgBtn);
  return resultDiv;
};

// toggle the appearance of post new request form
const openNewPostForm = () => {
  qs('#new-post-form').classList.toggle('collapse');
  qs('#add-new-post').classList.toggle('collapse');
  qs('#add-new-post-wrapper p').classList.toggle('collapse');
};

// callback function for send message to the selected people
const handleSendMsg = (e) => {
  e.target.textContent = "Message Sent!";
  e.target.disabled = true;
  e.target.classList.add('message-sent');
};

// function to bind DOM INPUT with state
const bindFilterWithState = () => {
  qs('#work-time-start').addEventListener('input', (e) => {
    STATE.filter.workTimeInterval.start = e.target.value;
  });

  qs('#work-time-end').addEventListener('input', (e) => {
    STATE.filter.workTimeInterval.end = e.target.value;
  });

  STATE.filter.sortBy = qs('#sort-filter').value;

  qs('#sort-filter').addEventListener('change', (e) => {
    STATE.filter.sortBy = e.target.value;
  });
};

// callback function for filtering search result
const handleFilter = (data) => {
  let output = data;
  output = output.filter(item => {
    if (STATE.filter.workTimeInterval.start === "" && STATE.filter.workTimeInterval.end === "") {
      return true;
    }
    if (STATE.filter.workTimeInterval.end === "") {
      return item.workTime.start >= STATE.filter.workTimeInterval.start
    } else if (STATE.filter.workTimeInterval.start === "") {
      return item.workTime.end <= STATE.filter.workTimeInterval.end;
    }
    return item.workTime.start >= STATE.filter.workTimeInterval.start &&
        item.workTime.end <= STATE.filter.workTimeInterval.end;
  });
  output = output.sort((prev, next) => {
    switch (STATE.filter.sortBy){
      case "workTime":
        return prev['workTime']['start'] < next['workTime']['start'] ? -1 : (prev['workTime']['start']
        === next['workTime']['start'] ? 0: 1);
      case "name":
        return prev[STATE.filter.sortBy] < next[STATE.filter.sortBy] ? -1 : (prev[STATE.filter.sortBy]
        === next[STATE.filter.sortBy] ? 0: 1);
      case "academicStanding":
        return prev[STATE.filter.sortBy] < next[STATE.filter.sortBy] ? 1 : (prev[STATE.filter.sortBy]
        === next[STATE.filter.sortBy] ? 0: -1);
    }
  });
  return output;
};

const setInitSearch = () => {
  let urlString = window.location.href;
  let url = new URL(urlString);
  let classTitle = url.searchParams.get("classTitle");
  if (classTitle) {
    STATE.search.classTitle = classTitle;
    return renderSearchResult().catch(error => {console.error(error)});
  }
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
};