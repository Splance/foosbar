if (Meteor.isServer) {

  // Towns -- {name: String}
  Towns = new Meteor.Collection("towns");
  // Publish complete set of towns to all clients.
  Meteor.publish("towns", function () {
    return Towns.find();
  });

  // Arenas -- {name: String,
  //            town_id: String,
  //            yelp_biz: String,
  //            visits: Number}
  Arenas = new Meteor.Collection("arenas");
  // Publish all arenas for requested town.
  Meteor.publish("arenas", function (town_id) {
    check(town_id, String);
    return Arenas.find({town_id: town_id});
  });

  // Scores -- {created: Date,
  //            played: Date,
  //            home: Number,
  //            visitor: Number,
  //            arena_id: String}
  Scores = new Meteor.Collection("scores");
  Meteor.publish("scores", function () {
    return Scores.find();
  });

  Scores.allow({
    'insert': function (userId, doc) {
      if(userId && userId == doc.user_id){
        doc.created = new Date();
        doc.owner = userId;
        return true;
      }
      else return false;
    },
    'update': function(userId, docs, fields, modifier) {
      for(var i=0; i<docs.length; i++){
        if (docs[i].user_id != userId) {
          return false;
        }
      }
      return true;
    },
    'remove': function(userId, docs) {
      for(var i=0; i<docs.length; i++ ){
        if (docs[i].user_id != userId) {
          return false;
        }
      }
      return true;
    }
  });

}
