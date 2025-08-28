import dotenv from "dotenv"
import express from "express"
dotenv.config()

const app = express()

const PORT = process.env.PORT  || PORT

app.get('/',(req,res) => {
    res.send("Welcome to the Store")
})

app.listen(PORT , ()=>{
    console.log(`Server running at port : ${PORT}`);
})
