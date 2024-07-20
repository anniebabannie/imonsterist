import type { APIRoute } from "astro";
import { analyzeMonster, uploadImage } from "../../utils";

export const POST: APIRoute = async ({ params, request }) => {
  
  const blob = await request.blob();
  if (!blob) {
    return new Response(
      JSON.stringify({ error: 'Missing URL parameter' }),
      { status: 400 }
    );
  }

  const filename = await uploadImage(blob);
  const image = `https://fly.storage.tigris.dev/${import.meta.env.BUCKET_NAME}/${filename}`;
  
  let monster = null;
  try {
    monster = await analyzeMonster(blob);
    console.log(monster);
    console.log(image);
    return new Response(
      JSON.stringify({ monster, image }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to analyze monster' }),
      { status: 500 }
    );
  }
}