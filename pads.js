const pads = document.querySelectorAll('.pad');
const ctx  = new AudioContext();
const dest = ctx.createMediaStreamDestination();
const bank = {};                         // буферы

// --- счётчик загрузки ---
let loaded = 0,
    total  = pads.length;

function checkReady(){
  if (loaded === total){
    document.getElementById('status').textContent = 'Ready ✔';
  }
}

// --- предзагрузка всех WAV ---
pads.forEach(btn=>{
  const file = 'sounds/' + btn.dataset.sound + '.wav';

  fetch(file)
    .then(r=>r.arrayBuffer())
    .then(b=>ctx.decodeAudioData(b, buf=>{
        bank[file] = buf;
        loaded++;
        checkReady();
    }));

  // обработка клика
  btn.addEventListener('click', ()=>{
     if(!bank[file]) return;              // звук ещё не готов
     const src = ctx.createBufferSource();
     src.buffer = bank[file];
     src.connect(ctx.destination);
     src.connect(dest);
     src.start();
  });
});
