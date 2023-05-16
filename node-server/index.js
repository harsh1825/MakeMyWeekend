const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const server = express();
server.use(cors());
server.use(bodyParser.json());
const multer = require('multer');
const { middleware } = require('./middleware')
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    port: 2525,
    auth: {
        user: "harshparekh5818@gmail.com",
        pass: "mjzrxopxoxpouayh"
    }
})

const message = {
    from: "harshparekh5818@gmail.com",
    to: "harshparekh5818@gmail.com",
    subject: "User logged-in",
    text: "....",
    html: ""
};


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://harsh18:harsh18@cluster1.9mnnzcc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("You're successfully connected to your Database!");
    }
    catch (e) {
        console.log("db error-----------------------", e);
    }
}
run().catch(console.error);


server.listen(8080, () => {
    console.log("server started");
})

server.post('/login', cors({ exposedHeaders: ['Token'] }),
    async (req, res) => {

        try {
            const a = req.body._id

            const userdetail = {
                _id: a
            }

            const password = req.body.password
            console.log("------frontend------", req.body);
            const flag = 1
            await finduser(client, userdetail, flag).then(async (ress) => {
                // console.log('resssss----------------------',ress.deletedAT);
                if (ress.deletedAT === null || ress.deletedAT === undefined || ress.deletedAT === 'null' || ress.deletedAT === 'undefined') {
                    try {
                        var passwordmatch = await bcrypt.compare(password, ress['password'])
                    } catch (error) {
                        if (ress['temppassword'] == password) {
                            res.send('700')
                        }
                        else {
                            res.send('400')
                        }
                    }
                    if (passwordmatch) {
                        if (ress['userVerified'] === '0') {
                            res.send('404')
                        } else {
                            const token = await tokengenerate(ress['_id'])
                            console.log('-----token generated-----', token);
                            res.set('Token', token);
                            res.send(ress)
                        }
                    } else { res.send('400') }
                } else {
                    res.sendStatus(400)
                }
            })
        } catch (error) {
            console.log(error);
            res.send(400)
        }
    })


server.post('/generateotp', async (req, res) => {
    try {

        console.log(req.body.email);
        const email = req.body.email
        const otp = Math.floor(100000 + crypto.randomInt(900000));
        console.log("otp-----", otp);
        res.send(JSON.stringify(otp))
        const otpmessage = {
            from: "harshparekh5818@gmail.com",
            to: email,
            subject: "Forgot Password OTP",
            text: "To reset the password your OTP is - " + otp + " \n\n\n *OTP will expire in 10 minutes"
        };
        sendemail(otpmessage)

    } catch (error) {
        console.log(error);
    }
})


server.post('/setforgetpassword', async (req, res) => {
    try {

        console.log(req.body);
        req.body.password = await bcrypt.hash(req.body.password, 10)
        console.log(req.body)
        var result = await client.db("my-app").collection("userdata").updateOne({ _id: req.body._id }, { $set: req.body });
        console.log(result);
        if (result) {
            res.send('200')
        } else {
            res.sendStatus(400)
        }


    } catch (error) {
        console.log(error);
        res.sendStatus(400)

    }
})


server.post('/welcome', async (req, res) => {
    try {

        const a = JSON.stringify(req)
        console.log("======a=======", a);
        const flag = 2
        await finduser(client, a, flag).then((ress) => {
            console.log("------ress------------", ress);
            res.send(ress)
        })

    } catch (error) {
        console.log(error);
    }
})


server.get('/getusers', async (req, res) => {
    try {

        const tokenCorrect = middleware(req)

        if (tokenCorrect) {

            let a = await client.db('my-app').collection('userdata').find({}).toArray();

            const filteredUser = a.filter((item) => item.deletedAT === null || item.deletedAT === undefined || item.deletedAT === 'null' || item.deletedAT === 'undefined');
            const filteredUser2 = filteredUser.filter((item) => item.userVerified === '1');
            console.log('a-------------', filteredUser2)

            res.send(filteredUser2)
        }
        else {
            res.sendStatus(400)
            console.log('sent!');
        }

    }
    catch (error) {
        console.log(error);
    }
})
server.get('/getposts', async (req, res) => {
    try {
        const tokenCorrect = middleware(req)
        // console.log('req-------------', req)

        if (tokenCorrect) {

            let a = await client.db('my-app').collection('feed_data').find({}).toArray();

            // const filteredUser = a.filter((item) => item.deletedAT === null || item.deletedAT === undefined || item.deletedAT === 'null' || item.deletedAT === 'undefined');
            // const filteredUser2 = filteredUser.filter((item) => item.userVerified === '1');
            console.log('a-------------', a)

            res.send(a)
        }
        else {
            res.sendStatus(400)
            console.log('sent!');
        }

    }
    catch (error) {
        console.log(error);
    }
})


