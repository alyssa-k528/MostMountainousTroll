import requests
import json
# python3 send_request.py

# Takes values from app.py, and converts it to a json file

def send_audio_file(url, file_path):
    files = {'file': open(file_path, 'rb')}
    response = requests.post(url, files=files)
    return response.json()

def main():
    url = 'http://127.0.0.1:5000/analyze'  #Flask app's /analyze endpoint
    file_path = 'output.wav'  # Path to the audio file
    
    result = send_audio_file(url, file_path)

    # Save the result to a JSON file
    with open('pitch_analysis_result.json', 'w') as json_file:
        json.dump(result, json_file, indent=4)

if __name__ == '__main__':
    main()