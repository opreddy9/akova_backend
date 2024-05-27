const express= require('express');
const connectDB = require('./config/db');
const app=express();
connectDB();
app.use(express.json({extended:false}));
app.get('/',(req,res)=> res.send('API running'));
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/postproblem',require('./routes/api/postproblem'))
app.use('/api/invest',require('./routes/api/invest'))
app.use('/api/idea',require('./routes/api/idea'))
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`server started on port ${PORT}`));