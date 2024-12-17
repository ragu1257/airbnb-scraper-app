import dotenv from "dotenv";
dotenv.config();

export const PORT: number = parseInt(process.env.PORT || "3001");
export const DEFAULT_URL: string = process.env.DEFAULT_URL || "https://www.airbnb.com/";
