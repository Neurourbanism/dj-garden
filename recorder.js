// --- запросить разовое разрешение на аудио, нужно для некоторых мобильных браузеров
navigator.mediaDevices.getUserMedia({audio:true})
      .then(()=>console.log('microphone permission granted'))
      .catch(err=>console.warn('mic permission denied',err));

let recorder, chunks=[];
const recBtn = document.getElementById('rec');
const stopBtn= document.getElementById('stop');
const dl     = document.getElementById('download');

recBtn.onclick = ()=>{
   chunks = [];
   recorder = new MediaRecorder(window.sharedStream);  // поток из pads.js
   recorder.ondataavailable = e => chunks.push(e.data);
   recorder.onstop = ()=>{
       const blob = new Blob(chunks,{type:'audio/wav'});
       const url  = URL.createObjectURL(blob);
       dl.href = url;
       dl.download = 'my_mix.wav';
       dl.style.display = 'inline';
   };
   recorder.start();
   recBtn.disabled = true;
   stopBtn.disabled = false;
};

stopBtn.onclick = ()=>{
   recorder.stop();
   recBtn.disabled = false;
   stopBtn.disabled = true;
};
