import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/library/db';
import mongoose from 'mongoose';

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    await dbConnect();
    
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: 'Invalid or missing token' });
    }

    try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
            bucketName: 'binshare'
        });

        // 1. Find the file in MongoDB using the unique URL token
        const files = await bucket.find({ "metadata.token": token }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'File not found. It may have already been burned.' });
        }

        const file = files[0];

        // --- ADD THESE 3 LINES RIGHT HERE ---
        if (req.query.metadataOnly === 'true') {
            return res.status(200).json({ file });
        }

        // 2. Tell the browser a file is incoming
        res.setHeader('Content-Type', file.metadata?.fileType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

        // 3. Stream the file out of the database and send it to the user
        const downloadStream = bucket.openDownloadStream(file._id);
        downloadStream.pipe(res);

        // 4. SMART DELETE LOGIC
        // Only wipe the file if the user explicitly checked "Burn After Reading"
        downloadStream.on('end', async () => {
            const shouldBurn = file.metadata?.burnAfterReading === true;

            if (shouldBurn) {
                try {
                    await bucket.delete(file._id);
                    console.log(`[Burn After Reading] Destroyed file: ${file.filename}`);
                } catch (deleteErr) {
                    console.error("Failed to delete file after download:", deleteErr);
                }
            } else {
                // For Vault or 24h files, we just let them stay.
                console.log(`[Keep File] ${file.filename} persists in DB.`);
            }
        });

        downloadStream.on('error', (err) => {
            console.error("Download error:", err);
            res.status(500).end();
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}