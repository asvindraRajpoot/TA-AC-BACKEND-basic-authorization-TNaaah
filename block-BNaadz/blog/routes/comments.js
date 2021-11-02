var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');


//delete the comment
router.get('/:id/delete', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndDelete(id, (err, comment) => {
        if (err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
})


//edit the comment

router.get('/:id/edit', (req, res, next) => {
    var id = req.params.id;
    console.log(id);
    Comment.findById(id, (err, comment) => {
        if (err) return next(err);
        res.render('commentUpdate', { comment: comment });
    })
})

//
router.post('/:id', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
        if (err) return next(err);
        res.redirect('/articles/' + updatedComment.articleId);
    })

})


//increment likes
router.get('/:id/inclikes', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, updatedComment) => {
        if (err) return next(err);
        res.redirect('/articles/' + updatedComment.articleId);
    })

})

//decrement likes
router.get('/:id/declikes', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, updatedComment) => {
        if (err) return next(err);
        res.redirect('/articles/' + updatedComment.articleId);
    })

})



module.exports = router;