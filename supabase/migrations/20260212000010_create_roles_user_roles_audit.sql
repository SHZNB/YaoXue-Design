-- roles dictionary
create table if not exists public.roles (
  id uuid default gen_random_uuid() primary key,
  code text not null unique check (code in ('student','teacher','parent')),
  name text not null
);

-- user_roles mapping
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('student','teacher','parent')),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

-- optional role-specific profile fields
create table if not exists public.role_profiles (
  id uuid default gen_random_uuid() primary key,
  user_role_id uuid not null references public.user_roles(id) on delete cascade,
  school text,
  grade text,
  class_name text,
  child_user_id uuid, -- for parent binding to student
  updated_at timestamp with time zone default now()
);

-- audit logs
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_user_id uuid not null,
  actor_role text,
  action text not null,
  resource text,
  delta jsonb,
  ip text,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- trigger to insert first user_role on new user based on raw_user_meta_data.role
create or replace function public.handle_new_user_role()
returns trigger as $$
begin
  begin
    insert into public.user_roles (user_id, role, status)
    values (new.id, coalesce(new.raw_user_meta_data->>'role','student'), 'active')
    on conflict (user_id, role) do nothing;
  exception when others then
    -- swallow to avoid signup failure
    perform 1;
  end;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_role_created on auth.users;
create trigger on_auth_user_role_created
after insert on auth.users
for each row execute function public.handle_new_user_role();

-- RLS policies
alter table public.user_roles enable row level security;
create policy user_roles_owner on public.user_roles
  for select using (user_id = auth.uid());
create policy user_roles_insert on public.user_roles
  for insert with check (user_id = auth.uid());
create policy user_roles_update on public.user_roles
  for update using (user_id = auth.uid());

alter table public.role_profiles enable row level security;
create policy role_profiles_owner on public.role_profiles
  for select using (
    exists(select 1 from public.user_roles ur where ur.id = role_profiles.user_role_id and ur.user_id = auth.uid())
  );
create policy role_profiles_mod on public.role_profiles
  for all using (
    exists(select 1 from public.user_roles ur where ur.id = role_profiles.user_role_id and ur.user_id = auth.uid())
  );

alter table public.audit_logs enable row level security;
create policy audit_logs_owner on public.audit_logs
  for select using (actor_user_id = auth.uid());
create policy audit_logs_write on public.audit_logs
  for insert with check (actor_user_id = auth.uid());
