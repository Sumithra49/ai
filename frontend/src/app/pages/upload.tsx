import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the file' });
      return;
    }

    let file: formidable.File | undefined;
    if (Array.isArray(files.file)) {
      file = files.file[0];
    } else if (files.file) {
      file = files.file as formidable.File;
    }

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filePath = file.filepath;

    fs.readFile(filePath, 'utf8', async (readErr, fileContent) => {
      if (readErr) {
        res.status(500).json({ error: 'Error reading the file' });
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/analyze', {
          method: 'POST',
          body: JSON.stringify({ content: fileContent }),
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        res.status(200).json(result);
      } catch (fetchError) {
        console.error('Error processing file:', fetchError);
        res.status(500).json({ error: 'Error processing file' });
      }
    });
  });
};

export default uploadHandler;
