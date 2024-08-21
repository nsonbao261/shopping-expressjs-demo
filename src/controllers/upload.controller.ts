import { Request, Response } from "express";
import * as firebase from '../utils/firebaseInitialize';

export class UploadControler {
    public uploadFile = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "No file found",
                })
            }
            const blob = firebase.bucket.file(req.file.originalname);

            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                }
            })


            blobWriter.on("error", (err) => {
                return res.status(500).json({
                    messagge: err,
                })
            })

            blobWriter.on("finish", () => {

                const downloadUrl = 'https://firebasestorage.googleapis.com/v0/b/'
                    + firebase.bucket.name + '/o/'
                    + blob.name + '?alt=media'
                return res.status(200).json({
                    message: "Uplaod sucessfully",
                    downloadUrl: downloadUrl,
                    fileInformation: {
                        fileName: blob.name,
                        contentType: blob.metadata.contentType,
                        size: blob.metadata.size,
                        createdAt: blob.metadata.timeCreated,
                    }
                })
            })

            blobWriter.end(req.file.buffer);
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
            })
        }
    }
}