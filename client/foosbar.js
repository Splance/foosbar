if (Meteor.isClient) {
  // code some event/interaction stuff here
  Template.newscore.today = function () {
    return new Date().toISOString().substring(0,10);
  }
  Template.newscore.now = function () {
    return new Date().toString().substring(16, 21);
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
