function recordAudio(){
    // Check if the browser supports the Web Audio API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support the Web Audio API!');
    } else {
        // Request access to the user's microphone
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                source.connect(analyser);
                analyser.fftSize = 2048;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Float32Array(bufferLength);
                const detectPitch = () => {
                    analyser.getFloatTimeDomainData(dataArray);

                    // Here, you would use a pitch detection algorithm/library
                    // For example, using Pitchy:
                    // const pitch = Pitchy.getPitch(dataArray, audioContext.sampleRate);

                    // Placeholder for detected pitch
                    const pitch = 440; // Example: A4 note

                    console.log('Detected pitch:', pitch);

                    // Continue detecting pitch
                    requestAnimationFrame(detectPitch);
                };

                // Start detecting pitch
                detectPitch();
            })
            .catch(err => {
                console.error('Error accessing microphone:', err);
            });
    }   
}