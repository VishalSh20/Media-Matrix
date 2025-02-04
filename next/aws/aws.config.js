import { S3Client } from "@aws-sdk/client-s3";
import { PollyClient } from "@aws-sdk/client-polly";
import { LambdaClient,InvokeCommand } from "@aws-sdk/client-lambda";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
})

export const pollyClient = new PollyClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
})

export const lambdaClient = new LambdaClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
})

export const getCloudFrontSignedUrl=(Key,DateLessThan=new Date(Date.now()+(1000*60*60*24)))=>{
    return getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `${process.env.CLOUDFRONT_URL}/${Key}`,
        dateLessThan: DateLessThan
    });
}

export const invokeLambda=async(functionName,payload)=>{
    const command = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload),
      });
    
      const { Payload} = await lambdaClient.send(command);
      const result = Buffer.from(Payload).toString();
      return result;
}