server.get('/verifyusers', async (req, res) => {
    try {

        const tokenCorrect = middleware(req)

        if (tokenCorrect) {

            let a = await client.db('my-app').collection('userdata').find({}).toArray();
            const filteredUser = a.filter((item) => item.userVerified === '0');
            res.send(filteredUser)
        }
        else {
            res.sendStatus(400)
            console.log('sent!');
        }

    }
    catch (error) {
        console.log(error);
    }
})


server.post('/searchedusers', async (req, res) => {
    try {

        const tokenCorrect = middleware(req)

        if (tokenCorrect) {
            console.log("---body---", req.body.searchdata);
            const flag = 3

            finduser(client, req.body.searchdata, flag).then((ress) => {
                console.log('search res-------', ress);

                const filteredUser = ress.filter((item) => item.deletedAT === null || item.deletedAT === undefined || item.deletedAT === 'null' || item.deletedAT === 'undefined');
                const filteredUser2 = filteredUser.filter((item) => item.userVerified === '1');

                res.send(filteredUser2)

            })

        }
        else {
            res.sendStatus(400)
            console.log('sent!');
        }

    }
    catch (error) {
        console.log(error);
    }
})
server.post('/searchedcity', async (req, res) => {
    try {

        const tokenCorrect = middleware(req)

        if (tokenCorrect) {
            console.log("---body---", req.body.searchdata);
            const flag = 3

            var result = await client.db("my-app").collection("feed_data").find(req.body.searchdata).toArray()
            console.log((result))
            if (result) {
                res.send(result)

            } else {
                res.sendStatus(400)
            }
        }
        else {
            res.sendStatus(400)
            console.log('sent!');
        }

    }
    catch (error) {
        console.log(error);
    }
})


const upload = multer();


server.post('/fileupload', upload.single(), async (req, res) => {
    try {

        const tokenCorrect = middleware(req)

        if (tokenCorrect) {
            const filedata = JSON.parse(req.body.filedata)

            for (let i = 0; i < filedata.data.length; i++) {
                console.log(filedata.data[i]);

                if (filedata.data[i].action === 'c' || filedata.data[i].action === 'C') {
                    if (filedata.data[i].password) {
                        filedata.data[i].password = await bcrypt.hash(filedata.data[i].password, 10)
                        var result = await client.db("my-app").collection("userdata").insertOne(filedata.data[i])
                    }
                    else {

                        var result = await client.db("my-app").collection("userdata").insertOne(filedata.data[i])

                    }


                }
                else if (filedata.data[i].action === 'u' || filedata.data[i].action === 'U') {
                    if (filedata.data[i].password) {
                        filedata.data[i].password = await bcrypt.hash(filedata.data[i].password, 10)
                        var result = await client.db("my-app").collection("userdata").updateOne({ _id: filedata.data[i]._id }, { $set: filedata.data[i] });
                    } else {
                        console.log("inside it");
                        var result = await client.db("my-app").collection("userdata").updateOne({ _id: filedata.data[i]._id }, { $set: filedata.data[i] });

                    }
                }
                else if (filedata.data[i].action === 'd' || filedata.data[i].action === 'D') {
                    filedata.data[i].deletedAT = Date();
                    var result = await client.db("my-app").collection("userdata").updateOne({ _id: filedata.data[i]._id }, { $set: filedata.data[i] });
                }
                else {

                    try {
                        var result = await client.db("my-app").collection("userdata").insertOne(filedata.data[i])

                    } catch (error) {
                        if (filedata.data[i].password) {
                            filedata.data[i].password = await bcrypt.hash(filedata.data[i].password, 10)
                            var result = await client.db("my-app").collection("userdata").updateOne({ _id: filedata.data[i]._id }, { $set: filedata.data[i] });
                        } else {
                            var result = await client.db("my-app").collection("userdata").updateOne({ _id: filedata.data[i]._id }, { $set: filedata.data[i] });

                        }
                    }
                }

            }
            if (result) {
                console.log('---------------Inserted--------------', result)
                res.send('200')

            } else {
                console.log('Not inserted');
                res.sendStatus(400)

            }

        }
        else {

        }

    }
    catch (error) {
        console.log(error);
    }
})


server.get('/roles', async (req, res) => {
    try {
        let a = await client.db('my-app').collection('roles').find({}).toArray();
        //console.log(a)
        res.send(a)
    }
    catch (error) {
        console.log(error);
    }
})


