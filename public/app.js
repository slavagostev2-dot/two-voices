const CFG={
  url:'https://fftnpeyfhchacmvgznvx.supabase.co',
  key:'sb_publishable_7u3lCI7Jj9ECpSAMYgP6Cw_uismT9Q6',
  poll:5000,
  version:'2026-07-v3'
};

const dims={
  trust:{name:'Доверие',desc:'честность, надёжность и чувство безопасности'},
  communication:{name:'Общение',desc:'прямота, слышание и ясность ожиданий'},
  conflict:{name:'Конфликты',desc:'как вы спорите и возвращаете контакт'},
  support:{name:'Поддержка',desc:'ощущение команды, принятия и опоры'},
  closeness:{name:'Близость',desc:'тепло, нежность и эмоциональный контакт'},
  boundaries:{name:'Границы',desc:'автономия, личное пространство и уважение к «нет»'},
  jealousy:{name:'Ревность и безопасность',desc:'спокойствие без контроля и постоянных доказательств'},
  money:{name:'Деньги',desc:'прозрачность, привычки и финансовые договорённости'},
  daily:{name:'Быт',desc:'справедливость нагрузки и повседневная координация'},
  future:{name:'Будущее',desc:'совместимость направления и важных жизненных решений'}
};

const qs=[
  {d:'trust',t:'Я могу сказать партнёру неприятную правду, не опасаясь, что честность разрушит контакт.'},
  {d:'trust',t:'В важной ситуации я чувствую, что действительно могу положиться на партнёра.'},
  {d:'trust',t:'Мне часто приходится перепроверять слова, обещания или намерения партнёра.',r:true},

  {d:'communication',t:'Мы обсуждаем ожидания до того, как они превращаются в накопленную обиду.'},
  {d:'communication',t:'Во время важного разговора я чувствую, что меня не просто слушают, а стараются понять.'},
  {d:'communication',t:'Сложные разговоры у нас часто заканчиваются недосказанностью, уходом от темы или угадыванием мыслей друг друга.',r:true},

  {d:'conflict',t:'После ссоры мы умеем вернуться к теме спокойнее и искать решение, а не продолжать борьбу.'},
  {d:'conflict',t:'Во время конфликтов между нами случаются оскорбления, угрозы, запугивание или намеренное наказание молчанием.',r:true,flag:'safety'},
  {d:'conflict',t:'В споре кому-то из нас важнее любой ценой оказаться правым, чем понять проблему.',r:true},

  {d:'support',t:'Партнёр замечает мои усилия и даёт почувствовать, что мой вклад важен.'},
  {d:'support',t:'Когда появляется внешняя проблема, мы чаще ощущаем себя одной командой, а не двумя отдельными людьми.'},
  {d:'support',t:'Мои слабости, ошибки или уязвимые признания иногда используются против меня.',r:true,flag:'safety'},

  {d:'closeness',t:'Мне хватает тепла, нежности и проявлений привязанности между нами.'},
  {d:'closeness',t:'Мы можем спокойно говорить о физической и эмоциональной близости, желаниях и том, чего каждому не хватает.'},
  {d:'closeness',t:'Я чувствую себя желанным(ой), важным(ой) и эмоционально близким(ой) партнёру.'},

  {d:'boundaries',t:'В отношениях достаточно места для моих друзей, интересов и времени на себя.'},
  {d:'boundaries',t:'Когда я хочу побыть отдельно или говорю «нет», партнёр давит, обижается или заставляет чувствовать вину.',r:true,flag:'boundary'},
  {d:'boundaries',t:'Для спокойствия в отношениях нам приходится проверять переписки, местоположение или подробно контролировать действия друг друга.',r:true,flag:'control'},

  {d:'jealousy',t:'Я в целом чувствую себя спокойно, когда партнёр общается с другими людьми без меня.'},
  {d:'jealousy',t:'Мы можем говорить о ревности без допросов, обвинений и попыток ограничить друг друга.'},
  {d:'jealousy',t:'Мне приходится регулярно оправдываться или доказывать верность, даже когда для подозрений нет конкретной причины.',r:true,flag:'control'},

  {d:'money',t:'Мы можем открыто обсуждать доходы, расходы, долги, накопления и крупные покупки.'},
  {d:'money',t:'Разница в наших финансовых привычках регулярно становится источником напряжения или скрытых претензий.',r:true},
  {d:'money',t:'Деньги, доступ к ним или финансовая зависимость используются в отношениях как способ давления или контроля.',r:true,flag:'control'},

  {d:'daily',t:'Повседневные обязанности и организационная нагрузка распределяются между нами достаточно справедливо.'},
  {d:'daily',t:'Мы умеем договариваться о быте, отдыхе и личном времени до того, как раздражение накопится.'},
  {d:'daily',t:'Один из нас несёт заметно больше бытовой или «невидимой» организационной нагрузки, чем второй.',r:true},

  {d:'future',t:'Наши представления о ближайших нескольких годах в основном совместимы.'},
  {d:'future',t:'Мы можем обсуждать семью, место жизни, работу и другие большие решения без давления и избегания.'},
  {d:'future',t:'Я понимаю главные приоритеты и принципиальные границы партнёра относительно будущего — и они в целом совместимы с моими.'}
];

