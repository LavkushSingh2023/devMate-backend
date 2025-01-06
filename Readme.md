use of regex-
 "/ab+c"
 "/ab*c"
 "/a(bc)+d"
 /a/
 req.query
 req.params

 // app.get("/hello", (req, res) => {
//     console.log(req.query)              // http://localhost:3000/hello?userId=123
//     res.send("llo page is here!")
// })

// app.get("/test/:userId/:name", (req, res) => {
//     console.log(req.params)                          // http://localhost:3000/test/120/Lavkush
//     res.send("this is test page!")
// })

// app.use("/admin", adminAuth)

// app.get("/user", userAuth, (req, res) => {
//     res.send("User data send")
// })

// app.get("/admin/getAllData", (req, res) => {
//     res.send("All data send")
// })

// app.get("/admin/delAllData", (req, res) => {
//     res.send("All data deleted")
// })

app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("Something went wrong!")
    }
})

app.get("/admin", (req, res) => {
    throw new Error("dfffd")
    res.send("Admin is called!")
})


