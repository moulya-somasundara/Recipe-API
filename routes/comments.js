var express = require('express');
var router = express.Router();
var data = require("../data");
var commentData = data.comments;
var recipeData = data.recipes;

router.get("/recipe/:recipeId", (req, res) => {
    var getRecipe = recipeData.getRecipeById(req.params.recipeId);
    getRecipe.then(() => {
        return commentData.getAllComments(req.params.recipeId).then((commentList) => {
            var commentsObj = {
                    "recipeId":null,
                    "recipeTitle":null,
                    "comments":[]
            };

            commentsObj.recipeId = commentList[0]._id;
            commentsObj.recipeTitle = commentList[0].title;
            commentsObj.comments = commentList[0].comments;
            res.json(commentsObj);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
    }).catch(() => {
        res.status(404).json({ error: "Recipe not found to display comments" });
    });
});

router.get("/:commentId", (req, res) => {
    commentData.getCommentById(req.params.commentId).then((comment) => {
        var commentsObj = {
                    "_id":null,
                    "recipeId":null,
                    "recipeTitle":null,
                    "poster":null,
                    "name":null
            };

            commentsObj.recipeId = comment._id;
            commentsObj.recipeTitle = comment.title;
            commentsObj._id = comment.comments[0]._id;
            commentsObj.name = comment.comments[0].comment;
            commentsObj.poster = comment.comments[0].poster;

        res.json(commentsObj);
    }).catch(() => {
        res.status(404).json({ error: "Comment not found" });
    });
});

router.post("/:recipeId", (req, res) => {
    var blogPostData = req.body;

    var getRecipe = recipeData.getRecipeById(req.params.recipeId);
    getRecipe.then(() => {
        return commentData.addComment(blogPostData.poster, blogPostData.comment, req.params.recipeId)
        .then((newComment) => {
            res.json(newComment);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
    }).catch(() => {
        res.status(404).json({ error: "Recipe not found to add comment" });
    });
});

router.put("/:recipeId/:commentId", (req, res) => {
    var updatedData = req.body;

    var getRecipe = commentData.getCommentById(req.params.commentId);

    

    getRecipe.then((commentResult) => {
        return commentData.updateComment(req.params.recipeId,req.params.commentId, updatedData)
            .then((updatedComment) => {
                res.json(updatedComment);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Comment not found to update" });
    });

});

router.delete("/:id", (req, res) => {
    var getComment = commentData.getCommentById(req.params.id);

    getComment.then(() => {
        
        return commentData.removeComment(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Comment not found to delete" });
    });
});


module.exports = router;