/* 
1. Selitys kyselyn sisällöstä, tarkoistuksesta jne
2. Kuka olet?
3. Kuinka suuressa seureessa olet?
4. Mitä teet tällä hetkellä?
5. Missä olet nyt / Karttaan piirtäminen
6. Kuinka hyvin tila sopii tekemiseesi?
7. Affect grid
8. Häiritseekö melutaso?
9. Häiritseekö tuoksut?
10. Kiitos osallistumisesta
11. Palkinnon lunastaminen

TODO:
-location kuva
-affect grid nappi alle
-


*/

var timeline = [];

// Welcome
var welcome = {
  type: "html-button-response",
  stimulus: "Welcome to the experiment, press any key to continue.",
  choices: ["Start"]
};

timeline.push(welcome);

// Introduction?
// Affect grid
var test_affect_grid = {
  stimulus: "Please rate how you are feeling right now.",
  type: "affect-grid",
  prompt: "Click the mouse in a cell.",
  choices: new Array(81 - 1 + 1).fill().map((d, i) => i + 1)
}

timeline.push(test_affect_grid);

// Who are you?
var participant_types = ["Student", "Researcher", "Staff", "Visitor"];
var test_who = {
  type: "survey-multi-choice",
  questions: [{
    prompt: "Who are you?",
    name: "Roles",
    options: participant_types,
    required: true
  }]
};

timeline.push(test_who);

// What activities are you doing right now?
var activities = ["Working alone", "Working together", "Eating or drinking", "Avoiding work", "Relaxing"];
var test_activities = {
  type: "survey-multi-select",
  questions: [{
    prompt: "What are you doing right now?",
    name: "Activities",
    options: activities,
    required: true
  }]
};

timeline.push(test_activities);

// What size is the group you're in right now?
var group_size = ["Alone", "2", "3", "4", "5 or more"];
var test_groupsize = {
  type: "survey-multi-choice",
  questions: [{
    prompt: "What size is the group you're in right now?",
    name: "Group size",
    options: group_size,
    required: true
  }]
};

timeline.push(test_groupsize);

// Where are you now?
var test_location = {
  type: "location",
  stimulus: './images/tellusmapnew.png',
  stimulus_width: 400,
  stimulus_height: 400,
  preamble: "Where are you now?"
};

timeline.push(test_location);

// How well does this spot support your current activity?
var scale_1 = [
  "Extremely poorly",
  "Somewhat poorly",
  "Neutral",
  "Somewhat well",
  "Extremely well"
];

var test_space_fit = {
  type: "survey-likert",
  questions: [{
    prompt: "How well does this spot support your current activity?",
    labels: scale_1
  }]
};

timeline.push(test_space_fit);


// The sound level
var scale_2 = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];

var test_sound_level = {
  type: "survey-likert",
  questions: [{
    prompt: "The sound level doesn't bother me.",
    labels: scale_2
  }]
};

timeline.push(test_sound_level);

// The smells
var test_smells = {
  type: "survey-likert",
  questions: [{
    prompt: "There aren't any distracting smells.",
    labels: scale_2
  }]
};

timeline.push(test_smells);

// End

jsPsych.init({
  timeline: timeline,
  on_finish: async function () {
    console.log("finish");
    const data = jsPsych.data.get().json();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data})
    };
    const response = await fetch('/api', options);
    const json = await response.json();
  }
});