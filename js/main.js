// Interactive system diagram and study programme tabs.
(function(){
var state={node:'vodenje',tab:'un'};
var data = [
      { id: 'senzorji', num: '01', label: 'Senzorji', title: 'Oči in ušesa sistema',
        text: 'Senzorji izmerijo položaj, temperaturo ali razdaljo. Sistemu povedo, kaj se dogaja.',
        nature: 'Sestavljene oči in občutljive dlačice, ki zaznajo najmanjši premik zraka.',
        tech: 'Merilnik pretoka, kamera strojnega vida, radar, optični senzor na konici vlakna.',
        subjects: ['Senzorji', 'Senzorska tehnika', 'Signali in obdelava signalov'] },
      { id: 'vodenje', num: '02', label: 'Sistem za vodenje', title: 'Možgani, ki se odločajo',
        text: 'Algoritem iz meritev izračuna naslednjo potezo: koliko zavrteti motor ali odpreti ventil.',
        nature: 'Drobni možgani, ki stokrat v sekundi popravljajo let.',
        tech: 'Programabilni logični krmilnik (PLC), mikrokrmilnik, industrijski računalnik.',
        subjects: ['Regulacije I in II', 'Teorija sistemov', 'Modeliranje in identifikacije', 'Osnove robotike'] },
      { id: 'aktuatorji', num: '03', label: 'Aktuatorji', title: 'Mišice, ki ukrepajo',
        text: 'Motorji, ventili in robotski sklepi pretvorijo ukaz v gibanje.',
        nature: 'Krila in mišice, ki v trenutku spremenijo smer leta.',
        tech: 'Elektromotorji, ventili, pnevmatski valji, sklepi robota.',
        subjects: ['Električni in elektromehanski pretvorniki', 'Gradniki sistemov vodenja', 'Aktuatorska tehnika'] },
      { id: 'energija', num: '04', label: 'Vir energije', title: 'Srce, ki vse poganja',
        text: 'Baterija ali napajalnik poganja napravo. Elektronika poskrbi za pravo napetost in tok.',
        nature: 'Hrana, ki se v mišicah spremeni v gibanje.',
        tech: 'Baterije, napajalniki, vodikova gorivna celica, sončne elektrarne.',
        subjects: ['Industrijska elektronika', 'Sistemi močnostne elektronike'] },
      { id: 'itk', num: '05', label: 'ITK', title: 'Živčni sistem povezav',
        text: 'Povezave prenašajo podatke med senzorji, krmilniki in tvojim zaslonom.',
        nature: 'Živci, ki prenašajo signale med očmi, možgani in krili.',
        tech: 'Industrijska omrežja, SCADA, internet stvari, brezžične povezave.',
        subjects: ['Komunikacije v avtomatiki', 'Digitalni signalni krmilniki v avtomatiki'] },
      { id: 'zanka', num: '06', label: 'Povratna zveza', title: 'Zakaj sploh deluje',
        text: 'Sistem znova izmeri rezultat in popravi ukaz. Tako robot ohranja ravnotežje.',
        nature: 'Muha vidi, da jo je zaneslo, in takoj popravi let.',
        tech: 'Regulacija temperature v peči, ravnotežje robota, stabilizacija drona.',
        subjects: ['Regulacije I in II', 'Teorija sistemov', 'Praktikum v avtomatiki in robotiki'] }
    ];
var un = [
      { name: 'SENZORJI', subjects: ['Senzorji'] },
      { name: 'SISTEM ZA VODENJE', subjects: ['Regulacije I', 'Teorija sistemov', 'Signali', 'Modeliranje in identifikacije', 'Regulacije II', 'Osnove robotike'] },
      { name: 'AKTUATORJI', subjects: ['Električni in elektromehanski pretvorniki', 'Gradniki sistemov vodenja'] },
      { name: 'VIR ENERGIJE', subjects: ['Industrijska elektronika'] },
      { name: 'ITK', subjects: ['Komunikacije v avtomatiki', 'Digitalni signalni krmilniki v avtomatiki'] },
      { name: 'PODPORNA ZNANJA', subjects: ['Digitalne tehnike', 'Osnove elektronike', 'Analiza II', 'Mikrokrmilniki', 'Izbirni matematični predmet', 'Izbirni predmeti'] }
    ];
var vs = [
      { name: 'SENZORJI', subjects: ['Senzorska tehnika I', 'Senzorska tehnika II', 'Standardizacija in zagotavljanje kakovosti'] },
      { name: 'SISTEM ZA VODENJE', subjects: ['Obdelava signalov', 'Krmilniki in mikroračunalniki', 'Krmilna tehnika', 'Regulacijska tehnika I', 'Regulacijska tehnika II', 'Modeliranje in simulacije', 'Robotika I', 'Avtomatizacija industrijskih obratov'] },
      { name: 'AKTUATORJI', subjects: ['Gradniki elektronskih sistemov', 'Elektromehanski pretvorniki', 'Aktuatorska tehnika'] },
      { name: 'VIR ENERGIJE', subjects: ['Industrijska elektronika', 'Sistemi močnostne elektronike'] },
      { name: 'ITK', subjects: ['Komunikacije v avtomatiki'] },
      { name: 'PODPORNA ZNANJA', subjects: ['Digitalna tehnika', 'Informacijska tehnika in dokumentiranje', 'Analiza II', 'Izbirni predmeti I, II, III'] }
    ];
var mag = [
      { name: 'SENZORJI', subjects: ['Senzorski sistemi', 'Optoelektronika', 'Strojni vid'] },
      { name: 'SISTEM ZA VODENJE', subjects: ['Snovanje sistemov vodenja', 'Napredni regulacijski sistemi', 'Inteligentno vodenje proizvodnih postopkov', 'Robotski sistemi', 'Vgrajeni sistemi'] },
      { name: 'AKTUATORJI', subjects: ['Pretvarjanje energije', 'Elektronski elementi'] },
      { name: 'VIR ENERGIJE', subjects: ['Energetska elektronika', 'Optimizacija v elektroenergetiki'] },
      { name: 'ITK', subjects: ['Sistemi daljinskega vodenja', 'Internet stvari in umetna inteligenca za vgrajene sisteme', 'Mobilni in vseprisotni elektronski sistemi'] },
      { name: 'PODPORNA ZNANJA', subjects: ['Teorija elektromagnetnega polja', 'Elektrodinamika', 'Elektronski sistemi za vesoljske aplikacije', 'Kakovost, zanesljivost in preizkušanje'] }
    ];
var programmes = { un: un, vs: vs, mag: mag };
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function render(){
  var h='';
  data.forEach(function(d){
    var on=d.id===state.node;
    h+='<button type="button" data-node="'+d.id+'" aria-pressed="'+on+'" class="loop-node">'
      +'<span class="loop-node-number">'+d.num+'</span>'
      +'<span class="loop-node-label">'+esc(d.label)+'</span></button>';
  });
  document.getElementById('nodes').innerHTML=h;
  var sel=data.filter(function(d){return d.id===state.node;})[0];
  document.querySelectorAll('[data-sel]').forEach(function(el){el.textContent=sel[el.getAttribute('data-sel')];});
  document.getElementById('selsubj').innerHTML=sel.subjects.map(function(s){
    return '<li class="subject-list-item"><span aria-hidden="true" class="subject-marker"></span><span>'+esc(s)+'</span></li>';
  }).join('');
  document.getElementById('tabs').innerHTML=[['un','Univerzitetni'],['vs','Visokošolski strokovni'],['mag','Magistrski']].map(function(t){
    var on=t[0]===state.tab;
    return '<button type="button" data-tab="'+t[0]+'" aria-pressed="'+on+'" class="study-tab">'+t[1]+'</button>';
  }).join('');
  document.getElementById('curr').innerHTML=(programmes[state.tab]||un).map(function(c){
    return '<div class="curriculum-card"><p class="curriculum-title">'+c.name+'</p><ul class="curriculum-subjects">'
      +c.subjects.map(function(s){return '<li class="curriculum-subject">'+esc(s)+'</li>';}).join('')+'</ul></div>';
  }).join('');
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-node],[data-tab]'); if(!b) return;
  if(b.dataset.node) state.node=b.dataset.node;
  else {
    state.tab=b.dataset.tab;
    document.querySelector('.curriculum-disclosure').open=true;
  }
  render();
  var f=document.querySelector(b.dataset.node?'[data-node="'+state.node+'"]':'[data-tab="'+state.tab+'"]'); if(f) f.focus();
});
render();
})();
