const ZipDb = require("zip-db");
const jayson = require("jayson");
 
const db = new ZipDb(__dirname + "/projects.db", "password");
let projectsDb;

if (db.hasCollection("projects")) {
    projectsDb = db.getCollection("projects");
} else {
    console.log("Database error");
    return;
}
console.log("Database:");
console.log(projectsDb.getAll());

const server = jayson.server({
    get: function(filter, callback) {
        console.log("get");
        let request = projectsDb.getAll();
        callback(null, request);
    },
    projectUpdateTime: function(args, callback) {
        console.log("projectUpdateTime");
        let entry = projectsDb.getById(args.id);
        if (entry) {
            entry.time += args.time;
            db.persist();
        }
        callback(null, entry);
    },

    updateStatus: function(args, callback) {
        let entry = projectsDb.getById(args.id);
        if (entry) {
            entry.status = args.status;
            db.persist();
        }
        callback(null, entry);
    },
    addProject: function(args, callback) {
        console.log("addProject")
        let entry = { 
            name: "",
            status: 'open',
            icon: "",
            time: 0,
            color: "#000000"
        };
        entry.name = args.name;
        entry.icon = args.icon;
        entry.color = args.color;
        let result = projectsDb.add(entry);
        db.persist();
        callback(null, result);

    },
    delProject: function(args, callback) {
        projectsDb.removeById(args.id);
        db.persist();
        callback(null, "done");
    }
});

server.http().listen(3000, function() {
    console.log('Server listening on http://localhost:3000');
});




