// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import expenseRoutes    from './routes/expenses.js';
import settlementRoutes from './routes/settlement.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());



try{
     mongoose.connect(process.env.MONGODB_URI)
 .then((data)=>{
    console.log(`Connected to MongoDB at ${data.connection.host}:${data.connection.port}`);
    const datas = mongoose.connection
    datas.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
 })
}
catch(err){
  console.error(`MongoDB connection error: ${err}`);
}


app.use('/expenses',   expenseRoutes);
app.use('/',           settlementRoutes);

// Global error handler
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
