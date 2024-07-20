import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Ollama } from "ollama";
import { v4 as uuidv4 } from 'uuid';

export type Monster = {
  name:string,
  description:string,
  avgHeight:string,
  diet:string,
  environment:string,
}

export async function getBase64Image(blob: Blob) {
  let buffer = Buffer.from(await blob.arrayBuffer());
  return buffer.toString('base64');
}

export async function uploadImage(file: Blob) {
    let buffer = Buffer.from(await file.arrayBuffer());
    const filename = uuidv4();
    const {AWS_REGION, BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = import.meta.env;
    const s3Client = new S3Client({
      endpoint: "https://fly.storage.tigris.dev",
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: "image/jpeg",
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      return filename;
    } catch (error) {
      console.error(error);
      return false;
    }
}


export const analyzeMonster = async (blob: Blob) => {
  const imgBase64 = await getBase64Image(blob);
  const monsterSchema = [
    {
      name: "Name of the monster",
      description: "Description of the monster",
      avgHeight: "Approximate height of the monster in meters",
      diet: "Diet of the monster, what the monster eats",
      environment: "The terrain in which the monster is typically found",
    }
  ];

  const ollama = new Ollama({ 
    host: 'http://ollama-scale-to-0-purple-pine-2926.flycast'
  });

  try {
    const response = await ollama.generate({
      model: 'llava',
      prompt: `
      This is an image of some type of monster or fictional creature. Invent a name and some details about this monster or creature. Be as descriptive as you like.
      In your response, provide me with the following information about the monster as JSON, following this schema: ${JSON.stringify(monsterSchema)}.
      Do not include any other properties in the JSON object other than the ones specified in the schema.`,
      images: [imgBase64],
      stream: false,
      format: 'json',
    })
    return response.response;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to analyze monster');
  }

}