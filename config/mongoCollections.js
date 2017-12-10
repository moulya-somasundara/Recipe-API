var dbConnection = require("./mongoConnection");


var getCollectionFn = (collection) => {
    var _col = undefined;

    return () => {
        if (!_col) {
            _col = dbConnection().then(db => {
                return db.collection(collection);
            });
        }

        return _col;
    }
}


module.exports = {
    recipes: getCollectionFn("recipes") ,
    comments: getCollectionFn("comments")
};

