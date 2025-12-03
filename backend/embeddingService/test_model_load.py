from sentence_transformers import SentenceTransformer

model = SentenceTransformer('D:/legal-bert-base-uncased')
print("Model loaded successfully")

# Test embedding
sentence = "This is a sample sentence"
embedding = model.encode(sentence)
print(f"Embedding generated, length = {len(embedding)}")
print(embedding[:10]) 
