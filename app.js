import express from "express"
import bodyParser from "body-parser"
import request from "request"
import path from "path"
import { fileURLToPath } from "url"
import {api} from "./credentials.js"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const exp = express()
const port = 3000

exp.use(bodyParser.urlencoded({extended : true}))
exp.use(express.static("public"))

exp.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html")
})

exp.post("/", (req, res)=>{
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const options = {
        url : `https://us12.api.mailchimp.com/3.0/lists/${api.listId}`,
        method : "POST",
        headers : {
            "Authorization" : `key ${api.key}`
        },
        body : jsonData

    }

    request(options, (error, response, body)=>{
        if(!error && response.statusCode == 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }
    })
})

exp.post("/failure", (req, res)=>{
    res.redirect("/")
})

exp.listen(port || process.env.POST , ()=>{
    console.log(`The server is running on port ${port}`);
})