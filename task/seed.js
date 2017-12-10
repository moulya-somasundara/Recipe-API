var dbConnection = require("../config/mongoConnection");
var data = require("../data/");
var recipes = data.recipes;
var comments = data.comments;

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
            return dbConnection;
        }).then((db) => {
            var title="Fried Eggs";
            var ingredients=[{
                                name: "Egg",
                                amount: "2 eggs"
                             },
                             {
                                name: "Olive Oil",
                                amount: "2 tbsp"
                            }];
            var steps = [ "First, heat a non-stick pan on medium-high until hot",
    "Add the oil to the pan and allow oil to warm; it is ready the oil immediately sizzles upon contact with a drop of water.",
    "Crack the egg and place the egg and yolk in a small prep bowl; do not crack the yolk!",
    "Gently pour the egg from the bowl onto the oil",    
    "Wait for egg white to turn bubbly and completely opaque (approx 2 min)",
    "Using a spatula, flip the egg onto its uncooked side until it is completely cooked (approx 2 min)",
    "Remove from oil and plate",
    "Repeat for second egg"];
            return recipes.addRecipe(title,ingredients,steps);
        }).then((recipe) => {
            var id = recipe._id;
            console.log("created id "+id);
             return comments.addComment("Moulya Soma Sundara","Eggs are delicious" ,id);
            

            }).then(() =>
        {
           
            console.log("Done seeding database");
            db.close();
        });
        

}, (error) => {
    console.error(error);
});