from google import genai

client = genai.Client(api_key="AIzaSyBSjPU14Tqg0eQC0yI5E5bjc7dXNdX3Qj0")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain how AI works in a few words",
)

print(response.text)