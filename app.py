from flask import Flask, request, jsonify
import aubio
import pandas as pd
import json
from flask_cors import CORS
import os

app = Flask(__name__)

# Allow CORS so that the frontend can make requests to the Flask backend
# Cross-origin resource sharing
CORS(app)

# this returns our 3 important values our of a JSON (result of analyze audio)
def analyze_pitch(data):
    average_pitch = data['average_pitch']
    highest_pitch = data['highest_pitch']
    lowest_pitch = data['lowest_pitch']
    return average_pitch, highest_pitch, lowest_pitch

@app.route('/', methods=['POST'])
def handle_post_request():
    # Handle the POST request here
    return 'POST request received'

@app.route('/analyze', methods=['POST'])
# this function will analyze the user's audio file and return the pitch data in a JSON format
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

@app.route('/analyze', methods=['POST'])
def analyze_audio_route():
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file found'}), 400
    
    audio_file = request.files['file']
    if audio_file.filename == '':
        return jsonify({'error': 'No audio file selected'}), 400

     # Save the file temporarily
    audio_file_path = 'temp_audio.wav'
    audio_file.save(audio_file_path)

    # Process audio data
    try:
        analysis_result = analyze_audio(audio_file_path)
        return jsonify(analysis_result)
    except Exception as e:
        os.remove(audio_file_path)
        return jsonify({'error': str(e)}), 500


# This function will find the song with the lowest total difference
def find_lowest_difference(csv_file, audio_path):
    # Analyze audio to get pitch data
    pitch_data = analyze_audio(audio_path)
    
    # Call analyze_pitch to get pitch details from JSON
    average_pitch, highest_pitch, lowest_pitch = analyze_pitch(pitch_data)
    
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
    # return relevant_columns.to_dict()


@app.route('/')
def index():
    return 'Upload an audio file to analyze pitch range.'


print(find_lowest_difference('songs.csv', 'output.wav'))

if __name__ == '__main__':
    app.run(debug=True)
    
    # ffmpeg -i Recording.wav -acodec pcm_s16le -ar 44100 -ac 1 output.wav
