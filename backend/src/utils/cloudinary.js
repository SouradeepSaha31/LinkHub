import ImageKit from '@imagekit/nodejs';
import fs from 'fs';


const fileUpload = async (file, filename) => {
    
    const client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    
    const response = await client.files.upload({
      file: file.buffer.toString('base64'),
      fileName: filename,
      folder : "/LinkHub"
    });

    return response;

}

export {fileUpload}