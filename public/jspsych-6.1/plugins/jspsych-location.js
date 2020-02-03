/*
 * Plugin which utilizes Leaflet.js to insert the test subject's
 * location into the map.
 */

/*

TODO:
-KUVAN KOKO

 */

jsPsych.plugins["location"] = (function() {
  var plugin = {};

  plugin.info = {
    name: "location",
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Stimulus",
        default: undefined,
        description: "The image to be displayed"
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image height",
        default: null,
        description: "Set the image height in pixels"
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image width",
        default: null,
        description: "Set the image width in pixels"
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Preamble",
        default: null,
        description: "String to display at top of the page."
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label",
        default: "Continue",
        description: "Label of the button."
      },
      required: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Required",
        default: false,
        description: "Makes answering the question required."
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var html = "";

    // show preamble text
    if (trial.preamble !== null) {
      html +=
        '<div id="jspsych-survey-likert-preamble" class="jspsych-survey-likert-preamble">' +
        trial.preamble;
      if (trial.required) {
        html += "<span class='required'>*</span>";
      }
      html += "</div>";
    }
    // Add the map
    html += '<div id="mapid"></div>';

    // Add the submit-button
    html += '<form id="jspsych-location-form">';
    html +=
      '<input type="submit" id="jspsych-location-next" class="jspsych-location jspsych-btn" value="' +
      trial.button_label +
      '"></input>';
    html += "</form>";
    display_element.innerHTML = html;

    var mymap = L.map("mapid").setView([0.2, -0.2], 10);
    var imageBounds = [
      [0, 0],
      [trial.stimulus_width / 1000, -trial.stimulus_height / 1000]
    ];

    L.imageOverlay(trial.stimulus, imageBounds).addTo(mymap);

    // start time
    var start_time = performance.now();
    var location = 0;

    var new_marker = {};
    function onMapClick(e) {
      location = e.latlng;

      if (new_marker != undefined) {
        mymap.removeLayer(new_marker);
      }

      new_marker = L.marker(e.latlng, {
        draggable: "true"
      }).addTo(mymap);
    }

    mymap.on("click", onMapClick);

    display_element
      .querySelector("#jspsych-location-form")
      .addEventListener("submit", function(e) {
        e.preventDefault();
        // measure response time
        var end_time = performance.now();
        var response_time = end_time - start_time;

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        // store response
        var trial_data = {
          rt: response_time,
          stimulus: trial.stimulus,
          location: location
        };

        // clear the display
        display_element.innerHTML = "";

        // move on to the next trial
        jsPsych.finishTrial(trial_data);
      });
    var start_time = performance.now();
  };

  return plugin;
})();
