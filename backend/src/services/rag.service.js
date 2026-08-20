import client from "../config/chroma.js";
import embedder from "../config/embedding.js";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import groq from "../config/groq.js";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
})

const addNoteToEmbedding = async (note) => {

    const text = `${note.title}\n${note.content}`;
    const chunks = await splitter.createDocuments([text]);

    const collection = await client.getCollection({
        name: 'notemind_notes',
        embeddingFunction: embedder
    });
    //create unique ids for each chunk
    const ids = await chunks.map((_, index) =>
        `${note._id.toString()}_chunk_${index}`
    )

    const documents = await chunks.map(
        chunk => chunk.pageContent
    );

    const metadatas = await chunks.map(
        (_, index) => ({
            userId: note.userId.toString(),
            noteId: note._id.toString(),
            chunkIndex: index
        })
    )

    await collection.add({
        ids,
        documents,
        metadatas,
    })
    console.log("Note chunks are added to chroma db");


}

const updateNoteEmbedding = async (note) => {

    const collection = await client.getCollection({
        name: "notemind_notes",
        embeddingFunction: embedder
    });


    await collection.delete({
        where: {
            noteId: note._id.toString()
        }
    });


    const text = `${note.title}\n${note.content}`;

    const chunks = await splitter.createDocuments([text]);


    const ids = chunks.map(
        (_, index) => `${note._id.toString()}_chunk_${index}`
    );

    const documents = chunks.map(
        chunk => chunk.pageContent
    );

    const metadatas = chunks.map(
        (_, index) => ({
            userId: note.userId.toString(),
            noteId: note._id.toString(),
            chunkIndex: index
        })
    );

    await collection.add({
        ids,
        documents,
        metadatas
    });

    console.log("Note embeddings updated in Chroma");
};

const deleteNoteEmbedding = async (note) => {
    const collection = await client.getCollection({
        name: "notemind_notes",
        embeddingFunction: embedder
    });

    await collection.delete({
        where: {
            noteId: note._id.toString()
        }
    });
    console.log("Embedding is deleted!")
}

const askllm = async (context, ques) => {
    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: `You are an assistant that answers questions
                    using the user's notes.

                    Use the provided context to answer the question.

                    Give a clear, concise answer of moderate length.
                    Provide enough explanation to properly answer the question,
                    but do not produce a very long or detailed response.
                    Avoid repeating information from the context.

                    If the answer is not present in the context,
                    say you don't have enough information.

                    Context:
                    ${context}`
                },
                {
                    role: "user",
                    content: ques
                }
            ]
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error("GROQ ERROR:", error);
        throw error;
    }
};

const ask = async (userId, ques) => {

    const collection = await client.getCollection({
        name: "notemind_notes",
        embeddingFunction: embedder
    });

    const result = await collection.query({
        queryTexts: [ques],
        nResults: 5,
        where: {
            userId: userId.toString()
        }
    });
    // console.dir(result, { depth: null });

    const relevantChunks = result.documents[0];

    const context = relevantChunks.join("\n\n");

    const answer = await askllm(context, ques);
    return answer;
};

export default {
    addNoteToEmbedding,
    updateNoteEmbedding,
    deleteNoteEmbedding,
    ask
}