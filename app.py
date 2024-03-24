from flask import Flask, request, jsonify
import aubio
from pydub import AudioSegment
# venv\Scripts\activate
# python3 app.py

audio = AudioSegment.from_file("Recording.m4a", format="m4a")
# Resample to 44100 Hz
audio = audio.set_frame_rate(44100)

audio.export("Recording.wav", format="wav")

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
    
    # Analyze pitch using Aubio
    pitches = analyze_audio(audio_path)
    
    return jsonify({'pitches': pitches})

def analyze_audio(audio_path):

    # Initialize pitches as an empty list
    pitches = []

    # Open audio file
    samplerate = 44100
    win_s = 4096
    hop_s = 512
    s = aubio.source(audio_path, samplerate, hop_s)
    samplerate = s.samplerate

    # Create pitch object
    pitch_o = aubio.pitch("yin", win_s, hop_s, samplerate)

    # Array to store detected pitches
    # Convert pitch values to Python floats
    pitches = [float(pitch) for pitch in pitches]

    # Process audio
    while True:
        samples, read = s()
        pitch = pitch_o(samples)[0]
        if pitch != 0:  # Filter out zero pitches
            pitches.append(pitch)
        if read < hop_s: 
            break

    if not pitches:
        return {'highest_pitch': None, 'lowest_pitch': None, 'average_pitch': None}

    # Calculate highest, lowest, and average pitch
    highest_pitch = max(pitches)
    lowest_pitch = min(pitches)
    average_pitch = sum(pitches) / len(pitches)

    return {
        'highest_pitch': float(highest_pitch) if highest_pitch else None,
        'lowest_pitch': float(lowest_pitch) if lowest_pitch else None,
        'average_pitch': float(average_pitch) if average_pitch else None
    }


if __name__ == '__main__':
    app.run(debug=True)

