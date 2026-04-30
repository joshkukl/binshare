import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/library/db';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import authOptions from "./auth/[...nextauth]"; // Using the same import you used for upload.ts

// This is the API handler for the user's private vault.
// It handles fetching and deleting files that are saved permanently.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Establish a connection to the MongoDB database.
    await dbConnect();
    
    // 1. THE SECURITY BOUNCER: Authenticate the user session.
    // This ensures that only logged-in users can access their vault.
    const session = await getServerSession(req, res, authOptions);
    if (!session || !(session as any).user?.email) {
        // If no session or email is found, deny access.
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }

    // Extract the user's email from the session to identify their files.
    const userEmail = (session as any).user.email;

    // Initialize the GridFS bucket where files are stored.
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
        bucketName: 'binshare'
    });

    // Handle GET requests to fetch the user's files.
    if (req.method === 'GET') {
        try {
            // 2. THE FILTER: Find all files in the bucket that meet two criteria:
            //    - They do not have an 'expiresAt' date, meaning they are permanent vault files.
            //    - The 'owner' in the metadata matches the logged-in user's email.
            const files = await bucket.find({ 
                "metadata.expiresAt": { $exists: false },
                "metadata.owner": userEmail 
            }).toArray();

            // Sort the files by their upload date in descending order (newest first).
            const sortedFiles = files.sort((a, b) => {
                return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            });

            // Return the sorted list of files.
            return res.status(200).json({ success: true, files: sortedFiles });
        } catch (error) {
            console.error("Vault fetch error:", error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } 
    // Handle DELETE requests to remove a file from the vault.
    else if (req.method === 'DELETE') {
        try {
            // Get the file ID from the request query parameters.
            const { id } = req.query;
            
            // Validate that the file ID was provided.
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ success: false, message: 'Missing file ID' });
            }

            // To enhance security, we first find the file to ensure the current user is the owner.
            const files = await bucket.find({
                _id: new mongoose.Types.ObjectId(id),
                "metadata.owner": userEmail
            }).toArray();

            // If no file is found with that ID and owner, it either doesn't exist or the user doesn't have permission.
            if (files.length === 0) {
                return res.status(404).json({ success: false, message: 'File not found or you do not have permission to delete it.' });
            }

            // If the check passes, proceed with deleting the file from GridFS using its unique ID.
            await bucket.delete(new mongoose.Types.ObjectId(id));
            return res.status(200).json({ success: true, message: 'File deleted' });
        } catch (error) {
            console.error("Delete error:", error);
            return res.status(500).json({ success: false, message: 'Failed to delete file' });
        }
    } 
    // Handle any other HTTP methods.
    else {
        // Inform the client which methods are allowed.
        res.setHeader('Allow', ['GET', 'DELETE']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}