const optionLabels=['Совсем не согласен(на)','Скорее не согласен(на)','По-разному / не уверен(а)','Скорее согласен(на)','Полностью согласен(на)'];
const fresh=()=>({
  mode:null,names:['',''],births:['',''],start:'',partner:0,q:0,
  answers:[Array(qs.length).fill(null),Array(qs.length).fill(null)],
  remote:{room:'',token:'',role:'',partnerUrl:'',doneA:false,doneB:false,timer:null}
});
let S=fresh();

const $=id=>document.getElementById(id);
const app=$('app'),landing=$('landing'),appSec=$('appSection'),resSec=$('resultsSection');
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));

function show(which){
  landing.classList.toggle('hidden',which!=='landing');
  appSec.classList.toggle('hidden',which!=='app');
  resSec.classList.toggle('hidden',which!=='results');
  window.scrollTo({top:0,behavior:'smooth'});
}
function openMode(){show('app');renderMode()}

function renderMode(){
  app.innerHTML=`<div class="step">Шаг 1 · формат</div><h2>Как вы хотите пройти?</h2><p class="sub">В обоих режимах ответы партнёров скрыты друг от друга до общего результата.</p><div class="mode-grid"><button class="mode" onclick="chooseMode('local')"><span class="mode-icon">⇄</span><strong>На одном устройстве</strong><small>Первый отвечает, затем передаёт телефон второму. Ответы первого не показываются.</small></button><button class="mode" onclick="chooseMode('remote')"><span class="mode-icon">↗</span><strong>С разных устройств</strong><small>Создаётся отдельная секретная ссылка для каждого. Результат откроется после обеих анкет.</small></button></div>`;
}
function chooseMode(m){S.mode=m;renderProfile()}

function renderProfile(){
  app.innerHTML=`<div class="step">Шаг 2 · о вас</div><h2>Кто проходит тест?</h2><p class="sub">Для основного анализа достаточно имён. Остальные поля необязательны и используются только для дополнительной персонализации.</p><div class="fields"><label class="field"><span>Первый партнёр</span><input id="na" maxlength="24" value="${esc(S.names[0])}" placeholder="Например, Аня"></label><label class="field"><span>Второй партнёр</span><input id="nb" maxlength="24" value="${esc(S.names[1])}" placeholder="Например, Максим"></label><label class="field"><span>Дата рождения первого · необязательно</span><input id="ba" type="date" value="${esc(S.births[0])}"><small>Нужна только для развлекательного астро-бонуса.</small></label><label class="field"><span>Дата рождения второго · необязательно</span><input id="bb" type="date" value="${esc(S.births[1])}"><small>Если одной из дат нет, астро-блок вообще не показывается.</small></label><label class="field wide"><span>Месяц начала отношений · необязательно</span><input id="st" type="month" value="${esc(S.start)}"></label><div class="profile-note">Даты рождения не влияют на индекс пары, совместимость, сильные стороны или зоны внимания. Астрология будет отдельно помечена как развлекательная интерпретация.</div></div><div id="err" class="error"></div><button class="btn primary full" onclick="saveProfile()">${S.mode==='remote'?'Создать пару':'Перейти к вопросам'} →</button>`;
}

function validBirth(v){return !v||new Date(v+'T00:00:00')<=new Date()}
async function saveProfile(){
  const a=$('na').value.trim(),b=$('nb').value.trim(),ba=$('ba').value,bb=$('bb').value,st=$('st').value;
  if(!a||!b){$('err').textContent='Укажите имена обоих партнёров.';return}
  if(!validBirth(ba)||!validBirth(bb)){$('err').textContent='Дата рождения не может быть в будущем.';return}
  S.names=[a,b];S.births=[ba,bb];S.start=st;S.partner=0;S.q=0;
  S.answers=[Array(qs.length).fill(null),Array(qs.length).fill(null)];
  if(S.mode==='local'){persist();renderQuestion();return}
  try{
    app.innerHTML='<div class="center"><div class="wait-dot"></div><h2>Создаём пару…</h2><p class="sub">Генерируем две независимые секретные ссылки.</p></div>';
    const r=await rpc('create_couple_session',{
      p_name_a:a,p_name_b:b,p_birth_a:ba||null,p_birth_b:bb||null,p_start_month:st||null,p_question_version:CFG.version
    });
    S.remote={...S.remote,room:r.room_code,token:r.token_a,role:'a',partnerUrl:remoteUrl(r.room_code,r.token_b)};
    localStorage.setItem('tv-partner:'+r.room_code,S.remote.partnerUrl);
    history.replaceState({},'',remoteUrl(r.room_code,r.token_a));
    renderInvite();
  }catch(e){renderProfile();$('err').textContent=e.message}
}

function renderInvite(){
  app.innerHTML=`<div class="center"><div class="big-icon">↗</div><div class="step">Пара создана</div><h2>Отправьте ссылку ${esc(S.names[1])}</h2><p class="sub">Это персональная ссылка второго участника. Не публикуйте её открыто: она даёт доступ к анкете этой пары.</p><div class="share"><input id="shareUrl" readonly value="${esc(S.remote.partnerUrl)}"><button class="btn secondary" onclick="copyShare()">Копировать</button></div><div id="copyStatus" class="error"></div><button class="btn primary" onclick="startRemoteQuiz()">Начать мою часть →</button></div>`;
}
async function copyShare(){
  const i=$('shareUrl');
  try{await navigator.clipboard.writeText(i.value);$('copyStatus').style.color='var(--ok)';$('copyStatus').textContent='Ссылка скопирована.'}
  catch{i.select();document.execCommand('copy');$('copyStatus').textContent='Ссылка выделена — скопируйте её.'}
}
function startRemoteQuiz(){S.partner=S.remote.role==='b'?1:0;S.q=0;renderQuestion()}