server.post('/signup', async (req, res) => {
    try {

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < 6; i++) {
            password += alphabet.charAt(crypto.randomInt(alphabet.length));
        }

        req.body.temppassword = password
        req.body.createdAT = Date()
        req.body.createdBY = req.body._id
        req.body.deletedAT = null
        req.body.updatedBY = null
        req.body.updatedAT = null
        req.body.userVerified = '0'
        let a = await client.db('my-app').collection('roles').find({}).toArray();

        console.log(req.body);
        await createuser(client, req.body).then((ress) => {
            console.log("signup ------------res-", ress);
            res.send(ress)
            console.log(a);
            for (let index = 0; index < a.length; index++) {
                if (a[index]._id == req.body.role) {
                    var rolestring = a[index].role;
                    break;
                } else {
                    continue
                }

            }
            message.to = "harshparekh5818@gmail.com"
            message.subject = "User Signed-up"
            message.html = `<p>Hello admin,</p>
            <p>A new user has signed up:</p>
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body._id}</li>
                <li>Contact: ${req.body.contact}</li>
                <li>Role: ${rolestring}</li>
            </ul>
            <br>
            <p>Please check your portal to accept or reject the user</p>`
            sendemail(message)

            const message2 = {
                from: "harshparekh5818@gmail.com",
                to: req.body._id,
                subject: "Welcome to the portal",
                html: `<p>Hello ${req.body.name},</p>
                <p>Welcome to our portal</p>
                <ul>
                    <li>Name: ${req.body.name}</li>
                    <li>Email: ${req.body._id}</li>
                    <li>Contact: ${req.body.contact}</li>
                    <li>Role: ${rolestring}</li>
                </ul>
                <br>
                <p>Please wait until the admin approves you</p>
                <p>you will receive a mail with temporary credentials as soon as admin approves you</p>`
            };
            sendemail(message2)

        })
    }
    catch (error) {
        console.log("db error2-------------", error);
        res.send(400);
    }

})


