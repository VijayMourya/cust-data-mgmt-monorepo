import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
const secretKey: Secret = process.env['secretKey'] as Secret

const corsOptions: CorsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route to get all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const token = req.cookies['jwt'];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorised' });
    }

    jwt.verify(token, secretKey, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorised' });
      }
      const users = await prisma.user.findMany();
      return res.json(users);
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create or update a user
app.post('/users', async (req: Request, res: Response) => {
  console.log("req:", req.body);
  const token = req.cookies['jwt'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorised' });
  }

  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorised' });
    }
  })
  const { id, firstname, lastname, phone, dob } = req.body;

  if (!firstname || !lastname || !phone || !dob) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (id) {
      const user = await prisma.user.update({
        where: { id },
        data: {
          firstname,
          lastname,
          phone,
          dob,
        },
      });
      return res.status(201).json(user);
    } else {
      const user = await prisma.user.create({
        data: {
          firstname,
          lastname,
          phone,
          dob,
        },
      });
      return res.status(201).json(user);
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Route to sign up new accounts
app.post('/signup', async (req: Request, res: Response) => {
  console.log("req:", req.body);
  const { username, email, password } = req.body;
  const data = {
    username,
    email,
    password: await bcrypt.hash(password, 10),
  };

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await prisma.account.create({ data });

    if (user) {
      let token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);

      return res.status(201).send(user);
    } else {
      return res.status(409).send("Details are not correct");
    }

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Route to login to an account
app.post('/login', async (req: Request, res: Response) => {
  console.log("req:", req.body);
  const { username, password } = req.body;

  try {
    //find a user by their username
    const user = await prisma.account.findUnique({
      where: {
        username
      }
    });
    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ id: user.id }, secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        //send user data
        return res.status(200).send(user);
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log(error);
  }
});

// Route to logout of an account
app.post('/logout', (req, res) => {
  res.clearCookie('jwt'); // Clear JWT cookie
  res.json({ message: 'Logged out successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
