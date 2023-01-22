const express = require('express')
const app = express()
app.set('view engine', "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true }))





const Document = require('./models/Document')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect("mongodb://localhost/copybin",{
    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    
})


  
 
app.get("/", (req, res) =>{
    const code = `Welcome to CopyBin!

# Project

This project is clone of the known app HasteBin.


## Basic Usage

Use the commands in the top right conrner
to create a new file to share with others.

Type what you want me to see, click "Save", and then copy the URL.
Send that URL to someone and they'll see what you see.

## AWS

I have chosen to host our CopyBin app on Amazon Web Services 
to take advantage of its robust and secure infrastructure,
ensuring our users have the best experience possible.

For more information about the cloud infrastructure
behind the app please visit github.`

    res.render("view-display.ejs", { code, language: 'markdown'})
})

app.get ("/new", (req, res) =>{
    res.render("new.ejs")
})

app.post('/save', async (req,res) =>{
    const value = req.body.value
    try  {
        const document = await Document.create({ value })
        res.redirect(`/${document.id}`)
    } catch (e) {
        res.render("new", { value })
    };
})


app.get('/:id/duplicate', async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)

        res.render('new', { value: document.value })
    } catch (e){
        res.redirect(`/${id}`)
    }
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)

        res.render('view-display', {code: document.value, id })
    } catch (e){
        res.redirect('/')
    }
})

app.listen(3000)