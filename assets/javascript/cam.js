let constraintObj = { 
    audio: false, 
    video: { 
        facingMode: "user", 
        width: { min: 320, ideal: 720, max: 1080 },
        height: { min: 240, ideal: 480, max: 720 } 
    } 
}; 
// width: 1280, height: 720  -- preference only
// facingMode: {exact: "user"}
// facingMode: "environment"

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
}

navigator.mediaDevices.getUserMedia(constraintObj)
.then(function(mediaStreamObj) {
    //connect the media stream to the first video element
    let video = document.querySelector('video');
    if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
    } else {
        //old version
        video.src = window.URL.createObjectURL(mediaStreamObj);
    }
    
    video.onloadedmetadata = function(ev) {
        //show in the video element what is being captured by the webcam
        video.play();
    };
    
    //add listeners for saving video/audio
    let start = document.getElementById('btnStart');
    let stop = document.getElementById('btnStop');
    let photo = document.getElementById('photo');
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    let chunks = [];
    
    start.addEventListener('click', (ev)=>{
        mediaRecorder.start();
    })
    stop.addEventListener('click', (ev)=>{
        mediaRecorder.stop();
    });
    photo.addEventListener('click', (ev)=>{
        const canvas = document.createElement('canvas'); // create a canvas
        const ctx = canvas.getContext('2d'); // get its context
        canvas.width = video.videoWidth; // set its size to the one of the video
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0,0); // the video
        return new Promise((res, rej)=>{
            canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
        });
    });    
    mediaRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data);
    }
    mediaRecorder.onstop = (ev)=>{
        let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);

        let first = 10;
        let second = 20;
        fetch('http://127.0.0.1/add?a='+first+'&b='+second)
        .then((response) => {
            return response.json();
        })
    }
})
.catch(function(err) { 
    console.log(err.name, err.message); 
});