function renderQuestion(){
  const q=qs[S.q],v=S.answers[S.partner][S.q];
  const all=S.mode==='local'?qs.length*2:qs.length,done=S.q+(S.mode==='local'?S.partner*qs.length:0),p=Math.round(done/all*100);
  app.innerHTML=`<div class="progress"><i style="width:${p}%"></i></div><div class="q-topic">${dims[q.d].name}</div><div class="qhead"><div><div class="step">Отвечает: ${esc(S.names[S.partner])}</div><h2>${esc(q.t)}</h2></div><div class="qnum">${S.q+1} / ${qs.length}</div></div><p class="sub">Отвечайте про ваши отношения в последние месяцы, а не про то, как «должно быть».</p><div class="scale">${[1,2,3,4,5].map((n,i)=>`<button class="${v===n?'selected':''}" onclick="pick(${n})"><b>${n}</b><span>${optionLabels[i]}</span></button>`).join('')}</div><div id="qerr" class="error"></div><div class="nav"><button class="btn ghost" onclick="backQ()">← Назад</button><button class="btn primary" ${v==null?'disabled':''} onclick="nextQ()">${S.q===qs.length-1?'Завершить':'Дальше'} →</button></div>`;
}
function pick(n){S.answers[S.partner][S.q]=n;if(S.mode==='local')persist();renderQuestion()}
function backQ(){
  if(S.q>0){S.q--;renderQuestion()}
  else if(S.mode==='local'&&S.partner===0)renderProfile();
  else if(S.mode==='remote'&&S.remote.role==='a')renderInvite();
  else renderRemoteWelcome();
}
async function nextQ(){
  if(S.answers[S.partner][S.q]==null)return;
  if(S.q<qs.length-1){S.q++;renderQuestion();return}
  if(S.mode==='local'){if(S.partner===0)renderHandoff();else showResults()}
  else await submitRemote();
}
function renderHandoff(){
  app.innerHTML=`<div class="center"><div class="big-icon">⇄</div><div class="step">Первая версия готова</div><h2>Теперь очередь: ${esc(S.names[1])}</h2><p class="sub">Ответы ${esc(S.names[0])} скрыты. Передайте устройство второму участнику — именно независимость ответов делает сравнение интересным.</p><button class="btn primary" onclick="secondPartner()">Я второй партнёр →</button></div>`;
}
function secondPartner(){S.partner=1;S.q=0;renderQuestion()}
function renderRemoteWelcome(){
  app.innerHTML=`<div class="center"><div class="big-icon">✦</div><div class="step">Вас пригласили</div><h2>${esc(S.names[S.partner])}, ваша версия отношений</h2><p class="sub">30 вопросов. Партнёр не увидит ваши ответы по отдельности. После завершения обоих участников откроется общий разбор.</p><button class="btn primary" onclick="startRemoteQuiz()">Начать вопросы →</button></div>`;
}

