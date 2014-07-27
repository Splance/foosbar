Arenas = new Meteor.Collection("arenas");
Arenas.insert({name:"Default Bar"});
var allArenas = Arenas.find({}).fetch();