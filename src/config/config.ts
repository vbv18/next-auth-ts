import "dotenv/config";
import { z } from "zod";


const ENVSchema = z.object({

});

const parsedENV = ENVSchema.safeParse(process.env);

if (!parsedENV.success) {
    throw new Error(
        `Environment validation failed:\n${parsedENV.error.message}`
    );
}

export const ENV = parsedENV.data;