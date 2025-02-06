import { Request, Response } from "express";
import { prisma } from "../../index";
import * as XLSX from "xlsx";
import axios from 'axios';

const addHSCodeFromLocal = async (req: Request, res: Response) => {
    try {
        const types = ["2bit", "4bit", "6bit", "8bit"];
        const fileUrls: any = {
            "2bit": "https://docs.google.com/spreadsheets/d/1khMLbwwURCKu_7KvEbJnoz1nbiI-w7zc/export?format=xlsx",
            "4bit": "https://docs.google.com/spreadsheets/d/1RUdegr76TP-w816ZOUP8Cfg91P4rLPEh/export?format=xlsx",
            "6bit": "https://docs.google.com/spreadsheets/d/1Eoo3CCtai5ZxDxHUDw4FfB08ohssrV-m/export?format=xlsx",
            "8bit": "https://docs.google.com/spreadsheets/d/1kNa2IZdVt5RQWN4M_A-O2R6PsSK8gWww/export?format=xlsx"
        };
        const sheetNames: any = {
            "2bit": "HS 2 digit",
            "4bit": "HS 4 digit",
            "6bit": "6 digit",
            "8bit": "8 digit"
        };

        for (const type of types) {
            console.log(`Processing type: ${type}`);
            const fileUrl = fileUrls[type];
            const sheetName = sheetNames[type];

            console.log(`Downloading file from URL: ${fileUrl}`);
            const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
            const fileBuffer = Buffer.from(response.data, 'binary');
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            console.log(`Converting sheet to JSON for sheet name: ${sheetName}`);
            const data = sheet.map((row: any) => ({
                HSCode: (row.HSCode).toString(),
                Commodity: (row.Commodity).toString(),
            }));

            console.log(`Inserting data into database for type: ${type}`);
            switch (type) {
                case "2bit":
                    await prisma.hSCode2Bit.createMany({ data });
                    break;
                case "4bit":
                    await prisma.hSCode4Bit.createMany({ data });
                    break;
                case "6bit":
                    await prisma.hSCode6Bit.createMany({ data });
                    break;
                case "8bit":
                    await prisma.hSCode8Bit.createMany({ data });
                    break;
            }
        }

        console.log("HS Codes added successfully from local files");
        res.status(200).json({ message: "HS Codes added successfully from local files" });
    } catch (error) {
        console.error("Error adding HS Codes from local files:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { addHSCodeFromLocal };
