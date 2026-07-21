-- Два Голоса — схема сетевого режима, версия анкеты 2026-07-v3.
-- Файл можно повторно выполнить поверх v1/v2.
-- Старые записи сохраняются; новые v3-сессии используют 30 ответов и могут хранить две необязательные даты рождения.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.couple_sessions (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  question_version text not null,
  name_a text not null,
  name_b text not null,
  start_month text,
  birth_a date,
  birth_b date,
  token_a_hash bytea not null,
  token_b_hash bytea not null,
  answers_a smallint[],
  answers_b smallint[],
  completed_a boolean not null default false,
  completed_b boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

alter table public.couple_sessions add column if not exists birth_a date;
alter table public.couple_sessions add column if not exists birth_b date;

alter table public.couple_sessions drop constraint if exists couple_sessions_name_a_length;
alter table public.couple_sessions drop constraint if exists couple_sessions_name_b_length;
alter table public.couple_sessions drop constraint if exists couple_sessions_question_version_length;
alter table public.couple_sessions drop constraint if exists couple_sessions_start_month_format;
alter table public.couple_sessions drop constraint if exists couple_sessions_answers_a_length;
alter table public.couple_sessions drop constraint if exists couple_sessions_answers_b_length;

alter table public.couple_sessions
  add constraint couple_sessions_name_a_length check (char_length(name_a) between 1 and 24),
  add constraint couple_sessions_name_b_length check (char_length(name_b) between 1 and 24),
  add constraint couple_sessions_question_version_length check (char_length(question_version) between 1 and 40),
  add constraint couple_sessions_start_month_format check (start_month is null or start_month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  add constraint couple_sessions_answers_a_length check (answers_a is null or cardinality(answers_a) in (18,30)),
  add constraint couple_sessions_answers_b_length check (answers_b is null or cardinality(answers_b) in (18,30));

create index if not exists couple_sessions_expires_at_idx on public.couple_sessions(expires_at);
alter table public.couple_sessions enable row level security;
revoke all on table public.couple_sessions from anon, authenticated;

-- Удаляем старую сигнатуру create_couple_session, чтобы PostgREST не видел неоднозначные overload-варианты.
drop function if exists public.create_couple_session(text,text,text,text);
drop function if exists public.create_couple_session(text,text,date,date,text,text);

create function public.create_couple_session(
  p_name_a text,
  p_name_b text,
  p_birth_a date default null,
  p_birth_b date default null,
  p_start_month text default null,
  p_question_version text default '2026-07-v3'
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_room text;
  v_token_a text;
  v_token_b text;
  v_row public.couple_sessions%rowtype;
begin
  p_name_a := btrim(coalesce(p_name_a,''));
  p_name_b := btrim(coalesce(p_name_b,''));
  p_start_month := nullif(btrim(coalesce(p_start_month,'')),'');
  p_question_version := btrim(coalesce(p_question_version,''));

  if char_length(p_name_a) not between 1 and 24 or char_length(p_name_b) not between 1 and 24 then
    raise exception 'Имена должны содержать от 1 до 24 символов.';
  end if;

  if char_length(p_question_version) not between 1 and 40 then
    raise exception 'Некорректная версия анкеты.';
  end if;

  if p_start_month is not null and p_start_month !~ '^\d{4}-(0[1-9]|1[0-2])$' then
    raise exception 'Некорректный месяц начала отношений.';
  end if;

  if p_birth_a is not null and p_birth_a > current_date then
    raise exception 'Дата рождения первого участника не может быть в будущем.';
  end if;

  if p_birth_b is not null and p_birth_b > current_date then
    raise exception 'Дата рождения второго участника не может быть в будущем.';
  end if;

  v_token_a := encode(gen_random_bytes(24),'hex');
  v_token_b := encode(gen_random_bytes(24),'hex');

  loop
    v_room := upper(substr(encode(gen_random_bytes(8),'hex'),1,10));
    begin
      insert into public.couple_sessions(
        room_code,question_version,name_a,name_b,birth_a,birth_b,start_month,token_a_hash,token_b_hash
      )
      values(
        v_room,p_question_version,p_name_a,p_name_b,p_birth_a,p_birth_b,p_start_month,
        digest(v_token_a,'sha256'),digest(v_token_b,'sha256')
      )
      returning * into v_row;
      exit;
    exception when unique_violation then
      null;
    end;
  end loop;

  return jsonb_build_object(
    'room_code',v_row.room_code,
    'token_a',v_token_a,
    'token_b',v_token_b,
    'name_a',v_row.name_a,
    'name_b',v_row.name_b,
    'birth_a',v_row.birth_a,
    'birth_b',v_row.birth_b,
    'start_month',v_row.start_month,
    'question_version',v_row.question_version,
    'expires_at',v_row.expires_at
  );
end;
$$;

create or replace function public.get_couple_session(
  p_room_code text,
  p_token text,
  p_question_version text default '2026-07-v3'
)
returns jsonb
language plpgsql
security definer
stable
set search_path = public, extensions, pg_temp
as $$
declare
  v_row public.couple_sessions%rowtype;
  v_hash bytea;
  v_role text;
begin
  if coalesce(btrim(p_room_code),'')='' or coalesce(btrim(p_token),'')='' then
    raise exception 'Код пары и секретный ключ обязательны.';
  end if;

  select * into v_row
  from public.couple_sessions
  where room_code=upper(btrim(p_room_code));

  if not found or v_row.expires_at<=now() then
    raise exception 'Пара не найдена или срок действия ссылки истёк.';
  end if;

  if v_row.question_version<>p_question_version then
    raise exception 'Эта ссылка создана для другой версии анкеты. Создайте новую пару.';
  end if;

  v_hash:=digest(btrim(p_token),'sha256');

  if v_hash=v_row.token_a_hash then
    v_role:='a';
  elsif v_hash=v_row.token_b_hash then
    v_role:='b';
  else
    raise exception 'Секретный ключ не подходит к этой паре.';
  end if;

  return jsonb_build_object(
    'room_code',v_row.room_code,
    'role',v_role,
    'name_a',v_row.name_a,
    'name_b',v_row.name_b,
    'birth_a',v_row.birth_a,
    'birth_b',v_row.birth_b,
    'start_month',v_row.start_month,
    'question_version',v_row.question_version,
    'completed_a',v_row.completed_a,
    'completed_b',v_row.completed_b,
    'answers_a',case when v_row.completed_a and v_row.completed_b then to_jsonb(v_row.answers_a) else null end,
    'answers_b',case when v_row.completed_a and v_row.completed_b then to_jsonb(v_row.answers_b) else null end,
    'expires_at',v_row.expires_at
  );
end;
$$;

create or replace function public.submit_couple_answers(
  p_room_code text,
  p_token text,
  p_answers smallint[],
  p_question_version text default '2026-07-v3'
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_row public.couple_sessions%rowtype;
  v_hash bytea;
  v_role text;
  v_expected integer;
begin
  v_expected := case when p_question_version='2026-07-v1' then 18 else 30 end;

  if cardinality(p_answers) is distinct from v_expected then
    raise exception 'Для этой версии анкеты должно быть передано ровно % ответов.', v_expected;
  end if;

  if exists(select 1 from unnest(p_answers) a where a is null or a<1 or a>5) then
    raise exception 'Каждый ответ должен быть целым числом от 1 до 5.';
  end if;

  select * into v_row
  from public.couple_sessions
  where room_code=upper(btrim(p_room_code))
  for update;

  if not found or v_row.expires_at<=now() then
    raise exception 'Пара не найдена или срок действия ссылки истёк.';
  end if;

  if v_row.question_version<>p_question_version then
    raise exception 'Эта ссылка создана для другой версии анкеты. Создайте новую пару.';
  end if;

  v_hash:=digest(btrim(p_token),'sha256');

  if v_hash=v_row.token_a_hash then
    v_role:='a';
    update public.couple_sessions
      set answers_a=p_answers,completed_a=true,updated_at=now()
      where id=v_row.id;
  elsif v_hash=v_row.token_b_hash then
    v_role:='b';
    update public.couple_sessions
      set answers_b=p_answers,completed_b=true,updated_at=now()
      where id=v_row.id;
  else
    raise exception 'Секретный ключ не подходит к этой паре.';
  end if;

  select * into v_row from public.couple_sessions where id=v_row.id;

  return jsonb_build_object(
    'room_code',v_row.room_code,
    'role',v_role,
    'name_a',v_row.name_a,
    'name_b',v_row.name_b,
    'birth_a',v_row.birth_a,
    'birth_b',v_row.birth_b,
    'start_month',v_row.start_month,
    'question_version',v_row.question_version,
    'completed_a',v_row.completed_a,
    'completed_b',v_row.completed_b,
    'answers_a',case when v_row.completed_a and v_row.completed_b then to_jsonb(v_row.answers_a) else null end,
    'answers_b',case when v_row.completed_a and v_row.completed_b then to_jsonb(v_row.answers_b) else null end,
    'expires_at',v_row.expires_at
  );
end;
$$;

create or replace function public.delete_couple_session(
  p_room_code text,
  p_token text,
  p_question_version text default '2026-07-v3'
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_row public.couple_sessions%rowtype;
  v_hash bytea;
begin
  select * into v_row
  from public.couple_sessions
  where room_code=upper(btrim(p_room_code));

  if not found then
    return jsonb_build_object('deleted',true);
  end if;

  if v_row.question_version<>p_question_version then
    raise exception 'Версия анкеты не совпадает.';
  end if;

  v_hash:=digest(btrim(p_token),'sha256');

  if v_hash<>v_row.token_a_hash and v_hash<>v_row.token_b_hash then
    raise exception 'Секретный ключ не подходит к этой паре.';
  end if;

  delete from public.couple_sessions where id=v_row.id;
  return jsonb_build_object('deleted',true);
end;
$$;

create or replace function public.delete_expired_couple_sessions()
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count bigint;
begin
  delete from public.couple_sessions where expires_at<=now();
  get diagnostics v_count=row_count;
  return v_count;
end;
$$;

revoke all on function public.create_couple_session(text,text,date,date,text,text) from public;
revoke all on function public.get_couple_session(text,text,text) from public;
revoke all on function public.submit_couple_answers(text,text,smallint[],text) from public;
revoke all on function public.delete_couple_session(text,text,text) from public;
revoke all on function public.delete_expired_couple_sessions() from public;

grant execute on function public.create_couple_session(text,text,date,date,text,text) to anon,authenticated;
grant execute on function public.get_couple_session(text,text,text) to anon,authenticated;
grant execute on function public.submit_couple_answers(text,text,smallint[],text) to anon,authenticated;
grant execute on function public.delete_couple_session(text,text,text) to anon,authenticated;

comment on table public.couple_sessions is
'Временные записи пар для режима с разных устройств. Даты рождения необязательны и используются только для отдельного развлекательного астро-блока. Прямой доступ браузера к таблице запрещён.';

notify pgrst, 'reload schema';
