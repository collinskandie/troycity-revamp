const express = require("express");
const router = express.Router();
const { Job, OurTeam, ContactUs, OurPartners } = require("../models");
const nodemailer = require("nodemailer");


const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_SECURE = process.env.EMAIL_SECURE; // true for 465, false for other ports
// const EMAIL_FROM = "troyhost@troycityafrica.com";
transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Render Admin Panel with all data
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.findAll();
        const teamMembers = await OurTeam.findAll();
        const contacts = await ContactUs.findAll();
        const partners = await OurPartners.findAll();


        res.render("index", { jobs, teamMembers, contacts, partners });
    } catch (err) {
        //console.error("Error fetching admin data:", err);
        res.status(500).send("Internal Server Error");
    }
});

// ---- Form Handlers ----

// Jobs
router.post("/jobs", async (req, res) => {
    try {
        await Job.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        //console.error("Error creating job:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/jobs/delete/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        //console.log("Deleting job with ID: ", jobId);
        const deleted = await Job.destroy({ where: { id: jobId } });
        // //console.log("Deleted rows count: ", deleted);

        res.redirect("/");
    } catch (err) {
        //console.error("Error deleting job:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Team
router.post("/team", async (req, res) => {
    try {
        await OurTeam.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        //console.error("Error creating team member:", err);
        res.status(500).send("Internal Server Error");
    }
});

// routes/index.js or wherever
router.get("/api/partner-team", async (req, res) => {
    try {
        // Fetch team
        const teamMembers = await OurTeam.findAll();

        // Fetch partners
        const partners = await OurPartners.findAll();

        console.log("Fetched team members:", teamMembers);
        console.log("Fetched partners:", partners);

        // Build response
        res.json({
            team: teamMembers.map(member => ({
                name: member.fullName,
                role: member.role,
                image: member.imageUrl,
                socials: {
                    facebook: member.facebook,
                    googlePlus: member.googlePlus,
                    twitter: member.twitter,
                    linkedin: member.linkedin
                }
            })),
            clients: partners.map(p => ({
                name: p.name,
                website: p.website,
                logo: p.logo
            }))
        });
    } catch (err) {
        console.error("Error fetching partner-team:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/team/delete/:id", async (req, res) => {
    try {
        const memberId = req.params.id;
        //console.log("Deleting team member with ID: ", memberId);
        const deleted = await OurTeam.destroy({ where: { id: memberId } });
        // //console.log("Deleted rows count: ", deleted);

        res.redirect("/");
    } catch (err) {
        //console.error("Error deleting team member:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Contact
router.post("/contact", async (req, res) => {
    try {
        await ContactUs.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        //console.error("Error creating contact:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Partners
// Partners
router.post("/partners", async (req, res) => {
    try {
        await OurPartners.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

router.post("/partners/delete/:id", async (req, res) => {
    try {
        const partnerId = req.params.id;
        await OurPartners.destroy({ where: { id: partnerId } });
        res.redirect("/");
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// an api entry for website visitors to enter contact details 
router.post("/api/contact", async (req, res) => {
    try {
        const contact = await ContactUs.create(req.body);
        if (!contact) {
            return res.status(400).json({ error: "Failed to create contact" });
        }
        // send email to both the admin and the user
        const mailOptions = {
            from: EMAIL_USER,
            to: `${contact.email}, ${EMAIL_USER}`, // send to both user and admin
            subject: "Contact Form Submission Received",
            text: `Dear ${contact.name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nTroycity Africa Team`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                //console.error("Error sending email:", error);
            } else {
                //console.log("Email sent:", info.response);
            }
        });
        res.status(201).json(contact);
    } catch (err) {
        //console.error("Error creating contact via API:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
