const router = require('express').Router();
const fs = require('fs');
const Role = require('../models/Role.js');

const header = fs.readFileSync("public/templates/_partials/header.html", "utf8");
const footer = fs.readFileSync("public/templates/_partials/footer.html", "utf8");
const navbar = fs.readFileSync("public/templates/_partials/navbar.html", "utf8");
const adminNavbar = fs.readFileSync("public/templates/_partials/adminnavbar.html", "utf8");
const createRecipePage = fs.readFileSync("public/templates/dashboard/createrecipe.html", "utf8");
const editRecipePage = fs.readFileSync("public/templates/dashboard/editrecipe.html", "utf8");
const approvePage = fs.readFileSync("public/templates/admin/approve.html", "utf8");
const dashBoardPage = fs.readFileSync("public/templates/dashboard/dashboard.html", "utf8");
const loginPage = fs.readFileSync("public/templates/auth/login.html", "utf8");
const registerPage = fs.readFileSync("public/templates/auth/register.html", "utf8");
const adminSupportPage = fs.readFileSync("public/templates/admin/adminsupportpage.html", "utf8");
const adminSupport = fs.readFileSync("public/templates/support/adminsupport.html", "utf8");

router.get("/login", (req, res) => {
    return res.send(header + loginPage + footer);
 });
 
 router.get("/register", (req, res) => {
     return res.send(header + registerPage + footer);
 });
 
 // Checking for session
 let sessionChecker = (req, res, next) => {
     if (req.session.user && req.cookies.user_sid) {
         res.redirect('/dashboard');
     } else {
         next();
     }    
 };

 let usersOnly = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.redirect('/login');
    }    
};

 let isAdmin = async (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        const roleId = req.session.user.roleId;
        try {
            const role = await Role.query().findById(roleId);
            if (role.role === 'ADMIN') {
                next();
            } else {
                res.redirect('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
        
    } else {
        next();
    }    
};

router.get("/dashboard", usersOnly, async (req, res) => {
    return res.send(header + await showAdminNavbar(req.session.user) + dashBoardPage + footer);
})

router.get('/recipe/create', usersOnly, async (req, res) => {
    return res.send(header + await showAdminNavbar(req.session.user) + createRecipePage + footer);
})

router.get('/recipe/edit/:recipeId', usersOnly, async (req, res) => {
    return res.send(header + await showAdminNavbar(req.session.user) + editRecipePage + footer);
})

router.get('/recipe/approve', isAdmin, usersOnly, async (req, res) => {
    return res.send(header + await showAdminNavbar(req.session.user) + approvePage + footer);
})

router.get('/support', isAdmin, usersOnly, async (req, res) => {
    return res.send(header + await showAdminNavbar(req.session.user) + adminSupportPage + footer);
})

router.get('/adminticket', isAdmin, usersOnly, async (req, res) => {
    return res.send(header + adminSupport + footer);
})

async function showAdminNavbar(user) {
    const roleId = user.roleId;

    try {
        const role = await Role.query().findById(roleId);
        if (role.role === 'ADMIN') {
            return adminNavbar;
        }
    } catch (error) {
        console.log(error);
    }

    return navbar;
}

router.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

module.exports = router;