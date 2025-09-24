const express = require("express");
const router = express.Router();
const { Job, OurTeam, ContactUs, Application, OurPartners, MembershipRequest } = require("../models");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Multer setup
const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

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
        const applications = await Application.findAll({ include: [{ model: Job, as: "job" }] });
        const membershipRequests = await MembershipRequest.findAll();
        //console.log("Fetched jobs:", jobs);
        //console.log("Fetched team members:", teamMembers);
        //console.log("Fetched contacts:", contacts);
        //console.log("Fetched partners:", partners);
        //console.log("Fetched applications:", applications);


        res.render("index", { jobs, teamMembers, contacts, partners, applications, membershipRequests });
    } catch (err) {
        ////console.error("Error fetching admin data:", err);
        res.status(500).send("Internal Server Error");
    }
});
// POST job application
router.post("/job-applications", upload.single("cv"), async (req, res) => {
    try {
        const { jobId, name, email, coverLetter } = req.body;
        const application = await Application.create({
            jobId,
            name,
            email,
            coverLetter,
            cv: req.file ? req.file.filename : null
        });
        // send mail to admin and user?
        const mailOptions = {
            from: EMAIL_USER,
            to: EMAIL_USER,
            subject: "New Job Application",
            text: `You have received a new job application from ${name}.`
        };
        const mailOptionsUser = {
            from: EMAIL_USER,
            to: email,
            subject: "Job Application Confirmation",
            text: `Thank you for applying for the job. We have received your application.`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error("Error sending email:", error);
            }
            console.log("Email sent:", info.response);
        });
        transporter.sendMail(mailOptionsUser, (error, info) => {
            if (error) {
                return console.error("Error sending email:", error);
            }
            console.log("Email sent:", info.response);
        });
        res.json({ message: "Application submitted successfully", application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
    }
});

// router.get("/all-applications", async (req, res) => {
//     try {
//         const applications = await Application.findAll({ include: [{ model: Job, as: "job" }] });
//         res.json(applications);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to fetch applications" });
//     }
// });

// Jobs
router.post("/jobs", async (req, res) => {
    try {
        await Job.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        ////console.error("Error creating job:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await Job.findAll();
        //console.log("Fetched jobs:", jobs);
        res.json(jobs);
    } catch (err) {
        ////console.error("Error fetching jobs:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/jobs/delete/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        ////console.log("Deleting job with ID: ", jobId);
        const deleted = await Job.destroy({ where: { id: jobId } });
        // ////console.log("Deleted rows count: ", deleted);

        res.redirect("/");
    } catch (err) {
        ////console.error("Error deleting job:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Team
router.post("/team", async (req, res) => {
    try {
        await OurTeam.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        ////console.error("Error creating team member:", err);
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

        // //console.log("Fetched team members:", teamMembers);
        // //console.log("Fetched partners:", partners);

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
        //console.error("Error fetching partner-team:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/team/delete/:id", async (req, res) => {
    try {
        const memberId = req.params.id;
        ////console.log("Deleting team member with ID: ", memberId);
        const deleted = await OurTeam.destroy({ where: { id: memberId } });
        // ////console.log("Deleted rows count: ", deleted);

        res.redirect("/");
    } catch (err) {
        ////console.error("Error deleting team member:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Contact
router.post("/contact", async (req, res) => {
    try {
        await ContactUs.create(req.body);
        res.redirect("/admin");
    } catch (err) {
        ////console.error("Error creating contact:", err);
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
                ////console.error("Error sending email:", error);
            } else {
                ////console.log("Email sent:", info.response);
            }
        });
        res.status(201).json(contact);
    } catch (err) {
        ////console.error("Error creating contact via API:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/api/membership-request", async (req, res) => {
    try {
        console.log("Received membership request:", req.body);
        const request = await MembershipRequest.create(req.body);

        console.log("Created membership request:", request.toJSON());
        if (!request) {
            return res.status(400).json({ error: "Failed to create membership request" });
        }

        // send email to both the admin and the user
        const mailOptions = {
            from: EMAIL_USER,
            to: `${request.email}, ${EMAIL_USER}`, // send to both user and admin
            subject: "Membership Request Received",
            text: `Dear ${request.name},\n\nThank you for your interest in becoming a member. We have received your request and will get back to you shortly.\n\nBest regards,\nTroycity Africa Team`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                ////console.error("Error sending email:", error);
            } else {
                ////console.log("Email sent:", info.response);
            }
        });
        res.status(201).json(request);
    } catch (err) {
        ////console.error("Error creating membership request via API:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;
