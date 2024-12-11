import express from "express"
import ServerlessHttp from "serverless-http/serverless-http"
const app =express();
app.get("/.netlify/functions/api",(req,res)=>{
    return res.json({
        message:"hello world!"
    })
})
module.exports.handler = async(event,context)=>{
    const result = await handler(event,context);
    return result;
}