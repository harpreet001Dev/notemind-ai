import client from "./chroma.js";

const testConnection=async()=>{
    try {
        const version=await client.version();
        console.log("✅ Connected to Chroma!");
        console.log("Chroma version:", version);
    } catch (error) {
        console.error("❌ Chroma connection failed");
        console.error(error);
    }
}

testConnection();