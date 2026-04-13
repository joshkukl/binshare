// Base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error('Please define the Base URL in your .env file');
} 
export default BASE_URL;