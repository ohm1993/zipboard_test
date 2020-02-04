import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Accounts} from 'meteor/accounts-base';
import './main.html';


if(Meteor.isClient){
  Router.configure({layoutTemplate: 'main'});

  Router.route('/register');
  Router.route('/login');
  Router.route('/', {
    name: 'home',
    template: 'home'
  });
  Template.main.helpers({
    currentUser: function() {
      return Meteor.userId();
    }
  })
  Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
          email: email,
          password: password
      }, function(error){
          if(error){
              console.log(error.reason); // Output error if registration fails
          } else {
              Router.go("home"); // Redirect user if registration succeeds
          }
      });
    }
  });
  Template.main.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
  });
  Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
            if(error){
                console.log(error.reason);
            } else {
                Router.go("home");
            }
        });
    }
  });
  Template.home.events({
    'submit form': function(event){
      event.preventDefault();
      var message =  $('[name=comment]').val();
      var currentUser = Meteor.userId();
      var email = Meteor.user().emails[0].address
      Comments.insert({
          message: message,
          postId: "1",
          createdBy: currentUser,
          email:email,
          createdAt: new Date()
      });
      $('[name="comment"]').val('');
    }
  })
  Template.home.helpers({
    'comments': function(){
         return Comments.find({ "message": { $exists: true, $ne: null } },{sort: {createdAt: -1}});
    }
  });
  Template.registerHelper('formatDate', function(createdAt) {
    return moment(createdAt).format('MM-DD-YYYY');
  });
  
}

if(Meteor.isServer){
  // server code goes here
}
Comments = new Meteor.Collection('comments');