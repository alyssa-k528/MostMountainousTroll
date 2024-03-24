from flask import Flask, request, jsonify
import aubio
from pydub import AudioSegment

audio = AudioSegment.from_file("Recording.m4a", format="m4a")
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
    # Open audio file
    samplerate = 44100
    win_s = 4096
    hop_s = 512
    s = aubio.source(audio_path, samplerate, hop_s)
    samplerate = s.samplerate

    # Create pitch object
    pitch_o = aubio.pitch("yin", win_s, hop_s, samplerate)

    # Array to store detected pitches
    pitches = []

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

    return {'highest_pitch': highest_pitch, 'lowest_pitch': lowest_pitch, 'average_pitch': average_pitch}


if __name__ == '__main__':
    app.run(debug=True)

