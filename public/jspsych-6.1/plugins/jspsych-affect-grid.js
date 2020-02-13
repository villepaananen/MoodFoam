/*
 * Plugin which uses the affect grid by Russell (1980) to measure participants mood
 */

jsPsych.plugins["affect-grid"] = (function() {
  var plugin = {};
  // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
  plugin.info = {
    name: "affect-grid",
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Stimulus",
        default: undefined,
        description: "The HTML string to be displayed"
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button HTML",
        default: '<button class="jspsych-btn"></button>',
        array: true,
        description: "The html of the button. Can create own style."
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Prompt",
        default: null,
        description: "Any content here will be displayed under the button."
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label",
        default: "Continue",
        description: "Label of the button."
      },
      show_labels: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Labels",
        default: false,
        description: "Show the labels."
      },
      show_sub_labels: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Sub-labels",
        default: false,
        description: "Show the sub-labels."
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var html =
      '<div id="jspsych-html-button-response-stimulus">' +
      trial.stimulus +
      "</div>";

    // create a 11-by-11 grid. The outermost rows and columns are for the labels
    html += '<div class="grid-container" id="grid">';

    var button_html = [];
    for (i = 0; i <= 11 * 11; i++) {
      button_html[i] =
        '<button class="grid-item-btn" value=' + i + "></button>";
    }

    if (trial.show_labels) {
      button_html[4] =
        '<button class="grid-item-btn" value="4"><span class="label" id="arousal">High Arousal</span></button>';
      button_html[36] =
        '<button class="grid-item-btn" value="36"><span class="label" id="unpleasant">Unpleasant Feelings</span></button>';
      button_html[44] =
        '<button class="grid-item-btn" value="44"><span class="label" id="pleasant">Pleasant Feelings</span></button>';
      button_html[76] =
        '<button class="grid-item-btn" value="76"><span class="label" id="sleepiness">Sleepiness</span></button>';
    }

    if (trial.show_sub_labels) {
      button_html[0] =
        '<button class="grid-item-btn" value="0"><span class="label" id="stress">Stress</span></button>';
      button_html[8] =
        '<button class="grid-item-btn" value="8"><span class="label" id="excitement">Excitement</span></button>';
      button_html[72] =
        '<button class="grid-item-btn" value="72"><span class="label" id="depression">Depression</span></button>';
      button_html[80] =
        '<button class="grid-item-btn" value="80"><span class="label" id="relaxation">Relaxation</span></button>';
    }

    for (i = 0; i <= 80; i++) {
      html += button_html[i];
    }

    html += "</div>";

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += "<p>" + trial.prompt + "</p>";
    }

    // add the submit-button
    html +=
      '<input type="submit" id="jspsych-affect-submit" class="jspsych-affect-submit jspsych-btn" value="' +
      trial.button_label +
      '"></input>';

    display_element.innerHTML = html;

    // add the labels

    // start time
    var start_time = performance.now();

    let prevBtn = null;
    let currChoice = null;
    let buttons = document.querySelectorAll(".grid-item-btn");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", () => {
        btnClicked(buttons[i]);
      });
    }

    let submitBtn = document.getElementById("jspsych-affect-submit");
    submitBtn.addEventListener("click", () => {
      submit();
    });

    // store response
    var response = {
      rt: null,
      button: null
    };

    // When the button is clicked
    function btnClicked(e) {
      if (prevBtn) {
        prevBtn.className = "grid-item-btn";
      }
      e.className = "grid-item-btn-active";
      prevBtn = e;
      currChoice = e;
    }

    // To handle the submit-action
    function submit() {
      let data = {};
      if (currChoice !== null) {
        (data.x = currChoice.value % 9),
          (data.y = Math.floor(currChoice.value / 9));
        after_response(data);
      }
    }

    // function to handle responses by the subject
    function after_response(choice) {
      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector(
        "#jspsych-html-button-response-stimulus"
      ).className += " responded";

      // disable all the buttons after a response
      var btns = document.querySelectorAll(
        ".jspsych-affect-grid-button button"
      );
      for (var i = 0; i < btns.length; i++) {
        //btns[i].removeEventListener('click');
        btns[i].setAttribute("disabled", "disabled");
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        button_pressed: response.button
      };

      // clear the display
      display_element.innerHTML = "";

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
