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

const URL = "https://mpvl0452tj.execute-api.us-east-1.amazonaws.com/Prod/query";

window.addEventListener("load", () => init());

// initialize the page
const init = async () => {
  initInput();
  await renderSearchResult();
  // qs('#submit-search').addEventListener("click", updateResearch);
};

// bind input with goble const state
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
      input.addEventListener("input", (e) => {
        if (input.name === 'workTime') {
          state.newPost['workTimeInterval']['start'] = e.target.value.split('-')[0];
          state.newPost['workTimeInterval']['end'] = e.target.value.split('-')[1];
        } else {
          state.newPost[e.target.name] = input.name === 'major' ? e.target.value.split(",") : e.target.value;
        }
      });
    }
  }
  qs("#new-post-form").addEventListener("submit", e => handleNewPost(e));

  bindFilterWithState();

  qs("#result-filter-wrapper").addEventListener("submit", e => handleNewSearch(e));

  qs('#add-new-post').addEventListener("click", () => openNewPostForm());
};

// callback function for submit a new match_up request
const handleNewPost = (e) => {
  e.preventDefault();
  if (state.newPost.name.classStanding === 0) {
    alert("You have to enter your name! (e.g.: Junior)");
  } else {
    setQueryFetcher({
      classTitle: state.newPost.classTitle,
      name: state.newPost.name,
      classStanding: state.newPost.classStanding,
      major: state.newPost.major,
      avatar: "placeholder",
      workTime: state.newPost.workTimeInterval
    }).then(async response => {
      qs('#new-post-form').classList.toggle('collapse');
      qs('#add-new-post-wrapper p').classList.toggle('collapse');
      qs('#add-new-post-wrapper p').innerText = response['message'];
      await renderSearchResult();
    })
  }
};

// fetch for post data to server
const setQueryFetcher = (data) => {
  return fetch(URL, {method: 'POST', body: JSON.stringify(data)})
      .then(response => {
        return response.json();
      })
};

// callback function for submit a new search, re-render search result components
const handleNewSearch = (e) => {
  e.preventDefault();
  return renderSearchResult();
};

// render search result components
const renderSearchResult = async () => {
  let result = await getQueryFetcher();
  result = handleFilter(result);

  qs('#ajax-loading').classList.toggle('collapse');
  qs("#search-result-content").innerHTML = null;
  if (result.length === 0) {
    let output = crNewEl('p');
    output.innerText = "No one has posted a request yet."
    qs("#search-result-content").appendChild(output);
  } else {
    result.forEach(x => {
      qs("#search-result-content").appendChild(genResultComponent(x));
    });
  }
  qs('#ajax-loading').classList.toggle('collapse');

};

// fetch for send query for get data from server
const getQueryFetcher = async () => {
  let finalURl = `${URL}?classTitle=${state.search.classTitle}`;
  let output = [];
  await fetch(finalURl)
      .then(response => {
        return response.json();
      })
      .then(response => {
        let result = response.result;
        result.forEach(x => {
          output.push(x);
        });
      });
  return output;
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
  resultStanding.textContent = "Academic Standing: " + data['academicStanding'];
  resultSpecInfo.appendChild(resultStanding);

  let resultMajor = crNewEl('p');
  let majorContent = data.major.length < 1 ? "Unknown" : data.major.reduce(((previousValue, currentValue) => {
    return previousValue + ", " + currentValue;
  }))
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
  e.target.textContent = "Message Sent via Email!";
};

// function to bind DOM INPUT with state
const bindFilterWithState = () => {
  qs('#work-time-start').addEventListener('input', (e) => {
    state.filter.workTimeInterval.start = e.target.value;
  });

  qs('#work-time-end').addEventListener('input', (e) => {
    state.filter.workTimeInterval.end = e.target.value;
  });

  state.filter.sortBy = qs('#sort-filter').value;

  qs('#sort-filter').addEventListener('change', (e) => {
    state.filter.sortBy = e.target.value;
  });
}

// callback function for filtering search result
const handleFilter = (data) => {
  let output = data;
  output = output.filter(x => {
    if (state.filter.workTimeInterval.start === "" && state.filter.workTimeInterval.end === "") {
      return true;
    }
    if (state.filter.workTimeInterval.end === "") {
      return x.workTime.start >= state.filter.workTimeInterval.start
    } else if (state.filter.workTimeInterval.start === "") {
      return x.workTime.end <= state.filter.workTimeInterval.end;
    }
    return x.workTime.start >= state.filter.workTimeInterval.start &&
        x.workTime.end <= state.filter.workTimeInterval.end;
  });
  output = output.sort((a, b) => {
    switch (state.filter.sortBy){
      case "workTime":
        return a['workTime']['start'] < b['workTime']['start'] ? -1 : (a['workTime']['start'] === b['workTime']['start'] ? 0: 1);
      case "name":
        return a[state.filter.sortBy] < b[state.filter.sortBy] ? -1 : (a[state.filter.sortBy] === b[state.filter.sortBy] ? 0: 1);
      case "academicStanding":
        return a[state.filter.sortBy] < b[state.filter.sortBy] ? 1 : (a[state.filter.sortBy] === b[state.filter.sortBy] ? 0: -1);
    }
  });
  return output;
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