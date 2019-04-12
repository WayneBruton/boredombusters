const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const os = require('os').hostname();

const pool = require('../routes/connection');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);

if (os == 'Waynes-MacBook-Air.local') {
    require('dotenv/config');
}

router.get('/clientPackage/:option', (req, res) => {
    let option = req.params.option
    let sql = `select * from packages where id = ${option}`
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            resizeBy.send('Error with connection');
        }
        connection.query(sql, function (error, result) {
            if (error) throw error;
            res.send(result);
        });
        connection.release();
    });

})


router.post('/send-email', (req, res) => {

    let response = {
        success: 'Your Email has been sent!',
        failure: 'There was a problem, please try again later'
    }
    let name = req.body.name;
    let email = req.body.email;
    let subject = req.body.subject;
    let message = req.body.content;
    const output = `
	<p>You have a new contact request</p>
	<h3>Contact Details</h3>
	<ul>
		<li>Name: ${name}</li><br>

		<li>Email: ${email}</li><br>
		

	</ul><br>
	<h3>Message</h3><br>
	<p>${message}</p>
    `;


    let transporter = nodemailer.createTransport({


        host: process.env.MAILHOST,
        port: 465, //587

        secure: true,
        auth: {

            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD

        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {

        from: 'Suburbs Directory Contact Form <lisa@suburbsdirectory.co.za>',
        to: 'lisasallyberg@gmail.com,nicole@suburbsdirectory.com, lisa@suburbsdirectory.co.za, waynebruton@icloud.com',
        subject: `Suburbs Directory Welcome Email - ${subject}`,
        text: 'Hello world?',
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            var title = 'Suburbs Directory - Contact Us'
            var color = '';
            var navBarType = 'navbar-dark bg-dark';
            var message = response.failure;
            var alertType = 'danger'
            var display = 'block'
            var backgroundColor = 'background-color: #4267b4;"'
            res.render('../views/menuViews/contact', {
                title: title,
                color: color,
                navBarType: navBarType,
                backgroundColor: backgroundColor,
                message: message,
                display: display,
                alertType: alertType
            });
        }

        var title = 'Suburbs Directory - Contact Us'
        var color = '';
        var navBarType = 'navbar-dark bg-dark';
        var message = response.success;
        var alertType = 'success'
        var display = 'block'
        var backgroundColor = 'background-color: #4267b4;"'
        res.render('../views/menuViews/contact', {
            title: title,
            color: color,
            navBarType: navBarType,
            backgroundColor: backgroundColor,
            message: message,
            display: display,
            alertType: alertType
        });
    });
});


router.post('/sendClientEmail', (req, res) => {
    let id = req.body.id
    // console.log(code)
    console.log(id)
    const encryptedString = cryptr.encrypt(`${id}`);
    // const decryptedString = cryptr.decrypt(encryptedString);
    console.log('Encrypted String',encryptedString); // 5590fd6409be2494de0226f5d7
    let urlParam = encryptedString;
    console.log(urlParam)
    urlParam = `https://www.suburbsdirectory.co.za/startPaymentProcess/${urlParam}`
    let response = {
        success: 'Your Email has been sent!',
        failure: 'There was a problem, please try again later'
    }
    let name = req.body.first_name;
    let email = req.body.email;
    let subject = 'Welcome to Suburbs Directory'
    let businessName = req.body.businessName;

    let optionCostMthly = req.body.optionCostMthly
    let optionCostAnnual = req.body.optionCostAnnual
    let optionCostOnceOff = req.body.optionCostOnceOff
    let categoryCostMnthly = req.body.categoryCostMnthly
    let categoryCostAnnual = req.body.categoryCostAnnual
    let categoryCostonceOff = req.body.categoryCostonceOff
    let adminAssistMthly = req.body.adminAssistMthly
    let adminAssistAnnual = req.body.adminAssistAnnual
    let adminAssistOneOff = req.body.adminAssistOneOff
    let totalMthly = optionCostMthly + categoryCostMnthly + adminAssistMthly
    let totalAnnual = optionCostAnnual + categoryCostAnnual + adminAssistAnnual
    let totalOnceOff = optionCostOnceOff + categoryCostonceOff + adminAssistOneOff
    const output = `
    
	<p>Welcome to Suburbs Directory</p>
	
	<h3>Message</h3><br>
	<p>Dear ${name}</p><br>
    <p>Your profile for ${businessName} has been successfully approved!</p><br>
    
    <p>Your options are the following:</p>
    <table>
    <tr>
        <th style="border: 1px solid black; width: 100px; background-color: lime;">Option</th>
        <th style="border: 1px solid black; width: 100px; background-color: lime;">Monthly</th>
        <th style="border: 1px solid black; width: 100px; background-color: lime;">Annual</th>
        <th style="border: 1px solid black; width: 100px; background-color: lime;">Once Off</th>
    </tr>
    <tr>
        <td style="border: 1px solid black; width: 100px;">Suburbs</td>
        <td style="border: 1px solid black; width: 100px;">R${optionCostMthly}</td>
        <td style="border: 1px solid black; width: 100px;">R${optionCostAnnual}</td>
        <td style="border: 1px solid black; width: 100px;">R${optionCostOnceOff}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; width: 100px;">Category</td>
        <td style="border: 1px solid black; width: 100px;">R${categoryCostMnthly}</td>
        <td style="border: 1px solid black; width: 100px;">R${categoryCostAnnual}</td>
        <td style="border: 1px solid black; width: 100px;">R${categoryCostonceOff}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; width: 100px">Admin Assistance</td>
        <td style="border: 1px solid black; width: 100px">R${adminAssistMthly}</td>
        <td style="border: 1px solid black; width: 100px">R${adminAssistAnnual}</td>
        <td style="border: 1px solid black; width: 100px">R${adminAssistOneOff}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; width: 100px; font-weight: bold">Total</td>
        <td style="border: 1px solid black; width: 100px; font-weight: bold">R${totalMthly}</td>
        <td style="border: 1px solid black; width: 100px; font-weight: bold">R${totalAnnual}</td>
        <td style="border: 1px solid black; width: 100px; font-weight: bold">R${totalOnceOff}</td>
    </tr>
    </table>

    <p>If you are satisfied, please deposit the amount for your option chosen into the following account:</p>
    <ul>
        <li>Bank Name: FNB</li>
        <li>Branch: Blue Route</li>
        <li>Account Number: 628 0624 8854</li>
        <li>Branch Code: 250-655</li>
        <li>Reference: ${businessName}</li>
    </ul><br>
    <p>Please send POP to lisa@suburbsdirectory.co.za </p>

    <p><strong>Alternatively</strong> to pay by card and be <strong>visible within minutes</strong> click the following link <a href="${urlParam}" style="width: 75px; height: 25px; background-color: green; border: 1px solid green; border-radius: 7px; color: white; font-weight: bold;">Pay Now</a></p>

    <p>or copy and past the following link into your browser <a href="${urlParam}">${urlParam}</a>.</p>  

    <p>We thank you for your support and look forward to having you on board!.</p>
    `;

    console.log(output);
    let transporter = nodemailer.createTransport({
 
        host: process.env.MAILHOST,
        port: 465, //587

        secure: true,
        auth: {

            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD

        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
  
        from: 'Suburbs Directory Contact Form <lisa@suburbsdirectory.co.za>',
        to: `${email}`,
        subject: `Suburbs Directory Contact Request - ${subject}`,
        text: 'Hello world?',
        html: output
    };


    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                var title = 'Suburbs Directory - Contact Us'
                var color = '';
                var navBarType = 'navbar-dark bg-dark';
                var message = response.failure;
                var alertType = 'danger'
                var display = 'block'
                var backgroundColor = 'background-color: #4267b4;"'
                console.log('there was an error')
                res.end('There was an error')
            } else {
                console.log('Email Sent')

            res.end('Email Sent')

            }
            // var title = 'Suburbs Directory - Contact Us'
            // var color = '';
            // var navBarType = 'navbar-dark bg-dark';
            // var message = response.success;
            // var alertType = 'success'
            // var display = 'block'
            // var backgroundColor = 'background-color: #4267b4;"'
            
        });
    } catch (e) {
        res.send('Error', e)
    }
});

