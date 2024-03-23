from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)


# import os
# from flask import Flask, request, jsonify
# # Import any necessary libraries for audio processing

# app = Flask(__name__)

# @app.route('/process-audio', methods=['POST'])
# def process_audio():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     # Process the audio file using PyAudio or other libraries
#     # ...

#     return jsonify({"message": "Audio processed successfully"}), 200

# if __name__ == '__main__':
#     app.run(debug=True)
