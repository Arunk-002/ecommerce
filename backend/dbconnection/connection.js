const mongoose = require('mongoose')
const connectDb = ()=>{
  try {
    mongoose.connect(process.env.MONGO_URL).then((err)=>{
        console.log('Database coonected');
    })
  } catch (error) {
    
  }
}

module.exports  =  connectDb