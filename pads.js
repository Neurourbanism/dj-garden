const pads   = document.querySelectorAll('.pad');
const ctx    = new AudioContext();
const dest   = ctx.createMediaStreamDestination();
const bank   = {};               // буферы
const active = new Map();        // <button, source>

pads.forEach(btn=>{
  const file = 'sounds/' + btn.dataset.sound + '.wav';

  // загрузка
  fetch(file)
    .then(r=>r.arrayBuffer())
    .then(b=>ctx.decodeAudioData(b, buf=>bank[file]=buf));

  // обработка клика
  btn.addEventListener('click', ()=>{
     // если уже играет — остановить
     if (active.has(btn)) {
         active.get(btn).stop();
         active.delete(btn);
         btn.classList.remove('playing');
         return;
     }
     // иначе воспроизвести
     const src = ctx.createBufferSource();
     src.buffer = bank[file];
     src.connect(ctx.destination);
     src.connect(dest);
     src.start();
     active.set(btn, src);
     btn.classList.add('playing');

     // когда звук закончится сам
     src.onended = ()=>{
        active.delete(btn);
        btn.classList.remove('playing');
     };
  });
});
