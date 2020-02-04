import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    Comments = new Meteor.Collection('comments');
});
