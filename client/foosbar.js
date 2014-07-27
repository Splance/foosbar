if (Meteor.isClient) {
  // Define Minimongo collections to match server/publish.js.
  Towns = new Meteor.Collection("towns");
  Arenas = new Meteor.Collection("arenas");

  // ID of currently selected town
  Session.setDefault('town_id', null);

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


  //// Towns ////
  Template.towns.loading = function () {
    return !townsHandle.ready();
  };
  Template.towns.towns = function () {
    return Towns.find({}, {sort: {name: 1}});
  };

  //// Arenas ////
  Template.arenas.loading = function () {
    return arenasHandle && !arenasHandle.ready();
  };
  Template.arenas.arenas = function () {
    return Arenas.find({}, {sort: {name: 1}});
  };

  // code some event/interaction stuff here
  Template.newscore.today = function () {
    return new Date().toISOString().substring(0,10);
  }
  Template.newscore.now = function () {
    return new Date().toString().substring(16, 21);
  }

}