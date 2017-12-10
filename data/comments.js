var mongoCollections = require("../config/mongoCollections");
var recipes = mongoCollections.recipes;
var uuid = require('node-uuid');
var recipeData= require("./recipes");

var exportedMethods = {
    getAllComments(recipeId) {
        return recipes().then((recipeCollection) => {
            return recipeCollection.find({_id: recipeId},{"_id":1,"title":1,"comments":1}).toArray();
        });
    },
    getCommentById(id) {
        return recipes().then((recipeCollection) => {
            return recipeCollection.findOne({ "comments._id":id },{"_id":1,"title":1,"comments": { $elemMatch: { "_id": id } }}).then((comment) => {
                if (!comment) 
                {
                   
                    throw "Comment not found";
                }
                return comment;
            });
        });
    },
    getRecipeCommentById(recipeId,commentId){

    },
    addComment(poster, comment, recipeId) {
        return recipes().then((recipeCollection) => {
            return recipeData.getRecipeById(recipeId)
                .then((recipeObj) => {
                    var newComment = {
                        _id: uuid.v4(),
                        poster: poster,
                        comment: comment
                    };
                    recipeObj.comments.push(newComment);

                    var updateCommand = {
                        $set: recipeObj
                    };

                    return recipeCollection.updateOne({ _id: recipeId }, updateCommand).then((result) => {
                        if(result.modifiedCount>0)
                            return newComment;
                        else
                            throw "Issue Adding the comments";
                    });
                });
        });
    },
    removeComment(id) {
        return recipes().then((recipeCollection) => {

            return recipeCollection.findOne({ "comments._id":id },{"_id":1}).then((commentObj)=>{
                
                return recipeCollection.update({ _id: commentObj._id }, { $pull: { "comments": { _id: id } } });
            });
            
        });
    },
    updateComment(recipeId, commentId, updatedComment) {
        return recipes().then((recipeCollection) => {
            var updatedCommentData = {};

            
            if (updatedComment.poster) {
                updatedCommentData.poster = updatedComment.poster;
            }

            if (updatedComment.comment) {
                updatedCommentData.comment = updatedComment.comment;
            }

            var updateCommand = {
                $set: {"comments.$._id": commentId,"comments.$.poster": updatedCommentData.poster,"comments.$.comment": updatedCommentData.comment}
              
            };

            return recipeCollection.updateOne({ _id: recipeId,"comments._id":commentId }, updateCommand).then((result) => {
                if(result.modifiedCount>0)
                return this.getCommentById(commentId);
                else
                throw "Issue updating the comments";
            });
        });
    },
}
module.exports = exportedMethods;