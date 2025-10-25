let rec,chunks=[];
const recBtn=document.getElementById('rec');
const stopBtn=document.getElementById('stop');
const dl     =document.getElementById('download');

recBtn.onclick=()=>{
  chunks=[];
  rec=new MediaRecorder(window.sharedStream);
  rec.ondataavailable=e=>chunks.push(e.data);
  rec.onstop=()=>{
     const blob=new Blob(chunks,{type:'audio/wav'});
     const url =URL.createObjectURL(blob);
     dl.href=url; dl.download='my_mix.wav';
     dl.style.display='inline';
  };
  rec.start();
  recBtn.disabled=true; stopBtn.disabled=false;
};

stopBtn.onclick=()=>{
  rec.stop();
  recBtn.disabled=false; stopBtn.disabled=true;
};
