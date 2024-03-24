from flask import Flask, request, jsonify
import aubio
import csv
from pydub import AudioSegment
import pandas as pd


app = Flask(__name__)

@app.route('/')
def index():
    return 'Upload an audio file to analyze pitch range.'

@app.route('/analyze', methods=['POST'])
def analyze_pitch():
    if 'file' not in request.files:
        return 'No file part'
    
    file = request.files['file']
    
    if file.filename == '':
        return 'No selected file'
    
    # Save the uploaded file
    audio_path = "Recording.wav"
    file.save(audio_path)
    
    # Analyze pitch using Aubio
    pitches = analyze_audio(audio_path)
    
    return jsonify({'pitches': pitches})

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



def find_lowest_difference(csv_file):
    csv_file = 'songs.csv'
    songs = pd.read_csv(csv_file)
    # min_lowest_diff = float('inf')  # Initialize with positive infinity
    # min_lowest_diff_index = None
    
    min_freq = songs['Min. Freq']
    max_freq = songs['Max. Freq']
    # lowest_pitch = songs['lowest_pitch']
    # highest_pitch = songs['highest_pitch']
        
    # Calculate differences
    mindiff = abs(min_freq - 0.1)
    maxdiff = abs(max_freq - 0.1)
    total_diff = mindiff + maxdiff
        
    # Update minimum difference if needed
    # if total_diff < min_lowest_diff:
    #     min_lowest_diff = total_diff
    #     min_lowest_diff_index = index
    
    # return min_lowest_diff, min_lowest_diff_index
    return mindiff, maxdiff

# Call the function to find the lowest difference and index
csv_file = 'songs.csv'  # Change to the path of your CSV file
lowest_difference, song_index = find_lowest_difference(csv_file)
print("Lowest difference:", lowest_difference)
print("Song index with lowest difference:", song_index)




if __name__ == '__main__':
    app.run(debug=True)
   
   
  
