const CFG={
  url:'https://fftnpeyfhchacmvgznvx.supabase.co',
  key:'sb_publishable_7u3lCI7Jj9ECpSAMYgP6Cw_uismT9Q6',
  poll:5000,
  version:'2026-07-v2'
};

const dims={
  trust:{name:'Доверие',desc:'надёжность, честность и эмоциональная безопасность'},
  communication:{name:'Общение',desc:'умение слышать, говорить прямо и уточнять ожидания'},
  conflict:{name:'Конфликты',desc:'как вы проживаете напряжение и восстанавливаете контакт'},
  support:{name:'Поддержка',desc:'ощущение команды, участия и принятия'},
  closeness:{name:'Близость',desc:'тепло, нежность, контакт и взаимное желание близости'},
  boundaries:{name:'Границы',desc:'личное пространство, автономия и уважение к отказу'},
  jealousy:{name:'Ревность и безопасность',desc:'спокойствие в отношениях без контроля и постоянных проверок'},
  money:{name:'Деньги',desc:'прозрачность, договорённости и совместимость финансовых привычек'},
  daily:{name:'Быт',desc:'справедливость повседневной нагрузки и совместная жизнь'},
  future:{name:'Будущее',desc:'совместимость направлений, темпа и важных жизненных планов'}
};

const qs=[
  ['trust','Я могу честно говорить партнёру о том, что меня тревожит.'],
  ['trust','Я чувствую, что могу положиться на партнёра в важной ситуации.'],
  ['trust','Мне не приходится постоянно сомневаться в словах и намерениях партнёра.'],

  ['communication','Мы обсуждаем ожидания до того, как они превращаются в обиду.'],
  ['communication','Во время важного разговора я чувствую, что меня действительно слушают.'],
  ['communication','Я могу прямо попросить о том, что мне нужно, не боясь насмешки или обесценивания.'],

  ['conflict','После ссоры мы умеем возвращаться к теме спокойнее и искать решение.'],
  ['conflict','В споре мы избегаем унижения, угроз, намеренного игнорирования и давления.'],
  ['conflict','Даже при сильном несогласии мы стараемся решать проблему, а не победить друг друга.'],

  ['support','Партнёр замечает мои усилия и даёт почувствовать поддержку.'],
  ['support','Когда появляется проблема, мы способны действовать как команда.'],
  ['support','В этих отношениях мне есть место для уязвимости, слабости и ошибок.'],

  ['closeness','Мне хватает тепла, нежности и проявлений привязанности между нами.'],
  ['closeness','Мы можем спокойно говорить о физической и эмоциональной близости и своих желаниях.'],
  ['closeness','Я чувствую себя желанным(ой), важным(ой) и эмоционально близким(ой) партнёру.'],

  ['boundaries','В отношениях достаточно места для моих личных интересов, друзей и времени на себя.'],
  ['boundaries','Мои границы и мой отказ воспринимаются с уважением.'],
  ['boundaries','Мы можем быть близкими, не контролируя переписки, местоположение и каждый шаг друг друга.'],

  ['jealousy','Я в целом чувствую себя спокойно, когда партнёр общается с другими людьми без меня.'],
  ['jealousy','Мы можем обсуждать ревность без обвинений, допросов и попыток ограничить друг друга.'],
  ['jealousy','Мне не приходится регулярно доказывать свою верность или оправдываться без причины.'],

  ['money','Мы можем открыто обсуждать доходы, расходы, долги и крупные покупки.'],
  ['money','Наши привычки в обращении с деньгами достаточно совместимы или мы умеем договариваться.'],
  ['money','Финансовые решения в паре не используются как способ давления или контроля.'],

  ['daily','Повседневные обязанности распределяются между нами достаточно справедливо.'],
  ['daily','Мы умеем договариваться о быте, отдыхе и личном времени без постоянного накопления раздражения.'],
  ['daily','Я чувствую, что мой вклад в совместную жизнь замечают и ценят.'],

  ['future','Наши представления о ближайших нескольких годах в основном совместимы.'],
  ['future','Мы можем обсуждать семью, место жизни, работу и другие большие решения без давления и избегания.'],
  ['future','Я понимаю, чего партнёр хочет от наших отношений в будущем, и это в целом совпадает с моими ожиданиями.']
];

