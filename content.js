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
