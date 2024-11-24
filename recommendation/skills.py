import pandas as pd
from sentence_transformers import SentenceTransformer, util

# Load ESCO or another skills dataset
skills = ["Python programming", "Data analysis", "Machine learning", "Project management", "Software development"]

# Initialize an embedding model (we'll use a sentence transformer for semantic matching)
model = SentenceTransformer('all-MiniLM-L6-v2')
skills_embeddings = model.encode(skills, convert_to_tensor=True)

def get_closest_skill(input_skill):
    # Embed the input skill
    input_embedding = model.encode(input_skill, convert_to_tensor=True)
    
    # Compute similarity scores
    similarities = util.pytorch_cos_sim(input_embedding, skills_embeddings)
    
    # Find the index of the highest similarity score
    closest_skill_idx = similarities.argmax().item()
    
    # Return the closest matching skill
    return skills[closest_skill_idx]

print(get_closest_skill("my"))