router.post('/send-charity-email', (req, res) => {

    let response = {
        success: 'Your Email has been sent!',
        failure: 'There was a problem, please try again later'
    }

    let description = req.body.description
    let areaCharityChosen = req.body.areaCharityChosen
    let facebook = req.body.facebook
    let website = req.body.website
    let email = req.body.email
    let contact_number = req.body.contact_number
    let contact_person = req.body.contact_person
    let charity_name = req.body.charity_name

    const output = `
	<p>You have a new charity suggestion</p>
    <h3>Contact Details</h3>
    
	<ul>
		<li>Name: ${contact_person}</li><br>

		<li>Email: ${email}</li><br>
		<li>website: ${website}</li><br>
		<li>charity_name: ${charity_name}</li><br>
		<li>contact_number: ${contact_number}</li><br>
		<li>facebook: ${facebook}</li><br>
		<li>area: ${areaCharityChosen}</li><br>
		

	</ul><br>
	<h3>Message</h3><br>
	<p>${description}</p>
    `;

    let transporter = nodemailer.createTransport({

        host: process.env.MAILHOST,
        port: 465, //587

        secure: true,
        auth: {

            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD

        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: 'Suburbs Directory Charity Form <lisa@suburbsdirectory.co.za>',
        to: 'lisasallyberg@gmail.com,nicole@suburbsdirectory.co.za, lisa@suburbsdirectory.co.za, waynebruton@icloud.com',
        subject: `Suburbs Directory Charity Email`,
        text: 'Hello world?',
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            var title = 'Suburbs Directory - Contact Us'
            var color = '';
            var navBarType = 'navbar-dark bg-dark';
            var message = response.failure;
            var alertType = 'danger'
            var display = 'block'
            var backgroundColor = 'background-color: #4267b4;"'
            res.send('There was an error')
        }

        var title = 'Suburbs Directory - Contact Us'
        var color = '';
        var navBarType = 'navbar-dark bg-dark';
        var message = response.success;
        var alertType = 'success'
        var display = 'block'
        var backgroundColor = 'background-color: #4267b4;"'
        res.send('Email sent successfully!')
    });
});

module.exports = router;