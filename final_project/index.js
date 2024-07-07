const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const {isValid} = require("./router/auth_users");
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
//TEST COMMIT

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here

    // Check if user is authentificated
    if(req.session.authorization && req.session.authorization['accessToken']){
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated or error" });
            }
        });
    } else return res.status(401).json({ message: "No access token provided" });
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
