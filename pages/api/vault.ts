import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/library/db';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import authOptions from "./auth/[...nextauth]"; // Using the same import you used for upload.ts

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    
    // 1. THE SECURITY BOUNCER
    const session = await getServerSession(req, res, authOptions);
    if (!session || !(session as any).user?.email) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }

    const userEmail = (session as any).user.email;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
        bucketName: 'binshare'
    });

    if (req.method === 'GET') {
        try {
            // 2. THE FILTER: Only grab files that belong to THIS user's email
            const files = await bucket.find({ 
                "metadata.expiresAt": { $exists: false },
                "metadata.owner": userEmail 
            }).toArray();

            const sortedFiles = files.sort((a, b) => {
                return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            });
            return res.status(200).json({ success: true, files: sortedFiles });
        } catch (error) {
            console.error("Vault fetch error:", error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } 
    else if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ success: false, message: 'Missing file ID' });
            }

            await bucket.delete(new mongoose.Types.ObjectId(id));
            return res.status(200).json({ success: true, message: 'File deleted' });
        } catch (error) {
            console.error("Delete error:", error);
            return res.status(500).json({ success: false, message: 'Failed to delete file' });
        }
    } 
    else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}