from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load model
model = SentenceTransformer('D:/legal-bert-base-uncased')
print("Model loaded successfully in embedding service")

# Set api for embedding
@app.route('/embed', methods=['POST'])
def embed_text():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    embedding = model.encode(text, normalize_embeddings=True).tolist()
    return jsonify({'embedding': embedding})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
