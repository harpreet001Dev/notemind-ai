import {ChromaClient} from 'chromadb';

const client = new ChromaClient({
    host: process.env.CHROMA_HOST,
    port: process.env.CHROMA_PORT,
    ssl: process.env.CHROMA_SSL
});

export default client;