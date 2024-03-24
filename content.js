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
function startRecording() {
  var device = navigator.mediaDevices.getUserMedia({ audio: true });
  var items = [];
  device.then(stream => {
      var recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
          items.push(e.data);
      };

      recorder.onstop = async () => {
          // Combine the audio chunks into a single Blob
          const audioBlob = new Blob(items, { type: 'audio/webm' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioContext = new AudioContext();
          const audioData = await audioContext.decodeAudioData(arrayBuffer);

          // Convert the audio data to WAV format
          var wavBlob = bufferToWave(audioData, audioData.length);
          saveBlob(wavBlob, 'Recording.wav');
      };

      recorder.start();
      setTimeout(() => {
          recorder.stop();
      }, 5000);
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


// Converts recorded audio to WAV format
function bufferToWave(abuffer, len) {
  var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      offset = 0,
      pos = 0;

  // write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for(i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while(pos < length) {
    for(i = 0; i < numOfChan; i++) { // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++ // next source sample
  }

  // create Blob
  return new Blob([buffer], {type: "audio/wav"});

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
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
