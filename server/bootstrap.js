if (Meteor.isServer) {
  // if the database is empty on server start, create some sample data.
  Meteor.startup(function () {
    if (Towns.find().count() === 0 && Arenas.find().count() === 0) {
      var data = [
        {
          name: "Boston, MA",
          places: [
            {name: "Beacon Hill Pub", yelp_biz: "beacon-hill-pub-boston"},
            {name: "Jm Curley", yelp_biz: "jm-curley-boston"},
            {name: "Mass Ave Tavern", yelp_biz: "mass-ave-tavern-boston-3"},
            {name: "Ames Plow Tavern", yelp_biz: "ames-plow-tavern-boston-2"},
            {name: "Our House East", yelp_biz: "our-house-east-boston?"},
            {name: "Sullivan's Tap", yelp_biz: "sullivans-tap-boston"},
            {name: "Biddy Early’s", yelp_biz: "biddy-earlys-boston"},
            {name: "Croke Park/Whitey’s", yelp_biz: "croke-park-whiteys-boston"},
            {name: "Punter’s Pub", yelp_biz: "punters-pub-boston"}
          ]
        },
        {
          name: "Cambridge, MA",
          places: []
        },
        {
          name: "Somerville, MA",
          places: [
            {name: "The Pub", yelp_biz: "the-pub-somerville"}
          ]
        }
      ];
      for (var i = 0; i < data.length; i++) {
        var town_id = Towns.insert({name: data[i].name});
        for (var j = 0; j < data[i].places.length; j++) {
          var info = data[i].places[j];
          Arenas.insert({town_id: town_id,
                        name: info.name,
                        yelp_biz: info.yelp_biz,
                        visits: 0});
        }
      }
    }
  });
}