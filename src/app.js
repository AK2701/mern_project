const express = require("express");//used for routing 
const path = require("path");//east way to work within directory
const app = express();//stored express func
const hbs = require("hbs");//js template engine
require("./db/conn");//established connection with database and js
const Register = require("./models/registers");//imported register collection
const port = process.env.PORT || 3000;//port to render project
// console.log(path.join(__dirname, "../public"));
//storing path in variable
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
//uss and set...one of the first thing to run
app.use(express.json());//parsing data
app.use(express.urlencoded({extended:false}));//parsing data
app.use(express.static(static_path));//access style css
app.set("view engine", "hbs");//using hbs for templating 
app.set("views", template_path);// setting path to access views direc from any directory
hbs.registerPartials(partials_path);//templates reuse through partials
//handling request to designated location 
app.get("/", (req, res) => {
    res.render("index");
    });
app.get("/register", (req, res) => {
    res.render("register");
    });
app.get("/login",(req,res) => {
        res.render("login");
    })
//handling the post request
app.post("/register", async (req, res) => {
    try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    //making instance of the model
    if(password === cpassword){
        const registerEmployee = new Register({
            firstname : req.body.firstname,
            lastname  : req.body.lastname,
            email     : req.body.email,
            gender    : req.body.gender,
            phone     : req.body.phone,
            age       : req.body.age,
            password  : password,
            confirmpassword: cpassword
        })
        const registered = await registerEmployee.save();// saving instance to the database
            res.status(201).render("index");//opening index page
    }else{
        res.send("passwords are not matching")
    }
    } catch (error) {
        res.status(400).send(error);
    }
});
//starting server
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})
