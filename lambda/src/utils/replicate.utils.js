import Replicate from "replicate";

const token = process.env.REPLICATE_API_TOKEN;
export const replicate = new Replicate({
  auth: token,
});

export const IMAGE_GENERATION_MODEL = "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637";


