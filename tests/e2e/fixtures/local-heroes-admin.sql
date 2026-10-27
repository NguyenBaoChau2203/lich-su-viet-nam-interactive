
-- Synthetic accounts for the descriptor-confirmed disposable project only.
update auth.users set instance_id='00000000-0000-0000-0000-000000000000', aud='authenticated', role='authenticated',
  encrypted_password=extensions.crypt('LocalHeroes-Synthetic-2026!', extensions.gen_salt('bf')),
  email_confirmed_at=now(), confirmation_token='', recovery_token='', email_change_token_new='', email_change='',
  raw_app_meta_data='{"provider":"email","providers":["email"]}'::jsonb, raw_user_meta_data='{}'::jsonb, created_at=now(), updated_at=now()
where id::text like 'aa000000-%';
insert into auth.identities(user_id,provider_id,identity_data,provider,created_at,updated_at)
select id,id::text,jsonb_build_object('sub',id::text,'email',email,'email_verified',true),'email',now(),now()
from auth.users where id::text like 'aa000000-%';
