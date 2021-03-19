import express from"express"
const router = new express.Router();

import User from"../models/user"
import auth from"../middleware/auth"
import verify from"../middleware/verified"
import multer from"multer"
import sharp from"sharp"
import { sendSignUpOtp, sendSignInOTP ,ReceivedTokenMail,sendTokenMail} from"../emails/mail"
import getAddress from'../utils/userHelper'


router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    await sendSignUpOtp(user);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/signup/verify", auth, async (req, res) => {
  const otp = req.body.otp;
  try {
    if (otp == req.user.otp && req.user.otp != "") {
      req.user.verified = true;
      req.user.otp = "";
      await req.user.save();
      return res.send();
    } else {
      res.status(401).send({ error: "Invalid Otp" });
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/login/password", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/login/send-otp", async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    await sendSignInOTP(user);
    res.send({ message: "Otp has been send" });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/login/verify-otp", async (req, res) => {
  try {
    const user = await User.findByOTP(req.body.email, req.body.otp);

    const token = await user.generateAuthToken();

    user.otp = "";

    await user.save();

    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/add-secret",auth,verify, async (req, res) => {
  try {
   const address = await getAddress(req.body.phrase)
   req.user.account = address
   req.user.phrase = req.body.phrase
   await req.user.save()
   await res.send()
  } catch (e) {
    console.log(e);
    res.status(400).send({'some thing went wrong':e});
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/me", auth, verify, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
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
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/me/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