const optionLabels=['Совсем не согласен(на)','Скорее не согласен(на)','По-разному / не уверен(а)','Скорее согласен(на)','Полностью согласен(на)'];

const fresh=()=>({
  mode:null,names:['',''],start:'',partner:0,q:0,
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
  app.innerHTML=`
    <div class="step">Шаг 1 · формат</div>
    <h2>Как вы хотите пройти?</h2>
    <p class="sub">Отчёт одинаковый. Отличается только способ, которым каждый участник отвечает на свою часть.</p>
    <div class="mode-grid">
      <button class="mode" onclick="chooseMode('local')">
        <span>⇄</span><strong>На одном устройстве</strong>
        <small>Первый отвечает, затем передаёт телефон второму. Ответы первого скрываются.</small>
      </button>
      <button class="mode" onclick="chooseMode('remote')">
        <span>↗</span><strong>С разных устройств</strong>
        <small>Создаются две независимые секретные ссылки. Участники могут находиться в разных местах.</small>
      </button>
    </div>`;
}

function chooseMode(m){S.mode=m;renderProfile()}

function renderProfile(){
  app.innerHTML=`
    <div class="step">Шаг 2 · о вас</div>
    <h2>Кто проходит тест?</h2>
    <p class="sub">Имена используются только для персонализации отчёта.</p>
    <div class="fields">
      <label class="field"><span>Первый партнёр</span><input id="na" maxlength="24" value="${esc(S.names[0])}" placeholder="Например, Аня"></label>
      <label class="field"><span>Второй партнёр</span><input id="nb" maxlength="24" value="${esc(S.names[1])}" placeholder="Например, Максим"></label>
      <label class="field wide"><span>Месяц начала отношений (необязательно)</span><input id="st" type="month" value="${esc(S.start)}"></label>
    </div>
    <div class="note">${S.mode==='local'
      ?'Локальный режим: ответы остаются только в этом браузере.'
      :'Сетевой режим: имена и ответы временно сохраняются в Supabase. Доступ к паре возможен по персональным секретным ссылкам.'}</div>
    <div id="err" class="error"></div>
    <button class="btn primary full" onclick="saveProfile()">${S.mode==='remote'?'Создать пару':'Перейти к вопросам'} →</button>`;
}

async function saveProfile(){
  const a=$('na').value.trim(),b=$('nb').value.trim(),st=$('st').value;
  if(!a||!b){$('err').textContent='Укажите имена обоих партнёров.';return}
  S.names=[a,b];S.start=st;S.partner=0;S.q=0;S.answers=[Array(qs.length).fill(null),Array(qs.length).fill(null)];
  if(S.mode==='local'){persist();renderQuestion();return}
  try{
    app.innerHTML='<div class="center"><div class="wait-dot"></div><h2>Создаём пару…</h2><p class="sub">Готовим две независимые секретные ссылки.</p></div>';
    const r=await rpc('create_couple_session',{p_name_a:a,p_name_b:b,p_start_month:st||null,p_question_version:CFG.version});
    S.remote={...S.remote,room:r.room_code,token:r.token_a,role:'a',partnerUrl:remoteUrl(r.room_code,r.token_b)};
    localStorage.setItem('tv-partner:'+r.room_code,S.remote.partnerUrl);
    history.replaceState({},'',remoteUrl(r.room_code,r.token_a));
    renderInvite();
  }catch(e){renderProfile();$('err').textContent=e.message}
}

function renderInvite(){
  app.innerHTML=`
    <div class="center">
      <div class="big-icon">↗</div>
      <div class="step">Пара создана</div>
      <h2>Отправьте ссылку ${esc(S.names[1])}</h2>
      <p class="sub">Это персональная ссылка второго участника. Не публикуйте её открыто и не отправляйте вместо неё свою собственную ссылку из адресной строки.</p>
      <div class="share"><input id="shareUrl" readonly value="${esc(S.remote.partnerUrl)}"><button class="btn secondary" onclick="copyShare()">Копировать</button></div>
      <div id="copyStatus" class="error"></div>
      <button class="btn primary" onclick="startRemoteQuiz()">Начать мою часть →</button>
    </div>`;
}

async function copyShare(){
  const i=$('shareUrl');
  try{
    await navigator.clipboard.writeText(i.value);
    $('copyStatus').style.color='var(--ok)';$('copyStatus').textContent='Ссылка скопирована.';
  }catch{
    i.select();document.execCommand('copy');$('copyStatus').textContent='Ссылка выделена — скопируйте её.';
  }
}

function startRemoteQuiz(){S.partner=S.remote.role==='b'?1:0;S.q=0;renderQuestion()}

function renderQuestion(){
  const q=qs[S.q],v=S.answers[S.partner][S.q],dim=dims[q[0]];
  const all=S.mode==='local'?qs.length*2:qs.length;
  const done=S.q+(S.mode==='local'?S.partner*qs.length:0);
  const p=Math.round(done/all*100);

  app.innerHTML=`
    <div class="progress"><i style="width:${p}%"></i></div>
    <div class="quiz-meta">
      <div class="dimension-chip">${esc(dim.name)}</div>
      <div class="qnum">${S.q+1} / ${qs.length}</div>
    </div>
    <div class="qhead">
      <div>
        <div class="step">Отвечает: ${esc(S.names[S.partner])}</div>
        <h2>${esc(q[1])}</h2>
      </div>
    </div>
    <p class="sub">Оцените, насколько утверждение описывает ваши отношения сейчас.</p>
    <div class="scale">
      ${[1,2,3,4,5].map((n,i)=>`
        <button class="${v===n?'selected':''}" onclick="pick(${n})">
          <b>${n}</b><small>${esc(optionLabels[i])}</small>
        </button>`).join('')}
    </div>
    <div class="scale-labels"><span>Совсем не про нас</span><span>Полностью про нас</span></div>
    <div id="qerr" class="error"></div>
    <div class="nav">
      <button class="btn ghost" onclick="backQ()">← Назад</button>
      <button class="btn primary" ${v==null?'disabled':''} onclick="nextQ()">${S.q===qs.length-1?'Завершить':'Дальше'} →</button>
    </div>`;
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
  if(S.mode==='local'){
    if(S.partner===0)renderHandoff();else showResults();
  }else await submitRemote();
}

function renderHandoff(){
  app.innerHTML=`
    <div class="center">
      <div class="big-icon">⇄</div>
      <div class="step">Половина готова</div>
      <h2>Теперь очередь: ${esc(S.names[1])}</h2>
      <p class="sub">Ответы ${esc(S.names[0])} скрыты. Передайте устройство второму участнику и не возвращайтесь к предыдущим вопросам.</p>
      <button class="btn primary" onclick="secondPartner()">Я второй партнёр →</button>
    </div>`;
}

function secondPartner(){S.partner=1;S.q=0;renderQuestion()}

function renderRemoteWelcome(){
  app.innerHTML=`
    <div class="center">
      <div class="big-icon">✦</div>
      <div class="step">Вас пригласили</div>
      <h2>${esc(S.names[S.partner])}, можно начинать</h2>
      <p class="sub">Ответьте самостоятельно на 30 вопросов. До завершения обоих участников ответы второго человека не показываются.</p>
      <button class="btn primary" onclick="startRemoteQuiz()">Начать вопросы →</button>
    </div>`;
}

async function submitRemote(){
  try{
    const r=await rpc('submit_couple_answers',{
      p_room_code:S.remote.room,p_token:S.remote.token,p_answers:S.answers[S.partner],p_question_version:CFG.version
    });
    applySession(r);
    if(r.completed_a&&r.completed_b&&r.answers_a&&r.answers_b)showResults();else renderWaiting();
  }catch(e){$('qerr').textContent='Не удалось сохранить ответы: '+e.message}
}

function renderWaiting(){
  app.innerHTML=`
    <div class="center">
      <div class="wait-dot"></div>
      <div class="step">Ваша часть готова</div>
      <h2>Ждём второго участника</h2>
      <p class="sub">Страница проверяет состояние автоматически. Когда обе анкеты будут готовы, полный отчёт откроется здесь.</p>
      <div id="waitStatus" class="note">Проверяем статус…</div>
      ${S.remote.role==='a'&&S.remote.partnerUrl?`
        <div class="share"><input id="shareUrl" readonly value="${esc(S.remote.partnerUrl)}"><button class="btn secondary" onclick="copyShare()">Копировать ссылку</button></div>
        <div id="copyStatus" class="error"></div>`:''}
      <button class="btn ghost" onclick="checkStatus()">Проверить сейчас</button>
    </div>`;
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
  S.mode='remote';S.remote.room=r.room_code;S.remote.role=r.role;
  S.remote.doneA=!!r.completed_a;S.remote.doneB=!!r.completed_b;
  S.names=[r.name_a,r.name_b];S.start=r.start_month||'';S.partner=r.role==='b'?1:0;
  if(r.answers_a)S.answers[0]=r.answers_a.map(Number);
  if(r.answers_b)S.answers[1]=r.answers_b.map(Number);
  if(r.role==='a'&&!S.remote.partnerUrl)S.remote.partnerUrl=localStorage.getItem('tv-partner:'+r.room_code)||'';
}

async function rpc(name,payload){
  const r=await fetch(CFG.url.replace(/\/$/,'')+'/rest/v1/rpc/'+name,{
    method:'POST',headers:{apikey:CFG.key,'Content-Type':'application/json'},body:JSON.stringify(payload)
  });
  const text=await r.text();let data;
  try{data=text?JSON.parse(text):null}catch{data=text}
  if(!r.ok)throw new Error(data?.message||data?.details||String(data||'Ошибка базы данных'));
  return Array.isArray(data)&&data.length===1?data[0]:data;
}

function baseUrl(){const u=new URL(location.href);u.search='';u.hash='';return u.toString()}
function remoteUrl(room,token){const u=new URL(baseUrl());u.searchParams.set('room',room);u.searchParams.set('token',token);return u.toString()}

async function restoreRemote(){
  const p=new URLSearchParams(location.search),room=p.get('room'),token=p.get('token');
  if(!room&&!token)return;
  if(!room||!token){
    show('app');app.innerHTML='<div class="center"><h2>Ссылка неполная</h2><p class="sub">В ней отсутствует код пары или секретный ключ.</p><button class="btn primary" onclick="newTest()">На главную</button></div>';return;
  }
  show('app');app.innerHTML='<div class="center"><div class="wait-dot"></div><h2>Открываем пару…</h2></div>';
  try{
    S.remote.room=room;S.remote.token=token;
    const r=await rpc('get_couple_session',{p_room_code:room,p_token:token,p_question_version:CFG.version});
    applySession(r);
    if(r.completed_a&&r.completed_b&&r.answers_a&&r.answers_b){showResults();return}
    if((r.role==='a'&&r.completed_a)||(r.role==='b'&&r.completed_b)){renderWaiting();return}
    renderRemoteWelcome();
  }catch(e){
    app.innerHTML=`<div class="center"><div class="big-icon">!</div><h2>Не удалось открыть пару</h2><p class="sub">${esc(e.message)}</p><button class="btn primary" onclick="newTest()">На главную</button></div>`;
  }
}

function persist(){
  localStorage.setItem('two-voices-local-v2',JSON.stringify({
    mode:S.mode,names:S.names,start:S.start,partner:S.partner,q:S.q,answers:S.answers,version:CFG.version
  }));
}

function questionAgreement(a,b){return clamp(100-Math.abs(a-b)*25)}
function questionQuality(a,b){return clamp(((a+b)/10)*100)}

function dimensionStats(){
  const out={};
  for(const d of Object.keys(dims)){
    const ids=qs.map((q,i)=>q[0]===d?i:-1).filter(i=>i>=0);
    const agreements=ids.map(i=>questionAgreement(S.answers[0][i],S.answers[1][i]));
    const qualities=ids.map(i=>questionQuality(S.answers[0][i],S.answers[1][i]));
    const a=clamp(avg(ids.map(i=>S.answers[0][i]))*20);
    const b=clamp(avg(ids.map(i=>S.answers[1][i]))*20);
    const agreement=clamp(avg(agreements));
    const quality=clamp(avg(qualities));
    out[d]={agreement,quality,pair:clamp(agreement*.55+quality*.45),a,b,gap:Math.abs(a-b)};
  }
  return out;
}

function individual(k,stats){
  const scores={};
  for(const d of Object.keys(dims))scores[d]=k===0?stats[d].a:stats[d].b;
  return{scores,overall:clamp(avg(Object.values(scores)))};
}

function pairArchetype(alignment,quality){
  if(alignment>=86&&quality>=80)return['В одном ритме','Вы не только высоко оцениваете отношения, но и во многом одинаково их воспринимаете.'];
  if(alignment>=80&&quality<68)return['Похожее видение, есть напряжение','Вы довольно похоже видите происходящее, но несколько сфер сами по себе оцениваются невысоко.'];
  if(alignment<70&&quality>=76)return['Тёплая база, разные ощущения','В отношениях много ресурса, но каждый местами переживает одну и ту же реальность по-разному.'];
  if(alignment>=70&&quality>=68)return['Крепкая база, разные акценты','Основы отношений выглядят устойчиво, но есть темы, где важны дополнительные договорённости.'];
  return['Две разные картины','Сейчас между вашим восприятием отношений есть заметная дистанция. Это не приговор, а карта тем, которые стоит проговорить конкретнее.'];
}

function scoreWord(n){
  if(n>=86)return'очень сильная';
  if(n>=74)return'устойчивая';
  if(n>=60)return'смешанная';
  return'уязвимая';
}

function metric(d,s){
  return `<article class="metric">
    <div class="metric-top"><b>${dims[d].name}</b><strong>${s.pair}%</strong></div>
    <div class="track"><div class="fill" style="width:${s.pair}%"></div></div>
    <small class="sub">${dims[d].desc}</small>
  </article>`;
}

function profileText(k,r){
  const sorted=Object.entries(r.scores).sort((a,b)=>b[1]-a[1]);
  const top=sorted[0],low=sorted.at(-1);
  const tone=r.overall>=82?'В целом вы воспринимаете отношения как устойчивые и ресурсные.'
    :r.overall>=68?'В целом вы видите в отношениях хорошую основу, хотя некоторые темы требуют больше ясности.'
    :r.overall>=54?'Ваше восприятие неоднородно: рядом с сильными сторонами есть заметные зоны напряжения.'
    :'Сейчас вы оцениваете несколько важных сторон отношений довольно низко; такой результат стоит воспринимать как повод внимательнее посмотреть на собственный опыт.';
  return `${tone} Наиболее уверенно для вас выглядит «${dims[top[0]].name}» (${top[1]}%), а сложнее всего — «${dims[low[0]].name}» (${low[1]}%).`;
}

function indCard(k,r){
  return `<article class="ind-card">
    <header>
      <div><div class="step">Индивидуальный профиль</div><h3>${esc(S.names[k])}</h3></div>
      <strong>${r.overall}</strong>
    </header>
    <p class="profile-copy">${profileText(k,r)}</p>
    <div class="ind-list">
      ${Object.entries(r.scores).map(([d,n])=>`
        <div class="ind-row"><span>${dims[d].name}</span><div class="track"><div class="fill" style="width:${n}%"></div></div><b>${n}</b></div>`).join('')}
    </div>
  </article>`;
}

const bestTexts={
  trust:'Вы оба сравнительно уверенно ощущаете надёжность, честность и безопасность отношений.',
  communication:'У пары есть хороший ресурс для прямого разговора и взаимного слышания.',
  conflict:'Вы сравнительно успешно проходите напряжение и умеете возвращаться к контакту.',
  support:'Ощущение команды и взаимного участия — одна из заметных опор пары.',
  closeness:'Тепло, привязанность и ощущение эмоциональной близости воспринимаются вами как сильная сторона.',
  boundaries:'Близость хорошо сочетается с автономией и уважением личного пространства.',
  jealousy:'В отношениях сравнительно много спокойствия и мало необходимости в контроле и доказательствах.',
  money:'Финансовая тема воспринимается достаточно прозрачно и договороспособно.',
  daily:'Повседневная жизнь и вклад каждого воспринимаются сравнительно справедливо.',
  future:'Направление и темп будущих планов выглядят для вас достаточно совместимыми.'
};

const gapTexts={
  trust:'Полезно конкретно обсудить, что для каждого означает надёжность, честность и чувство безопасности.',
  communication:'Сравните, в какие моменты один пытается объяснить, а второй уже чувствует давление или перестаёт слышать.',
  conflict:'Разберите не содержание последней ссоры, а сам сценарий: что запускает эскалацию и что помогает остановиться.',
  support:'Назовите конкретные действия, которые каждый воспринимает как поддержку: советы, участие, объятия, помощь или просто присутствие.',
  closeness:'Полезно без обвинений сравнить потребность в тепле, физическом контакте, нежности и эмоциональном внимании.',
  boundaries:'Назовите границы максимально конкретно: время на себя, друзья, переписки, физический контакт, личные вещи и право отказать.',
  jealousy:'Отделите реальные договорённости от тревоги. Обсудите, какое поведение даёт безопасность, а какое уже ощущается как контроль.',
  money:'Сравните отношение к расходам, накоплениям, долгам и крупным решениям. Особенно важно заранее определить зоны личной и общей ответственности.',
  daily:'Проверьте, одинаково ли вы видите объём бытовой и эмоциональной нагрузки и что именно каждый считает справедливым вкладом.',
  future:'Разделите разговор о будущем на конкретные темы: сроки, семья, место жизни, работа, дети, стиль жизни и приоритеты.'
};

function comparisonRows(stats,limit=4){
  return Object.entries(stats).sort((a,b)=>b[1].gap-a[1].gap).slice(0,limit).map(([d,s])=>`
    <div class="comparison-row">
      <header><span>${dims[d].name}</span><b>разница ${s.gap} п.</b></header>
      <div class="dual">
        <div>${esc(S.names[0])}: <b>${s.a}%</b></div>
        <div>${esc(S.names[1])}: <b>${s.b}%</b></div>
      </div>
    </div>`).join('');
}

function talkQuestions(low,gap,best){
  return [
    `Что в сфере «${dims[low].name}» каждый из нас хотел бы получать чаще — одним конкретным действием?`,
    `Почему мы можем по-разному воспринимать сферу «${dims[gap].name}» и какой недавний пример лучше всего показывает эту разницу?`,
    `Когда в сфере «${dims[best].name}» у нас получается особенно хорошо, что именно мы делаем и как можем перенести это в более сложные темы?`,
    `Какое одно небольшое изменение на ближайшие семь дней сделает отношения спокойнее или понятнее для каждого из нас?`
  ];
}

function showResults(){
  stopPoll();
  const stats=dimensionStats();
  const entries=Object.entries(stats).sort((a,b)=>b[1].pair-a[1].pair);
  const best=entries[0],low=entries.at(-1);
  const gap=Object.entries(stats).sort((a,b)=>b[1].gap-a[1].gap)[0];
  const alignment=clamp(avg(Object.values(stats).map(s=>s.agreement)));
  const quality=clamp(avg(Object.values(stats).map(s=>s.quality)));
  const overall=clamp(avg(Object.values(stats).map(s=>s.pair)));
  const [type,typeText]=pairArchetype(alignment,quality);
  const a=individual(0,stats),b=individual(1,stats);

  show('results');
  $('resultsRoot').innerHTML=`
    <section class="result-head">
      <article class="result-block result-title">
        <div class="eyebrow">Расширенный отчёт пары</div>
        <h1>${esc(S.names[0])} + ${esc(S.names[1])}</h1>
        <p><b>${type}.</b> ${typeText}</p>
      </article>
      <article class="result-block scorebox">
        <span>Индекс пары</span>
        <strong>${overall}%</strong>
        <small class="sub">55% совпадение восприятия + 45% средняя оценка качества отношений.</small>
      </article>
    </section>

    <section class="summary-grid">
      <article class="summary-card">
        <span>Согласованность взглядов</span><strong>${alignment}%</strong>
        <p>Насколько похоже вы отвечали на одни и те же вопросы.</p>
      </article>
      <article class="summary-card">
        <span>Средняя оценка отношений</span><strong>${quality}%</strong>
        <p>Насколько позитивно оба участника в среднем оценивают текущую ситуацию.</p>
      </article>
    </section>

    <section class="grid10">${Object.entries(stats).map(([d,s])=>metric(d,s)).join('')}</section>

    <section class="ind-grid">${indCard(0,a)}${indCard(1,b)}</section>

    <section class="insights">
      <article class="insight">
        <div class="step">Сильнейшая общая опора</div>
        <h3>${dims[best[0]].name} · ${best[1].pair}%</h3>
        <p>${bestTexts[best[0]]} Для этой сферы картина сейчас выглядит как <b>${scoreWord(best[1].pair)}</b>.</p>
      </article>
      <article class="insight">
        <div class="step">Главная зона внимания</div>
        <h3>${dims[low[0]].name} · ${low[1].pair}%</h3>
        <p>${gapTexts[low[0]]}</p>
      </article>
    </section>

    <section class="profile-block questions-box">
      <div class="step">Где вы видите отношения по-разному</div>
      <h2>Разница восприятия по сферам</h2>
      <p class="sub">Здесь показаны не ответы на отдельные вопросы, а итоговые оценки сфер каждого участника.</p>
      <div class="comparison-list">${comparisonRows(stats)}</div>
    </section>

    <section class="result-block questions-box">
      <div class="step">Вопросы для разговора</div>
      <h2>Не спорьте с цифрой — обсуждайте конкретный опыт</h2>
      ${talkQuestions(low[0],gap[0],best[0]).map((t,i)=>`<div class="talk"><i>0${i+1}</i><div>${esc(t)}</div></div>`).join('')}
    </section>

    <div class="footer-note result-block">
      <b>Важно.</b> Этот отчёт — прозрачная интерпретация ваших ответов, а не клиническая или психологическая диагностика и не прогноз длительности отношений.
      Низкий показатель сам по себе не доказывает наличие насилия или расстройства. При угрозах, принуждении, контроле или физическом насилии важнее безопасность и профессиональная помощь, а не результат теста.
    </div>`;
}

function demoResult(){
  S.mode='local';S.names=['Аня','Максим'];
  S.answers=[
    [5,5,4,4,4,5,3,4,4,5,4,5,5,4,4,5,5,4,4,4,5,4,4,5,4,4,5,4,4,4],
    [5,4,5,4,5,4,3,3,4,5,5,4,4,4,5,4,5,5,3,4,4,4,3,4,5,4,4,4,3,5]
  ];
  showResults();
}

async function deleteData(){
  if(S.mode==='remote'&&S.remote.room&&S.remote.token){
    if(!confirm('Удалить сетевую запись пары и оба набора ответов?'))return;
    try{
      await rpc('delete_couple_session',{p_room_code:S.remote.room,p_token:S.remote.token,p_question_version:CFG.version});
    }catch(e){alert('Не удалось удалить данные: '+e.message);return}
  }
  localStorage.removeItem('two-voices-local-v2');
  if(S.remote.room)localStorage.removeItem('tv-partner:'+S.remote.room);
  newTest();
}

function newTest(){
  stopPoll();S=fresh();history.replaceState({},'',baseUrl());show('landing');
}

restoreRemote();
