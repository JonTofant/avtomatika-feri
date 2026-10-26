// Study programme tabs.
(function(){
var state={tab:'un'};
// Study programmes of the Avtomatika in robotika direction.
// Source: accredited curricula on moja.um.si (UN 0000308, VS 0000309).
// Subject: [name, block, short description, ECTS]. Subjects of the Institute of
// Automation have a block and are highlighted; the rest of the programme has none.
// Elective pools list highlighted institute subjects in `pick`, the rest in `other`.
var blocks = {
      senzorji: 'Senzorji', vodenje: 'Vodenje', aktuatorji: 'Aktuatorji',
      energija: 'Energija', itk: 'ITK', robotika: 'Robotika'
    };
var programs = {
  un: {
    tab: ['Univerzitetni', '3 leta · smer od 4. semestra'],
    ects: 6,
    facts: [['3 leta', '180 ECTS, univerzitetni program'], ['4. semester', 'Takrat izbereš smer Avtomatika in robotika'], ['Projekt', 'Praktikum v avtomatiki in robotiki']],
    banner: ['Praktikum v avtomatiki in robotiki – projekt', '<strong>Znanje preizkusiš v praksi.</strong> V svojem projektu.'],
    note: 'Predmeti so iz <a href="https://moja.um.si/studijski-programi/Strani/akreditacija.aspx?jezik=S&amp;deli=D&amp;program=0000308&amp;fakulteta=FERI">akreditiranega predmetnika UN Elektrotehnika</a>.',
    first: { title: 'Temelji', text: 'Matematika, fizika, elektrotehnika in programiranje. Skupno vsem smerem.',
      subjects: ['Analiza I', 'Diferencialne enačbe', 'Fizika I', 'Fizika valovanja', 'Fizika snovi', 'Osnove elektrotehnike I', 'Osnove elektrotehnike II', 'Elektrotehnični materiali', 'Meritve v elektrotehniki', 'Programiranje za elektrotehnike I', 'Programiranje za elektrotehnike II'] },
    years: [
      { label: '2. LETNIK', title: 'Izbereš smer', text: 'Zimski semester je skupen vsem smerem. V poletnem začneš s predmeti avtomatike.',
        z: [
          ['Signali', 'senzorji', 'Kako iz meritve izluščiš uporabno informacijo.'],
          ['Digitalna tehnika'], ['Osnove elektronike'], ['Električni in elektromehanski pretvorniki'], ['Linearna algebra']
        ],
        p: [
          ['Senzorji', 'senzorji', 'Kako naprava izmeri temperaturo, položaj, silo ali razdaljo.'],
          ['Teorija sistemov', 'vodenje', 'Kako opišeš in napoveš obnašanje dinamičnih sistemov.'],
          ['Regulacije I', 'vodenje', 'Povratna zanka: naprava sama popravlja svoje napake.'],
          ['Modeliranje in identifikacije', 'vodenje', 'Iz meritev zgradiš matematični model naprave.'],
          ['Mikrokrmilniki', 'vodenje', 'Programiraš čip, ki bere senzorje in poganja motorje.']
        ] },
      { label: '3. LETNIK', title: 'Robotika in projekt', text: 'Robote vodiš, sisteme povežeš v omrežje in zgradiš svoj projekt.',
        z: [
          ['Osnove robotike', 'robotika', 'Kinematika in vodenje robotske roke.'],
          ['Regulacije II', 'vodenje', 'Zahtevnejši regulatorji za hitre in natančne sisteme.'],
          ['Gradniki sistemov vodenja', 'aktuatorji', 'Ojačevalniki, pretvorniki in pogoni, iz katerih sestaviš sistem vodenja.'],
          ['Industrijska elektronika', 'energija', 'Elektronika, ki napaja in krmili motorje ter stroje.'],
          ['Izbirni predmet ŠP']
        ],
        p: [
          ['Praktikum v avtomatiki in robotiki'], ['Praktično usposabljanje'], ['Projekt'],
          ['Izbirni predmet iz nabora izbirnih predmetov ŠP'], ['Prosto izbirni predmet']
        ],
        electives: { text: 'Izbirni predmet iz nabora 6. semestra.',
          pick: [
            ['Komunikacije v avtomatiki', 'itk', 'Industrijska omrežja, prek katerih se naprave pogovarjajo.'],
            ['Digitalni signalni krmilniki v avtomatiki', 'itk', 'Hitri procesorji, ki v realnem času vodijo motorje in pretvornike.']
          ],
          other: ['Elektronska vezja', 'Proizvodnja električne energije in gospodarjenje', 'Računalniško načrtovanje vezij', 'Elektrodinamika', 'Načrtovanje tiskanih vezij in elektromagnetna združljivost', 'Načrtovanje elektromagnetnih naprav', 'Servosistemi I', 'Verjetnost'] } }
    ]
  },
  vs: {
    tab: ['Visokošolski strokovni', '3 leta · praksa v podjetju'],
    ects: 5,
    facts: [['3 leta', '180 ECTS, visokošolski strokovni program'], ['3. semester', 'Takrat izbereš smer Avtomatika in robotika'], ['15 ECTS', 'Praktično usposabljanje v podjetju']],
    banner: ['Praktično usposabljanje – 15 ECTS', '<strong>Zadnji semester delaš v podjetju.</strong> Na pravih napravah.'],
    note: 'Predmeti so iz <a href="https://moja.um.si/studijski-programi/Strani/akreditacija.aspx?jezik=S&amp;deli=D&amp;program=0000309&amp;fakulteta=FERI">akreditiranega predmetnika VS Elektrotehnika</a>.',
    first: { title: 'Temelji', text: 'Matematika, fizika, elektrotehnika in računalništvo. Skupno vsem smerem.',
      subjects: ['Matematika I', 'Matematika II', 'Fizika I', 'Fizika II', 'Osnove elektrotehnike I', 'Osnove elektrotehnike II', 'Meritve', 'Materiali in tehnologije', 'Računalništvo', 'Internetne tehnologije', 'Prosto izbirni predmet I'] },
    years: [
      { label: '2. LETNIK', title: 'Izbereš smer', text: 'Ves letnik je posvečen avtomatiki: od senzorja do krmilnika.',
        z: [
          ['Obdelava signalov', 'senzorji', 'Filtriraš šum in iz meritev izluščiš uporabno informacijo.'],
          ['Standardizacija in zagotavljanje kakovosti', 'senzorji', 'Kako zagotoviš, da izdelek deluje zanesljivo in po standardih.'],
          ['Gradniki elektronskih sistemov'], ['Elektromehanski pretvorniki'], ['Digitalna tehnika'],
          ['Računalniško podprto načrtovanje in dokumentiranje']
        ],
        p: [
          ['Senzorska tehnika I', 'senzorji', 'Senzorje izbereš, priključiš in umeriš.'],
          ['Krmilniki in mikroračunalniki', 'vodenje', 'Programiraš krmilnik, ki vodi napravo.'],
          ['Krmilna tehnika', 'vodenje', 'PLC-ji, ki vodijo tekoče trakove in stroje.'],
          ['Aktuatorska tehnika', 'aktuatorji', 'Motorji, ventili in pnevmatika v praksi.'],
          ['Industrijska elektronika', 'energija', 'Elektronika, ki napaja in krmili motorje ter stroje.'],
          ['Komunikacije v avtomatiki', 'itk', 'Industrijska omrežja, prek katerih se naprave pogovarjajo.']
        ] },
      { label: '3. LETNIK', title: 'Robotika in industrija', text: 'Robote in proizvodne linije vodiš, nato znanje preizkusiš v podjetju.',
        z: [
          ['Robotika I', 'robotika', 'Programiraš industrijskega robota.'],
          ['Regulacijska tehnika I', 'vodenje', 'Načrtuješ regulator, ki napravo drži na želeni vrednosti.'],
          ['Modeliranje in simulacije', 'vodenje', 'Napravo preizkusiš v simulaciji, preden jo zgradiš.'],
          ['Avtomatizacija industrijskih obratov', 'vodenje', 'Kako deluje avtomatizirana tovarna.'],
          ['Izbirni predmet I'], ['Prosto izbirni predmet II']
        ],
        p: [
          ['Praktično usposabljanje', null, null, 15], ['Diplomsko delo', null, null, 10], ['Izbirni predmet II']
        ],
        electives: { text: 'Izbirna predmeta I in II izbereš iz nabora izbirnih predmetov.',
          pick: [
            ['Senzorska tehnika II', 'senzorji', 'Zahtevnejši merilni sistemi in sodobne senzorske tehnologije.'],
            ['Sistemi močnostne elektronike', 'energija', 'Pretvorniki, ki krmilijo energijo za motorje, baterije in sončne elektrarne.'],
            ['Regulacijska tehnika II', 'vodenje', 'Naprednejše metode vodenja za zahtevnejše procese.']
          ],
          other: ['Energetski trg', 'Praktikum iz programirljivih logičnih vezij', 'Načrtovanje elektronskih sistemov', 'Računalniško vodenje procesov', 'Multimedijsko omreženje', 'Sodobne storitve v telekomunikacijah', 'Linearna algebra', 'Akustika', 'Razsvetljava', 'Mobilne komunikacije'] } }
    ]
  }
};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function render(){
  document.getElementById('tabs').innerHTML=['un','vs'].map(function(id){
    var on=id===state.tab;
    return '<button type="button" data-tab="'+id+'" aria-pressed="'+on+'" class="study-tab">'
      +'<span class="study-tab-title">'+programs[id].tab[0]+'</span><span class="study-tab-text">'+programs[id].tab[1]+'</span></button>';
  }).join('');
  var p=programs[state.tab];
  document.getElementById('facts').innerHTML=p.facts.map(function(f){
    return '<li class="study-fact"><span class="study-fact-value">'+esc(f[0])+'</span><span class="study-fact-text">'+esc(f[1])+'</span></li>';
  }).join('');
  document.getElementById('legend').innerHTML=Object.keys(blocks).map(tag).join('');
  document.getElementById('curr').innerHTML=renderFirst(p.first)
    +'<ol class="study-years" aria-label="Predmeti 2. in 3. letnika">'+p.years.map(function(y){return renderYear(y,p);}).join('')+'</ol>';
  document.getElementById('banner-title').textContent=p.banner[0];
  document.getElementById('banner-text').innerHTML=p.banner[1];
  document.getElementById('study-note').innerHTML=p.note;
}
function tag(b){return '<span class="block-tag block-'+b+'">'+blocks[b]+'</span>';}
function renderFirst(y){
  return '<div class="study-first"><div class="study-first-copy"><p class="curriculum-title">1. LETNIK</p>'
    +'<h3 class="study-year-title">'+esc(y.title)+'</h3><p class="study-year-text">'+esc(y.text)+'</p></div>'
    +'<ul class="study-chips">'+y.subjects.map(function(s){return '<li class="study-chip">'+esc(s)+'</li>';}).join('')+'</ul></div>';
}
function renderSubject(s,p,elective){
  var ects=(s[3]||p.ects)+' ECTS', kind=elective||/izbirni/i.test(s[0])?'IZBIRNI':'OBVEZNI';
  if(!s[1]) return '<li class="study-subject"><span class="study-subject-name">'+esc(s[0])+'</span>'
    +'<span class="study-subject-meta">'+kind+' · '+ects+'</span></li>';
  return '<li class="study-subject is-ar block-'+s[1]+(elective?' is-elective':'')+'"><span class="study-subject-name">'+esc(s[0])+'</span>'+tag(s[1])
    +'<span class="study-subject-meta">'+kind+' · '+ects+'</span>'
    +(s[2]?'<span class="study-subject-text">'+esc(s[2])+'</span>':'')+'</li>';
}
function renderYear(y,p){
  var h='<li class="study-year"><p class="curriculum-title">'+y.label+'</p>'
    +'<h3 class="study-year-title">'+esc(y.title)+'</h3><p class="study-year-text">'+esc(y.text)+'</p>';
  [['z','ZIMSKI SEMESTER'],['p','POLETNI SEMESTER']].forEach(function(sem){
    h+='<p class="study-semester">'+sem[1]+'</p><ul class="study-subjects">'
      +y[sem[0]].map(function(s){return renderSubject(s,p);}).join('')+'</ul>';
  });
  if(y.electives){
    h+='<div class="study-electives"><p class="study-semester">IZBIRNI PREDMETI</p><p class="study-year-text">'+esc(y.electives.text)+'</p>'
      +'<ul class="study-subjects">'+y.electives.pick.map(function(s){return renderSubject(s,p,true);}).join('')+'</ul>'
      +'<p class="study-more"><span class="mono-label">DRUGI IZBIRNI</span> '+y.electives.other.map(esc).join(' · ')+'</p></div>';
  }
  return h+'</li>';
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-tab]'); if(!b) return;
  state.tab=b.dataset.tab;
  render();
  var f=document.querySelector('[data-tab="'+state.tab+'"]'); if(f) f.focus();
});
render();
})();
