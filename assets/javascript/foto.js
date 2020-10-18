const vid = document.querySelector('video');
navigator.mediaDevices.getUserMedia({video: true}) 
.then(stream => {
  vid.srcObject = stream; 
  return vid.play(); 
})
.then(()=>{ 
  const btn = document.querySelector('button');
  btn.disabled = false;
  btn.onclick = e => {
    takeASnap()
    .then(send);
  };
});

function takeASnap(){
  const canvas = document.createElement('canvas'); 
  const ctx = canvas.getContext('2d'); 
  canvas.width = vid.videoWidth; 
  canvas.height = vid.videoHeight;
  ctx.drawImage(vid, 0,0); 
  return new Promise((res, rej)=>{
    canvas.toBlob(res, 'image/jpeg'); 
  });
}
function send(blob){
    var formData = new FormData();
    formData.append('some_text', 'Connie')
    formData.append('avatar_img', blob, 'foto.jpg');
    const URL = 'http://192.168.1.67:5000/RequestImageWithMetadata'
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL);
    xhr.send(formData);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log(xhr.responseText)
        if (xhr.responseText == 0){
          Swal.fire({
            target: document.getElementById('swal2-container'),
            title: 'Deseas mandar tu informacion?',
            showDenyButton: true,
            confirmButtonText: `Enviar`,
            denyButtonText: `Cancelar`,
          }).then((result) => {
            if (result.isConfirmed) {
              var formData2 = new FormData();
              formData2.append('n1', '1')
              formData.append('some_text', 'Gaby')
              const URL2 = 'http://192.168.1.81:5000/ch1'
              const xhr2 = new XMLHttpRequest();
              xhr2.open('POST', URL2);
              xhr2.send(formData);

              xhr2.onreadystatechange = function() {
                if (xhr2.readyState == XMLHttpRequest.DONE) {
                  alert('Se han recibido los datos')
                }
              }
            }
          })
        }
      }
  }
}