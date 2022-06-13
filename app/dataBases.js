const Datastore = require('nedb');

module.exports = {
    users: new Datastore({
        filename: 'users.db',
        autoload: true
    }),    
    profiles: new Datastore({
        filename: 'profiles.db',
        autoload: true
    }),
    rooms: []
}