if (Meteor.isClient) {
  // Define Minimongo collections to match server/publish.js.
  Towns = new Meteor.Collection("towns");
  Arenas = new Meteor.Collection("arenas");
  Scores = new Meteor.Collection("scores");

  // ID of currently selected town
  Session.setDefault('town_id', null);
  // Green light for data changes
  Session.setDefault('go_ahead', false);

  // Subscribe to 'towns' collection on startup.
  // Select a list once data has arrived.
  var townsHandle = Meteor.subscribe('towns', function () {
    if (!Session.get('town_id')) {
      Session.set('town_id', Towns.findOne({}, {sort: {name: 1}})._id);
    }
  });

  var arenasHandle = null;
  // Always be subscribed to the arenas for the selected town.
  Deps.autorun(function () {
    var town_id = Session.get('town_id');
    if (town_id)
      arenasHandle = Meteor.subscribe('arenas', town_id);
    else
      arenasHandle = null;
  });

  // Subscribe to 'scores' collection on startup.
  var scoresHandle = Meteor.subscribe('scores');

  //// Towns ////
  Template.towns.loading = function () {
    return !townsHandle.ready();
  };
  Template.towns.towns = function () {
    return Towns.find({}, {sort: {name: 1}});
  };
  Template.towns.events({
    'change select.town': function (evt) {
      Session.set('town_id', evt.currentTarget.value);
    }
  });

  //// Arenas ////
  Template.arenas.loading = function () {
    return arenasHandle && !arenasHandle.ready();
  };
  Template.arenas.arenas = function () {
    return Arenas.find({}, {sort: {name: 1}});
  };

  //// Scores ////
  Template.scores.loading = function () {
    return scoresHandle && !scoresHandle.ready();
  };
  Template.scores.scores = function () {
    return Scores.find({}, {sort: {added: 1}});
  };

  //// New Score ////
  Template.newscore.events({
    'submit form.new_score': function (evt){
      evt.preventDefault();
      var score = validateScoreForm();
      if(score != false){
        Session.set('go_ahead', true);
        var submitted = submitNewScore(score);
        if (submitted) {
          toggleSubmitButton(false);
          $("form.new_score")[0].reset();
        }
      }
      return false;
    },
    'change input[name=approved]': function (evt) {
      var toggle = evt.target.checked && (validateScoreForm() != false);
      toggleSubmitButton(toggle);
      evt.target.checked = toggle;
    },
    'change form.new_score': function (evt) {
      if (evt.target.name != "approved"){
        var checker = $('.new_score input[name=approved]');
        if (checker[0].checked) {
          checker[0].checked = false;
          toggleSubmitButton(false);
        }
      }
    }
  });

  //// Extras ////
  // code some event/interaction stuff here
  function newDateInputValue() {
    return new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10);
  }
  Template.newscore.today = function () {
    return newDateInputValue();
  }
  function newTimeInputValue() {return new Date().toString().substring(16, 21);}
  Template.newscore.now = function () {
    return newTimeInputValue();
  }

  function toggleSubmitButton(toggle){
    var submitButton = $("form.new_score input[type=submit]")[0];
    submitButton.disabled = !toggle;
    submitButton.style.setProperty("opacity", toggle ? 1 : .3);
  }
  
  function validateScoreForm(){
    var items = {
      home: null,
      visitor: null,
      played: null,
      arena_id: null
    }
    var valid = true;

    // scores
    var scores = $('.new_score input[type="number"]');
    for (var i = scores.length - 1; i >= 0; i--) {
      if(!scores[i].value || scores[i].value < 0){
        invalidLabel(scores[i].name, true);
        valid = false;
      }
      else{
        invalidLabel(scores[i].name, false);
        items[scores[i].name] = scores[i].value;
      }
    };

    // date & time
    var date = $('.new_score input[type="date"]')[0];
    var time = $('.new_score input[name="time"]')[0];
    if (date && date.value && time && time.valueAsDate){
      var day = date.value+" 00:00:00";
      if (new Date(day) > new Date()){
        invalidLabel('date', true);
        valid = false;
      }
      else invalidLabel('date', false);
      
      var played = new Date(day);
      var t = time.valueAsDate;
      played.setHours(t.getUTCHours(), t.getMinutes());
      if (played > new Date()){
        invalidLabel('time', true);
        valid = false;
      }
      else{
        invalidLabel('time', false);
        items.played = played;
        // point next reset on last time check
        date.defaultValue = newDateInputValue();
        time.defaultValue = newTimeInputValue();
      }
    }
    else valid = false;

    // arena
    var arena = $('.new_score select[name="arena"]')[0];
    if (arena && arena.value){
      invalidLabel('arena', false);
      items.arena_id = arena.value;
    }
    else {
      invalidLabel('arena', true);
      valid = false;
    }

    return valid && items;
  }

  function invalidLabel(class_name, invalid) {
    var fields = $('label.'+class_name);
    if (fields.length) {
      for (var i = fields.length - 1; i >= 0; i--) {
        if (invalid) {
          fields[i].classList.add("invalid")
        }
        else {
          fields[i].classList.remove("invalid")
        }
      };
    }
  }

  function submitNewScore(score){
    var data = score;
    var submitted = false;
    if(Session.equals('go_ahead', true)){
      data.user_id = Meteor.userId();
      if (!data.user_id) {
        alert("You must be signed in to perform this action.");
        submitted = false;
      }
      else {
        var new_id = Scores.insert(data, function(err){
          if(err) alert(err.reason + ": The score could not be added.");
          else Session.set('go_ahead', false);
        });
        submitted = (typeof new_id !== 'undefined');
      }
      return submitted;
    }
  }
}