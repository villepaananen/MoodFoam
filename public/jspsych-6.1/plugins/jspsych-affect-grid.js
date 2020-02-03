/*
 * Example plugin template
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
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var html =
      '<div id="jspsych-html-button-response-stimulus">' +
      trial.stimulus +
      "</div>";

    // make the grid for the buttons
    html += '<div class="grid-container" id="grid">';

    // add all the buttons to the html
    let i = 0;
    for (i; i <= 80; i++) {
      button = '<button class="grid-item-btn" id=' + i + "></button>";
      html += button;
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
      e.classList.className = "grid-item-btn-active";
      prevBtn = e;
      currChoice = e;
    }

    // To handle the submit-action
    function submit() {
      let data = {};
      if (currChoice !== null) {
        (data.x = currChoice.id % 9), (data.y = Math.floor(currChoice.id / 9));
        rt = data;
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
