const pads = document.querySelectorAll('.pad');
const ctx  = new AudioContext();
const dest = ctx.createMediaStreamDestination();
const bank = {};
const active = new Map();          // <button, gainNode>

// счётчик загрузки
let loaded = 0, total = pads.length;
function checkReady(){
  if(loaded === total){
    document.getElementById('status').textContent = 'Ready ✔';
  }
}

// предзагрузка
pads.forEach(btn=>{
  const file = 'sounds/' + btn.dataset.sound + '.wav';

  fetch(file)
    .then(r=>r.arrayBuffer())
    .then(b=>ctx.decodeAudioData(b, buf=>{
        bank[file]=buf;
        loaded++; checkReady();
    }));

  // клик
  btn.addEventListener('click', ()=>{
     if(!bank[file]) return;        // ещё не загрузилось

     // если уже играет — плавно затихаем
     if(active.has(btn)){
        const g = active.get(btn);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.2);
        active.delete(btn);
        btn.classList.remove('playing');
        return;
     }

     // воспроизводим
     const src  = ctx.createBufferSource();
     const gain = ctx.createGain();
     src.buffer = bank[file];
     src.connect(gain);
     gain.connect(ctx.destination);
     gain.connect(dest);
     gain.gain.setValueAtTime(1, ctx.currentTime);
     src.start();

     active.set(btn, gain);
     btn.classList.add('playing');

     src.onended = ()=>{
        active.delete(btn);
        btn.classList.remove('playing');
     };
  });
});
