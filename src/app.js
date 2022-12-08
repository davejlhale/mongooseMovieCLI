const db = require("./db/connection")
const yargs = require("yargs");
const Movie = require("./schemas/Movie");

// * build the search query filter obj key:value pairs from a string (eg from yargs)
// user yarg string formatted as "key:value,key:value"
const buildObjFromString = (argsString) => {
    console.log(`building filter Object from the string: "${argsString}"`)
    let obj = {};
    let buildQueryFrom = argsString.split(/,(?=[^,]+:)/).map(s => s.split(':'));
    buildQueryFrom.map((pair) => {
        const props = Object.keys(Movie.schema.paths);
        props.map((key) => {
            if (pair[0] === key) { obj[pair[0]] = pair[1] }
        })
    });
    return obj;
}

//handle the requested yarg input
const crudHandler = async (args) => {
    db.connect();
    let queryFilter = {};
    let results = null;
    if (args.create) {
        try {
            const movie = new Movie({ title: args.title, actor: args.actor, director: args.director, rating: args.rating })
            movie.save().catch((error) => console.log(error.message));
            console.table(movie._doc)
        }
        catch (e) { console.log(e) }
    }//end create
    else if (args.query) {
        switch (args.query) {
            case "all":
                queryFilter = {};
                results = await Movie.findByFilterObj(queryFilter);
                break;
            default:
                queryFilter = buildObjFromString(args.query);
                results = await Movie.findByFilterObj(queryFilter);
                break;
        }
        console.log(`Found ${results.length} documents`);
        Movie.displayTable(results);
    } //end query
    else if (args.update) {
        queryFilter = buildObjFromString(args.update)
        console.log("query", queryFilter)
        if (Object.keys(queryFilter).length !== 0) {
            results = await Movie.findByFilterObj(queryFilter)
            console.log(results.length)
            results.map((movie) => {
                if (args.title) {
                    movie.title = args.title;
                }
                if (args.actor) {
                    movie.actor = args.actor;
                }
                if (args.director) {
                    movie.director = args.director;
                }
                if (args.rating || args.rating === 0) {
                    movie.rating = args.rating;
                }
                movie.updatedAt = Date.now();
                movie.save().then(function (v) {
                    console.log("Document updated");
                    console.table(v._doc)
                }).catch((error) => console.log(error.message));
            })
        }


    }//end update
    else if (args.delete) {
        console.log(args.delete)
        switch (args.delete) {
            case "all": queryFilter = {};
                results = await Movie.findByFilterObj(queryFilter)
                break;
            default:
                queryFilter = buildObjFromString(args.delete)
                results = await Movie.findByFilterObj(queryFilter)
                break;
        }
        console.log(`Deleting ${results.length} results`);
        results.map((movie) => {
            movie.delete();
        })

    } //end delete
    else {
        console.log("Command not recognized");
    }

    setTimeout(() => {
        db.disconnect();
    }, 1000);
    
}


crudHandler(yargs.argv)







