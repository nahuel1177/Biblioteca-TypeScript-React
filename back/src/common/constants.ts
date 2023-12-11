import 'dotenv/config'

export const PORT=process.env.PORT
export const MONGODB_URI=process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/libdb?authSource=admin';

const constants = { PORT, MONGODB_URI };
export default constants;