import client from "./chroma.js";
import embedder from "./embedding.js";

try {
    // Delete the old collection if it exists
    try {
        await client.deleteCollection({
            name: "notemind_notes"
        });
        console.log("Old collection deleted");
    } catch (error) {
        // Ignore if it doesn't exist
    }

    // Create it again with our embedding function
    const collection = await client.createCollection({
        name: "notemind_notes",
        embeddingFunction: embedder
    });

    console.log("✅ Collection created:", collection.name);

} catch (error) {
    console.error("❌ Error:", error);
}