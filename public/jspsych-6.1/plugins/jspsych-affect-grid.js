/*
 * Example plugin template
 */

jsPsych.plugins["affect-grid"] = (function () {

  var plugin = {};
  // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
  plugin.info = {
    name: "affect-grid",
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn"></button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'Label of the button.'
      }
    }
  }

  plugin.trial = function (display_element, trial) {

    var html = '<div id="jspsych-html-button-response-stimulus">' + trial.stimulus + '</div>';

    /*
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in affect grid plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-html-button-response-btngroup">';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-affect-grid-button" style="display: inline-block; margin:' + trial.margin_vertical + ' ' + trial.margin_horizontal + '" id="jspsych-affect-grid-button-' + i + '" data-choice="' + i + '">' + str + '</div>';
    }
    html += '</div>'; */

    html += '<div class="grid-container" id="grid">';

    let i = 0;

    for (i; i <= 80; i++) {
      button = '<button class="grid-item-btn" id=' + i + '></button>'
      html += button;
    }

    html += '</div>'

    html += '<input type="submit" id="jspsych-affect-next" class="jspsych-affect jspsych-btn" value="' + trial.button_label + '"></input>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    // start time
    var start_time = performance.now();

    let prevBtn = null;
    let currChoice = null;
    let buttons = document.querySelectorAll('.grid-item-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', btnClicked(btn));
    });


    // store response
    var response = {
      rt: null,
      button: null
    };

    // When the button is clicked
    function btnClicked(e) {
      console.log(e);
      if (prevBtn) {
        prevBtn.className = "grid-item-btn";
      }
      e.classList.className = "grid-item-btn-active";
      prevBtn = e;
      currChoice = e;

    }

    // To handle the submit-action
    function submit(e) {
      if (currChoice != null) {
        let data = {
          x: currChoice % 9,
          y: Math.floor(currChoice / 9)
        };
        rt = data;
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
      display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-affect-grid-button button');
      for (var i = 0; i < btns.length; i++) {
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

  };

  return plugin;
})();