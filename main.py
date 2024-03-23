from openai import OpenAI

# Define your API key


# Create an OpenAI client instance
client = OpenAI(api_key=api_key)

# Define your prompt or question
prompt = "Once upon a time,"

# Make a request to the API
response = client.completions.create(
    model="text-davinci-003",  # Specify the model (e.g., text-davinci-003)
    prompt=prompt,
    max_tokens=50  # Specify maximum tokens for the response
)

# Access the generated text from the response
generated_text = response['choices'][0]['text'].strip()

print("Generated text:", generated_text)
