import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/library/db';
import mongoose from 'mongoose';
import formidable from 'formidable';
import fs from 'fs';
import { getServerSession } from "next-auth/next";
import authOptions from "./auth/[...nextauth]"; 

// Configuration for Next.js API routes.
// We disable the body parser because formidable handles the multipart/form-data parsing.
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Connect to the MongoDB database.
    await dbConnect();
    const { method } = req;
    
    // Grab the logged-in user's session to associate uploads with a user account.
    const session = await getServerSession(req, res, authOptions);
    
    // Set default headers for the JSON response.
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');

    switch (method) {
        case 'POST':
            try {
                // Initialize formidable to handle the incoming file upload.
                // `multiples: false` means we only expect one file.
                const form = formidable({ multiples: false });

                // Parse the request to get fields and files.
                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        res.statusCode = 500;
                        return res.end(JSON.stringify({ message: "Error parsing form data" }));
                    }

                    // Formidable can return an array or a single file object. We handle both cases.
                    const fileArray = files.file as formidable.File[];
                    const singleFile = Array.isArray(fileArray) ? fileArray[0] : files.file as any;

                    // If no file is present, return a bad request error.
                    if (!singleFile) {
                        res.statusCode = 400;
                        return res.end(JSON.stringify({ message: "No file uploaded" }));
                    }
                    // Check the 'saveToVault' field to see if the file should be permanent.
                    const isPermanent = fields.saveToVault 
                      ? (Array.isArray(fields.saveToVault) ? fields.saveToVault[0] === 'true' : fields.saveToVault === 'true')
                      : false;
                    // Check the 'burnAfterReading' field.
                    const isBurnOption = fields.burnAfterReading 
                      ? (Array.isArray(fields.burnAfterReading) ? fields.burnAfterReading[0] === 'true' : fields.burnAfterReading === 'true')
                      : false;
                    // Initialize GridFS bucket for file storage in MongoDB.
                    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
                        bucketName: 'binshare'
                    });
                    // Generate a short, random, and unique token for the file's access URL.
                    const token = Math.random().toString(36).substring(2, 14);

                    // Build metadata and STAMP the user's email if they are logged in
                    let fileMetadata: any = { 
                        fileType: singleFile.mimetype, 
                        token: token, 
                        createdAt: new Date(),
                        burnAfterReading: isBurnOption,
                        owner: (session as any)?.user?.email || null // Associate file with the logged-in user, or null if not logged in.
                    };

                    // If the file is not permanent (not saved to vault), set a 24-hour expiration date.
                    if (!isPermanent) {
                        const expirationDate = new Date();
                        expirationDate.setHours(expirationDate.getHours() + 24);
                        fileMetadata.expiresAt = expirationDate;
                    }
                    // Open an upload stream to GridFS with the file's original name and metadata.
                    const uploadStream = bucket.openUploadStream(singleFile.originalFilename || 'unknown_file', {
                        metadata: fileMetadata
                    });
                    // Create a read stream from the temporarily saved file path and pipe it to the upload stream.
                    const readStream = fs.createReadStream(singleFile.filepath);
                    readStream.pipe(uploadStream);

                    // When the upload is complete...
                    uploadStream.on('finish', () => {
                        // ...delete the temporary file from the server's filesystem.
                        fs.unlinkSync(singleFile.filepath);
                        
                        // Send a success response with the file token and name.
                        res.statusCode = 201;
                        res.end(JSON.stringify({ 
                            message: `${singleFile.originalFilename} File Was Created via GridFS`, 
                            data: [{ token: token, fileName: singleFile.originalFilename }] 
                        }));
                    });

                    uploadStream.on('error', (uploadErr) => {
                        // If there's an error during the database stream, log it and send a server error response.
                        console.error(uploadErr);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: 'Database stream failed' }));
                    });
                });
                break;
            } catch (err) {
                // Catch any other errors during the process.
                res.statusCode = 400;
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                res.end(JSON.stringify({ message: errorMessage }));
                break;
            }
        default:
            // If any method other than POST is used, return an error.
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Error: Only POST method allowed' }));
            break;
    }
}