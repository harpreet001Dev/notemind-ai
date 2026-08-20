import {SentenceTransformersEmbeddingFunction } from '@chroma-core/sentence-transformer'

const embedder =new SentenceTransformersEmbeddingFunction({
     modelName: "all-MiniLM-L6-v2",
})

export default embedder;