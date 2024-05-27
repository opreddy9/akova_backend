const express=require('express')
const {check,validationResult}=require('express-validator')
const auth=require('../../middleware/auth')
const User=require('../../models/User')
const PostProblem=require('../../models/postproblem');
const router=express.Router();
//@route /api/postproblem
//desc post a problem
router.post('/',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('technologies','Technologies are needed for better user experience').not().isEmpty(),
    check('domain','Domain is required for essential search purpose').not().isEmpty(),
    check('description','Description is required').not().isEmpty(),
    check('outcome','Outcome of project is required').not().isEmpty(),
    check('dueDate','Due date is required').not().isEmpty(),
    check('attachments','Attachments are needed').not().isEmpty(),
    //check in the front-end for user entered dueDate is greater than present date
]], async (req,res)=>{
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try{
        let user=await User.findById(req.user.id).select('-password');
        if(req.user.profession!=='entrepreneur'){
            return res.status(400).json({
                errors: [{ msg: "Authorization denied" }],
            });
        }
        let title=req.body.title;
        let alreadythere=await PostProblem.findOne({title});
        if(alreadythere){
            res.status(400).
            json({msg:'Post with this specific title seems be taken. please post with alternative title'})
        }
        let post=new PostProblem({
            user:user.id,
            contributer:user.name,
            title:req.body.title,
            technologies:req.body.technologies,
            domain:req.body.domain,
            description:req.body.description,
            outcome:req.body.outcome,
            dueDate:req.body.dueDate,
            attachments:req.body.attachments
        });
        let problem= await post.save();
        res.status(200).json(problem);

      }catch(err){
        res.status(500).send('Server Error');
      }
});
//@route /api/postproblem/studentdashboard
//desc get all problems 
router.get('/studentdashboard',[auth],async (req,res)=>{
  try {
    if(req.user.profession !=='student'){
      return res.status(400).json({
          errors:[{msg:"Authorization denied"}]
      });
    }
    let allproblems=await PostProblem.find({}).populate('user',[
      "name",
      "email"
    ]);
    res.status(200).json(allproblems)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
});
//@route /api/postproblem/entrepreneurdashboard
//desc get all problems of an entrepreneur
router.get('/entrepreneurdashboard',[auth],async (req,res)=>{
  try {
    if(req.user.profession !=='entrepreneur'){
      return res.status(400).json({
          errors:[{msg:"Authorization denied"}]
      });
    }
    let allproblems=await PostProblem.find({user:req.user.id})
    res.status(200).json(allproblems)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
});

module.exports=router;