if (Meteor.isServer) {

	// Towns -- {name: String}
	Towns = new Meteor.Collection("towns");
	// Publish complete set of towns to all clients.
	Meteor.publish("towns", function () {
	  return Towns.find();
	});

	// Arenas -- {name: String,
  //            town_id: String,
	//						yelp_biz: String,
	// 						visits: Number}
	Arenas = new Meteor.Collection("arenas");
	// Publish all arenas for requested town.
	Meteor.publish("arenas", function (town_id) {
	  check(town_id, String);
	  return Arenas.find({town_id: town_id});
	});
  
  // Scores -- {played: Date,
  //            home: Number,
  //            visitor: Number,
  //            arena_id: String}
  Scores = new Meteor.Collection("scores");
  Meteor.publish("scores", function () {
  	return Scores.find();
  });

  Scores.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
  });

}
