const db = require("./db/connection")
const yargs = require("yargs");
const Movie = require("./schemas/Movie");

/*      helper function to:
        build the a search query filter obj with key:value pairs parsed from a string (eg from the yargs)
        user yarg string formatted as "key:value,key:value"
                                                        */
const buildObjFromString = (argsString) => {
    console.log(`building filter Object from the string: "${argsString}"`)

    let obj = {};

    //get an array of all keys in our Movie schema
    const props = Object.keys(Movie.schema.paths);
    //split the string at each ,  into key:values then split those inturn at the :
    let buildQueryFrom = argsString.split(/,(?=[^,]+:)/).map(s => s.split(':'));
    //map over the array of [ [key ,value] ... [key ,value]  ]
    buildQueryFrom.map((pair) => {
        //for each key in schema 
        props.map((key) => {
            //if pair[0] is a schema key 
            if (pair[0] === key) {
                //add the key:value to our obj
                obj[pair[0]] = pair[1]
            }
        })
    });
    return obj;
}

/* function to handle the requested yarg input */
const crudHandler = async (args) => {
    db.connect();
    let queryFilter = {};
    let results = null;

    //start update
    if (args.create) {
        try {
            //if not supplied by yargs defualts from schema used
            const movie = new Movie({ title: args.title, actor: args.actor, director: args.director, rating: args.rating })
            //if mongoose cant save then schema / mongoose error caught
            await movie.save().then(() => console.log("adding document")).catch((error) => console.log(error.message));
            //movie._doc is our schema document - ie fields
            // console.table(movie._doc,)
        }
        catch (e) { console.log(e) }
    }
    //end create

    //start read - aka find documents based on our filter
    else if (args.query) {
        switch (args.query) {
            case "all":
                queryFilter = {};
                break;
            default:
                //build our find filter from yargs input
                queryFilter = buildObjFromString(args.query);
                break;
        }
        //findByFilterObj is a static function defined with the schema in movie.js 
        results = await Movie.findByFilterObj(queryFilter);
        console.log(`Found ${results.length} documents`);
        //displayTable is statis schema function defined with the schema in movie.js
        Movie.displayTable(results);
    }
    //end query 
    //end read

    //start update
    else if (args.update) {
        //build the find/query filter
        queryFilter = buildObjFromString(args.update)
        console.log("query", queryFilter)
        //if the query object we built from the yargs input had valid keys added
        if (Object.keys(queryFilter).length !== 0) {

            //find the documents that match
            //findByFilterObj is a static function defined with the schema in movie.js 
            results = await Movie.findByFilterObj(queryFilter)
            console.log(`Found ${results.length} objects matching query string to update`)

            /*  for each document matching our query
                update the user defined new values */
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
                // update our updatedAT date/time
                movie.updatedAt = Date.now();

                /*  save our movie with newly changed values 
                    using .save() to allow mongoose's built in and any user defined (in schemea) validations
                    
                    if validation or for any reason save fails - catch the error */
                movie.save().then(function (v) {
                    console.log("Updating Document");
                    console.table(v._doc)
                }).catch((error) => console.log(error.message));
            })
        }
    }//end update

    //start delete
    else if (args.delete) {
        /*switch on the yarg cli input value eg
        --delete all 
        or 
        --delete "key:value,key/value" */
        switch (args.delete) {
            case "all":
                queryFilter = {};
                break;
            default:
                //build the find filter from yargs/user input string
                queryFilter = buildObjFromString(args.delete)
                break;
        }

        //find the documents that match
        //findByFilterObj is a static function defined with the schema in movie.js 
        results = await Movie.findByFilterObj(queryFilter)
        console.log(`Deleting ${results.length} results`);

        //for each document/movie found
        results.map((movie) => {
            movie.delete();
        })
    }
    //end delete


    else {
        console.log("Command not recognized");
    }

    //stopping diconnect before queued asyncs get chance to execute
    //why this error otherwise???
    setTimeout(() => {
        db.disconnect();
    }, 1000);

}

//send the yargs argv to our handler
crudHandler(yargs.argv)







