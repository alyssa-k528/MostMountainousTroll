from flask import Flask, request, jsonify
import aubio
import csv
from pydub import AudioSegment
from flask_cors import CORS
import pandas as pd
import json

# venv\Scripts\activate
# python3 app.py

# Converts m4a to wav
# Interprets vocal range to return max/min/avg vocal range
# Sends to send_request.py

app = Flask(__name__)
# Allow CORS so that the frontend can make requests to the Flask backend
# Cross-origin resource sharing

CORS(app)

@app.route('/')
def index():
    return 'Upload an audio file to analyze pitch range.'

@app.route('/analyze', methods=['POST'])
def analyze_pitch(json_data):
    data = json.loads(json_data)
    average_pitch = data['pitches']['average_pitch']
    highest_pitch = data['pitches']['highest_pitch']
    lowest_pitch = data['pitches']['lowest_pitch']
    return average_pitch, highest_pitch, lowest_pitch

def analyze_audio(audio_path):
    pitches = []

    # Open audio file
    samplerate = 44100
    win_s = 4096
    hop_s = 512
    s = aubio.source(audio_path, samplerate, hop_s)
    samplerate = s.samplerate

    # Create pitch object
    pitch_o = aubio.pitch("yin", win_s, hop_s, samplerate)

    # Process audio
    while True:
        samples, read = s()
        pitch = pitch_o(samples)[0]
        if pitch != 0:  # Filter out zero pitches
            pitches.append(float(pitch))
        if read < hop_s: 
            break

    if not pitches:
        return {'highest_pitch': None, 'lowest_pitch': None, 'average_pitch': None}

    # Calculate highest, lowest, and average pitch
    highest_pitch = max(pitches)
    lowest_pitch = min(pitches)
    average_pitch = sum(pitches) / len(pitches)

    return {
        'highest_pitch': highest_pitch,
        'lowest_pitch': lowest_pitch,
        'average_pitch': average_pitch
    }



def find_lowest_difference(csv_file, average_pitch, highest_pitch, lowest_pitch):
    songs = pd.read_csv(csv_file)

    min_freq = songs['Min. Freq']
    max_freq = songs['Max. Freq']

    # Calculate differences
    mindiff = abs(min_freq - lowest_pitch)
    maxdiff = abs(max_freq - highest_pitch)
    total_diff = mindiff + maxdiff
    
    # Find the index of the row with the minimum total difference
    min_index = total_diff.idxmin()

    # Retrieve the row with the minimum total difference
    row_with_min_diff = songs.iloc[min_index]

    # Extract specific columns (1, 2, and 5)
    relevant_columns = row_with_min_diff.iloc[[0, 1, 4]]
    
    return relevant_columns


json_data = '''
{
    "pitches": {
        "average_pitch": 715.7707580192802,
        "highest_pitch": 500.0,
        "lowest_pitch": 100.91373062133789
    }
}
'''

# Call the function to find the lowest difference and index
average_pitch, highest_pitch, lowest_pitch = analyze_pitch(json_data)
csv_file = 'songs.csv'  # Change to the path of your CSV file
lowest_difference = find_lowest_difference(csv_file, average_pitch, highest_pitch, lowest_pitch)
print("Lowest difference:", lowest_difference)




if __name__ == '__main__':
    app.run(debug=True)
   
   
  