server.post('/adduser', async (req, res) => {
    try {

        req.body.createdAT = Date()
        req.body.deletedAT = null
        req.body.updatedBY = null
        req.body.updatedAT = null
        console.log(req.body);
        await createuser(client, req.body).then((ress) => {
            //console.log("db ------------res-",ress);
            res.send(ress)
        })
    }
    catch (error) {
        console.log("db error2-------------", error);
        res.send(400);
    }

})
server.post('/ideapost', async (req, res) => {
    try {
        console.log("body-----", req.body);
        req.body.postedAT = Date();
        req.body.likes = 0;
        const result = await client.db("my-app").collection("feed_data").insertOne(req.body);
        console.log(result);
        if (result) {
            res.send('200');
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.log("db error2-------------", error);
        res.sendStatus(400);
    }
});

server.post('/likepost', async (req, res) => {
    try {
        const postId = req.body.postId;
        const action = req.body.action;
        const userId = req.body.id;
        console.log('action', action);
        console.log("postid", postId);
        console.log("userid", userId);

        if (action === 'like') {
            var result = await client.db("my-app").collection("feed_data").updateOne({ _id: new ObjectId(postId) }, { $push: { likedBY: userId } });
        }
        else if (action === 'unlike') {
            var result = await client.db("my-app").collection("feed_data").updateOne({ _id: new ObjectId(postId) }, { $pull: { likedBY: userId } });
        } else {
            throw new Error("Invalid action");
        }
        console.log("-----", result);
        if (result.modifiedCount === 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    }
    catch (error) {
        console.log("db error-------------", error);
        res.sendStatus(400);
    }
})

server.post('/newrolecreate', async (req, res) => {
    try {

        const result = await client.db("my-app").collection("roles").insertOne(req.body);
        console.log(`New Role Created with id ==> ${result.insertedId}`);
        res.send(result)

    }
    catch (error) {
        console.log("new role error -------------", error);
        res.sendStatus(400)
    }

})


server.post('/update', async (req, res) => {
    try {

        req.body.updatedAT = Date();
        console.log(req.body);
        let userid = req.body._id;
        await updateUser(client, userid, req.body).then((ress) => {
            // console.log("db ------------res-", ress);
            res.send(ress)

        })
    }
    catch (error) {
        console.log("db error2-------------", error);
        res.send(400);
    }

})


server.post('/updateperpass', async (req, res) => {
    try {

        req.body.updatedAT = Date();
        req.body.password = await bcrypt.hash(req.body.password, 10)
        console.log(req.body);
        let userid = req.body._id;
        const result = await client.db("my-app").collection("userdata").updateOne({ _id: userid }, { $set: req.body });
        if (result) {
            res.send('200')
        } else {
            res.send('400')

        }
    }
    catch (error) {
        console.log("db error2-------------", error);
        res.send(400);
    }

})


server.post('/sendcredentialtouser', async (req, res) => {
    try {
        const userdetail = {
            _id: req.body._id
        }
        console.log(userdetail)
        var result = await client.db("my-app").collection("userdata").findOne(userdetail)

        console.log("resssuuulllttt-------------", result);

        message.to = result._id
        message.subject = "Admin Approval"
        message.html = `<p>Hello User,</p>
            <p>Admin has approved you</p>
            <p>Use this Credentials to login into portal:</p>
            <ul>
                <li>Username : ${result._id}</li>
                <li>Temporary-Password : ${result.temppassword}</li>
            </ul>
            <br>
            <p>*Change the password once you have logged in (Password can only be used once)</p>`
        sendemail(message)
    }
    catch (error) {

    }

})


server.post('/delete', async (req, res) => {
    try {
        console.log("=========", req.body);
        req.body.deletedAT = Date()
        console.log("=========>", req.body);
        await client.db("my-app").collection("userdata").updateOne({ _id: req.body._id }, { $set: { deletedAT: req.body.deletedAT } });

    }
    catch (error) {
        console.log("db error2-------------", error);
        //res.send(400);
    }

})
server.post('/deletepost', async (req, res) => {
    try {
        console.log("reqqqqqqqqq", req.body._id);
        const id = req.body._id;

        const result = await client.db("my-app").collection("feed_data").deleteOne({ _id: new ObjectId(id) });
        console.log(`${result.deletedCount} document(s) was/were deleted.`);
    }
    catch (error) {
        console.log("db error2-------------", error);
        //res.send(400);
    }

})

server.post('/postcomment', async (req, res) => {
    try {

        const tokenCorrect = middleware(req)

        if (tokenCorrect) {
            var result = await client.db("my-app").collection("feed_data").updateOne({ _id: new ObjectId(req.body.inWhichPost) }, { $push: { comments: req.body } });
            console.log(result)
            res.sendStatus(200)

        }
        else {
            res.sendStatus(400)
            console.log(result);
        }

    }
    catch (error) {
        console.log(error);
    }
})

server.post('/sendquerymail', async (req, res) => {
    try {

        console.log(req.body);

        message.to = "harshparekh5818@gmail.com"
        message.subject = "New Contact-us Query"
        message.html = `<p>Hello admin,</p>
            <p>A new query has been received from a user:</p>
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body._id}</li>
                <li>Contact: ${req.body.contact}</li>
                <li>Message: ${req.body.message}</li>
            </ul>
            <br>`
        sendemail(message)
        res.sendStatus(200);

    }
    catch (error) {
        console.log("db error2-------------", error);
        res.send(400);
    }

})

async function createuser(client, newUser) {
    const result = await client.db("my-app").collection("userdata").insertOne(newUser);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    return result
}


async function finduser(client, userdetail, flag) {

    if (flag === 1) {
        var result = await client.db("my-app").collection("userdata").findOne(userdetail)
        if (result) {
            console.log('---------------found--------------', result)


        } else {
            console.log('No listings found');
            result = 400
        }
        return result
    }

    else if (flag === 2) {

        var result = await client.db("my-app").collection("userdata").findOne(userdetail, { "password": 0, "_id": 1 })
        console.log(result)
        if (result) {
            console.log('result----------result idd------db', result)
        } else {
            console.log('No listings found with the name ', userdetail);
            result = 400
            console.log(result);
        }
        return result

    }
    else {
        var result = await client.db("my-app").collection("userdata").find(userdetail).toArray()
        // console.log((result))
        if (result) {
            console.log('---------------found--------------', flag, result)


        } else {
            console.log('No listings found');
            result = 400
            // console.log(result);
        }
        return result
    }

}


async function updateUser(client, userid, userdetail) {
    const result = await client.db("my-app").collection("userdata")
        .updateOne({ _id: userid }, { $set: userdetail });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}


async function deleteuser(client, userdetail) {
    console.log(userdetail);
    const result = await client.db("my-app").collection("userdata").deleteOne(userdetail);
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}


const tokengenerate = async (userid) => {

    try {
        const token = jwt.sign({ _id: userid }, "ye_ek_secret_key_hai")
        return token
    } catch (error) {
        console.log("-----Token error-----", error)
    }

    // const verified = jwt.verify(token,'yeeksecretkeyhai')
    // console.log('---------verified-------',verified);
}


function sendemail(message) {
    transporter.sendMail(message, function (err, response) {
        if (err) {
            console.log(err);
        }
        console.log('Message Sent' + response);
        transporter.close();
    })
}

