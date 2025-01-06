const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked!")
    const token = "xyz"
    const isAuthorized = token === "xyz"
    if(!isAuthorized){
        res.status(401).send("Unauthorized request!")
    }else{
        next()
    }
}

const userAuth = (req, res, next) => {
    console.log("User authentication checked!")
    const token = "abc"
    const isAuthorized = token === "akbc"
    if(!isAuthorized){
        res.status(401).send("User is not authorized!")
    }else{
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}