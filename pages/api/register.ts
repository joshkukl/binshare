import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/library/db'; // Adjust this import path if your db.ts is elsewhere
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    await dbConnect();

    const { email, password } = req.body;

    // 1. Validate the input
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Invalid email or password must be at least 6 characters' });
    }

    // 2. Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'A user with this email already exists' });
    }

    // 3. Hash the password (the shredder)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Save the new user to MongoDB
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Send a success response (but NEVER send the password back!)
    res.status(201).json({ message: 'User created successfully', userId: user._id });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}