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