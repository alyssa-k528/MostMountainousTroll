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
        saveBlob(blob, 'myRecording.wav');
      }
    }

    recorder.start();
    setTimeout(()=>{
      recorder.stop();
    }, 4000);

    });

    
}

// this function records audio and saves it as a a file for processing
function recordAudio(){
  // Check if the browser supports the Web Audio API
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support the Web Audio API!');
  } else {
      // Request access to the user's microphone
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
              startRecording()
          })
          .catch(err => {
              console.error('Error accessing microphone:', err);
          });
  }   
}











// // Save the file with dynamic file name and replace existing file
// function saveBlob(blob, fileName) {
//   var a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";

//   var url = window.URL.createObjectURL(blob);
//   a.href = url;
//   a.download = fileName;

//   // Remove existing file with the same name if it exists
//   var existingFile = document.getElementById(fileName);
//   if(existingFile) {
//     document.body.removeChild(existingFile);
//   }

//   // Append the anchor element to the body
//   document.body.appendChild(a);
  
//   // Click the anchor element to trigger download
//   a.click();

//   // Revoke the object URL to free up resources
//   window.URL.revokeObjectURL(url);
// }

// // Start the recording
// function startRecording(){
//   var device = navigator.mediaDevices.getUserMedia({audio:true});
//   var items = [];
//   device.then(stream => {
//     var recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = e => {
//       items.push(e.data);
//       if(recorder.state == "inactive") {
//         var blob = new Blob(items, {type: 'audio/wav'});
//         // Pass the blob to the function that sends it to the server
//         sendAudioToServer(blob);
//       }
//     }
//     recorder.start();
//     setTimeout(() => {
//       recorder.stop();
//     }, 4000);
//   });
// }

// function sendAudioToServer(blob) {
//   var formData = new FormData();
//   formData.append('file', blob);

//   fetch('http://127.0.0.1:5000/analyze', {
//     method: 'POST',
//     mode: 'no-cors',
//     body: formData
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Failed to send audio to server');
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log(data);
//     // Process the analysis result here
//   })
//   .catch(error => {
//     console.error('Error sending audio to server:', error);
//   });
// }

// // Other functions remain unchanged

// // Record audio and save it as a file for processing
// function recordAudio() {
//   // Check if the browser supports the Web Audio API
//   if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//     alert('Your browser does not support the Web Audio API!');
//   } else {
//     // Request access to the user's microphone
//     navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//       startRecording();
//     })
//     .catch(err => {
//       console.error('Error accessing microphone:', err);
//     });
//   }
// }