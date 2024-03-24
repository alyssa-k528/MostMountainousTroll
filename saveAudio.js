function saveBlob(blob, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

function startRecording(){
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const recorder = new MediaRecorder(stream);
    const data = [];

    recorder.ondataavailable = event => data.push(event.data);
    recorder.onstop = () => sendAudioToServer(data);

    recorder.start();
    setTimeout(() => recorder.stop(), 4000); // Adjust recording time as needed
  });
}

function sendAudioToServer(audioChunks) {
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  const formData = new FormData();
  formData.append('file', audioBlob, 'myRecording.wav');

  fetch('http://127.0.0.1:5000/analyze', { // Replace with your Flask server URL
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}
