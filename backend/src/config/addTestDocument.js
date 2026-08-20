import client from "./chroma.js";
import embedder from "./embedding.js";

try {
    const collection = await client.getOrCreateCollection({
        name: "notemind_notes",
        embeddingFunction: embedder
    });
    await collection.add({
        ids: ['test-1'],
        documents: [
            "RAG allows an LLM to use external information."
        ],
        metadatas: [
            {
                userId: "test-user",
            }
        ]
    })
    console.log("✅ Test document added!");
} catch (error) {
    console.error("❌ Error:", error);
}