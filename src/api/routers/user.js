import express from"express"
const router = new express.Router();

import User from"../models/user"
import auth from"../middleware/auth"
import verify from"../middleware/verified"
import multer from"multer"
import sharp from"sharp"
import { sendSignUpOtp, sendSignInOTP ,ReceivedTokenMail,sendTokenMail} from"../emails/mail"
import getAddress from'../utils/userHelper'
import logger from '../../../logger'
import responseHandler from '../middleware/sendResponse'
//import bip39 from 'bip39'
//unable use es6 syntax as it is showing error
const bip39 = require('bip39')



// user can signup
router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {

  // auto generate wallet phrase
    const mnemonic = bip39.generateMnemonic();
    const address = await getAddress(mnemonic)
    user.account = address
    user.phrase = mnemonic
    await user.save()

    await sendSignUpOtp(user);
    const token = await user.generateAuthToken();
    responseHandler.sendResponse(res, 201,'signup successful', {user,token})
    //res.status(201).send({ user, token });
  } catch (e) {
    logger.info(`${e}`)
    //res.status(400).send(e);
    responseHandler.sendError(res, 400,'Email Should be unique' ,`${e}`)
  }
});

// user can verify their email

router.post("/signup/verify", auth, async (req, res) => {
  const otp = req.body.otp;
  try {
    if (otp == req.user.otp && req.user.otp != "") {
      req.user.verified = true;
      req.user.otp = "";
      await req.user.save();
     // return res.send();
     responseHandler.sendResponse(res, 200,'Email verification successful')
    } else {
     // res.status(401).send({ error: "Invalid Otp" });
     responseHandler.sendResponse(res, 401,'invalid OTP')
    }
  } catch (e) {
    logger.info(`${e}`)
    //res.status(500).send();
    responseHandler.sendError(res, 500,'Internal Server Error',`${e}`)
  }
});

// login with password

router.post("/login/password", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    //res.send({ user, token });
    responseHandler.sendResponse(res, 200,'login successful',{ user, token })
  } catch (e) {
    logger.info(`${e}`)
   // res.status(400).send(e);
   responseHandler.sendError(res, 400,'something went wrong',`${e}`)
  }
});

// send otp to specified emailfor login

router.post("/login/send-otp", async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    await sendSignInOTP(user);
   // res.send({ message: "Otp has been send" });
    responseHandler.sendResponse(res, 200,"Otp has been send")
  } catch (e) {
    logger.info(`${e}`)
   // res.status(400).send(e);
   responseHandler.sendError(res, 400,'some thing went wrong',`${e}`)
  }
});

// enter the OTP, verify identity and login
router.post("/login/verify-otp", async (req, res) => {
  try {
    const user = await User.findByOTP(req.body.email, req.body.otp);

    const token = await user.generateAuthToken();

    user.otp = "";

    await user.save();

    //res.send({ user, token });
    responseHandler.sendResponse(res, 200,'login successful',{ user, token })
  } catch (e) {
    logger.info(`${e}`)
    //res.status(400).send(e);
    responseHandler.sendError(res, 401,'some thing went wrong',`${e}`)
  }
});


// add phrase to enbale get bonus and send receive token functinality

router.post("/add-secret",auth,verify, async (req, res) => {
  try {
   const address = await getAddress(req.body.phrase)
   req.user.account = address
   req.user.phrase = req.body.phrase
   await req.user.save()
   // res.send()
   responseHandler.sendResponse(res, 200,'mnemonic added successfully')
  } catch (e) {
    logger.info(`${e}`)
    //res.status(400).send({'some thing went wrong':e});
    responseHandler.sendError(res, 400,'some thing went wrong',`${e}`)
  }
});

// logout

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
   // res.send();
   responseHandler.sendResponse(res, 200,'logout successful')
  } catch (e) {
    logger.info(`${e}`)
    //res.status(500).send();
    responseHandler.sendError(res, 500,'Internal Server Error',`${e}`)
  }
});

// logout from all devices

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
   // res.send();
   responseHandler.sendResponse(res, 200,'logout successful')
  } catch (e) {
    logger.info(`${e}`)
    //res.status(500).send();
    responseHandler.sendError(res, 500,'Internal Server Error',`${e}`)
  }
});


// information obout profile 

router.get("/me", auth, async (req, res) => {
  //res.send(req.user);
  responseHandler.sendResponse(res, 200,'user data',req.user)
});


// edit the information 
router.patch("/me", auth, verify, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
  
    responseHandler.sendResponse(res, 400,'Invalid Updates')
    //return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    //res.send(req.user);
    responseHandler.sendResponse(res, 200,'update successful',req.user)
  } catch (e) {
    logger.info(`${e}`)
   // res.status(400).send(e);
   responseHandler.sendError(res, 400,'Internal Server Error',`${e}`)
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be jpg,jpeg,png"));
    }
    cb(undefined, true);
  },
});

// upload the profile pic

router.post(
  "/me/avatar",
  auth,
  verify,
  upload.single("upload"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
   // res.send();
   responseHandler.sendResponse(res, 200,'avatar saved successful')
  },
  (error, req, res, next) => {
    logger.info(`${e}`)
    //res.status(400).send({ error: error.message });
    responseHandler.sendError(res, 400,'something went wrong',`${e}`)
  }
);

//delete profile pic 

router.delete("/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
   // res.send();
   responseHandler.sendResponse(res, 200,'avatar remove successful')
  } catch (e) {
    logger.info(`${e}`)
   // res.status(500).send();
   responseHandler.sendError(res, 500,'Internal Server Error',`${e}`)
  }
});

// get profile pic
router.get("/me/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    //res.send(user.avatar);
    responseHandler.sendResponse(res, 500,'user display picture',user.avatar)
  } catch (e) {
    logger.info(`${e}`)
   // res.status(404).send();
   responseHandler.sendError(res, 404,'content not found',`${e}`)
  }
});

module.exports = router;