async function submitRemote(){
  try{
    const r=await rpc('submit_couple_answers',{p_room_code:S.remote.room,p_token:S.remote.token,p_answers:S.answers[S.partner],p_question_version:CFG.version});
    applySession(r);
    if(r.completed_a&&r.completed_b&&r.answers_a&&r.answers_b)showResults();else renderWaiting();
  }catch(e){$('qerr').textContent='Не удалось сохранить ответы: '+e.message}
}
function renderWaiting(){
  app.innerHTML=`<div class="center"><div class="wait-dot"></div><div class="step">Ваша часть готова</div><h2>Ждём второй голос</h2><p class="sub">Страница проверяет состояние автоматически. Когда обе анкеты будут готовы, полный отчёт откроется здесь.</p><div id="waitStatus" class="note">Проверяем статус…</div>${S.remote.role==='a'&&S.remote.partnerUrl?`<div class="share"><input id="shareUrl" readonly value="${esc(S.remote.partnerUrl)}"><button class="btn secondary" onclick="copyShare()">Копировать ссылку</button></div><div id="copyStatus" class="error"></div>`:''}<button class="btn ghost" onclick="checkStatus()">Проверить сейчас</button></div>`;
  startPoll();
}
function startPoll(){stopPoll();S.remote.timer=setInterval(()=>checkStatus(),Math.max(3000,CFG.poll));checkStatus()}
function stopPoll(){if(S.remote.timer){clearInterval(S.remote.timer);S.remote.timer=null}}
async function checkStatus(){
  try{
    const r=await rpc('get_couple_session',{p_room_code:S.remote.room,p_token:S.remote.token,p_question_version:CFG.version});
    applySession(r);
    if(r.completed_a&&r.completed_b&&r.answers_a&&r.answers_b){stopPoll();showResults();return}
    if($('waitStatus'))$('waitStatus').textContent='Второй участник ещё не завершил анкету.';
  }catch(e){if($('waitStatus'))$('waitStatus').textContent='Ошибка проверки: '+e.message}
}
function applySession(r){
  S.mode='remote';S.remote.room=r.room_code;S.remote.role=r.role;S.remote.doneA=!!r.completed_a;S.remote.doneB=!!r.completed_b;
  S.names=[r.name_a,r.name_b];S.births=[r.birth_a||'',r.birth_b||''];S.start=r.start_month||'';S.partner=r.role==='b'?1:0;
  if(r.answers_a)S.answers[0]=r.answers_a.map(Number);if(r.answers_b)S.answers[1]=r.answers_b.map(Number);
  if(r.role==='a'&&!S.remote.partnerUrl)S.remote.partnerUrl=localStorage.getItem('tv-partner:'+r.room_code)||'';
}
async function rpc(name,payload){
  const r=await fetch(CFG.url.replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:CFG.key,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const text=await r.text();let data;try{data=text?JSON.parse(text):null}catch{data=text}
  if(!r.ok)throw new Error(data?.message||data?.details||String(data||'Ошибка базы данных'));
  return Array.isArray(data)&&data.length===1?data[0]:data;
}
function baseUrl(){const u=new URL(location.href);u.search='';u.hash='';return u.toString()}
function remoteUrl(room,token){const u=new URL(baseUrl());u.searchParams.set('room',room);u.searchParams.set('token',token);return u.toString()}
async function restoreRemote(){
  const p=new URLSearchParams(location.search),room=p.get('room'),token=p.get('token');
  if(!room&&!token)return false;
  if(!room||!token){show('app');app.innerHTML='<div class="center"><h2>Ссылка неполная</h2><p class="sub">В ней отсутствует код пары или секретный ключ.</p><button class="btn primary" onclick="newTest()">На главную</button></div>';return true}
  show('app');app.innerHTML='<div class="center"><div class="wait-dot"></div><h2>Открываем пару…</h2></div>';
  try{
    S.remote.room=room;S.remote.token=token;
    const r=await rpc('get_couple_session',{p_room_code:room,p_token:token,p_question_version:CFG.version});
    applySession(r);
    if(r.completed_a&&r.completed_b&&r.answers_a&&r.answers_b){showResults();return true}
    if((r.role==='a'&&r.completed_a)||(r.role==='b'&&r.completed_b)){renderWaiting();return true}
    renderRemoteWelcome();return true;
  }catch(e){app.innerHTML=`<div class="center"><div class="big-icon">!</div><h2>Не удалось открыть пару</h2><p class="sub">${esc(e.message)}</p><button class="btn primary" onclick="newTest()">На главную</button></div>`;return true}
}
function persist(){localStorage.setItem('two-voices-local-v3',JSON.stringify({mode:S.mode,names:S.names,births:S.births,start:S.start,partner:S.partner,q:S.q,answers:S.answers,version:CFG.version}))}

function norm(i,val){return qs[i].r?6-val:val}
function questionAgreement(a,b){return clamp(100-Math.abs(a-b)*25)}
function questionQuality(a,b){return clamp(((a+b)/10)*100)}
function dimensionStats(){
  const out={};
  for(const d of Object.keys(dims)){
    const ids=qs.map((q,i)=>q.d===d?i:-1).filter(i=>i>=0);
    const na=ids.map(i=>norm(i,S.answers[0][i])),nb=ids.map(i=>norm(i,S.answers[1][i]));
    const agreement=clamp(avg(ids.map((i,j)=>questionAgreement(na[j],nb[j]))));
    const quality=clamp(avg(ids.map((i,j)=>questionQuality(na[j],nb[j]))));
    const a=clamp(avg(na)*20),b=clamp(avg(nb)*20);
    out[d]={agreement,quality,pair:clamp(agreement*.45+quality*.55),a,b,gap:Math.abs(a-b)};
  }
  return out;
}
function questionStats(){
  return qs.map((q,i)=>{const a=norm(i,S.answers[0][i]),b=norm(i,S.answers[1][i]);return{i,q,a,b,gap:Math.abs(a-b),agreement:questionAgreement(a,b),quality:questionQuality(a,b)}});
}
function individual(k,stats){const scores={};for(const d of Object.keys(dims))scores[d]=k===0?stats[d].a:stats[d].b;return{scores,overall:clamp(avg(Object.values(scores)))}}

function archetype(stats,alignment,quality){
  if(stats.closeness.pair>=82&&stats.conflict.pair<66)return{name:'Искра и гроза',teaser:'Между вами много притяжения, но напряжение иногда проживается слишком резко.',portrait:'Сильная близость сама по себе не отменяет сложного сценария конфликтов. Ваш ресурс — желание быть рядом; ваша задача — сделать споры безопаснее, чтобы яркость связи не оплачивалась эмоциональным истощением.'};
  if(stats.future.pair>=82&&stats.daily.pair<66)return{name:'Большие планы, маленькие трения',teaser:'Вы хорошо видите общее направление, но повседневность временами мешает ему наслаждаться.',portrait:'У пары есть представление о том, куда двигаться вместе, однако бытовая координация может съедать больше энергии, чем кажется. Вам полезнее чинить не «отношения вообще», а конкретные ежедневные договорённости.'};
  if(stats.support.pair>=82&&stats.communication.pair<66)return{name:'Сердцем рядом, словами мимо',teaser:'Поддержка есть, но не всегда получается донести её друг до друга словами.',portrait:'Вы способны быть опорой, однако часть напряжения рождается не из отсутствия заботы, а из того, как она выражается и обсуждается. Перевод чувств в конкретные просьбы может сильно изменить картину.'};
  if(stats.trust.pair>=82&&stats.boundaries.pair<66)return{name:'Близко, иногда слишком',teaser:'Связь прочная, но вопрос личного пространства требует более тонкой настройки.',portrait:'Высокая близость и доверие могут сосуществовать с разными потребностями в автономии. Для вашей пары особенно важно не путать любовь с постоянной доступностью и заранее договориться о праве каждого на отдельное пространство.'};
  if(alignment>=85&&quality>=80)return{name:'Тихая гавань',teaser:'Вы и хорошо оцениваете отношения, и во многом одинаково их понимаете.',portrait:'Это редкая комбинация: не только высокий общий фон, но и похожее восприятие того, что происходит между вами. Главный риск здесь — считать устойчивость автоматической; сильные стороны всё равно требуют внимания.'};
  if(quality>=76&&alignment<70)return{name:'Два ракурса — одна связь',teaser:'Отношения в целом ценны для обоих, но проживаете вы их заметно по-разному.',portrait:'У вас есть ресурс и привязанность, однако один и тот же эпизод может оставлять у каждого совершенно разное послевкусие. Самая важная задача — не спорить, чья версия «правильнее», а научиться признавать две реальности одновременно.'};
  if(alignment>=82&&quality<66)return{name:'Точки напряжения под гладью',teaser:'Вы довольно одинаково видите происходящее — и оба замечаете, что несколько важных сфер проседают.',portrait:'Здесь меньше проблемы в непонимании друг друга и больше — в самих условиях отношений. Плюс в том, что вам не нужно сначала доказывать наличие сложности: можно быстрее переходить к конкретным изменениям.'};
  if(alignment>=70&&quality>=68)return{name:'Одна команда, разные языки',teaser:'Основа выглядит устойчивой, но часть потребностей вы выражаете и считываете по-разному.',portrait:'Ваши отношения скорее держатся не на идеальном совпадении, а на способности оставаться командой при различиях. Чем конкретнее вы переводите ожидания в действия, тем сильнее становится эта модель.'};
  return{name:'Перекрёсток двух версий',teaser:'Сейчас между вашими оценками и потребностями есть заметная дистанция.',portrait:'Это не прогноз расставания и не ярлык. Скорее карта, показывающая, что несколько важных тем требуют не общего разговора «о наших отношениях», а отдельных, конкретных договорённостей.'};
}

function durationText(start){
  if(!start)return'';const [y,m]=start.split('-').map(Number);if(!y||!m)return'';
  const now=new Date(),months=(now.getFullYear()-y)*12+(now.getMonth()+1-m);if(months<0)return'';
  if(months<12)return`Вы вместе примерно ${months||1} мес.`;
  const years=Math.floor(months/12),rest=months%12;return`Вы вместе примерно ${years} ${years===1?'год':years<5?'года':'лет'}${rest?` и ${rest} мес.`:''}`;
}
function profileText(k,r){
  const sorted=Object.entries(r.scores).sort((a,b)=>b[1]-a[1]),top=sorted[0],low=sorted.at(-1);
  const tone=r.overall>=82?'В целом вы воспринимаете отношения как устойчивые и ресурсные.':r.overall>=68?'Вы видите хорошую основу, хотя несколько тем требуют большей ясности.':r.overall>=54?'Ваше восприятие неоднородно: рядом с сильными сторонами есть заметные зоны напряжения.':'Сейчас вы оцениваете несколько важных сторон отношений довольно низко; это повод внимательнее отнестись к собственному опыту, а не спорить с цифрой.';
  return `${tone} Наиболее уверенно для вас выглядит «${dims[top[0]].name}» (${top[1]}%), а сложнее всего — «${dims[low[0]].name}» (${low[1]}%).`;
}
function metric(d,s){return `<article class="metric"><div class="metric-top"><b>${dims[d].name}</b><strong>${s.pair}%</strong></div><div class="track"><div class="fill" style="width:${s.pair}%"></div></div><small class="sub">${dims[d].desc}</small><div class="metric-dual"><span>${esc(S.names[0])}: ${s.a}</span><span>${esc(S.names[1])}: ${s.b}</span><span>разница: ${s.gap}</span></div></article>`}
function indCard(k,r){return `<article class="ind-card"><header><div><div class="step">Индивидуальный профиль</div><h3>${esc(S.names[k])}</h3></div><strong>${r.overall}</strong></header><p class="profile-copy">${profileText(k,r)}</p><div class="ind-list">${Object.entries(r.scores).map(([d,n])=>`<div class="ind-row"><span>${dims[d].name}</span><div class="track"><div class="fill" style="width:${n}%"></div></div><b>${n}</b></div>`).join('')}</div></article>`}

function metaAxes(stats){
  const calc=keys=>clamp(avg(keys.map(k=>stats[k].pair)));
  return[
    ['Безопасность',calc(['trust','conflict','boundaries','jealousy']),'Можно ли быть честными, спорить и сохранять право на границы.'],
    ['Связь',calc(['support','closeness']),'Тепло, поддержка и ощущение эмоционального контакта.'],
    ['Координация',calc(['communication','money','daily']),'Как вы договариваетесь о словах, деньгах и повседневности.'],
    ['Направление',calc(['future']),'Насколько совместимы ключевые планы и большие решения.']
  ];
}
function rankList(items,type){
  return `<div class="rank-list">${items.map(([d,s],i)=>`<div class="rank-row"><i>0${i+1}</i><div><b>${dims[d].name}</b><p>${type==='best'?`Здесь у пары одновременно хороший общий фон и достаточно близкое восприятие.`:`Эта сфера получила один из самых низких итоговых показателей и заслуживает отдельного разговора.`}</p></div><strong>${s.pair}%</strong></div>`).join('')}</div>`;
}
function blindSpot(stats){
  const [d,s]=Object.entries(stats).sort((a,b)=>b[1].gap-a[1].gap)[0];
  const high=s.a>=s.b?0:1,low=high===0?1:0;
  if(s.gap<8)return{d,text:`По десяти сферам вы оцениваете отношения довольно похоже. Самая большая разница всё равно находится в теме «${dims[d].name}», но она умеренная (${s.gap} пунктов).`};
  return{d,text:`«${dims[d].name}» — место, где ваши две версии отношений расходятся сильнее всего. ${S.names[high]} оценивает эту сферу на ${high===0?s.a:s.b}, а ${S.names[low]} — на ${low===0?s.a:s.b}. Это хороший кандидат на разговор о конкретных эпизодах, а не о том, кто «прав».`};
}
function safetySignals(qsStats){
  return qsStats.filter(x=>x.q.flag&&(x.a<=2||x.b<=2)).sort((a,b)=>Math.min(a.a,a.b)-Math.min(b.a,b.b));
}
function signalCard(signals){
  if(!signals.length)return `<article class="signal-card good"><div class="step">Контрольные вопросы безопасности</div><h3>Явного низкого сигнала не выделилось</h3><p>По вопросам про угрозы, давление, контроль и использование уязвимости против партнёра не появилось оценок в самой низкой зоне. Это не доказывает отсутствие проблем вне анкеты — только описывает ответы на эти конкретные вопросы.</p></article>`;
  const first=signals[0],who=first.a<=first.b?S.names[0]:S.names[1];
  return `<article class="signal-card attention"><div class="step">Стоит отнестись серьёзно</div><h3>Есть ответы в зоне повышенного внимания</h3><p>По одному или нескольким вопросам о давлении, контроле, угрозах или использовании уязвимости появилась низкая оценка. Самый заметный сигнал: «${esc(first.q.t)}» — особенно со стороны ${esc(who)}. Это не диагноз, но такую тему лучше не растворять в общем проценте совместимости.</p></article>`;
}

function zodiac(dateStr){
  if(!dateStr)return null;const d=new Date(dateStr+'T00:00:00'),m=d.getMonth()+1,day=d.getDate();
  const data=[
    ['Козерог','земля',m===12&&day>=22||m===1&&day<=19],['Водолей','воздух',m===1&&day>=20||m===2&&day<=18],
    ['Рыбы','вода',m===2&&day>=19||m===3&&day<=20],['Овен','огонь',m===3&&day>=21||m===4&&day<=19],
    ['Телец','земля',m===4&&day>=20||m===5&&day<=20],['Близнецы','воздух',m===5&&day>=21||m===6&&day<=20],
    ['Рак','вода',m===6&&day>=21||m===7&&day<=22],['Лев','огонь',m===7&&day>=23||m===8&&day<=22],
    ['Дева','земля',m===8&&day>=23||m===9&&day<=22],['Весы','воздух',m===9&&day>=23||m===10&&day<=22],
    ['Скорпион','вода',m===10&&day>=23||m===11&&day<=21],['Стрелец','огонь',m===11&&day>=22||m===12&&day<=21]
  ];
  const z=data.find(x=>x[2]);return z?{name:z[0],element:z[1]}:null;
}
function astroCopy(a,b){
  if(a.element===b.element)return `Оба знака относятся к стихии «${a.element}». В популярной астрологической традиции это описывают как похожий базовый темп и способы реагирования.`;
  const pair=new Set([a.element,b.element]);
  if(pair.has('огонь')&&pair.has('воздух'))return 'В популярной астрологии сочетание огня и воздуха считают динамичным: один добавляет импульс, другой — движение идей и общения.';
  if(pair.has('земля')&&pair.has('вода'))return 'В популярной астрологии землю и воду часто описывают как сочетание устойчивости и эмоциональной глубины.';
  if(pair.has('огонь')&&pair.has('вода'))return 'В популярной астрологии огонь и вода считаются контрастной связкой: эмоции и импульс могут усиливать друг друга, но требуют бережного обращения.';
  if(pair.has('земля')&&pair.has('воздух'))return 'В популярной астрологии землю и воздух считают связкой разных темпов: практичность встречается с потребностью в свободе, идеях и переменах.';
  return 'В популярной астрологии эту комбинацию описывают как сочетание разных способов чувствовать и действовать — с потенциалом дополнять друг друга.';
}
function astroBlock(){
  if(!S.births[0]||!S.births[1])return'';const a=zodiac(S.births[0]),b=zodiac(S.births[1]);if(!a||!b)return'';
  return `<section class="section-head"><div class="step">Дополнительный слой</div><h2>Астро-бонус</h2><p>Только потому, что вы указали обе даты рождения.</p></section><article class="astro-card"><div class="astro-pair"><div class="astro-person"><b>${esc(S.names[0])}</b><span>${a.name} · ${a.element}</span></div><div class="astro-plus">+</div><div class="astro-person"><b>${esc(S.names[1])}</b><span>${b.name} · ${b.element}</span></div></div><p>${astroCopy(a,b)}</p><div class="disclaimer"><b>Важно:</b> этот блок — развлекательная астрологическая интерпретация. Она не имеет доказательной силы и никак не входит в индекс пары, согласованность, качество отношений или рекомендации.</div></article>`;
}

function actionPlan(bottom,best){
  const actions={
    trust:'Выберите одну тему, где обычно появляется сомнение, и договоритесь о конкретном действии, которое повышает предсказуемость и доверие.',
    communication:'Проведите один разговор по правилу: сначала каждый 3 минуты описывает свой опыт без перебивания, затем второй пересказывает услышанное своими словами.',
    conflict:'Согласуйте стоп-сигнал для ссоры и правило возвращения к теме: когда именно вы продолжаете разговор после паузы.',
    support:'Каждый назовите два конкретных действия, которые лично для вас ощущаются как поддержка — не угадывайте их за партнёра.',
    closeness:'Отдельно обсудите, чего каждому сейчас хочется больше: времени вдвоём, нежности, сексуальной близости, слов или внимания.',
    boundaries:'Назовите по одной границе, которая помогает вам чувствовать себя свободнее внутри отношений, и договоритесь, как её уважать без обиды.',
    jealousy:'Отделите факты от тревоги: сформулируйте, какие договорённости дают безопасность, а какие проверки уже ощущаются контролем.',
    money:'Выберите одну финансовую тему — расходы, накопления, долги или крупные покупки — и сформулируйте понятное правило хотя бы на ближайший месяц.',
    daily:'Составьте список повторяющихся бытовых и организационных задач и проверьте, одинаково ли вы вообще видите их объём.',
    future:'Выберите одно большое решение и отдельно ответьте: чего я хочу, чего боюсь, что для меня принципиально, где готов(а) быть гибким(ой).'
  };
  return [actions[bottom[0][0]],actions[bottom[1][0]],`Сохраните то, что уже работает: в сфере «${dims[best[0][0]].name}» у вас один из сильнейших результатов. Назовите по одному поведению, которое создаёт эту силу, и повторите его осознанно в течение недели.`];
}
function talkQuestions(bottom,best,blind){
  return[
    `Что в сфере «${dims[bottom[0][0]].name}» каждый из нас хотел бы получать чаще — одним конкретным действием?`,
    `Где в теме «${dims[blind.d].name}» мы чаще всего описываем один и тот же эпизод совершенно по-разному?`,
    `Что из того, что я называю заботой или поддержкой, ты на самом деле почти не воспринимаешь как заботу?`,
    `Когда у нас особенно хорошо получается «${dims[best[0][0]].name}», что именно мы тогда делаем иначе?`,
    `Какое одно изменение на ближайшие семь дней даст каждому больше спокойствия или близости — и как мы поймём, что оно сработало?`
  ];
}

function showResults(){
  stopPoll();
  const stats=dimensionStats(),qst=questionStats();
  const entries=Object.entries(stats).sort((a,b)=>b[1].pair-a[1].pair),best=entries.slice(0,3),bottom=[...entries].reverse().slice(0,3);
  const alignment=clamp(avg(Object.values(stats).map(x=>x.agreement))),quality=clamp(avg(Object.values(stats).map(x=>x.quality))),overall=clamp(alignment*.45+quality*.55);
  const a=individual(0,stats),b=individual(1,stats),arch=archetype(stats,alignment,quality),blind=blindSpot(stats),signals=safetySignals(qst);
  const maxGap=[...qst].sort((x,y)=>y.gap-x.gap||x.quality-y.quality)[0];
  const bestMatch=[...qst].sort((x,y)=>x.gap-y.gap||y.quality-x.quality)[0];
  const warmDelta=Math.abs(a.overall-b.overall),warm=a.overall>=b.overall?0:1,cool=warm===0?1:0;
  const axes=metaAxes(stats),duration=durationText(S.start),actions=actionPlan(bottom,best),talk=talkQuestions(bottom,best,blind);
  show('results');
  $('resultsRoot').innerHTML=`
    <section class="result-hero"><article class="result-block result-title"><div class="eyebrow">Ваш совместный разбор</div><h1>${esc(S.names[0])} + ${esc(S.names[1])}</h1><div class="archetype-pill">Архетип: ${arch.name}</div><p class="lead"><b>${arch.teaser}</b> ${arch.portrait}</p>${duration?`<p class="sub">${duration}</p>`:''}</article><article class="result-block scorebox"><span>Индекс пары</span><strong>${overall}%</strong><small class="sub">Авторская эвристика: 45% согласованность восприятия + 55% средняя оценка качества отношений.</small><div class="score-pills"><div><b>${alignment}%</b><small>согласованность взглядов</small></div><div><b>${quality}%</b><small>качество по вашим оценкам</small></div></div></article></section>

    <section class="section-head"><div class="step">Самое интересное сначала</div><h2>Четыре вывода, которые обычно хочется обсудить сразу</h2></section>
    <section class="highlight-grid">
      <article class="insight"><div class="step">Кто оценивает отношения теплее</div><h3>${warmDelta<5?'Почти одинаково':esc(S.names[warm])+' — выше на '+warmDelta+' п.'}</h3><p>${warmDelta<5?'Ваши общие индивидуальные оценки очень близки. Здесь нет заметного разрыва восприятия.':`${esc(S.names[warm])} в среднем оценивает десять сфер выше, чем ${esc(S.names[cool])}. Это не означает «любит больше» — только показывает более позитивную текущую оценку отношений.`}</p><div class="compare-line"><span>${esc(S.names[0])}</span><strong>${a.overall} / ${b.overall}</strong><span>${esc(S.names[1])}</span></div></article>
      <article class="insight"><div class="step">Самое неожиданное расхождение</div><h3>${dims[maxGap.q.d].name} · разница ${maxGap.gap*20} п.</h3><p>«${esc(maxGap.q.t)}» Здесь ответы разошлись сильнее всего: ${esc(S.names[0])} — ${maxGap.a}/5, ${esc(S.names[1])} — ${maxGap.b}/5 после приведения шкалы.</p></article>
      <article class="insight"><div class="step">Самое сильное совпадение</div><h3>${dims[bestMatch.q.d].name} · ${bestMatch.agreement}% совпадения</h3><p>«${esc(bestMatch.q.t)}» Это один из вопросов, где ваши две версии отношений ближе всего друг к другу.</p></article>
      <article class="insight"><div class="step">Где вы живёте в разных версиях</div><h3>${dims[blind.d].name}</h3><p>${blind.text}</p></article>
    </section>

    <section class="section-head"><div class="step">10 сфер отношений</div><h2>Полная карта пары</h2><p>Итог каждой сферы учитывает и качество, и то, насколько похоже вы её воспринимаете.</p></section>
    <section class="grid10">${Object.entries(stats).map(([d,s])=>metric(d,s)).join('')}</section>

    <section class="section-head"><div class="step">Как устроена связь</div><h2>Четыре системы ваших отношений</h2></section>
    <section class="meta-grid">${axes.map(([n,v,t])=>`<article class="meta-card"><div class="step">${n}</div><strong>${v}%</strong><p>${t}</p></article>`).join('')}</section>

    <section class="section-head"><div class="step">Два отдельных голоса</div><h2>Как каждый из вас переживает эти отношения</h2></section>
    <section class="ind-grid">${indCard(0,a)}${indCard(1,b)}</section>

    <section class="section-head"><div class="step">Ресурсы и напряжение</div><h2>Что держит вас вместе — и что просит внимания</h2></section>
    <section class="dual-grid"><article class="list-card"><div class="step">Три главные опоры</div><h3>То, на что уже можно опираться</h3>${rankList(best,'best')}</article><article class="list-card"><div class="step">Три зоны внимания</div><h3>Не приговор, а приоритет разговора</h3>${rankList(bottom,'gap')}</article></section>

    <section class="section-head"><div class="step">Не растворяем важное в процентах</div><h2>Контрольные сигналы</h2></section>
    ${signalCard(signals)}

    ${astroBlock()}

    <section class="section-head"><div class="step">Практический выход</div><h2>Что попробовать в ближайшие 7 дней</h2></section>
    <article class="result-block"><div class="action-list">${actions.map((x,i)=>`<div class="action-item"><b>0${i+1}</b><div>${esc(x)}</div></div>`).join('')}</div></article>

    <section class="section-head"><div class="step">Вопросы вместо спора о цифрах</div><h2>Пять разговоров, которые дадут больше самого теста</h2></section>
    <article class="result-block">${talk.map((t,i)=>`<div class="talk"><i>0${i+1}</i><div>${esc(t)}</div></div>`).join('')}</article>

    <div class="footer-note result-block"><b>Как читать результат.</b> Это не психологическая диагностика, не предсказание продолжительности отношений и не способ определить «кто любит больше». Основные выводы строятся только из ваших ответов на текущую анкету. Низкий показатель — повод уточнить опыт, а не ярлык для человека или пары.</div>`;
}

function demoResult(){
  S=fresh();S.mode='local';S.names=['Аня','Максим'];S.births=['1997-04-14','1995-10-30'];S.start='2021-06';
  S.answers=[
    [5,5,2,4,4,2,3,1,2,5,5,1,5,4,5,4,2,2,4,4,1,4,2,1,3,4,3,5,4,5],
    [5,4,2,3,4,3,4,2,3,4,5,1,4,5,4,5,1,1,5,4,1,5,3,1,4,3,2,5,5,4]
  ];showResults();
}
async function shareResult(){
  const stats=dimensionStats(),alignment=clamp(avg(Object.values(stats).map(x=>x.agreement))),quality=clamp(avg(Object.values(stats).map(x=>x.quality))),overall=clamp(alignment*.45+quality*.55),arch=archetype(stats,alignment,quality);
  const text=`Два Голоса: ${S.names[0]} + ${S.names[1]} — ${overall}% · «${arch.name}». Согласованность взглядов ${alignment}%, оценка отношений ${quality}%.`;
  const data={title:'Два Голоса — результат пары',text,url:baseUrl()};
  try{
    if(navigator.share){await navigator.share(data);return}
    await navigator.clipboard.writeText(text+' '+baseUrl());if($('shareStatus'))$('shareStatus').textContent='Краткий результат скопирован.';
  }catch(e){if(e?.name!=='AbortError'&&$('shareStatus'))$('shareStatus').textContent='Не удалось поделиться автоматически.'}
}
async function deleteData(){
  if(S.mode==='remote'&&S.remote.room&&S.remote.token){
    if(!confirm('Удалить сетевую запись пары, дополнительные данные и оба набора ответов?'))return;
    try{await rpc('delete_couple_session',{p_room_code:S.remote.room,p_token:S.remote.token,p_question_version:CFG.version})}
    catch(e){alert('Не удалось удалить данные: '+e.message);return}
  }
  localStorage.removeItem('two-voices-local-v3');if(S.remote.room)localStorage.removeItem('tv-partner:'+S.remote.room);newTest();
}
function newTest(){
  stopPoll();localStorage.removeItem('two-voices-local-v3');S=fresh();history.replaceState({},'',baseUrl());show('landing');
}
restoreRemote();
