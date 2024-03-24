// Save the file
function saveBlob(blob, fileName) {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  sendAudioToServer(blob);
}

// Start the recording
function startRecording(){

  var device = navigator.mediaDevices.getUserMedia({audio:true});
  var items = [];
  device.then( stream => {
    var recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {

      items.push(e.data);
      if(recorder.state == "inactive")
      {
        var blob = new Blob(items, {type: 'audio/wav'});
        alert(blob.type);
        saveBlob(blob, 'Recording.wav');
      }
    }

    recorder.start();
    setTimeout(()=>{
      recorder.stop();
    }, 4000);

    });

}

// Start the recording and send the file to the server
// function startRecording() {
//   navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//       const recorder = new MediaRecorder(stream);
//       const data = [];

//       recorder.onstart = () => {
//         console.log("Recording started");  // Display message when recording starts
//         // Alternatively, you can use: alert("Recording started");
//       };

//       recorder.ondataavailable = event => data.push(event.data);
      
//       recorder.onstop = () => {
//         console.log("Recording stopped");  // Display message when recording stops
//         // Alternatively, you can use: alert("Recording stopped");
//         const audioBlob = new Blob(data, { type: 'audio/wav' });
//         sendAudioToServer(audioBlob);
//       };

//       recorder.start();
//       setTimeout(() => recorder.stop(), 4000); // Adjust recording time as needed
//     });
// }

// Send the audio blob to the Flask server
function sendAudioToServer(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'Recording.wav');

  fetch('http://127.0.0.1:5000', { // Flask server URL
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

// This function records audio
function recordAudio() {
  // Check if the browser supports the Web Audio API
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Your browser does not support the Web Audio API!');
  } else {
    // Request access to the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        startRecording();
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
      });
  }
}
