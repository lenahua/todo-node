var express = require("express");
var app = express();
app.listen(3000);

var bp = require("body-parser");
app.use(bp.urlencoded({extended: false}))

var mysql = require("mysql");
var conn = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    database: "tododb"
})

// app.get("/todo/index", (req, res)=>{
//     res.render("todoIndex.ejs", {});
// })

app.get("/todo/index", (req, res)=>{
    conn.query("select * from todoTable",
        {},
        function(err, result){
            // console.log(result);
            res.render("todoIndex.ejs", {todoList: result});
        }
    )
})

app.get("/Todo/Create", (req, res)=>{
    res.render("todoCreate.ejs")
})
app.post("/Todo/Create", (req, res)=>{
    conn.query("insert into todoTable (title, isComplete) values (?, ?)",
    [req.body.Name, req.body.IsComplete || 0],
    function(err, result){
        
        // res.send("Insert Data " + req.body.Name + " " + req.body.IsComplete)
        res.redirect("/todo/index")
    }
    )
})

// EDIT
app.get("/Todo/Edit/:id", (req, res)=>{
    conn.query("select * from todoTable where todoTableId = ?",
        [req.params.id],
        function(err, result){
            // console.log(result);
            res.render("todoEdit.ejs", {item: result[0]})
        })
})
app.post("/Todo/Edit/:id", (req, res)=>{
    var isComplete = (req.body.IsComplete) ? 1 : 0;
    conn.query("update todoTable set title = ?, isComplete = ? where todoTableId = ?",
        [req.body.Name, isComplete, req.params.id],
        function(err, result){
            // res.send(`name ${req.body.Name}, isComplete: ${isComplete}`)
            res.redirect("/todo/index");
        })
})

//DELETE
app.get("/Todo/Delete/:id", (req, res)=>{
    conn.query("select * from todoTable where todoTableId = ?",
        [req.params.id],
        function(err, result){
            res.render("todoDelete.ejs", {item: result[0]})
        })
    
})
app.post("/Todo/Delete/:id", (req, res)=>{
    conn.query("delete from todoTable where todoTableId = ?",
        [req.params.id],
        function(err, result){
            res.redirect("/todo/index")
        })
})