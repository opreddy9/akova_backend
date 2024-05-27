const express=require('express');
const {check,validationResult}=require('express-validator')
const router=express.Router();
const checkObjectId=require('../../middleware/checkObjectId')
const investmentask=require('../../models/investmentask')
const InvAccept=require('../../models/invaccept')
const User=require('../../models/User')
const auth=require('../../middleware/auth')
//@route /api/invest
//desc ask for an investment
router.post('/',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('technologies','Technologies are needed for better user experience').not().isEmpty(),
    check('domain','Domain is required for essential search purpose').not().isEmpty(),
    check('description','Description is required').not().isEmpty(),
    check('outcome','Outcome of project is required').not().isEmpty(),
    check('dueDate','Due date is required').not().isEmpty(),
    check('attachments','Attachments are needed').not().isEmpty(),
    check('amount','Amount is required and It should be an number').notEmpty().isNumeric()
]],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }
    try{
        if(req.user.profession !=='entrepreneur'){
            return res.status(400).json({
                errors:[{msg:"Authorization denied"}]
            })
        }
        let user = await User.findById(req.user.id).select('-password')
        let title=req.body.title;
        let alreadythere=await investmentask.findOne({title});
        if(alreadythere){
            return res.status(400).json({
                msg:"There seems to an investment with this current title"
            })
        }
        let invest=new investmentask({
            user:req.user.id,
            askedby:user.name,
            title:req.body.title,
            technologies:req.body.technologies,
            domain:req.body.domain,
            description:req.body.description,
            outcome:req.body.outcome,
            dueDate:req.body.dueDate,
            attachments:req.body.attachments,
            status:0,
            amount:req.body.amount
        })
        let investposted=await invest.save();
        res.status(200).json(investposted)
    }catch(err){
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});
//Get all investment asks by a entrepreneur
router.get('/getallinvestments',[auth],async (req,res)=>{
    try{
        // console.log(req.user.id)
        if(req.user.profession !=='investor'){
            return res.status(400).json({
                errors:[{msg:"Authorization denied"}]
            });
        }
        let investments=await investmentask.find().sort({date:-1});
        if(!investments || investments.length==0){
            return res.status(400).json({msg:"No investments are present"})
        }
        res.status(200).json(investments);
    }catch(err){
        res.status(500).send("Server error")
    }
});
//Get investment ask by its id
router.get('/investment/:id',[auth,checkObjectId('id')],async (req,res)=>{
    try{
        let investment=await investmentask.findById(req.params.id);
        if(!investment || investment.length==0){
            return res.status(400).json({msg:"There seems to be no investment you are looking"})
        }
        res.status(200).json(investment)
    }
    catch(err){
        res.status(500).send("Server error")
    }
});
//accept a investment by routed through its id
router.post('/investmentaccepted/:id',[auth,checkObjectId('id'),[
    check('amount','Amount is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        if(req.user.profession !=='investor'){
            return res.status(400).json({
                errors:[{msg:"Authorization denied"}]
            })
        }
        let present=await InvAccept.find({investment:req.params.id,user:req.user.id});
        if(present && present.length>0){
            return res.status(400).json({
                errors:[{msg:"You already agreed to investment"}]
            })
        }
        let validask=await investmentask.findById(req.params.id);
        if(!validask || validask.length==0){
            return res.status(400).json({
                errors:[{msg:"Not a valid investment request"}]
            });
        }
        let accept=new InvAccept({
            user:req.user.id,
            investment:req.params.id,
            askedby:validask.user,
            amount:req.body.amount,
        });
        let investsave=await accept.save();
        res.status(200).json(investsave);
    }catch(err){
        console.log(err.message)
        res.status(500).send('server error');
    }

});
//get all accepted investments for a investment ask
router.get('/allinvested/:id',[auth,checkObjectId('id')], async (req,res)=>{
    try{
        if(req.user.profession !=='entrepreneur'){
            return res.status(400).json({
                errors:[{msg:"Authorization denied"}]
            })
        }
        let allinvested= await InvAccept.find({investment:req.params.id,askedby:req.user.id}).populate(
            [
                {
                    path:'user',
                    select:'name email'
                }
            ]
        )
        if(!allinvested || allinvested.length==0){
            return res.status(400).json({msg:"There seems to be no investment you are looking"})
        }
        res.status(200).json(allinvested);
    }
    catch(err){
        res.status(500).send('Server error');
    }
});
//get all accepted investment asks of any entrepreneur
router.get('/allaccepted',[auth], async (req,res)=>{
    try{
        if(req.user.profession !=='entrepreneur'){
            return res.status(400).json({
                errors:[{msg:"Authorization denied"}]
            })
        }
        let allinvested= await InvAccept.find({askedby:req.user.id}).populate(
            [
                {
                    path:'investment',
                    select:'title domain technologies amount'
                },
                {
                    path:'user',
                    select:'name email'
                }
            ]
        )
        res.status(200).json(allinvested)
    }catch(err){
        res.status(500).send('Server error')
    }
});
//Get all investments accepted by investor
router.get('/investoraccepted',[auth], async (req,res)=>{
    try {
        if(req.user.profession !=='investor'){
            return res.status(400).json({
                errors:[{msg:"Authorization denied"}]
            });
        }
        let allaccepted=await InvAccept.find({user:req.user.id}).populate(
            [
                {
                    path:'investment',
                    select:'title domain technologies amount'
                },
                {
                    path:'askedby',
                    select:'name email'
                }
            ]);
        if(!allaccepted || allaccepted.length==0){
            return res.status(400).json({
                errors:[{msg:"NO accepted investment requests"}]
            });
        }
        res.status(200).json(allaccepted);
    } catch (err) {
        res.status(500).send('server error')
    }
})
module.exports=router