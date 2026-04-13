import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/library/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Find the user (and force it to return the hidden password field for comparison)
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("No user found with that email");
        }

        // Compare the typed password with the shredded one in the database
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // If everything passes, return the user object (which NextAuth turns into a session cookie)
        return { id: user._id.toString(), email: user.email };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Tells NextAuth to use your custom page, not their ugly default one
  },
  secret: process.env.NEXTAUTH_SECRET,
});