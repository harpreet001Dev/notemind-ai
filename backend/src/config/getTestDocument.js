import client from "./chroma.js";
import embedder from "./embedding.js";

try {
    const collection = await client.getCollection({
        name: "notemind_notes",
        embeddingFunction: embedder
    });

    const result = await collection.get({
        ids: ["test-1"],
        
    });

    console.log(result);

} catch (error) {
    console.log("error", error);

}