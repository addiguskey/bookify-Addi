const router = require("express").Router();
const { Review, User } = require("../models/");
const withAuth = require("../utils/auth");

// router.get("/", withAuth, async (req, res) => {
//   try {
//     const reviewData = await Review.findAll({
//       where: {
//         user_id: req.session.user_id,
//       },
//     });

//     const reviews = reviewData.map((review) => review.get({ plain: true }));

//     res.render("all-booklogs", {
//       // layout: "booklog-main",
//       reviews,
//     });
//   } catch (err) {
//     res.redirect("login");
//   }
// });

router.post("/all-booklogs", withAuth, async (req, res) => {
  try {

    const currentReview = await Review.create(
      req.body
    );
    const currentUser = await User.findOne({
      where: {
        id: req.session.user_id
      }
    })
    await currentUser.addReview(currentReview)
    // res.status(200).json(reviewData);
    res.redirect("/booklog")
  } catch (err) {
    res.redirect("login");
  }
});

router.get('/review/:id', withAuth, async (req, res) => {
  try {
    const postData = await Review.findByPk(req.params.id);

    if (postData) {
      const post = postData.get({ plain: true });

      res.render('reviews', {
        layout: 'main',
        loggedIn: req.session.loggedIn,
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});


router.delete('/review/:id', withAuth, async (req, res) => {
  try{
    const currentReview = await Review.destroy(
      {
        review_id: req.params.review_id
      })

    if (!currentReview) {
      res.status(404).json({ message: 'No Review found with this id!' });
      return;
    }
  } catch(err){
    res.status(500).json(err)
  }
})
module.exports = router;
