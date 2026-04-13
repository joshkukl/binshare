import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/library/db';
import mongoose from 'mongoose';
import formidable from 'formidable';
import fs from 'fs';
import { getServerSession } from "next-auth/next";
import authOptions from "./auth/[...nextauth]"; 

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    const { method } = req;
    
    // Grab the logged-in user's session
    const session = await getServerSession(req, res, authOptions);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');

    switch (method) {
        case 'POST':
            try {
                const form = formidable({ multiples: false });

                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        res.statusCode = 500;
                        return res.end(JSON.stringify({ message: "Error parsing form data" }));
                    }

                    const fileArray = files.file as formidable.File[];
                    const singleFile = Array.isArray(fileArray) ? fileArray[0] : files.file as any;

                    if (!singleFile) {
                        res.statusCode = 400;
                        return res.end(JSON.stringify({ message: "No file uploaded" }));
                    }

                    const isPermanent = fields.saveToVault 
                      ? (Array.isArray(fields.saveToVault) ? fields.saveToVault[0] === 'true' : fields.saveToVault === 'true')
                      : false;

                    const isBurnOption = fields.burnAfterReading 
                      ? (Array.isArray(fields.burnAfterReading) ? fields.burnAfterReading[0] === 'true' : fields.burnAfterReading === 'true')
                      : false;

                    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
                        bucketName: 'binshare'
                    });

                    const token = Math.random().toString(36).substring(2, 14);

                    // Build metadata and STAMP the user's email if they are logged in
                    let fileMetadata: any = { 
                        fileType: singleFile.mimetype, 
                        token: token, 
                        createdAt: new Date(),
                        burnAfterReading: isBurnOption,
                        owner: (session as any)?.user?.email || null // THIS IS THE MAGIC FIX
                    };

                    if (!isPermanent) {
                        const expirationDate = new Date();
                        expirationDate.setHours(expirationDate.getHours() + 24);
                        fileMetadata.expiresAt = expirationDate;
                    }

                    const uploadStream = bucket.openUploadStream(singleFile.originalFilename || 'unknown_file', {
                        metadata: fileMetadata
                    });

                    const readStream = fs.createReadStream(singleFile.filepath);
                    readStream.pipe(uploadStream);

                    uploadStream.on('finish', () => {
                        fs.unlinkSync(singleFile.filepath);
                        
                        res.statusCode = 201;
                        res.end(JSON.stringify({ 
                            message: `${singleFile.originalFilename} File Was Created via GridFS`, 
                            data: [{ token: token, fileName: singleFile.originalFilename }] 
                        }));
                    });

                    uploadStream.on('error', (uploadErr) => {
                        console.error(uploadErr);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: 'Database stream failed' }));
                    });
                });
                break;
            } catch (err) {
                res.statusCode = 400;
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                res.end(JSON.stringify({ message: errorMessage }));
                break;
            }
        default:
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Error: Only POST method allowed' }));
            break;
    }
}