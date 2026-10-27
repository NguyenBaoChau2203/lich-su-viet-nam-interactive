-- Actual system public schema baseline captured 2026-10-27; mark adopted only after byte/hash verification.
-- Managed Auth/Storage schemas and user data are excluded. The extension prelude supports local reproduction.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
--
-- PostgreSQL database dump
--

-- \restrict 9CumgRBHUCE4aLQTMe9zAESIIi5dxUKKdPV7Cy1yJGcRw28cYvCueteobTeEKxB

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: account_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."account_status" AS ENUM (
    'active',
    'locked'
);


ALTER TYPE "public"."account_status" OWNER TO "postgres";

--
-- Name: content_workflow_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."content_workflow_status" AS ENUM (
    'draft',
    'pending_review',
    'needs_revision',
    'published',
    'hidden'
);


ALTER TYPE "public"."content_workflow_status" OWNER TO "postgres";

--
-- Name: exam_attempt_mode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."exam_attempt_mode" AS ENUM (
    'exam',
    'practice',
    'review',
    'paper'
);


ALTER TYPE "public"."exam_attempt_mode" OWNER TO "postgres";

--
-- Name: exam_attempt_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."exam_attempt_status" AS ENUM (
    'in_progress',
    'submitted',
    'abandoned'
);


ALTER TYPE "public"."exam_attempt_status" OWNER TO "postgres";

--
-- Name: exam_competency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."exam_competency" AS ENUM (
    'tim_hieu_lich_su',
    'nhan_thuc_tu_duy',
    'van_dung_kien_thuc'
);


ALTER TYPE "public"."exam_competency" OWNER TO "postgres";

--
-- Name: exam_item_kind; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."exam_item_kind" AS ENUM (
    'mcq',
    'true_false'
);


ALTER TYPE "public"."exam_item_kind" OWNER TO "postgres";

--
-- Name: exam_item_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."exam_item_level" AS ENUM (
    'nhan_biet',
    'thong_hieu',
    'van_dung'
);


ALTER TYPE "public"."exam_item_level" OWNER TO "postgres";

--
-- Name: exam_report_reason; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."exam_report_reason" AS ENUM (
    'sai_dap_an',
    'loi_chinh_ta',
    'khong_ro_nghia',
    'sai_kien_thuc',
    'khac'
);


ALTER TYPE "public"."exam_report_reason" OWNER TO "postgres";

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."order_status" AS ENUM (
    'pending',
    'paid',
    'cancelled',
    'expired',
    'refunded'
);


ALTER TYPE "public"."order_status" OWNER TO "postgres";

--
-- Name: product_kind; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."product_kind" AS ENUM (
    'exam_pack',
    'donation'
);


ALTER TYPE "public"."product_kind" OWNER TO "postgres";

--
-- Name: staff_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."staff_role" AS ENUM (
    'editor',
    'reviewer',
    'system_admin'
);


ALTER TYPE "public"."staff_role" OWNER TO "postgres";

--
-- Name: activate_license("text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."activate_license"("p_code" "text", "p_device_hash" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  l public.licenses%rowtype;
  used integer;
  slug text;
begin
  select * into l from public.licenses where code = upper(btrim(p_code)) for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'invalid_code');
  end if;
  if l.status <> 'active' then
    return jsonb_build_object('ok', false, 'reason', 'revoked');
  end if;
  if l.valid_until is not null and l.valid_until < now() then
    return jsonb_build_object('ok', false, 'reason', 'expired');
  end if;

  select count(*) into used from public.license_activations where license_id = l.id;
  if exists (select 1 from public.license_activations where license_id = l.id and device_hash = p_device_hash) then
    update public.license_activations set last_seen_at = now() where license_id = l.id and device_hash = p_device_hash;
  elsif used >= l.max_devices then
    return jsonb_build_object('ok', false, 'reason', 'device_limit', 'devices_used', used, 'max_devices', l.max_devices);
  else
    insert into public.license_activations (license_id, device_hash) values (l.id, p_device_hash);
    used := used + 1;
  end if;

  select pr.slug into slug from public.products pr where pr.id = l.product_id;
  return jsonb_build_object('ok', true, 'devices_used', used, 'max_devices', l.max_devices,
                            'valid_until', l.valid_until, 'product_slug', slug);
end;
$$;


ALTER FUNCTION "public"."activate_license"("p_code" "text", "p_device_hash" "text") OWNER TO "postgres";

--
-- Name: admin_resolve_late_payment(bigint, "uuid", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."admin_resolve_late_payment"("p_order_code" bigint, "p_staff_id" "uuid", "p_note" "text", "p_license_code" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  o public.orders%rowtype;
  p public.products%rowtype;
  e public.payment_events%rowtype;
  existing_code text;
begin
  select * into o from public.orders where order_code = p_order_code for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  select * into p from public.products where id = o.product_id;

  if o.status = 'paid' then
    select code into existing_code from public.licenses where order_id = o.id;
    return jsonb_build_object('ok', true, 'already', true, 'kind', p.kind, 'license_code', existing_code);
  end if;
  if o.status <> 'cancelled' then
    return jsonb_build_object('ok', false, 'reason', 'invalid_status', 'status', o.status);
  end if;

  select * into e from public.payment_events
   where order_code = p_order_code and note = 'paid_after_cancelled' and signature_ok
   order by received_at desc, id desc
   limit 1;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'no_late_payment', 'status', o.status);
  end if;
  if e.amount_vnd is distinct from o.amount_vnd then
    return jsonb_build_object('ok', false, 'reason', 'amount_mismatch', 'status', o.status);
  end if;

  perform set_config('app.late_payment', 'on', true);
  update public.orders
     set status = 'paid', paid_at = e.received_at, provider_ref = coalesce(e.provider_ref, o.provider_ref)
   where id = o.id;
  perform set_config('app.late_payment', 'off', true);

  insert into public.payment_events (order_code, provider, source, signature_ok, status, amount_vnd, provider_ref, note, payload)
    values (p_order_code, o.provider, 'admin', true, 'paid', e.amount_vnd, e.provider_ref, 'resolve_late_payment',
            jsonb_build_object('action', 'resolve_late_payment', 'by', p_staff_id, 'evidence_event', e.id,
                               'note', left(coalesce(p_note, ''), 200)));

  if p.kind = 'exam_pack' then
    insert into public.licenses (order_id, product_id, code, max_devices, valid_until, user_id)
      values (o.id, coalesce(p.grants_product_id, p.id), p_license_code, p.max_devices,
              case when p.duration_days is not null then now() + make_interval(days => p.duration_days) else p.valid_until end,
              o.user_id);
    return jsonb_build_object('ok', true, 'already', false, 'kind', p.kind, 'license_code', p_license_code);
  end if;
  return jsonb_build_object('ok', true, 'already', false, 'kind', p.kind, 'license_code', null);
end;
$$;


ALTER FUNCTION "public"."admin_resolve_late_payment"("p_order_code" bigint, "p_staff_id" "uuid", "p_note" "text", "p_license_code" "text") OWNER TO "postgres";

--
-- Name: check_attempt_item("uuid", "uuid", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."check_attempt_item"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_item_id" "uuid", "p_answer" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  a public.exam_attempts%rowtype;
  item public.exam_items%rowtype;
  slot integer;
  cleaned jsonb;
  earned integer;
  has_pack boolean;
  today_seconds integer;
begin
  select * into a from public.exam_attempts where id = p_attempt_id for update;
  if not found or not public.exam_attempt_owner_ok(a, p_user_id, p_device_hash) then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if a.mode not in ('practice', 'review') then
    return jsonb_build_object('ok', false, 'reason', 'not_practice');
  end if;
  if a.status <> 'in_progress' then
    return jsonb_build_object('ok', false, 'reason', 'submitted');
  end if;
  slot := array_position(a.item_ids, p_item_id);
  if slot is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if coalesce(a.answers -> p_item_id::text ->> 'checked', '') = 'true' then
    return jsonb_build_object('ok', true, 'already', true) || public.exam_attempt_view(a, false);
  end if;

  has_pack := a.license_id is not null or public.exam_pack_license(null, null, a.user_id) is not null;
  if not has_pack then
    today_seconds := greatest(1, extract(epoch from now() - public.exam_vn_day(0))::integer);
    -- Khóa đếm phải là hex 64 ký tự: mã thiết bị đã là băm; id tài khoản thì băm SHA-256.
    if not public.consume_rate_limit('practice_free',
                                     coalesce(encode(sha256(convert_to('user:' || a.user_id::text, 'UTF8')), 'hex'), a.device_hash),
                                     today_seconds, 10) then
      return jsonb_build_object('ok', false, 'reason', 'quota');
    end if;
  end if;

  cleaned := coalesce(public.exam_clean_answers(a, jsonb_build_object(p_item_id::text, coalesce(p_answer, '{}'::jsonb))) -> p_item_id::text, '{}'::jsonb);
  cleaned := cleaned || jsonb_build_object('checked', true);
  update public.exam_attempts set answers = answers || jsonb_build_object(p_item_id::text, cleaned) where id = a.id returning * into a;

  select * into item from public.exam_items where id = p_item_id;
  earned := public.exam_item_earned(item, a.choice_shifts[slot], cleaned);
  if a.user_id is not null then
    perform public.exam_leitner_apply(a.user_id, p_item_id, earned = (case when item.kind = 'mcq' then 250 else 1000 end));
  end if;
  return jsonb_build_object('ok', true, 'checked_item', p_item_id, 'earned_milli', earned) || public.exam_attempt_view(a, false);
end;
$$;


ALTER FUNCTION "public"."check_attempt_item"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_item_id" "uuid", "p_answer" "jsonb") OWNER TO "postgres";

--
-- Name: check_event_has_source(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."check_event_has_source"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  source_count integer;
begin
  if NEW.workflow_status in ('pending_review', 'published') then
    select count(*) into source_count
    from public.event_sources
    where event_id = NEW.id;

    if source_count = 0 then
      raise exception 'Sự kiện phải có ít nhất 1 nguồn tham khảo trước khi gửi duyệt hoặc công bố';
    end if;
  end if;
  return NEW;
end;
$$;


ALTER FUNCTION "public"."check_event_has_source"() OWNER TO "postgres";

--
-- Name: claim_license("text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."claim_license"("p_code" "text", "p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  l public.licenses%rowtype;
  slug text;
begin
  if p_user_id is null or not exists (select 1 from auth.users where id = p_user_id) then
    return jsonb_build_object('ok', false, 'reason', 'invalid_user');
  end if;
  select * into l from public.licenses where code = upper(btrim(coalesce(p_code, ''))) for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'invalid_code');
  end if;
  if l.status <> 'active' then
    return jsonb_build_object('ok', false, 'reason', 'revoked');
  end if;
  if l.valid_until is not null and l.valid_until < now() then
    return jsonb_build_object('ok', false, 'reason', 'expired');
  end if;
  if l.user_id is not null and l.user_id <> p_user_id then
    return jsonb_build_object('ok', false, 'reason', 'owned_by_other');
  end if;

  select pr.slug into slug from public.products pr where pr.id = l.product_id;
  if l.user_id = p_user_id then
    return jsonb_build_object('ok', true, 'already', true, 'product_slug', slug);
  end if;
  update public.licenses set user_id = p_user_id where id = l.id;
  return jsonb_build_object('ok', true, 'already', false, 'product_slug', slug);
end;
$$;


ALTER FUNCTION "public"."claim_license"("p_code" "text", "p_user_id" "uuid") OWNER TO "postgres";

--
-- Name: consume_rate_limit("text", "text", integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."consume_rate_limit"("p_bucket" "text", "p_key_hash" "text", "p_window_seconds" integer, "p_max" integer) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  used integer;
begin
  if p_window_seconds not between 1 and 86400 or p_max not between 1 and 1000 then
    raise exception 'Tham số giới hạn không hợp lệ.';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_bucket || ':' || p_key_hash, 0));

  select count(*) into used
    from public.rate_limit_hits
   where bucket = p_bucket and key_hash = p_key_hash
     and created_at > now() - make_interval(secs => p_window_seconds);
  if used >= p_max then
    return false;
  end if;

  insert into public.rate_limit_hits (bucket, key_hash) values (p_bucket, p_key_hash);
  -- Dọn dần bản ghi cũ hơn 1 ngày (giữ bảng nhỏ, không cần pg_cron).
  delete from public.rate_limit_hits
   where id in (select id from public.rate_limit_hits where created_at < now() - interval '1 day' limit 200);
  return true;
end;
$$;


ALTER FUNCTION "public"."consume_rate_limit"("p_bucket" "text", "p_key_hash" "text", "p_window_seconds" integer, "p_max" integer) OWNER TO "postgres";

--
-- Name: current_staff_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."current_staff_role"() RETURNS "public"."staff_role"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select role
  from public.staff_profiles
  where id = (select auth.uid())
    and account_status = 'active'
$$;


ALTER FUNCTION "public"."current_staff_role"() OWNER TO "postgres";

--
-- Name: event_topics_not_primary(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."event_topics_not_primary"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if exists (select 1 from public.historical_events e where e.id = new.event_id and e.topic_id = new.topic_id) then
    raise exception 'Chủ đề phụ trùng với chủ đề chính của sự kiện.' using errcode = '23514';
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."event_topics_not_primary"() OWNER TO "postgres";

--
-- Name: exam_access("text", "text", "text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_access"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  s public.exam_sets%rowtype;
  l public.licenses%rowtype;
begin
  select * into s from public.exam_sets where slug = p_slug and workflow_status = 'published';
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if s.product_id is null then
    return jsonb_build_object('ok', true, 'access', 'free', 'set_id', s.id);
  end if;
  if p_user_id is not null then
    select * into l from public.licenses
     where user_id = p_user_id and product_id = s.product_id and status = 'active' and (valid_until is null or valid_until >= now())
     order by created_at limit 1;
    if found then
      return jsonb_build_object('ok', true, 'access', 'account', 'set_id', s.id, 'license_id', l.id);
    end if;
  end if;
  select * into l from public.licenses where code = upper(btrim(coalesce(p_code, '')));
  if not found or l.product_id <> s.product_id then
    return jsonb_build_object('ok', false, 'reason', 'invalid_code');
  end if;
  if l.status <> 'active' then
    return jsonb_build_object('ok', false, 'reason', 'revoked');
  end if;
  if l.valid_until is not null and l.valid_until < now() then
    return jsonb_build_object('ok', false, 'reason', 'expired');
  end if;
  update public.license_activations set last_seen_at = now() where license_id = l.id and device_hash = p_device_hash;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_activated');
  end if;
  return jsonb_build_object('ok', true, 'access', 'code', 'set_id', s.id, 'license_id', l.id);
end;
$$;


ALTER FUNCTION "public"."exam_access"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") OWNER TO "postgres";

--
-- Name: exam_admin_overview(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_admin_overview"("p_days" integer) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  with recent as (
    select a.*, (a.started_at at time zone 'Asia/Ho_Chi_Minh')::date as day
      from public.exam_attempts a
     where a.started_at > now() - make_interval(days => least(greatest(coalesce(p_days, 30), 1), 365))
  )
  select jsonb_build_object(
    'days', coalesce((
      select jsonb_agg(jsonb_build_object('day', day, 'exam', exam, 'practice', practice, 'submitted', submitted) order by day)
        from (select day, count(*) filter (where mode in ('exam', 'paper')) as exam,
                     count(*) filter (where mode in ('practice', 'review')) as practice,
                     count(*) filter (where status = 'submitted') as submitted
                from recent group by day) as d), '[]'::jsonb),
    'active_7', (select count(distinct coalesce(user_id::text, device_hash)) from recent where started_at > now() - interval '7 days'),
    'active_period', (select count(distinct coalesce(user_id::text, device_hash)) from recent),
    'accounts_period', (select count(distinct user_id) from recent where user_id is not null),
    'scores', (select jsonb_agg(c order by b) from (
                 select b, (select count(*) from recent r where r.status = 'submitted' and r.mode = 'exam' and r.score10 is not null
                                                          and least(floor(r.score10), 9) = b) as c
                   from generate_series(0, 9) as b) as h),
    'submitted_exams', (select count(*) from recent where status = 'submitted' and mode = 'exam'),
    'reports_open', (select count(*) from public.exam_item_reports where status = 'open')
  );
$$;


ALTER FUNCTION "public"."exam_admin_overview"("p_days" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: exam_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_attempts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "license_id" "uuid",
    "device_hash" "text",
    "set_id" "uuid",
    "mode" "public"."exam_attempt_mode" DEFAULT 'exam'::"public"."exam_attempt_mode" NOT NULL,
    "item_ids" "uuid"[] NOT NULL,
    "sections" smallint[] NOT NULL,
    "choice_shifts" smallint[] NOT NULL,
    "answers" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deadline_at" timestamp with time zone,
    "submitted_at" timestamp with time zone,
    "status" "public"."exam_attempt_status" DEFAULT 'in_progress'::"public"."exam_attempt_status" NOT NULL,
    "score10" numeric(4,2),
    "raw_score" numeric(6,2),
    "max_score" numeric(6,2),
    "breakdown" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "blueprint" "text",
    CONSTRAINT "exam_attempts_answers_check" CHECK ((("jsonb_typeof"("answers") = 'object'::"text") AND ("pg_column_size"("answers") <= 65536))),
    CONSTRAINT "exam_attempts_blueprint_check" CHECK ((("blueprint" IS NULL) OR ("blueprint" ~ '^(thpt_2025|quick_15|tf_only|chu-de-[0-9]{1,2})$'::"text"))),
    CONSTRAINT "exam_attempts_device_check" CHECK ((("device_hash" IS NULL) OR ("device_hash" ~ '^[0-9a-f]{64}$'::"text"))),
    CONSTRAINT "exam_attempts_items_check" CHECK (((("cardinality"("item_ids") >= 1) AND ("cardinality"("item_ids") <= 200)) AND ("cardinality"("sections") = "cardinality"("item_ids")) AND ("cardinality"("choice_shifts") = "cardinality"("item_ids")))),
    CONSTRAINT "exam_attempts_owner_check" CHECK ((("user_id" IS NOT NULL) OR ("device_hash" IS NOT NULL))),
    CONSTRAINT "exam_attempts_submitted_check" CHECK ((("status" = 'submitted'::"public"."exam_attempt_status") = (("submitted_at" IS NOT NULL) AND ("score10" IS NOT NULL))))
);


ALTER TABLE "public"."exam_attempts" OWNER TO "postgres";

--
-- Name: exam_attempt_owner_ok("public"."exam_attempts", "uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_attempt_owner_ok"("a" "public"."exam_attempts", "p_user_id" "uuid", "p_device_hash" "text") RETURNS boolean
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select case when a.user_id is not null then p_user_id is not null and a.user_id = p_user_id
              else coalesce(p_device_hash, '') <> '' and a.device_hash = p_device_hash end;
$$;


ALTER FUNCTION "public"."exam_attempt_owner_ok"("a" "public"."exam_attempts", "p_user_id" "uuid", "p_device_hash" "text") OWNER TO "postgres";

--
-- Name: exam_attempt_view("public"."exam_attempts", boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_attempt_view"("a" "public"."exam_attempts", "p_reveal" boolean) RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select jsonb_build_object(
    'attempt', jsonb_strip_nulls(jsonb_build_object(
      'id', a.id, 'status', a.status, 'mode', a.mode, 'blueprint', a.blueprint, 'started_at', a.started_at, 'deadline_at', a.deadline_at,
      'submitted_at', a.submitted_at, 'server_now', now(),
      'score10', case when p_reveal then a.score10 end, 'raw_score', case when p_reveal then a.raw_score end,
      'max_score', case when p_reveal then a.max_score end, 'breakdown', case when p_reveal then a.breakdown end,
      'regraded_items', case when p_reveal then (select jsonb_agg(distinct l.item_id) from public.exam_regrade_log l where l.attempt_id = a.id) end)),
    'set', (select jsonb_build_object('slug', s.slug, 'title', s.title, 'duration_min', s.duration_min, 'format', s.format,
                                      'free', s.product_id is null)
              from public.exam_sets s where s.id = a.set_id),
    'answers', a.answers,
    'questions', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
               'n', q.n, 'item_id', q.id, 'section', a.sections[q.n], 'kind', q.kind, 'stem', q.stem,
               'choices', case when q.kind = 'mcq' then
                            to_jsonb(array(select q.choices[((k - a.choice_shifts[q.n] + 4) % 4) + 1] from generate_series(0, 3) as k order by k)) end,
               'statements', case when q.kind = 'true_false' then
                            (select jsonb_agg(s.st -> 'text' order by s.ord) from jsonb_array_elements(q.statements) with ordinality as s(st, ord)) end,
               'passage', case when p.id is not null then jsonb_build_object('body', p.body, 'source_citation', p.source_citation) end,
               'checked', case when q.checked then true end,
               'correct_index', case when q.reveal and q.kind = 'mcq' then (q.correct_index + a.choice_shifts[q.n]) % 4 end,
               'truths', case when q.reveal and q.kind = 'true_false' then
                            (select jsonb_agg(s.st -> 'is_true' order by s.ord) from jsonb_array_elements(q.statements) with ordinality as s(st, ord)) end,
               'statement_explanations', case when q.reveal and q.kind = 'true_false' then
                            (select jsonb_agg(s.st -> 'explanation' order by s.ord) from jsonb_array_elements(q.statements) with ordinality as s(st, ord)) end,
               -- Vị trí kiến thức + kiểu bẫy của từng ý (object rỗng khi ý không ghi gì).
               'statement_refs', case when q.reveal and q.kind = 'true_false' then
                            (select jsonb_agg(jsonb_strip_nulls(jsonb_build_object('lesson_slug', s.st -> 'lesson_slug', 'section_id', s.st -> 'section_id',
                                                                                   'ref', s.st -> 'ref', 'trap', s.st -> 'trap')) order by s.ord)
                               from jsonb_array_elements(q.statements) with ordinality as s(st, ord)) end,
               -- Lựa chọn gốc i hiện ở vị trí (i + shift) mod 4 → lời giải xoay đúng như choices.
               'choice_notes', case when q.reveal and q.kind = 'mcq' and q.choice_notes is not null then
                            to_jsonb(array(select q.choice_notes -> ((k - a.choice_shifts[q.n] + 4) % 4) from generate_series(0, 3) as k order by k)) end,
               'explanation', case when q.reveal then q.explanation end,
               'remember', case when q.reveal then q.remember end,
               'level', case when q.reveal then q.level end,
               'lesson_slug', case when q.reveal then q.lesson_slug end,
               'section_id', case when q.reveal then q.section_id end,
               'topic_tag', case when q.reveal then q.topic_tag end,
               'event_slug', case when q.reveal then e.slug end,
               'event_title', case when q.reveal then e.title end,
               'earned_milli', case when q.reveal then
                                 coalesce((a.breakdown -> 'items' -> (q.n::int - 1))::int,
                                          public.exam_item_earned(q.item_row, a.choice_shifts[q.n], a.answers -> q.id::text)) end
             )) order by q.n)
        from (
          select o.n, i.*, i as item_row,
                 coalesce(a.answers -> i.id::text ->> 'checked', '') = 'true' as checked,
                 (p_reveal and a.mode in ('exam', 'paper')) or coalesce(a.answers -> i.id::text ->> 'checked', '') = 'true' as reveal
            from unnest(a.item_ids) with ordinality as o(item_id, n)
            join public.exam_items i on i.id = o.item_id
        ) as q
        left join public.exam_passages p on p.id = q.passage_id
        left join public.historical_events e on e.id = q.event_id and e.workflow_status = 'published'
    ), '[]'::jsonb)
  );
$$;


ALTER FUNCTION "public"."exam_attempt_view"("a" "public"."exam_attempts", "p_reveal" boolean) OWNER TO "postgres";

--
-- Name: exam_clean_answers("public"."exam_attempts", "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_clean_answers"("a" "public"."exam_attempts", "p_answers" "jsonb") RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $_$
  select coalesce(jsonb_object_agg(x.item_id::text, x.answer), '{}'::jsonb)
    from (
      select o.item_id,
             (case when i.kind = 'mcq' and jsonb_typeof(v -> 'choice') = 'number' and (v ->> 'choice') ~ '^[0-3]$'
                     then jsonb_build_object('choice', v -> 'choice')
                   when i.kind = 'mcq' and jsonb_typeof(v -> 'choice') = 'null' then '{"choice": null}'::jsonb
                   else '{}'::jsonb end)
             || (case when i.kind = 'true_false' and jsonb_typeof(v -> 'tf') = 'array' then
                        case when jsonb_array_length(v -> 'tf') = 4
                             then jsonb_build_object('tf', (select jsonb_agg(case when jsonb_typeof(t.e) = 'boolean' then t.e else 'null'::jsonb end order by t.ord)
                                                             from jsonb_array_elements(v -> 'tf') with ordinality as t(e, ord)))
                             else '{}'::jsonb end
                      else '{}'::jsonb end)
             || (case when jsonb_typeof(v -> 'flagged') = 'boolean' then jsonb_build_object('flagged', v -> 'flagged') else '{}'::jsonb end)
             || (case when jsonb_typeof(v -> 'ms') = 'number' and (v ->> 'ms') ~ '^[0-9]{1,8}$' then jsonb_build_object('ms', v -> 'ms') else '{}'::jsonb end)
               as answer
        from unnest(a.item_ids) with ordinality as o(item_id, n)
        join public.exam_items i on i.id = o.item_id
        cross join lateral (select p_answers -> o.item_id::text as v) as given
       where jsonb_typeof(given.v) = 'object'
         and coalesce(a.answers -> o.item_id::text ->> 'checked', '') <> 'true'
    ) as x
   where x.answer <> '{}'::jsonb;
$_$;


ALTER FUNCTION "public"."exam_clean_answers"("a" "public"."exam_attempts", "p_answers" "jsonb") OWNER TO "postgres";

--
-- Name: exam_fold("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_fold"("p_text" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE PARALLEL SAFE
    SET "search_path" TO ''
    AS $$
  select regexp_replace(
           replace(regexp_replace(normalize(lower(coalesce(p_text, '')), NFD), '[̀-ͯ]', '', 'g'), 'đ', 'd'),
           '[^a-z0-9]+', '', 'g');
$$;


ALTER FUNCTION "public"."exam_fold"("p_text" "text") OWNER TO "postgres";

--
-- Name: exam_grade_attempt("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_grade_attempt"("p_attempt_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
  a public.exam_attempts%rowtype;
  v_raw bigint;
  v_max bigint;
  v_hundredths bigint;
  v_breakdown jsonb;
  g record;
begin
  select * into a from public.exam_attempts where id = p_attempt_id for update;
  if not found or a.status <> 'in_progress' then
    return;
  end if;

  create temporary table if not exists pg_temp.exam_graded (
    n bigint, item_id uuid, kind public.exam_item_kind, lesson_slug text, level public.exam_item_level, has_passage boolean,
    section smallint, max_milli integer, earned integer, answered boolean
  ) on commit drop;
  -- Supabase bật pg_safeupdate cho kết nối qua API: DELETE phải có WHERE.
  delete from pg_temp.exam_graded where true;
  insert into pg_temp.exam_graded
  select o.n, i.id, i.kind, i.lesson_slug, i.level, i.passage_id is not null, a.sections[o.n],
         case when included then (case when i.kind = 'mcq' then 250 else 1000 end) else 0 end,
         case when included then public.exam_item_earned(i, a.choice_shifts[o.n], v) else 0 end,
         included and (case when i.kind = 'mcq' then (v ->> 'choice') is not null
                            else exists (select 1 from jsonb_array_elements(coalesce(v -> 'tf', '[]'::jsonb)) as t(e) where jsonb_typeof(t.e) = 'boolean') end)
    from unnest(a.item_ids) with ordinality as o(item_id, n)
    join public.exam_items i on i.id = o.item_id
    cross join lateral (select a.answers -> o.item_id::text as v) as given
    cross join lateral (select a.mode in ('exam', 'paper') or coalesce(v ->> 'checked', '') = 'true' as included) as inc;

  select coalesce(sum(earned), 0), coalesce(sum(max_milli), 0) into v_raw, v_max from pg_temp.exam_graded;
  v_breakdown := jsonb_build_object(
    'items', coalesce((select jsonb_agg(earned order by n) from pg_temp.exam_graded), '[]'::jsonb),
    'correct', (select count(*) from pg_temp.exam_graded where max_milli > 0 and earned = max_milli),
    'unanswered', (select count(*) from pg_temp.exam_graded where max_milli > 0 and not answered),
    'total', (select count(*) from pg_temp.exam_graded where max_milli > 0),
    'raw_milli', v_raw,
    'max_milli', v_max
  ) || coalesce((
    select jsonb_object_agg(dim, by_key) from (
      select dim, jsonb_object_agg(key, jsonb_build_object('earned', earned, 'max', max, 'n', n)) as by_key
        from (
          select 'sections' as dim, section::text as key, sum(earned) as earned, sum(max_milli) as max, count(*) as n
            from pg_temp.exam_graded where max_milli > 0 group by section
          union all
          select 'lessons', coalesce(lesson_slug, '_'), sum(earned), sum(max_milli), count(*) from pg_temp.exam_graded where max_milli > 0 group by lesson_slug
          union all
          select 'levels', level::text, sum(earned), sum(max_milli), count(*) from pg_temp.exam_graded where max_milli > 0 group by level
          union all
          select 'kinds', kind::text, sum(earned), sum(max_milli), count(*) from pg_temp.exam_graded where max_milli > 0 group by kind
          union all
          select 'kinds', 'passage', sum(earned), sum(max_milli), count(*) from pg_temp.exam_graded where max_milli > 0 and has_passage having count(*) > 0
        ) as groups
       group by dim
    ) as d
  ), '{}'::jsonb);

  v_hundredths := case when v_max = 0 then 0 else (2000 * v_raw + v_max) / (2 * v_max) end;
  update public.exam_attempts
     set status = 'submitted', submitted_at = now(), score10 = v_hundredths / 100.0,
         raw_score = round(v_raw / 1000.0, 2), max_score = round(v_max / 1000.0, 2), breakdown = v_breakdown
   where id = a.id;

  -- Sổ câu sai: chỉ lượt thi của tài khoản (luyện tập cập nhật ngay lúc kiểm tra từng câu).
  if a.user_id is not null and a.mode = 'exam' then
    for g in select item_id, earned = max_milli as right from pg_temp.exam_graded where answered loop
      perform public.exam_leitner_apply(a.user_id, g.item_id, g.right);
    end loop;
  end if;
end;
$$;


ALTER FUNCTION "public"."exam_grade_attempt"("p_attempt_id" "uuid") OWNER TO "postgres";

--
-- Name: exam_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "kind" "public"."exam_item_kind" NOT NULL,
    "stem" "text" NOT NULL,
    "passage_id" "uuid",
    "choices" "text"[],
    "correct_index" smallint,
    "statements" "jsonb",
    "explanation" "text" NOT NULL,
    "grade" smallint DEFAULT 12 NOT NULL,
    "lesson_slug" "text",
    "topic_tag" "text",
    "level" "public"."exam_item_level" NOT NULL,
    "competency" "public"."exam_competency" NOT NULL,
    "event_id" "uuid",
    "source_note" "text" NOT NULL,
    "workflow_status" "public"."content_workflow_status" DEFAULT 'draft'::"public"."content_workflow_status" NOT NULL,
    "review_note" "text",
    "fingerprint" "text" NOT NULL,
    "legacy_question_id" "uuid",
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "section_id" "text",
    "choice_notes" "jsonb",
    "remember" "text",
    "content_key" "text",
    CONSTRAINT "exam_items_choice_notes_kind_check" CHECK ((("choice_notes" IS NULL) OR ("kind" = 'mcq'::"public"."exam_item_kind"))),
    CONSTRAINT "exam_items_content_key_check" CHECK ((("content_key" IS NULL) OR ("content_key" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text"))),
    CONSTRAINT "exam_items_correct_check" CHECK ((("correct_index" >= 0) AND ("correct_index" <= 3))),
    CONSTRAINT "exam_items_explanation_check" CHECK ((("char_length"("btrim"("explanation")) >= 5) AND ("char_length"("btrim"("explanation")) <= 2000))),
    CONSTRAINT "exam_items_grade_check" CHECK (("grade" = ANY (ARRAY[11, 12]))),
    CONSTRAINT "exam_items_lesson_check" CHECK ((("lesson_slug" IS NULL) OR ("lesson_slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text"))),
    CONSTRAINT "exam_items_remember_check" CHECK ((("remember" IS NULL) OR (("char_length"("btrim"("remember")) >= 10) AND ("char_length"("btrim"("remember")) <= 300)))),
    CONSTRAINT "exam_items_section_check" CHECK ((("section_id" IS NULL) OR (("section_id" ~ '^muc-[0-9]{1,2}$'::"text") AND ("lesson_slug" IS NOT NULL)))),
    CONSTRAINT "exam_items_shape_check" CHECK (((("kind" = 'mcq'::"public"."exam_item_kind") AND ("choices" IS NOT NULL) AND ("correct_index" IS NOT NULL) AND ("statements" IS NULL)) OR (("kind" = 'true_false'::"public"."exam_item_kind") AND ("statements" IS NOT NULL) AND ("choices" IS NULL) AND ("correct_index" IS NULL)))),
    CONSTRAINT "exam_items_source_check" CHECK ((("char_length"("btrim"("source_note")) >= 3) AND ("char_length"("btrim"("source_note")) <= 500))),
    CONSTRAINT "exam_items_stem_check" CHECK ((("char_length"("btrim"("stem")) >= 5) AND ("char_length"("btrim"("stem")) <= 800))),
    CONSTRAINT "exam_items_topic_check" CHECK ((("topic_tag" IS NULL) OR (("char_length"("btrim"("topic_tag")) >= 2) AND ("char_length"("btrim"("topic_tag")) <= 60))))
);


ALTER TABLE "public"."exam_items" OWNER TO "postgres";

--
-- Name: COLUMN "exam_items"."section_id"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "public"."exam_items"."section_id" IS 'Mục SGK (muc-N) chứa kiến thức chính của câu, cùng lesson_slug.';


--
-- Name: COLUMN "exam_items"."choice_notes"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "public"."exam_items"."choice_notes" IS 'Câu trắc nghiệm: 4 lời giải theo thứ tự lựa chọn GỐC — { note, lesson_slug?, section_id?, ref?, trap? }.';


--
-- Name: COLUMN "exam_items"."remember"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "public"."exam_items"."remember" IS '"Ghi nhớ": một câu chốt kiến thức, hiện sau khi lộ đáp án.';


--
-- Name: COLUMN "exam_items"."content_key"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "public"."exam_items"."content_key" IS 'Khóa ổn định (vd. b7-m3-tn-05) để seed chạy lại được và đề tham chiếu câu.';


--
-- Name: exam_item_earned("public"."exam_items", smallint, "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_item_earned"("p_item" "public"."exam_items", "p_shift" smallint, "p_answer" "jsonb") RETURNS integer
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select case when p_item.kind = 'mcq' then
                case when (p_answer ->> 'choice') = ((p_item.correct_index + p_shift) % 4)::text then 250 else 0 end
              else (array[0, 100, 250, 500, 1000])[1 + (
                     select count(*) from jsonb_array_elements(p_item.statements) with ordinality as s(st, ord)
                      where (p_answer -> 'tf' -> (s.ord::int - 1)) = (s.st -> 'is_true'))]
         end;
$$;


ALTER FUNCTION "public"."exam_item_earned"("p_item" "public"."exam_items", "p_shift" smallint, "p_answer" "jsonb") OWNER TO "postgres";

--
-- Name: exam_item_fingerprint("public"."exam_item_kind", "text", "text"[], "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_item_fingerprint"("p_kind" "public"."exam_item_kind", "p_stem" "text", "p_choices" "text"[], "p_statements" "jsonb") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE PARALLEL SAFE
    SET "search_path" TO ''
    AS $$
  select public.exam_fold(p_stem) || '|' || coalesce(
    case when p_kind = 'mcq'
      then (select string_agg(f, '|' order by f collate "C") from (select public.exam_fold(c) as f from unnest(p_choices) as c) as x)
      else (select string_agg(f, '|' order by f collate "C")
              from (select public.exam_fold(s ->> 'text') as f from jsonb_array_elements(p_statements) as s) as x)
    end, '');
$$;


ALTER FUNCTION "public"."exam_item_fingerprint"("p_kind" "public"."exam_item_kind", "p_stem" "text", "p_choices" "text"[], "p_statements" "jsonb") OWNER TO "postgres";

--
-- Name: exam_item_integrity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_item_integrity"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $_$
declare
  r record;
  traps constant text[] := array['thoi_gian', 'chu_the', 'dia_diem', 'so_lieu', 'nhan_qua', 'tuyet_doi', 'khai_niem', 'ban_chat'];
begin
  if new.kind = 'mcq' then
    -- Trigger BEFORE chạy trước CHECK nên tự kiểm null.
    if new.choices is null or cardinality(new.choices) <> 4 then
      raise exception 'Câu trắc nghiệm cần đúng 4 lựa chọn.';
    end if;
    if exists (select 1 from unnest(new.choices) as c where c is null or btrim(c) = '' or char_length(c) > 300) then
      raise exception 'Mỗi lựa chọn phải có nội dung (tối đa 300 ký tự).';
    end if;
    if (select count(distinct lower(btrim(c))) from unnest(new.choices) as c) <> 4 then
      raise exception 'Bốn lựa chọn không được trùng nhau.';
    end if;
    if new.choice_notes is not null then
      if jsonb_typeof(new.choice_notes) is distinct from 'array' then
        raise exception 'Lời giải từng lựa chọn cần đúng 4 phần tử.';
      end if;
      if jsonb_array_length(new.choice_notes) <> 4 then
        raise exception 'Lời giải từng lựa chọn cần đúng 4 phần tử.';
      end if;
      if exists (
        select 1 from jsonb_array_elements(new.choice_notes) as n(value)
         where jsonb_typeof(n.value) is distinct from 'object'
            or jsonb_typeof(n.value -> 'note') is distinct from 'string'
      ) then
        raise exception 'Mỗi lựa chọn cần một lời giải (note).';
      end if;
      if exists (select 1 from jsonb_array_elements(new.choice_notes) as n(value) where char_length(btrim(n.value ->> 'note')) not between 10 and 500) then
        raise exception 'Lời giải từng lựa chọn dài 10–500 ký tự.';
      end if;
    end if;
  else
    if new.choice_notes is not null then
      raise exception 'Câu Đúng/Sai không có lời giải theo lựa chọn — ghi lời giải ở từng ý.';
    end if;
    -- Hai lệnh if riêng: OR không bảo đảm thứ tự, jsonb_array_length lỗi khi không phải mảng.
    if jsonb_typeof(new.statements) is distinct from 'array' then
      raise exception 'Câu Đúng/Sai cần đúng 4 ý.';
    end if;
    if jsonb_array_length(new.statements) <> 4 then
      raise exception 'Câu Đúng/Sai cần đúng 4 ý.';
    end if;
    if exists (
      select 1 from jsonb_array_elements(new.statements) as s(value)
       where jsonb_typeof(s.value -> 'text') is distinct from 'string'
          or jsonb_typeof(s.value -> 'is_true') is distinct from 'boolean'
          or jsonb_typeof(s.value -> 'explanation') is distinct from 'string'
    ) then
      raise exception 'Mỗi ý Đúng/Sai cần nội dung, đáp án Đúng hoặc Sai và lời giải riêng.';
    end if;
    if exists (
      select 1 from jsonb_array_elements(new.statements) as s(value)
       where char_length(btrim(s.value ->> 'text')) not between 5 and 500
          or char_length(btrim(s.value ->> 'explanation')) not between 5 and 1000
    ) then
      raise exception 'Mỗi ý Đúng/Sai dài 5–500 ký tự, lời giải từng ý dài 5–1000 ký tự.';
    end if;
  end if;

  -- Vị trí kiến thức + kiểu bẫy của từng lựa chọn / từng ý (đều tùy chọn; JSON null coi như không có).
  for r in
    select n.value as e, n.ord::int - 1 as slot, true as is_choice
      from jsonb_array_elements(case when new.kind = 'mcq' then coalesce(new.choice_notes, '[]'::jsonb) else '[]'::jsonb end) with ordinality as n(value, ord)
    union all
    select s.value, s.ord::int - 1, false
      from jsonb_array_elements(case when new.kind = 'true_false' then new.statements else '[]'::jsonb end) with ordinality as s(value, ord)
  loop
    if nullif(r.e -> 'lesson_slug', 'null'::jsonb) is not null
       and (jsonb_typeof(r.e -> 'lesson_slug') <> 'string' or (r.e ->> 'lesson_slug') !~ '^[a-z0-9]+(-[a-z0-9]+)*$') then
      raise exception 'Bài SGK của lựa chọn / ý không hợp lệ.';
    end if;
    if nullif(r.e -> 'section_id', 'null'::jsonb) is not null
       and (jsonb_typeof(r.e -> 'section_id') <> 'string' or (r.e ->> 'section_id') !~ '^muc-[0-9]{1,2}$') then
      raise exception 'Mục SGK của lựa chọn / ý phải có dạng muc-N.';
    end if;
    if nullif(r.e -> 'ref', 'null'::jsonb) is not null
       and (jsonb_typeof(r.e -> 'ref') <> 'string' or char_length(btrim(r.e ->> 'ref')) not between 3 and 160) then
      raise exception 'Vị trí kiến thức (ref) dài 3–160 ký tự.';
    end if;
    if nullif(r.e -> 'trap', 'null'::jsonb) is not null then
      if jsonb_typeof(r.e -> 'trap') <> 'string' or not ((r.e ->> 'trap') = any (traps)) then
        raise exception 'Kiểu bẫy không hợp lệ.';
      end if;
      if (r.is_choice and r.slot = new.correct_index) or (not r.is_choice and (r.e -> 'is_true')::boolean) then
        raise exception 'Kiểu bẫy chỉ ghi ở lựa chọn / ý SAI.';
      end if;
    end if;
  end loop;

  -- Chỉ giữ các khóa đã biết, bỏ khoảng trắng thừa — khóa lạ không lọt vào dữ liệu trả cho học sinh.
  if new.kind = 'mcq' and new.choice_notes is not null then
    new.choice_notes := (
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
               'note', btrim(n.value ->> 'note'), 'lesson_slug', n.value ->> 'lesson_slug', 'section_id', n.value ->> 'section_id',
               'ref', btrim(n.value ->> 'ref'), 'trap', n.value ->> 'trap')) order by n.ord)
        from jsonb_array_elements(new.choice_notes) with ordinality as n(value, ord)
    );
  end if;
  if new.kind = 'true_false' then
    new.statements := (
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
               'text', btrim(s.value ->> 'text'), 'is_true', (s.value -> 'is_true')::boolean, 'explanation', btrim(s.value ->> 'explanation'),
               'lesson_slug', s.value ->> 'lesson_slug', 'section_id', s.value ->> 'section_id', 'ref', btrim(s.value ->> 'ref'),
               'trap', s.value ->> 'trap')) order by s.ord)
        from jsonb_array_elements(new.statements) with ordinality as s(value, ord)
    );
  end if;
  new.fingerprint := public.exam_item_fingerprint(new.kind, new.stem, new.choices, new.statements);
  return new;
end;
$_$;


ALTER FUNCTION "public"."exam_item_integrity"() OWNER TO "postgres";

--
-- Name: exam_item_stats("uuid"[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_item_stats"("p_item_ids" "uuid"[]) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  with picks as (
    select a.score10, o.item_id, a.choice_shifts[o.n] as shift, a.answers -> o.item_id::text as ans,
           (a.breakdown -> 'items' ->> (o.n::int - 1))::int as earned
      from public.exam_attempts a
      cross join lateral unnest(a.item_ids) with ordinality as o(item_id, n)
     where a.status = 'submitted' and a.mode = 'exam' and a.breakdown is not null
       and o.item_id = any(p_item_ids)
  ), ranked as (
    select p.*, i.kind, i.statements,
           p.earned::numeric / (case when i.kind = 'mcq' then 250 else 1000 end) as ratio,
           percent_rank() over (partition by p.item_id order by p.score10) as pr,
           case when i.kind = 'mcq' and (p.ans ->> 'choice') is not null
                then (((p.ans ->> 'choice')::int - p.shift + 4) % 4) end as original_choice
      from picks p
      join public.exam_items i on i.id = p.item_id
  )
  select coalesce(jsonb_object_agg(item_id, stats), '{}'::jsonb)
    from (
      select r.item_id, jsonb_build_object(
               'n', count(*),
               'p', round(avg(r.ratio), 3),
               'disc', round(coalesce(avg(r.ratio) filter (where r.pr >= 0.73), 0) - coalesce(avg(r.ratio) filter (where r.pr <= 0.27), 0), 3),
               'choices', case when r.kind = 'mcq' then jsonb_build_array(
                            count(*) filter (where r.original_choice = 0), count(*) filter (where r.original_choice = 1),
                            count(*) filter (where r.original_choice = 2), count(*) filter (where r.original_choice = 3)) end,
               'blank', count(*) filter (where r.kind = 'mcq' and r.original_choice is null),
               'statements', case when r.kind = 'true_false' then (
                 select jsonb_agg(t.v order by t.k)
                   from (select s.k, round(avg(case when (x.ans -> 'tf' ->> s.k) is not null
                                                     and (x.ans -> 'tf' ->> s.k)::boolean = (x.statements -> s.k ->> 'is_true')::boolean
                                                    then 1 else 0 end), 3) as v
                           from ranked x cross join generate_series(0, 3) as s(k)
                          where x.item_id = r.item_id
                          group by s.k) as t) end
             ) as stats
        from ranked r
       group by r.item_id, r.kind
    ) as per_item;
$$;


ALTER FUNCTION "public"."exam_item_stats"("p_item_ids" "uuid"[]) OWNER TO "postgres";

--
-- Name: exam_leitner_apply("uuid", "uuid", boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_leitner_apply"("p_user_id" "uuid", "p_item_id" "uuid", "p_right" boolean) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
  s public.learner_item_state%rowtype;
  intervals constant integer[] := array[1, 3, 7, 14, 30];
begin
  select * into s from public.learner_item_state where user_id = p_user_id and item_id = p_item_id for update;
  if not found then
    insert into public.learner_item_state (user_id, item_id, box, due_at, wrong_count, right_count, in_notebook)
    values (p_user_id, p_item_id, 1, case when p_right then null else public.exam_vn_day(1) end,
            case when p_right then 0 else 1 end, case when p_right then 1 else 0 end, not p_right);
    return;
  end if;
  if not p_right then
    update public.learner_item_state
       set box = 1, due_at = public.exam_vn_day(1), wrong_count = wrong_count + 1, in_notebook = true, last_answer_at = now()
     where user_id = p_user_id and item_id = p_item_id;
  elsif s.in_notebook and s.box >= 5 then
    update public.learner_item_state
       set in_notebook = false, due_at = null, right_count = right_count + 1, last_answer_at = now()
     where user_id = p_user_id and item_id = p_item_id;
  elsif s.in_notebook then
    update public.learner_item_state
       set box = s.box + 1, due_at = public.exam_vn_day(intervals[s.box + 1]), right_count = right_count + 1, last_answer_at = now()
     where user_id = p_user_id and item_id = p_item_id;
  else
    update public.learner_item_state set right_count = right_count + 1, last_answer_at = now()
     where user_id = p_user_id and item_id = p_item_id;
  end if;
end;
$$;


ALTER FUNCTION "public"."exam_leitner_apply"("p_user_id" "uuid", "p_item_id" "uuid", "p_right" boolean) OWNER TO "postgres";

--
-- Name: exam_open_attempt("uuid", "uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_open_attempt"("p_set_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") RETURNS "public"."exam_attempts"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select a.* from public.exam_attempts a
   where a.set_id = p_set_id and a.status = 'in_progress' and a.mode = 'exam'
     and (a.deadline_at is null or a.deadline_at > now())
     and public.exam_attempt_owner_ok(a, p_user_id, p_device_hash)
   order by a.started_at desc limit 1;
$$;


ALTER FUNCTION "public"."exam_open_attempt"("p_set_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") OWNER TO "postgres";

--
-- Name: exam_open_generated("text", "uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_open_generated"("p_blueprint" "text", "p_user_id" "uuid", "p_device_hash" "text") RETURNS "public"."exam_attempts"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select a.* from public.exam_attempts a
   where a.blueprint = p_blueprint and a.status = 'in_progress' and a.mode = 'exam'
     and (a.deadline_at is null or a.deadline_at > now())
     and public.exam_attempt_owner_ok(a, p_user_id, p_device_hash)
   order by a.started_at desc limit 1;
$$;


ALTER FUNCTION "public"."exam_open_generated"("p_blueprint" "text", "p_user_id" "uuid", "p_device_hash" "text") OWNER TO "postgres";

--
-- Name: exam_pack_license("text", "text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_pack_license"("p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select coalesce(
    (select l.id from public.licenses l join public.products p on p.id = l.product_id and p.kind = 'exam_pack'
      where p_user_id is not null and l.user_id = p_user_id and l.status = 'active' and (l.valid_until is null or l.valid_until >= now())
      order by l.created_at limit 1),
    (select l.id from public.licenses l join public.products p on p.id = l.product_id and p.kind = 'exam_pack'
       join public.license_activations la on la.license_id = l.id and la.device_hash = p_device_hash
      where l.code = upper(btrim(coalesce(p_code, ''))) and l.status = 'active' and (l.valid_until is null or l.valid_until >= now())
      limit 1)
  );
$$;


ALTER FUNCTION "public"."exam_pack_license"("p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") OWNER TO "postgres";

--
-- Name: exam_question_integrity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_question_integrity"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if exists (select 1 from unnest(new.choices) as c where c is null or btrim(c) = '' or char_length(c) > 300) then
    raise exception 'Mỗi đáp án phải có nội dung (tối đa 300 ký tự).';
  end if;
  if (select count(distinct lower(btrim(c))) from unnest(new.choices) as c) <> 4 then
    raise exception 'Bốn đáp án không được trùng nhau.';
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."exam_question_integrity"() OWNER TO "postgres";

--
-- Name: exam_set_published_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_set_published_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if tg_op = 'UPDATE' then
    new.published_at := old.published_at;
  else
    new.published_at := null;
  end if;
  if new.workflow_status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."exam_set_published_at"() OWNER TO "postgres";

--
-- Name: exam_vn_day(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."exam_vn_day"("p_days" integer) RETURNS timestamp with time zone
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select (((now() at time zone 'Asia/Ho_Chi_Minh')::date + p_days)::timestamp) at time zone 'Asia/Ho_Chi_Minh';
$$;


ALTER FUNCTION "public"."exam_vn_day"("p_days" integer) OWNER TO "postgres";

--
-- Name: expire_stale_orders(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."expire_stale_orders"() RETURNS integer
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  with expired as (
    update public.orders set status = 'expired'
     where status = 'pending' and expires_at < now()
    returning 1
  )
  select count(*)::integer from expired;
$$;


ALTER FUNCTION "public"."expire_stale_orders"() OWNER TO "postgres";

--
-- Name: find_auth_user_by_email("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."find_auth_user_by_email"("p_email" "text") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select id from auth.users where lower(email) = lower(btrim(coalesce(p_email, ''))) order by created_at limit 1;
$$;


ALTER FUNCTION "public"."find_auth_user_by_email"("p_email" "text") OWNER TO "postgres";

--
-- Name: find_published_locations_within_radius(double precision, double precision, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."find_published_locations_within_radius"("center_lat" double precision, "center_lng" double precision, "radius_m" double precision) RETURNS TABLE("id" "uuid", "name" "text", "slug" "text", "latitude" numeric, "longitude" numeric, "accuracy_level" "text", "distance_m" double precision)
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO ''
    AS $$
declare
  center extensions.geography;
begin
  -- Bán kính không hợp lệ bị từ chối (UC03)
  if radius_m is null or radius_m <= 0 or radius_m > 2000000 then
    raise exception 'Bán kính không hợp lệ: phải lớn hơn 0 và không quá 2.000.000 mét';
  end if;

  if center_lat is null or center_lng is null
     or center_lat not between -90 and 90
     or center_lng not between -180 and 180 then
    raise exception 'Tọa độ tâm không hợp lệ';
  end if;

  center := extensions.st_setsrid(
              extensions.st_makepoint(center_lng, center_lat), 4326
            )::extensions.geography;

  return query
    select l.id, l.name, l.slug, l.latitude, l.longitude, l.accuracy_level,
           extensions.st_distance(l.geom, center)
    from public.historical_locations l
    where l.workflow_status = 'published'
      and l.geom is not null
      and extensions.st_dwithin(l.geom, center, radius_m)
    order by 7;  -- sắp theo khoảng cách, gần nhất trước
end;
$$;


ALTER FUNCTION "public"."find_published_locations_within_radius"("center_lat" double precision, "center_lng" double precision, "radius_m" double precision) OWNER TO "postgres";

--
-- Name: get_attempt_result("uuid", "uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."get_attempt_result"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  a public.exam_attempts%rowtype;
begin
  select * into a from public.exam_attempts where id = p_attempt_id;
  if not found or not public.exam_attempt_owner_ok(a, p_user_id, p_device_hash) then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if a.status = 'in_progress' and a.deadline_at is not null and now() > a.deadline_at + interval '30 seconds' then
    perform public.exam_grade_attempt(a.id);
    select * into a from public.exam_attempts where id = p_attempt_id;
  end if;
  return jsonb_build_object('ok', true) || public.exam_attempt_view(a, a.status = 'submitted');
end;
$$;


ALTER FUNCTION "public"."get_attempt_result"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") OWNER TO "postgres";

--
-- Name: get_exam_intro("text", "text", "text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."get_exam_intro"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  access jsonb;
  open_attempt public.exam_attempts%rowtype;
begin
  access := public.exam_access(p_slug, p_code, p_device_hash, p_user_id);
  if (access ->> 'ok')::boolean is not true then
    return access;
  end if;
  open_attempt := public.exam_open_attempt((access ->> 'set_id')::uuid, p_user_id, p_device_hash);
  return jsonb_build_object(
    'ok', true,
    'access', access ->> 'access',
    'question_count', (select count(*) from public.exam_set_items si join public.exam_items i on i.id = si.item_id
                        where si.set_id = (access ->> 'set_id')::uuid and i.workflow_status = 'published'),
    'in_progress', case when open_attempt.id is not null
                        then jsonb_build_object('id', open_attempt.id, 'deadline_at', open_attempt.deadline_at, 'server_now', now()) end
  );
end;
$$;


ALTER FUNCTION "public"."get_exam_intro"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") OWNER TO "postgres";

--
-- Name: get_exam_set("text", "text", "text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."get_exam_set"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid" DEFAULT NULL::"uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  s public.exam_sets%rowtype;
  l public.licenses%rowtype;
  access text := 'free';
begin
  select * into s from public.exam_sets where slug = p_slug and workflow_status = 'published';
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if s.product_id is not null then
    if p_user_id is not null and exists (
      select 1 from public.licenses
       where user_id = p_user_id and product_id = s.product_id and status = 'active'
         and (valid_until is null or valid_until >= now())
    ) then
      access := 'account';
    else
      select * into l from public.licenses where code = upper(btrim(coalesce(p_code, '')));
      if not found or l.product_id <> s.product_id then
        return jsonb_build_object('ok', false, 'reason', 'invalid_code');
      end if;
      if l.status <> 'active' then
        return jsonb_build_object('ok', false, 'reason', 'revoked');
      end if;
      if l.valid_until is not null and l.valid_until < now() then
        return jsonb_build_object('ok', false, 'reason', 'expired');
      end if;
      update public.license_activations set last_seen_at = now()
       where license_id = l.id and device_hash = p_device_hash;
      if not found then
        return jsonb_build_object('ok', false, 'reason', 'not_activated');
      end if;
      access := 'code';
    end if;
  end if;

  return jsonb_build_object(
    'ok', true,
    'access', access,
    'set', jsonb_build_object('slug', s.slug, 'title', s.title, 'description', s.description,
                              'duration_min', s.duration_min, 'free', s.product_id is null),
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object(
               'position', x.n, 'question', x.stem,
               -- lựa chọn ở vị trí mới k lấy từ vị trí gốc (k - shift) mod 4
               'choices', to_jsonb(array(select x.choices[((k - x.choice_shift + 4) % 4) + 1] from generate_series(0, 3) as k order by k)),
               'correct_index', (x.correct_index + x.choice_shift) % 4,
               'explanation', x.explanation, 'lesson_slug', x.lesson_slug,
               'event_slug', x.event_slug, 'event_title', x.event_title
             ) order by x.n)
      from (
        select row_number() over (order by si.section, si.position) as n, i.stem, i.choices, i.correct_index,
               si.choice_shift, i.explanation, i.lesson_slug, e.slug as event_slug, e.title as event_title
          from public.exam_set_items si
          join public.exam_items i on i.id = si.item_id and i.workflow_status = 'published' and i.kind = 'mcq'
          left join public.historical_events e on e.id = i.event_id and e.workflow_status = 'published'
         where si.set_id = s.id
      ) as x
    ), '[]'::jsonb)
  );
end;
$$;


ALTER FUNCTION "public"."get_exam_set"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") OWNER TO "postgres";

--
-- Name: get_generated_intro("uuid", "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."get_generated_intro"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  pack uuid;
  open_attempt public.exam_attempts%rowtype;
begin
  pack := public.exam_pack_license(p_code, p_device_hash, p_user_id);
  if pack is null then
    return jsonb_build_object('ok', false, 'reason', 'pack_required');
  end if;
  open_attempt := public.exam_open_generated(p_blueprint, p_user_id, p_device_hash);
  return jsonb_build_object(
    'ok', true,
    'access', case when p_user_id is not null and exists (select 1 from public.licenses where id = pack and user_id = p_user_id) then 'account' else 'code' end,
    'in_progress', case when open_attempt.id is not null
                        then jsonb_build_object('id', open_attempt.id, 'deadline_at', open_attempt.deadline_at, 'server_now', now()) end
  );
end;
$$;


ALTER FUNCTION "public"."get_generated_intro"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text") OWNER TO "postgres";

--
-- Name: get_notebook("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."get_notebook"("p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select jsonb_build_object(
    'total', (select count(*) from public.learner_item_state s join public.exam_items i on i.id = s.item_id and i.workflow_status = 'published'
               where s.user_id = p_user_id and s.in_notebook),
    'due', (select count(*) from public.learner_item_state s join public.exam_items i on i.id = s.item_id and i.workflow_status = 'published'
             where s.user_id = p_user_id and s.in_notebook and s.due_at <= now()),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object('item_id', i.id, 'kind', i.kind, 'stem', i.stem, 'lesson_slug', i.lesson_slug, 'box', s.box,
                                          'due_at', s.due_at, 'wrong_count', s.wrong_count) order by s.due_at, i.stem)
        from public.learner_item_state s
        join public.exam_items i on i.id = s.item_id and i.workflow_status = 'published'
       where s.user_id = p_user_id and s.in_notebook
    ), '[]'::jsonb)
  );
$$;


ALTER FUNCTION "public"."get_notebook"("p_user_id" "uuid") OWNER TO "postgres";

--
-- Name: mark_order_paid(bigint, integer, "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."mark_order_paid"("p_order_code" bigint, "p_amount" integer, "p_provider" "text", "p_provider_ref" "text", "p_license_code" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  o public.orders%rowtype;
  p public.products%rowtype;
  existing_code text;
begin
  select * into o from public.orders where order_code = p_order_code for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  select * into p from public.products where id = o.product_id;

  if o.status = 'paid' then
    select code into existing_code from public.licenses where order_id = o.id;
    return jsonb_build_object('ok', true, 'already', true, 'kind', p.kind, 'license_code', existing_code);
  end if;

  if o.provider <> p_provider then
    return jsonb_build_object('ok', false, 'reason', 'invalid_status', 'status', o.status);
  end if;

  if o.status not in ('pending', 'expired') then
    insert into public.payment_events (order_code, provider, source, signature_ok, status, amount_vnd, provider_ref, note)
      values (p_order_code, p_provider, 'reconcile', true, 'paid', p_amount, p_provider_ref, 'paid_after_' || o.status);
    return jsonb_build_object('ok', false, 'reason', 'invalid_status', 'status', o.status);
  end if;

  if p_amount is distinct from o.amount_vnd then
    insert into public.payment_events (order_code, provider, source, signature_ok, status, amount_vnd, provider_ref, note)
      values (p_order_code, p_provider, 'reconcile', true, 'paid', p_amount, p_provider_ref, 'amount_mismatch');
    return jsonb_build_object('ok', false, 'reason', 'amount_mismatch', 'status', o.status);
  end if;

  update public.orders
     set status = 'paid', paid_at = now(), provider_ref = p_provider_ref
   where id = o.id;

  if p.kind = 'exam_pack' then
    insert into public.licenses (order_id, product_id, code, max_devices, valid_until, user_id)
      values (o.id, coalesce(p.grants_product_id, p.id), p_license_code, p.max_devices,
              case when p.duration_days is not null then now() + make_interval(days => p.duration_days) else p.valid_until end,
              o.user_id);
    return jsonb_build_object('ok', true, 'already', false, 'kind', p.kind, 'license_code', p_license_code);
  end if;

  return jsonb_build_object('ok', true, 'already', false, 'kind', p.kind, 'license_code', null);
end;
$$;


ALTER FUNCTION "public"."mark_order_paid"("p_order_code" bigint, "p_amount" integer, "p_provider" "text", "p_provider_ref" "text", "p_license_code" "text") OWNER TO "postgres";

--
-- Name: media_owner_status("uuid", "uuid", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."media_owner_status"("p_event" "uuid", "p_figure" "uuid", "p_location" "uuid") RETURNS "text"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select coalesce(
    (select e.workflow_status::text from public.historical_events e where e.id = p_event),
    (select f.workflow_status::text from public.historical_figures f where f.id = p_figure),
    (select l.workflow_status::text from public.historical_locations l where l.id = p_location)
  )
$$;


ALTER FUNCTION "public"."media_owner_status"("p_event" "uuid", "p_figure" "uuid", "p_location" "uuid") OWNER TO "postgres";

--
-- Name: order_integrity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."order_integrity"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if new.order_code <> old.order_code or new.product_id <> old.product_id
     or new.amount_vnd <> old.amount_vnd or new.provider <> old.provider
     or new.access_token_hash <> old.access_token_hash then
    raise exception 'Không được sửa mã đơn, sản phẩm, số tiền, cổng thanh toán hoặc token của đơn hàng.';
  end if;
  if new.user_id is distinct from old.user_id and new.user_id is not null then
    raise exception 'Không được gán lại tài khoản của đơn hàng.';
  end if;
  if new.status is distinct from old.status and not (
       (old.status = 'pending' and new.status in ('paid', 'cancelled', 'expired'))
    or (old.status = 'expired' and new.status = 'paid')
    or (old.status = 'paid'    and new.status = 'refunded')
    -- Chỉ qua admin_resolve_late_payment. coalesce bắt buộc: cờ chưa đặt thì current_setting trả NULL và IF không chặn.
    or (old.status = 'cancelled' and new.status = 'paid' and coalesce(current_setting('app.late_payment', true), '') = 'on')
  ) then
    raise exception 'Không thể chuyển đơn hàng từ "%" sang "%".', old.status, new.status;
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."order_integrity"() OWNER TO "postgres";

--
-- Name: prevent_last_admin_lockout(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."prevent_last_admin_lockout"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  remaining_admins integer;
begin
  if TG_OP = 'DELETE' then
    if OLD.role = 'system_admin' and OLD.account_status = 'active' then
      select count(*) into remaining_admins
      from public.staff_profiles
      where role = 'system_admin' and account_status = 'active' and id <> OLD.id;

      if remaining_admins = 0 then
        raise exception 'Không thể xóa: đây là quản trị viên đang hoạt động cuối cùng';
      end if;
    end if;
    return OLD;
  end if;

  if TG_OP = 'UPDATE' then
    if OLD.role = 'system_admin' and OLD.account_status = 'active'
       and (NEW.role <> 'system_admin' or NEW.account_status <> 'active') then
      select count(*) into remaining_admins
      from public.staff_profiles
      where role = 'system_admin' and account_status = 'active' and id <> OLD.id;

      if remaining_admins = 0 then
        raise exception 'Không thể thực hiện: đây là quản trị viên đang hoạt động cuối cùng';
      end if;
    end if;
    return NEW;
  end if;

  return null;
end;
$$;


ALTER FUNCTION "public"."prevent_last_admin_lockout"() OWNER TO "postgres";

--
-- Name: quiz_question_integrity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."quiz_question_integrity"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if exists (select 1 from unnest(new.choices) as c where c is null or btrim(c) = '' or char_length(c) > 200) then
    raise exception 'Mỗi đáp án phải có nội dung (tối đa 200 ký tự).';
  end if;
  if (select count(distinct lower(btrim(c))) from unnest(new.choices) as c) <> 4 then
    raise exception 'Bốn đáp án không được trùng nhau.';
  end if;
  if new.media_id is not null and not exists (
    select 1 from public.media_assets m where m.id = new.media_id and m.event_id = new.event_id
  ) then
    raise exception 'Ảnh của câu hỏi phải là ảnh của chính sự kiện này.';
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."quiz_question_integrity"() OWNER TO "postgres";

--
-- Name: regrade_item("uuid", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."regrade_item"("p_item_id" "uuid", "p_actor" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  it public.exam_items%rowtype;
  a public.exam_attempts%rowtype;
  pos integer;
  v_old integer;
  v_new integer;
  v_delta integer;
  v_max integer;
  b jsonb;
  v_raw bigint;
  v_total_max bigint;
  v_score numeric(4, 2);
  k text;
  checked_count integer := 0;
  changed integer := 0;
begin
  select * into it from public.exam_items where id = p_item_id;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  v_max := case when it.kind = 'mcq' then 250 else 1000 end;

  for a in
    select * from public.exam_attempts x
     where x.status = 'submitted' and x.breakdown is not null and p_item_id = any(x.item_ids)
     for update
  loop
    pos := array_position(a.item_ids, p_item_id);
    -- Câu không được chấm trong lượt này (luyện tập mà chưa kiểm tra) → bỏ qua.
    continue when not (a.mode in ('exam', 'paper') or coalesce(a.answers -> p_item_id::text ->> 'checked', '') = 'true');
    checked_count := checked_count + 1;
    v_old := coalesce((a.breakdown -> 'items' ->> (pos - 1))::int, 0);
    v_new := public.exam_item_earned(it, a.choice_shifts[pos], a.answers -> p_item_id::text);
    continue when v_new = v_old;
    v_delta := v_new - v_old;

    b := jsonb_set(a.breakdown, array['items', (pos - 1)::text], to_jsonb(v_new));
    b := jsonb_set(b, '{raw_milli}', to_jsonb(coalesce((b ->> 'raw_milli')::bigint, 0) + v_delta));
    b := jsonb_set(b, '{correct}', to_jsonb(coalesce((b ->> 'correct')::int, 0)
                                             - (case when v_old = v_max then 1 else 0 end) + (case when v_new = v_max then 1 else 0 end)));
    -- Các nhóm phân tích chứa câu này (bỏ qua nhóm không còn trong breakdown — ví dụ câu đã đổi bài).
    foreach k in array array[
      'sections/' || a.sections[pos]::text, 'lessons/' || coalesce(it.lesson_slug, '_'), 'levels/' || it.level::text, 'kinds/' || it.kind::text
    ] || case when it.passage_id is not null then array['kinds/passage'] else array[]::text[] end
    loop
      if b #> string_to_array(k, '/') is not null then
        b := jsonb_set(b, string_to_array(k || '/earned', '/'), to_jsonb(coalesce((b #>> string_to_array(k || '/earned', '/'))::bigint, 0) + v_delta));
      end if;
    end loop;

    v_raw := (b ->> 'raw_milli')::bigint;
    v_total_max := (b ->> 'max_milli')::bigint;
    v_score := case when coalesce(v_total_max, 0) = 0 then 0 else ((2000 * v_raw + v_total_max) / (2 * v_total_max)) / 100.0 end;
    update public.exam_attempts
       set breakdown = b, score10 = v_score, raw_score = round(v_raw / 1000.0, 2)
     where id = a.id;
    insert into public.exam_regrade_log (item_id, attempt_id, old_earned, new_earned, old_score10, new_score10, actor)
    values (p_item_id, a.id, v_old, v_new, a.score10, v_score, p_actor);
    changed := changed + 1;
  end loop;

  return jsonb_build_object('ok', true, 'attempts', checked_count, 'changed', changed);
end;
$$;


ALTER FUNCTION "public"."regrade_item"("p_item_id" "uuid", "p_actor" "uuid") OWNER TO "postgres";

--
-- Name: report_exam_item("uuid", "text", "uuid", "uuid", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."report_exam_item"("p_user_id" "uuid", "p_device_hash" "text", "p_attempt_id" "uuid", "p_item_id" "uuid", "p_reason" "text", "p_note" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  a public.exam_attempts%rowtype;
begin
  if p_reason is null or p_reason not in ('sai_dap_an', 'loi_chinh_ta', 'khong_ro_nghia', 'sai_kien_thuc', 'khac')
     or char_length(coalesce(p_note, '')) > 500 then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;
  select * into a from public.exam_attempts where id = p_attempt_id;
  if not found or not public.exam_attempt_owner_ok(a, p_user_id, p_device_hash) or not (p_item_id = any(a.item_ids))
     or not ((a.status = 'submitted' and a.mode in ('exam', 'paper')) or coalesce(a.answers -> p_item_id::text ->> 'checked', '') = 'true') then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  insert into public.exam_item_reports (item_id, attempt_id, user_id, device_hash, reason, note)
  values (p_item_id, a.id, p_user_id, case when p_user_id is null then nullif(p_device_hash, '') end,
          p_reason::public.exam_report_reason, nullif(btrim(coalesce(p_note, '')), ''))
  on conflict (item_id, coalesce(user_id::text, device_hash)) where status = 'open' do nothing;
  return jsonb_build_object('ok', true);
end;
$$;


ALTER FUNCTION "public"."report_exam_item"("p_user_id" "uuid", "p_device_hash" "text", "p_attempt_id" "uuid", "p_item_id" "uuid", "p_reason" "text", "p_note" "text") OWNER TO "postgres";

--
-- Name: reviewer_may_only_change_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."reviewer_may_only_change_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$ declare allowed_columns constant text[] := array['workflow_status', 'review_note', 'updated_at', 'geom']; begin if public.current_staff_role() = 'reviewer' then if (to_jsonb(new) - allowed_columns) is distinct from (to_jsonb(old) - allowed_columns) then raise exception 'Kiểm duyệt viên chỉ được thay đổi trạng thái và ghi chú kiểm duyệt, không được sửa nội dung'; end if; end if; return new; end; $$;


ALTER FUNCTION "public"."reviewer_may_only_change_status"() OWNER TO "postgres";

--
-- Name: save_attempt_answers("uuid", "uuid", "text", "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."save_attempt_answers"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  a public.exam_attempts%rowtype;
begin
  select * into a from public.exam_attempts where id = p_attempt_id for update;
  if not found or not public.exam_attempt_owner_ok(a, p_user_id, p_device_hash) then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if a.status <> 'in_progress' then
    return jsonb_build_object('ok', false, 'reason', 'submitted');
  end if;
  if a.deadline_at is not null and now() > a.deadline_at + interval '30 seconds' then
    return jsonb_build_object('ok', false, 'reason', 'time_up');
  end if;
  if jsonb_typeof(p_answers) = 'object' then
    update public.exam_attempts set answers = answers || public.exam_clean_answers(a, p_answers) where id = a.id;
  end if;
  return jsonb_build_object('ok', true, 'saved_at', now());
end;
$$;


ALTER FUNCTION "public"."save_attempt_answers"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") OWNER TO "postgres";

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  new.updated_at := now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

--
-- Name: source_locked_for_editor("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."source_locked_for_editor"("p_source" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select exists (
    select 1
    from public.event_sources es
    join public.historical_events e on e.id = es.event_id
    where es.source_id = p_source
      and e.workflow_status in ('pending_review', 'published', 'hidden')
  )
  or exists (
    select 1
    from public.media_assets ma
    where ma.source_id = p_source
      and public.media_owner_status(ma.event_id, ma.figure_id, ma.location_id) in ('pending_review', 'published', 'hidden')
  )
$$;


ALTER FUNCTION "public"."source_locked_for_editor"("p_source" "uuid") OWNER TO "postgres";

--
-- Name: start_exam_attempt("text", "text", "text", "uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."start_exam_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid", "p_mode" "text" DEFAULT 'exam'::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  access jsonb;
  set_row public.exam_sets%rowtype;
  a public.exam_attempts%rowtype;
  stale uuid;
begin
  if p_mode is distinct from 'exam' then
    return jsonb_build_object('ok', false, 'reason', 'unsupported_mode');
  end if;
  if p_user_id is null and coalesce(p_device_hash, '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'no_device');
  end if;
  access := public.exam_access(p_slug, p_code, p_device_hash, p_user_id);
  if (access ->> 'ok')::boolean is not true then
    return access;
  end if;
  select * into set_row from public.exam_sets where id = (access ->> 'set_id')::uuid;

  for stale in
    select x.id from public.exam_attempts x
     where x.set_id = set_row.id and x.status = 'in_progress' and x.deadline_at is not null and x.deadline_at <= now()
       and public.exam_attempt_owner_ok(x, p_user_id, p_device_hash)
  loop
    perform public.exam_grade_attempt(stale);
  end loop;

  a := public.exam_open_attempt(set_row.id, p_user_id, p_device_hash);
  if a.id is null then
    insert into public.exam_attempts (user_id, license_id, device_hash, set_id, mode, item_ids, sections, choice_shifts, deadline_at)
    select p_user_id, (access ->> 'license_id')::uuid, nullif(p_device_hash, ''), set_row.id, 'exam',
           array_agg(si.item_id order by si.section, si.position),
           array_agg(si.section order by si.section, si.position),
           array_agg(si.choice_shift order by si.section, si.position),
           now() + make_interval(mins => set_row.duration_min)
      from public.exam_set_items si
      join public.exam_items i on i.id = si.item_id and i.workflow_status = 'published'
     where si.set_id = set_row.id
    having count(*) > 0
    returning * into a;
    if a.id is null then
      return jsonb_build_object('ok', false, 'reason', 'empty');
    end if;
  end if;
  return jsonb_build_object('ok', true, 'access', access ->> 'access') || public.exam_attempt_view(a, false);
end;
$$;


ALTER FUNCTION "public"."start_exam_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid", "p_mode" "text") OWNER TO "postgres";

--
-- Name: start_generated_attempt("uuid", "text", "text", "text", "uuid"[], smallint[], smallint[], integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."start_generated_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text", "p_item_ids" "uuid"[], "p_sections" smallint[], "p_shifts" smallint[], "p_duration_min" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
declare
  pack uuid;
  a public.exam_attempts%rowtype;
  stale uuid;
begin
  if p_user_id is null and coalesce(p_device_hash, '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'no_device');
  end if;
  if p_blueprint is null or p_blueprint !~ '^(thpt_2025|quick_15|tf_only|chu-de-[0-9]{1,2})$' then
    return jsonb_build_object('ok', false, 'reason', 'unsupported_mode');
  end if;
  pack := public.exam_pack_license(p_code, p_device_hash, p_user_id);
  if pack is null then
    return jsonb_build_object('ok', false, 'reason', 'pack_required');
  end if;

  for stale in
    select x.id from public.exam_attempts x
     where x.blueprint = p_blueprint and x.status = 'in_progress' and x.deadline_at is not null and x.deadline_at <= now()
       and public.exam_attempt_owner_ok(x, p_user_id, p_device_hash)
  loop
    perform public.exam_grade_attempt(stale);
  end loop;

  a := public.exam_open_generated(p_blueprint, p_user_id, p_device_hash);
  if a.id is null then
    if p_item_ids is null or cardinality(p_item_ids) not between 1 and 200
       or cardinality(p_sections) is distinct from cardinality(p_item_ids) or cardinality(p_shifts) is distinct from cardinality(p_item_ids)
       or p_duration_min not between 5 and 180
       or exists (select 1 from unnest(p_sections) as s where s not in (1, 2))
       or exists (select 1 from unnest(p_shifts) as s where s not between 0 and 3)
       or (select count(distinct x) from unnest(p_item_ids) as x) <> cardinality(p_item_ids)
       or (select count(*) from public.exam_items i where i.id = any(p_item_ids) and i.workflow_status = 'published') <> cardinality(p_item_ids) then
      return jsonb_build_object('ok', false, 'reason', 'invalid_items');
    end if;
    insert into public.exam_attempts (user_id, license_id, device_hash, set_id, mode, blueprint, item_ids, sections, choice_shifts, deadline_at)
    values (p_user_id, pack, nullif(p_device_hash, ''), null, 'exam', p_blueprint, p_item_ids, p_sections, p_shifts,
            now() + make_interval(mins => p_duration_min))
    returning * into a;
  end if;
  return jsonb_build_object('ok', true,
           'access', case when p_user_id is not null and exists (select 1 from public.licenses where id = pack and user_id = p_user_id) then 'account' else 'code' end)
         || public.exam_attempt_view(a, false);
end;
$_$;


ALTER FUNCTION "public"."start_generated_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text", "p_item_ids" "uuid"[], "p_sections" smallint[], "p_shifts" smallint[], "p_duration_min" integer) OWNER TO "postgres";

--
-- Name: start_paper_attempt("text", "text", "text", "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."start_paper_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  access jsonb;
  a public.exam_attempts%rowtype;
begin
  if p_user_id is null and coalesce(p_device_hash, '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'no_device');
  end if;
  access := public.exam_access(p_slug, p_code, p_device_hash, p_user_id);
  if (access ->> 'ok')::boolean is not true then
    return access;
  end if;

  select x.* into a from public.exam_attempts x
   where x.set_id = (access ->> 'set_id')::uuid and x.mode = 'paper' and x.status = 'in_progress'
     and public.exam_attempt_owner_ok(x, p_user_id, p_device_hash)
   order by x.started_at desc limit 1;
  if a.id is null then
    insert into public.exam_attempts (user_id, license_id, device_hash, set_id, mode, item_ids, sections, choice_shifts, deadline_at)
    select p_user_id, (access ->> 'license_id')::uuid, nullif(p_device_hash, ''), (access ->> 'set_id')::uuid, 'paper',
           array_agg(si.item_id order by si.section, si.position),
           array_agg(si.section order by si.section, si.position),
           array_agg(si.choice_shift order by si.section, si.position),
           null
      from public.exam_set_items si
      join public.exam_items i on i.id = si.item_id and i.workflow_status = 'published'
     where si.set_id = (access ->> 'set_id')::uuid
    having count(*) > 0
    returning * into a;
    if a.id is null then
      return jsonb_build_object('ok', false, 'reason', 'empty');
    end if;
  end if;
  return jsonb_build_object('ok', true, 'access', access ->> 'access') || public.exam_attempt_view(a, false);
end;
$$;


ALTER FUNCTION "public"."start_paper_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") OWNER TO "postgres";

--
-- Name: start_practice_attempt("uuid", "text", "text", "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."start_practice_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_options" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  mode_name text := coalesce(p_options ->> 'mode', 'practice');
  pack uuid;
  wanted integer;
  ids uuid[];
  source public.exam_attempts%rowtype;
  stale uuid;
  a public.exam_attempts%rowtype;
begin
  if p_user_id is null and coalesce(p_device_hash, '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'no_device');
  end if;
  if mode_name not in ('practice', 'review', 'retry') then
    return jsonb_build_object('ok', false, 'reason', 'unsupported_mode');
  end if;
  pack := public.exam_pack_license(p_code, p_device_hash, p_user_id);

  if mode_name = 'review' then
    if p_user_id is null then
      return jsonb_build_object('ok', false, 'reason', 'login_required');
    end if;
    if pack is null then
      return jsonb_build_object('ok', false, 'reason', 'pack_required');
    end if;
    select array_agg(x.item_id order by x.due_at) into ids from (
      select s.item_id, s.due_at from public.learner_item_state s
        join public.exam_items i on i.id = s.item_id and i.workflow_status = 'published'
       where s.user_id = p_user_id and s.in_notebook and s.due_at <= now()
       order by s.due_at limit 30
    ) as x;
  elsif mode_name = 'retry' then
    select * into source from public.exam_attempts where id = nullif(p_options ->> 'from_attempt', '')::uuid;
    if not found or not public.exam_attempt_owner_ok(source, p_user_id, p_device_hash) or source.status <> 'submitted' then
      return jsonb_build_object('ok', false, 'reason', 'not_found');
    end if;
    select array_agg(o.item_id order by o.n) into ids
      from unnest(source.item_ids) with ordinality as o(item_id, n)
      join public.exam_items i on i.id = o.item_id and i.workflow_status = 'published'
     where coalesce((source.breakdown -> 'items' ->> (o.n::int - 1))::int, 0) < (case when i.kind = 'mcq' then 250 else 1000 end)
       and (source.mode in ('exam', 'paper') or coalesce(source.answers -> o.item_id::text ->> 'checked', '') = 'true');
  else
    wanted := case when (p_options ->> 'count') in ('10', '20', '30') then (p_options ->> 'count')::int else 10 end;
    select array_agg(x.id) into ids from (
      select i.id
        from public.exam_items i
        left join public.learner_item_state s on p_user_id is not null and s.user_id = p_user_id and s.item_id = i.id
       where i.workflow_status = 'published'
         and (jsonb_typeof(p_options -> 'lessons') is distinct from 'array' or jsonb_array_length(p_options -> 'lessons') = 0
              or i.lesson_slug in (select jsonb_array_elements_text(p_options -> 'lessons')))
         and (jsonb_typeof(p_options -> 'kinds') is distinct from 'array' or jsonb_array_length(p_options -> 'kinds') = 0
              or i.kind::text in (select jsonb_array_elements_text(p_options -> 'kinds')))
         and (jsonb_typeof(p_options -> 'levels') is distinct from 'array' or jsonb_array_length(p_options -> 'levels') = 0
              or i.level::text in (select jsonb_array_elements_text(p_options -> 'levels')))
         and (jsonb_typeof(p_options -> 'passage') is distinct from 'boolean' or (i.passage_id is not null) = (p_options ->> 'passage')::boolean)
         and (coalesce(p_options ->> 'only_new', 'false') <> 'true' or p_user_id is null or s.item_id is null)
       order by case when coalesce(p_options ->> 'prefer_wrong', 'false') = 'true' then coalesce(s.in_notebook, false) end desc nulls last, random()
       limit wanted
    ) as x;
  end if;

  if ids is null or cardinality(ids) = 0 then
    return jsonb_build_object('ok', false, 'reason', 'empty');
  end if;

  for stale in
    select x.id from public.exam_attempts x
     where x.status = 'in_progress' and x.mode in ('practice', 'review') and public.exam_attempt_owner_ok(x, p_user_id, p_device_hash)
  loop
    perform public.exam_grade_attempt(stale);
  end loop;

  insert into public.exam_attempts (user_id, license_id, device_hash, set_id, mode, item_ids, sections, choice_shifts, deadline_at)
  select p_user_id, pack, nullif(p_device_hash, ''), null, case when mode_name = 'review' then 'review' else 'practice' end::public.exam_attempt_mode,
         array_agg(i.id order by o.n),
         array_agg(case when i.kind = 'mcq' then 1 else 2 end::smallint order by o.n),
         array_agg(case when i.kind = 'mcq' then floor(random() * 4) else 0 end::smallint order by o.n),
         null
    from unnest(ids) with ordinality as o(item_id, n)
    join public.exam_items i on i.id = o.item_id
  returning * into a;
  return jsonb_build_object('ok', true, 'pack', pack is not null) || public.exam_attempt_view(a, false);
end;
$$;


ALTER FUNCTION "public"."start_practice_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_options" "jsonb") OWNER TO "postgres";

--
-- Name: submit_exam_attempt("uuid", "uuid", "text", "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."submit_exam_attempt"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  a public.exam_attempts%rowtype;
begin
  select * into a from public.exam_attempts where id = p_attempt_id for update;
  if not found or not public.exam_attempt_owner_ok(a, p_user_id, p_device_hash) then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if a.status = 'in_progress' then
    if jsonb_typeof(p_answers) = 'object' and (a.deadline_at is null or now() <= a.deadline_at + interval '30 seconds') then
      update public.exam_attempts set answers = answers || public.exam_clean_answers(a, p_answers) where id = a.id;
    end if;
    perform public.exam_grade_attempt(a.id);
  elsif a.status <> 'submitted' then
    return jsonb_build_object('ok', false, 'reason', 'abandoned');
  end if;
  select * into a from public.exam_attempts where id = p_attempt_id;
  return jsonb_build_object('ok', true) || public.exam_attempt_view(a, true);
end;
$$;


ALTER FUNCTION "public"."submit_exam_attempt"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") OWNER TO "postgres";

--
-- Name: curriculum_topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."curriculum_topics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "workflow_status" "public"."content_workflow_status" DEFAULT 'draft'::"public"."content_workflow_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "review_note" "text"
);


ALTER TABLE "public"."curriculum_topics" OWNER TO "postgres";

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_code" bigint NOT NULL,
    "product_id" "uuid" NOT NULL,
    "amount_vnd" integer NOT NULL,
    "provider" "text" NOT NULL,
    "provider_ref" "text",
    "checkout_url" "text",
    "status" "public"."order_status" DEFAULT 'pending'::"public"."order_status" NOT NULL,
    "buyer_email" "text",
    "display_name" "text",
    "message" "text",
    "show_on_wall" boolean DEFAULT false NOT NULL,
    "wall_approved" boolean DEFAULT false NOT NULL,
    "access_token_hash" "text" NOT NULL,
    "client_ip_hash" "text",
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:15:00'::interval) NOT NULL,
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    CONSTRAINT "orders_amount_check" CHECK ((("amount_vnd" >= 1000) AND ("amount_vnd" <= 10000000))),
    CONSTRAINT "orders_display_name_check" CHECK ((("display_name" IS NULL) OR ("char_length"("display_name") <= 60))),
    CONSTRAINT "orders_email_check" CHECK ((("buyer_email" IS NULL) OR (("char_length"("buyer_email") <= 254) AND ("buyer_email" ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'::"text")))),
    CONSTRAINT "orders_ip_hash_check" CHECK ((("client_ip_hash" IS NULL) OR ("client_ip_hash" ~ '^[0-9a-f]{64}$'::"text"))),
    CONSTRAINT "orders_message_check" CHECK ((("message" IS NULL) OR ("char_length"("message") <= 200))),
    CONSTRAINT "orders_paid_has_time" CHECK ((("status" <> ALL (ARRAY['paid'::"public"."order_status", 'refunded'::"public"."order_status"])) OR ("paid_at" IS NOT NULL))),
    CONSTRAINT "orders_provider_check" CHECK (("provider" = ANY (ARRAY['payos'::"text", 'vnpay'::"text", 'mock'::"text"]))),
    CONSTRAINT "orders_token_hash_check" CHECK (("access_token_hash" ~ '^[0-9a-f]{64}$'::"text")),
    CONSTRAINT "orders_wall_needs_opt_in" CHECK (((NOT "wall_approved") OR "show_on_wall"))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "kind" "public"."product_kind" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price_vnd" integer,
    "min_vnd" integer,
    "max_vnd" integer,
    "max_devices" smallint DEFAULT 3 NOT NULL,
    "valid_until" timestamp with time zone,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "duration_days" smallint,
    "grants_product_id" "uuid",
    CONSTRAINT "products_devices_check" CHECK ((("max_devices" >= 1) AND ("max_devices" <= 20))),
    CONSTRAINT "products_duration_check" CHECK ((("duration_days" IS NULL) OR (("duration_days" >= 1) AND ("duration_days" <= 400)))),
    CONSTRAINT "products_max_check" CHECK ((("max_vnd" IS NULL) OR ("max_vnd" <= 10000000))),
    CONSTRAINT "products_min_check" CHECK ((("min_vnd" IS NULL) OR ("min_vnd" >= 1000))),
    CONSTRAINT "products_name_check" CHECK ((("char_length"("btrim"("name")) >= 3) AND ("char_length"("btrim"("name")) <= 120))),
    CONSTRAINT "products_price_check" CHECK ((("price_vnd" IS NULL) OR (("price_vnd" >= 1000) AND ("price_vnd" <= 10000000)))),
    CONSTRAINT "products_price_rule" CHECK (((("kind" = 'exam_pack'::"public"."product_kind") AND ("price_vnd" IS NOT NULL) AND ("min_vnd" IS NULL) AND ("max_vnd" IS NULL)) OR (("kind" = 'donation'::"public"."product_kind") AND ("price_vnd" IS NULL) AND ("min_vnd" IS NOT NULL) AND ("max_vnd" IS NOT NULL) AND ("min_vnd" <= "max_vnd")))),
    CONSTRAINT "products_slug_check" CHECK (("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text"))
);


ALTER TABLE "public"."products" OWNER TO "postgres";

--
-- Name: donation_wall; Type: VIEW; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW "public"."donation_wall" WITH ("security_invoker"='false') AS
 SELECT "o"."display_name",
    "o"."message",
    "o"."paid_at",
        CASE
            WHEN ("o"."amount_vnd" < 50000) THEN 'Ủng hộ'::"text"
            WHEN ("o"."amount_vnd" < 200000) THEN 'Ủng hộ nhiệt tình'::"text"
            ELSE 'Nhà hảo tâm'::"text"
        END AS "tier"
   FROM ("public"."orders" "o"
     JOIN "public"."products" "p" ON (("p"."id" = "o"."product_id")))
  WHERE (("p"."kind" = 'donation'::"public"."product_kind") AND ("o"."status" = 'paid'::"public"."order_status") AND "o"."show_on_wall" AND "o"."wall_approved");


ALTER VIEW "public"."donation_wall" OWNER TO "postgres";

--
-- Name: event_figures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."event_figures" (
    "event_id" "uuid" NOT NULL,
    "figure_id" "uuid" NOT NULL,
    "relationship" "text",
    "sort_order" integer DEFAULT 0
);


ALTER TABLE "public"."event_figures" OWNER TO "postgres";

--
-- Name: event_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."event_locations" (
    "event_id" "uuid" NOT NULL,
    "location_id" "uuid" NOT NULL,
    "location_role" "text",
    "is_primary" boolean DEFAULT false
);


ALTER TABLE "public"."event_locations" OWNER TO "postgres";

--
-- Name: event_sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."event_sources" (
    "event_id" "uuid" NOT NULL,
    "source_id" "uuid" NOT NULL,
    "source_note" "text",
    "confidence_note" "text"
);


ALTER TABLE "public"."event_sources" OWNER TO "postgres";

--
-- Name: event_topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."event_topics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "topic_id" "uuid" NOT NULL
);


ALTER TABLE "public"."event_topics" OWNER TO "postgres";

--
-- Name: exam_item_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_item_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "item_id" "uuid" NOT NULL,
    "attempt_id" "uuid",
    "user_id" "uuid",
    "device_hash" "text",
    "reason" "public"."exam_report_reason" NOT NULL,
    "note" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "admin_note" "text",
    "handled_by" "uuid",
    "handled_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "exam_item_reports_admin_note_check" CHECK ((("admin_note" IS NULL) OR ("char_length"("admin_note") <= 500))),
    CONSTRAINT "exam_item_reports_note_check" CHECK ((("note" IS NULL) OR ("char_length"("note") <= 500))),
    CONSTRAINT "exam_item_reports_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'fixed'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."exam_item_reports" OWNER TO "postgres";

--
-- Name: exam_passages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_passages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "body" "text" NOT NULL,
    "source_citation" "text" NOT NULL,
    "lesson_slug" "text",
    "workflow_status" "public"."content_workflow_status" DEFAULT 'draft'::"public"."content_workflow_status" NOT NULL,
    "review_note" "text",
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "exam_passages_body_check" CHECK ((("char_length"("btrim"("body")) >= 30) AND ("char_length"("btrim"("body")) <= 2000))),
    CONSTRAINT "exam_passages_lesson_check" CHECK ((("lesson_slug" IS NULL) OR ("lesson_slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text"))),
    CONSTRAINT "exam_passages_source_check" CHECK ((("char_length"("btrim"("source_citation")) >= 5) AND ("char_length"("btrim"("source_citation")) <= 500))),
    CONSTRAINT "exam_passages_title_check" CHECK ((("char_length"("btrim"("title")) >= 3) AND ("char_length"("btrim"("title")) <= 160)))
);


ALTER TABLE "public"."exam_passages" OWNER TO "postgres";

--
-- Name: exam_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "set_id" "uuid" NOT NULL,
    "position" smallint NOT NULL,
    "question" "text" NOT NULL,
    "choices" "text"[] NOT NULL,
    "correct_index" smallint NOT NULL,
    "explanation" "text" NOT NULL,
    "lesson_slug" "text",
    "event_id" "uuid",
    "source_note" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "exam_questions_choices_check" CHECK (("cardinality"("choices") = 4)),
    CONSTRAINT "exam_questions_correct_check" CHECK ((("correct_index" >= 0) AND ("correct_index" <= 3))),
    CONSTRAINT "exam_questions_explanation_check" CHECK ((("char_length"("btrim"("explanation")) >= 5) AND ("char_length"("btrim"("explanation")) <= 1500))),
    CONSTRAINT "exam_questions_lesson_check" CHECK ((("lesson_slug" IS NULL) OR ("lesson_slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text"))),
    CONSTRAINT "exam_questions_position_check" CHECK ((("position" >= 1) AND ("position" <= 200))),
    CONSTRAINT "exam_questions_question_check" CHECK ((("char_length"("btrim"("question")) >= 5) AND ("char_length"("btrim"("question")) <= 600))),
    CONSTRAINT "exam_questions_source_check" CHECK ((("char_length"("btrim"("source_note")) >= 3) AND ("char_length"("btrim"("source_note")) <= 500)))
);


ALTER TABLE "public"."exam_questions" OWNER TO "postgres";

--
-- Name: exam_regrade_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_regrade_log" (
    "id" bigint NOT NULL,
    "item_id" "uuid" NOT NULL,
    "attempt_id" "uuid" NOT NULL,
    "old_earned" integer NOT NULL,
    "new_earned" integer NOT NULL,
    "old_score10" numeric(4,2),
    "new_score10" numeric(4,2),
    "actor" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."exam_regrade_log" OWNER TO "postgres";

--
-- Name: exam_regrade_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_regrade_log" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."exam_regrade_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: exam_set_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_set_items" (
    "set_id" "uuid" NOT NULL,
    "item_id" "uuid" NOT NULL,
    "section" smallint NOT NULL,
    "position" smallint NOT NULL,
    "choice_shift" smallint DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "exam_set_items_position_check" CHECK ((("position" >= 1) AND ("position" <= 200))),
    CONSTRAINT "exam_set_items_section_check" CHECK (("section" = ANY (ARRAY[1, 2]))),
    CONSTRAINT "exam_set_items_shift_check" CHECK ((("choice_shift" >= 0) AND ("choice_shift" <= 3)))
);


ALTER TABLE "public"."exam_set_items" OWNER TO "postgres";

--
-- Name: exam_sets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."exam_sets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "product_id" "uuid",
    "duration_min" smallint DEFAULT 50 NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "workflow_status" "public"."content_workflow_status" DEFAULT 'draft'::"public"."content_workflow_status" NOT NULL,
    "review_note" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "format" "text" DEFAULT 'thpt_2025'::"text" NOT NULL,
    "published_at" timestamp with time zone,
    "difficulty" smallint,
    CONSTRAINT "exam_sets_difficulty_check" CHECK ((("difficulty" >= 1) AND ("difficulty" <= 3))),
    CONSTRAINT "exam_sets_duration_check" CHECK ((("duration_min" >= 5) AND ("duration_min" <= 180))),
    CONSTRAINT "exam_sets_format_check" CHECK (("format" = ANY (ARRAY['thpt_2025'::"text", 'mini'::"text", 'chuyen_de'::"text"]))),
    CONSTRAINT "exam_sets_slug_check" CHECK (("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text")),
    CONSTRAINT "exam_sets_title_check" CHECK ((("char_length"("btrim"("title")) >= 3) AND ("char_length"("btrim"("title")) <= 160)))
);


ALTER TABLE "public"."exam_sets" OWNER TO "postgres";

--
-- Name: historical_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."historical_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "topic_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "start_year" integer NOT NULL,
    "end_year" integer,
    "start_date" "date",
    "end_date" "date",
    "date_text" "text" NOT NULL,
    "date_precision" "text" NOT NULL,
    "summary" "text" NOT NULL,
    "content" "text",
    "is_featured" boolean DEFAULT false,
    "workflow_status" "public"."content_workflow_status" DEFAULT 'draft'::"public"."content_workflow_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "review_note" "text",
    CONSTRAINT "historical_events_check" CHECK ((("end_year" IS NULL) OR ("end_year" >= "start_year"))),
    CONSTRAINT "historical_events_check1" CHECK ((("end_date" IS NULL) OR ("start_date" IS NULL) OR ("end_date" >= "start_date"))),
    CONSTRAINT "historical_events_check2" CHECK ((("start_date" IS NULL) OR (EXTRACT(year FROM "start_date") = ("start_year")::numeric))),
    CONSTRAINT "historical_events_check3" CHECK ((("end_date" IS NULL) OR ("end_year" IS NULL) OR (EXTRACT(year FROM "end_date") = ("end_year")::numeric))),
    CONSTRAINT "historical_events_date_precision_check" CHECK (("date_precision" = ANY (ARRAY['exact'::"text", 'year'::"text", 'period'::"text", 'approximate'::"text", 'disputed'::"text"])))
);


ALTER TABLE "public"."historical_events" OWNER TO "postgres";

--
-- Name: historical_figures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."historical_figures" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "other_names" "text",
    "birth_year" integer,
    "death_year" integer,
    "biography" "text",
    "portrait_url" "text",
    "workflow_status" "public"."content_workflow_status" DEFAULT 'draft'::"public"."content_workflow_status" NOT NULL,
    "review_note" "text",
    CONSTRAINT "historical_figures_check" CHECK ((("death_year" IS NULL) OR ("birth_year" IS NULL) OR ("death_year" >= "birth_year")))
);


ALTER TABLE "public"."historical_figures" OWNER TO "postgres";

--
-- Name: historical_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."historical_locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "historical_name" "text",
    "slug" "text" NOT NULL,
    "description" "text",
    "latitude" numeric(9,6),
    "longitude" numeric(9,6),
    "accuracy_level" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "accuracy_note" "text",
    "workflow_status" "public"."content_workflow_status" DEFAULT 'draft'::"public"."content_workflow_status" NOT NULL,
    "geom" "extensions"."geography"(Point,4326) GENERATED ALWAYS AS (
CASE
    WHEN (("latitude" IS NOT NULL) AND ("longitude" IS NOT NULL)) THEN ("extensions"."st_setsrid"("extensions"."st_makepoint"(("longitude")::double precision, ("latitude")::double precision), 4326))::"extensions"."geography"
    ELSE NULL::"extensions"."geography"
END) STORED,
    "review_note" "text",
    CONSTRAINT "historical_locations_accuracy_level_check" CHECK (("accuracy_level" = ANY (ARRAY['exact'::"text", 'approximate'::"text", 'region'::"text", 'unknown'::"text"]))),
    CONSTRAINT "historical_locations_check" CHECK ((("latitude" IS NULL) = ("longitude" IS NULL))),
    CONSTRAINT "historical_locations_latitude_check" CHECK ((("latitude" IS NULL) OR (("latitude" >= ('-90'::integer)::numeric) AND ("latitude" <= (90)::numeric)))),
    CONSTRAINT "historical_locations_longitude_check" CHECK ((("longitude" IS NULL) OR (("longitude" >= ('-180'::integer)::numeric) AND ("longitude" <= (180)::numeric))))
);


ALTER TABLE "public"."historical_locations" OWNER TO "postgres";

--
-- Name: learner_item_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."learner_item_state" (
    "user_id" "uuid" NOT NULL,
    "item_id" "uuid" NOT NULL,
    "box" smallint DEFAULT 1 NOT NULL,
    "due_at" timestamp with time zone,
    "wrong_count" integer DEFAULT 0 NOT NULL,
    "right_count" integer DEFAULT 0 NOT NULL,
    "last_answer_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "in_notebook" boolean DEFAULT false NOT NULL,
    CONSTRAINT "learner_item_state_box_check" CHECK ((("box" >= 1) AND ("box" <= 5))),
    CONSTRAINT "learner_item_state_due_check" CHECK (((NOT "in_notebook") OR ("due_at" IS NOT NULL))),
    CONSTRAINT "learner_item_state_right_check" CHECK (("right_count" >= 0)),
    CONSTRAINT "learner_item_state_wrong_check" CHECK (("wrong_count" >= 0))
);


ALTER TABLE "public"."learner_item_state" OWNER TO "postgres";

--
-- Name: learner_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."learner_profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text" NOT NULL,
    "avatar_url" "text",
    "school" "text",
    "terms_version" "text" NOT NULL,
    "agreed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "exam_goal" numeric(3,1),
    "study_plan" "jsonb",
    CONSTRAINT "learner_profiles_avatar_check" CHECK ((("avatar_url" IS NULL) OR (("avatar_url" ~ '^https://'::"text") AND ("char_length"("avatar_url") <= 500)))),
    CONSTRAINT "learner_profiles_goal_check" CHECK ((("exam_goal" IS NULL) OR (("exam_goal" >= (1)::numeric) AND ("exam_goal" <= (10)::numeric)))),
    CONSTRAINT "learner_profiles_name_check" CHECK ((("char_length"("btrim"("display_name")) >= 1) AND ("char_length"("btrim"("display_name")) <= 60))),
    CONSTRAINT "learner_profiles_plan_check" CHECK ((("study_plan" IS NULL) OR (("jsonb_typeof"("study_plan") = 'object'::"text") AND ("pg_column_size"("study_plan") <= 32768)))),
    CONSTRAINT "learner_profiles_school_check" CHECK ((("school" IS NULL) OR ("char_length"("school") <= 120))),
    CONSTRAINT "learner_profiles_terms_check" CHECK ((("char_length"("terms_version") >= 1) AND ("char_length"("terms_version") <= 20)))
);


ALTER TABLE "public"."learner_profiles" OWNER TO "postgres";

--
-- Name: learner_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."learner_progress" (
    "user_id" "uuid" NOT NULL,
    "data" "jsonb" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "learner_progress_data_check" CHECK ((("jsonb_typeof"("data") = 'object'::"text") AND ("pg_column_size"("data") <= 65536)))
);


ALTER TABLE "public"."learner_progress" OWNER TO "postgres";

--
-- Name: license_activations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."license_activations" (
    "license_id" "uuid" NOT NULL,
    "device_hash" "text" NOT NULL,
    "activated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_seen_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "license_activations_hash_check" CHECK (("device_hash" ~ '^[0-9a-f]{64}$'::"text"))
);


ALTER TABLE "public"."license_activations" OWNER TO "postgres";

--
-- Name: licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."licenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "code" "text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "max_devices" smallint NOT NULL,
    "valid_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    CONSTRAINT "licenses_code_check" CHECK (("code" ~ '^LT12-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$'::"text")),
    CONSTRAINT "licenses_devices_check" CHECK ((("max_devices" >= 1) AND ("max_devices" <= 20))),
    CONSTRAINT "licenses_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'revoked'::"text"])))
);


ALTER TABLE "public"."licenses" OWNER TO "postgres";

--
-- Name: media_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."media_assets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid",
    "file_url" "text" NOT NULL,
    "media_type" "text" NOT NULL,
    "caption" "text",
    "alt_text" "text",
    "source_id" "uuid",
    "sort_order" integer DEFAULT 0,
    "era" "text" DEFAULT 'historical'::"text" NOT NULL,
    "year_taken" integer,
    "photographer" "text",
    "license" "text",
    "license_url" "text",
    "source_page_url" "text",
    "is_reenactment" boolean DEFAULT false NOT NULL,
    "is_colorized" boolean DEFAULT false NOT NULL,
    "is_cover" boolean DEFAULT false NOT NULL,
    "focal_point" "text",
    "pair_id" "uuid",
    "width" integer,
    "height" integer,
    "figure_id" "uuid",
    "location_id" "uuid",
    CONSTRAINT "media_assets_era_check" CHECK (("era" = ANY (ARRAY['historical'::"text", 'today'::"text", 'illustration'::"text"]))),
    CONSTRAINT "media_assets_focal_point_check" CHECK (("focal_point" ~ '^(100|[1-9]?[0-9])% (100|[1-9]?[0-9])%$'::"text")),
    CONSTRAINT "media_assets_height_check" CHECK (("height" > 0)),
    CONSTRAINT "media_assets_license_url_check" CHECK (("license_url" ~ '^https?://'::"text")),
    CONSTRAINT "media_assets_media_type_check" CHECK (("media_type" = ANY (ARRAY['image'::"text", 'document'::"text", 'video'::"text", 'panorama'::"text"]))),
    CONSTRAINT "media_assets_source_page_url_check" CHECK (("source_page_url" ~ '^https?://'::"text")),
    CONSTRAINT "media_assets_width_check" CHECK (("width" > 0)),
    CONSTRAINT "media_assets_year_taken_check" CHECK ((("year_taken" >= 1800) AND ("year_taken" <= 2100))),
    CONSTRAINT "media_owner_one" CHECK (("num_nonnulls"("event_id", "figure_id", "location_id") = 1))
);


ALTER TABLE "public"."media_assets" OWNER TO "postgres";

--
-- Name: order_code_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE IF NOT EXISTS "public"."order_code_seq"
    START WITH 100001
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."order_code_seq" OWNER TO "postgres";

--
-- Name: order_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."order_code_seq" OWNED BY "public"."orders"."order_code";


--
-- Name: payment_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."payment_events" (
    "id" bigint NOT NULL,
    "order_code" bigint,
    "provider" "text" NOT NULL,
    "source" "text" NOT NULL,
    "signature_ok" boolean NOT NULL,
    "status" "text",
    "amount_vnd" integer,
    "provider_ref" "text",
    "payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "note" "text",
    "received_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "payment_events_source_check" CHECK (("source" = ANY (ARRAY['webhook'::"text", 'return'::"text", 'reconcile'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."payment_events" OWNER TO "postgres";

--
-- Name: payment_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."payment_events" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."payment_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."quiz_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "choices" "text"[] NOT NULL,
    "correct_index" smallint NOT NULL,
    "explanation" "text" NOT NULL,
    "media_id" "uuid",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "quiz_questions_choices_check" CHECK (("cardinality"("choices") = 4)),
    CONSTRAINT "quiz_questions_correct_check" CHECK ((("correct_index" >= 0) AND ("correct_index" <= 3))),
    CONSTRAINT "quiz_questions_explanation_check" CHECK ((("char_length"("btrim"("explanation")) >= 5) AND ("char_length"("btrim"("explanation")) <= 1000))),
    CONSTRAINT "quiz_questions_question_check" CHECK ((("char_length"("btrim"("question")) >= 5) AND ("char_length"("btrim"("question")) <= 300)))
);


ALTER TABLE "public"."quiz_questions" OWNER TO "postgres";

--
-- Name: rate_limit_hits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."rate_limit_hits" (
    "id" bigint NOT NULL,
    "bucket" "text" NOT NULL,
    "key_hash" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "rate_limit_hits_bucket_check" CHECK (("bucket" = ANY (ARRAY['order_lookup'::"text", 'license_activation'::"text", 'license_claim'::"text", 'progress_write'::"text", 'exam_start'::"text", 'exam_save'::"text", 'practice_free'::"text", 'exam_report'::"text"]))),
    CONSTRAINT "rate_limit_hits_key_check" CHECK (("key_hash" ~ '^[0-9a-f]{64}$'::"text"))
);


ALTER TABLE "public"."rate_limit_hits" OWNER TO "postgres";

--
-- Name: rate_limit_hits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."rate_limit_hits" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."rate_limit_hits_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sgk_lesson_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."sgk_lesson_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lesson_slug" "text" NOT NULL,
    "section_id" "text" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "sgk_lesson_events_lesson_check" CHECK (("lesson_slug" ~ '^([1-9]|1[0-7])-[a-z0-9-]+$'::"text")),
    CONSTRAINT "sgk_lesson_events_section_check" CHECK (("section_id" ~ '^muc-[1-9]$'::"text"))
);


ALTER TABLE "public"."sgk_lesson_events" OWNER TO "postgres";

--
-- Name: sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."sources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "author_org" "text",
    "publisher" "text",
    "published_year" integer,
    "url" "text",
    "source_type" "text" NOT NULL,
    "citation" "text" NOT NULL,
    "accessed_at" "date",
    CONSTRAINT "sources_source_type_check" CHECK (("source_type" = ANY (ARRAY['book'::"text", 'article'::"text", 'official'::"text", 'web'::"text", 'archive'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."sources" OWNER TO "postgres";

--
-- Name: staff_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."staff_profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "account_status" "public"."account_status" DEFAULT 'active'::"public"."account_status" NOT NULL,
    "role" "public"."staff_role" DEFAULT 'editor'::"public"."staff_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."staff_profiles" OWNER TO "postgres";

--
-- Name: orders order_code; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders" ALTER COLUMN "order_code" SET DEFAULT "nextval"('"public"."order_code_seq"'::"regclass");


--
-- Name: curriculum_topics curriculum_topics_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."curriculum_topics"
    ADD CONSTRAINT "curriculum_topics_name_key" UNIQUE ("name");


--
-- Name: curriculum_topics curriculum_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."curriculum_topics"
    ADD CONSTRAINT "curriculum_topics_pkey" PRIMARY KEY ("id");


--
-- Name: curriculum_topics curriculum_topics_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."curriculum_topics"
    ADD CONSTRAINT "curriculum_topics_slug_key" UNIQUE ("slug");


--
-- Name: event_figures event_figures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_figures"
    ADD CONSTRAINT "event_figures_pkey" PRIMARY KEY ("event_id", "figure_id");


--
-- Name: event_locations event_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_pkey" PRIMARY KEY ("event_id", "location_id");


--
-- Name: event_sources event_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_sources"
    ADD CONSTRAINT "event_sources_pkey" PRIMARY KEY ("event_id", "source_id");


--
-- Name: event_topics event_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_topics"
    ADD CONSTRAINT "event_topics_pkey" PRIMARY KEY ("id");


--
-- Name: event_topics event_topics_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_topics"
    ADD CONSTRAINT "event_topics_unique" UNIQUE ("event_id", "topic_id");


--
-- Name: exam_attempts exam_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_attempts"
    ADD CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id");


--
-- Name: exam_item_reports exam_item_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_item_reports"
    ADD CONSTRAINT "exam_item_reports_pkey" PRIMARY KEY ("id");


--
-- Name: exam_items exam_items_content_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_items"
    ADD CONSTRAINT "exam_items_content_key_key" UNIQUE ("content_key");


--
-- Name: exam_items exam_items_fingerprint_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_items"
    ADD CONSTRAINT "exam_items_fingerprint_key" UNIQUE ("fingerprint");


--
-- Name: exam_items exam_items_legacy_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_items"
    ADD CONSTRAINT "exam_items_legacy_key" UNIQUE ("legacy_question_id");


--
-- Name: exam_items exam_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_items"
    ADD CONSTRAINT "exam_items_pkey" PRIMARY KEY ("id");


--
-- Name: exam_passages exam_passages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_passages"
    ADD CONSTRAINT "exam_passages_pkey" PRIMARY KEY ("id");


--
-- Name: exam_questions exam_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_questions"
    ADD CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id");


--
-- Name: exam_questions exam_questions_set_id_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_questions"
    ADD CONSTRAINT "exam_questions_set_id_position_key" UNIQUE ("set_id", "position");


--
-- Name: exam_regrade_log exam_regrade_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_regrade_log"
    ADD CONSTRAINT "exam_regrade_log_pkey" PRIMARY KEY ("id");


--
-- Name: exam_set_items exam_set_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_set_items"
    ADD CONSTRAINT "exam_set_items_pkey" PRIMARY KEY ("set_id", "item_id");


--
-- Name: exam_set_items exam_set_items_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_set_items"
    ADD CONSTRAINT "exam_set_items_position_key" UNIQUE ("set_id", "section", "position") DEFERRABLE;


--
-- Name: exam_sets exam_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_sets"
    ADD CONSTRAINT "exam_sets_pkey" PRIMARY KEY ("id");


--
-- Name: exam_sets exam_sets_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_sets"
    ADD CONSTRAINT "exam_sets_slug_key" UNIQUE ("slug");


--
-- Name: historical_events historical_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."historical_events"
    ADD CONSTRAINT "historical_events_pkey" PRIMARY KEY ("id");


--
-- Name: historical_events historical_events_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."historical_events"
    ADD CONSTRAINT "historical_events_slug_key" UNIQUE ("slug");


--
-- Name: historical_figures historical_figures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."historical_figures"
    ADD CONSTRAINT "historical_figures_pkey" PRIMARY KEY ("id");


--
-- Name: historical_figures historical_figures_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."historical_figures"
    ADD CONSTRAINT "historical_figures_slug_key" UNIQUE ("slug");


--
-- Name: historical_locations historical_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."historical_locations"
    ADD CONSTRAINT "historical_locations_pkey" PRIMARY KEY ("id");


--
-- Name: historical_locations historical_locations_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."historical_locations"
    ADD CONSTRAINT "historical_locations_slug_key" UNIQUE ("slug");


--
-- Name: learner_item_state learner_item_state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."learner_item_state"
    ADD CONSTRAINT "learner_item_state_pkey" PRIMARY KEY ("user_id", "item_id");


--
-- Name: learner_profiles learner_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."learner_profiles"
    ADD CONSTRAINT "learner_profiles_pkey" PRIMARY KEY ("id");


--
-- Name: learner_progress learner_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."learner_progress"
    ADD CONSTRAINT "learner_progress_pkey" PRIMARY KEY ("user_id");


--
-- Name: license_activations license_activations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."license_activations"
    ADD CONSTRAINT "license_activations_pkey" PRIMARY KEY ("license_id", "device_hash");


--
-- Name: licenses licenses_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."licenses"
    ADD CONSTRAINT "licenses_code_key" UNIQUE ("code");


--
-- Name: licenses licenses_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."licenses"
    ADD CONSTRAINT "licenses_order_id_key" UNIQUE ("order_id");


--
-- Name: licenses licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."licenses"
    ADD CONSTRAINT "licenses_pkey" PRIMARY KEY ("id");


--
-- Name: media_assets media_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id");


--
-- Name: orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_code_key" UNIQUE ("order_code");


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");


--
-- Name: payment_events payment_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."payment_events"
    ADD CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id");


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id");


--
-- Name: rate_limit_hits rate_limit_hits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."rate_limit_hits"
    ADD CONSTRAINT "rate_limit_hits_pkey" PRIMARY KEY ("id");


--
-- Name: sgk_lesson_events sgk_lesson_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."sgk_lesson_events"
    ADD CONSTRAINT "sgk_lesson_events_pkey" PRIMARY KEY ("id");


--
-- Name: sgk_lesson_events sgk_lesson_events_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."sgk_lesson_events"
    ADD CONSTRAINT "sgk_lesson_events_unique" UNIQUE ("lesson_slug", "section_id", "event_id");


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."sources"
    ADD CONSTRAINT "sources_pkey" PRIMARY KEY ("id");


--
-- Name: staff_profiles staff_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."staff_profiles"
    ADD CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id");


--
-- Name: idx_event_figures_figure; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_event_figures_figure" ON "public"."event_figures" USING "btree" ("figure_id");


--
-- Name: idx_event_locations_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_event_locations_location" ON "public"."event_locations" USING "btree" ("location_id");


--
-- Name: idx_event_sources_source; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_event_sources_source" ON "public"."event_sources" USING "btree" ("source_id");


--
-- Name: idx_event_topics_topic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_event_topics_topic" ON "public"."event_topics" USING "btree" ("topic_id");


--
-- Name: idx_events_topic_status_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_events_topic_status_year" ON "public"."historical_events" USING "btree" ("topic_id", "workflow_status", "start_year");


--
-- Name: idx_exam_attempts_blueprint; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_attempts_blueprint" ON "public"."exam_attempts" USING "btree" ("blueprint", "status") WHERE ("blueprint" IS NOT NULL);


--
-- Name: idx_exam_attempts_device; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_attempts_device" ON "public"."exam_attempts" USING "btree" ("device_hash", "set_id", "status") WHERE ("device_hash" IS NOT NULL);


--
-- Name: idx_exam_attempts_license; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_attempts_license" ON "public"."exam_attempts" USING "btree" ("license_id", "device_hash", "submitted_at" DESC) WHERE ("license_id" IS NOT NULL);


--
-- Name: idx_exam_attempts_set; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_attempts_set" ON "public"."exam_attempts" USING "btree" ("set_id", "status");


--
-- Name: idx_exam_attempts_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_attempts_user" ON "public"."exam_attempts" USING "btree" ("user_id", "submitted_at" DESC) WHERE ("user_id" IS NOT NULL);


--
-- Name: idx_exam_item_reports_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_item_reports_item" ON "public"."exam_item_reports" USING "btree" ("item_id");


--
-- Name: idx_exam_item_reports_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_item_reports_status" ON "public"."exam_item_reports" USING "btree" ("status", "created_at" DESC);


--
-- Name: idx_exam_items_event; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_items_event" ON "public"."exam_items" USING "btree" ("event_id") WHERE ("event_id" IS NOT NULL);


--
-- Name: idx_exam_items_grade_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_items_grade_level" ON "public"."exam_items" USING "btree" ("workflow_status", "grade", "level");


--
-- Name: idx_exam_items_kind_lesson; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_items_kind_lesson" ON "public"."exam_items" USING "btree" ("workflow_status", "kind", "lesson_slug");


--
-- Name: idx_exam_items_passage; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_items_passage" ON "public"."exam_items" USING "btree" ("passage_id") WHERE ("passage_id" IS NOT NULL);


--
-- Name: idx_exam_passages_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_passages_status" ON "public"."exam_passages" USING "btree" ("workflow_status", "lesson_slug");


--
-- Name: idx_exam_questions_event; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_questions_event" ON "public"."exam_questions" USING "btree" ("event_id") WHERE ("event_id" IS NOT NULL);


--
-- Name: idx_exam_regrade_log_attempt; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_regrade_log_attempt" ON "public"."exam_regrade_log" USING "btree" ("attempt_id");


--
-- Name: idx_exam_regrade_log_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_regrade_log_item" ON "public"."exam_regrade_log" USING "btree" ("item_id", "created_at" DESC);


--
-- Name: idx_exam_set_items_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_set_items_item" ON "public"."exam_set_items" USING "btree" ("item_id");


--
-- Name: idx_exam_sets_status_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_exam_sets_status_order" ON "public"."exam_sets" USING "btree" ("workflow_status", "sort_order");


--
-- Name: idx_historical_locations_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_historical_locations_geom" ON "public"."historical_locations" USING "gist" ("geom");


--
-- Name: idx_learner_item_state_due; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_learner_item_state_due" ON "public"."learner_item_state" USING "btree" ("user_id", "due_at") WHERE "in_notebook";


--
-- Name: idx_licenses_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_licenses_product" ON "public"."licenses" USING "btree" ("product_id");


--
-- Name: idx_licenses_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_licenses_user" ON "public"."licenses" USING "btree" ("user_id") WHERE ("user_id" IS NOT NULL);


--
-- Name: idx_media_assets_event; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_media_assets_event" ON "public"."media_assets" USING "btree" ("event_id");


--
-- Name: idx_media_assets_figure; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_media_assets_figure" ON "public"."media_assets" USING "btree" ("figure_id") WHERE ("figure_id" IS NOT NULL);


--
-- Name: idx_media_assets_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_media_assets_location" ON "public"."media_assets" USING "btree" ("location_id") WHERE ("location_id" IS NOT NULL);


--
-- Name: idx_media_assets_pair; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_media_assets_pair" ON "public"."media_assets" USING "btree" ("pair_id") WHERE ("pair_id" IS NOT NULL);


--
-- Name: idx_media_assets_source; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_media_assets_source" ON "public"."media_assets" USING "btree" ("source_id");


--
-- Name: idx_orders_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_email" ON "public"."orders" USING "btree" ("lower"("buyer_email")) WHERE ("buyer_email" IS NOT NULL);


--
-- Name: idx_orders_ip_recent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_ip_recent" ON "public"."orders" USING "btree" ("client_ip_hash", "created_at" DESC) WHERE ("client_ip_hash" IS NOT NULL);


--
-- Name: idx_orders_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_product" ON "public"."orders" USING "btree" ("product_id");


--
-- Name: idx_orders_status_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_status_created" ON "public"."orders" USING "btree" ("status", "created_at" DESC);


--
-- Name: idx_orders_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_orders_user" ON "public"."orders" USING "btree" ("user_id", "created_at" DESC) WHERE ("user_id" IS NOT NULL);


--
-- Name: idx_payment_events_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_payment_events_order" ON "public"."payment_events" USING "btree" ("order_code", "received_at" DESC);


--
-- Name: idx_payment_events_recent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_payment_events_recent" ON "public"."payment_events" USING "btree" ("received_at" DESC);


--
-- Name: idx_quiz_questions_event; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_quiz_questions_event" ON "public"."quiz_questions" USING "btree" ("event_id", "sort_order");


--
-- Name: idx_rate_limit_hits_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_rate_limit_hits_lookup" ON "public"."rate_limit_hits" USING "btree" ("bucket", "key_hash", "created_at" DESC);


--
-- Name: idx_sgk_lesson_events_event; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_sgk_lesson_events_event" ON "public"."sgk_lesson_events" USING "btree" ("event_id");


--
-- Name: idx_sgk_lesson_events_lesson; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_sgk_lesson_events_lesson" ON "public"."sgk_lesson_events" USING "btree" ("lesson_slug", "section_id", "sort_order");


--
-- Name: uq_event_locations_one_primary; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "uq_event_locations_one_primary" ON "public"."event_locations" USING "btree" ("event_id") WHERE ("is_primary" = true);


--
-- Name: uq_exam_item_reports_open; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "uq_exam_item_reports_open" ON "public"."exam_item_reports" USING "btree" ("item_id", COALESCE(("user_id")::"text", "device_hash")) WHERE ("status" = 'open'::"text");


--
-- Name: uq_media_assets_one_cover; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "uq_media_assets_one_cover" ON "public"."media_assets" USING "btree" (COALESCE("event_id", "figure_id", "location_id")) WHERE "is_cover";


--
-- Name: event_topics event_topics_not_primary; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "event_topics_not_primary" BEFORE INSERT OR UPDATE ON "public"."event_topics" FOR EACH ROW EXECUTE FUNCTION "public"."event_topics_not_primary"();


--
-- Name: historical_events trg_check_event_has_source; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_check_event_has_source" BEFORE INSERT OR UPDATE ON "public"."historical_events" FOR EACH ROW EXECUTE FUNCTION "public"."check_event_has_source"();


--
-- Name: exam_attempts trg_exam_attempts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_attempts_updated_at" BEFORE UPDATE ON "public"."exam_attempts" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: exam_items trg_exam_item_integrity; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_item_integrity" BEFORE INSERT OR UPDATE ON "public"."exam_items" FOR EACH ROW EXECUTE FUNCTION "public"."exam_item_integrity"();


--
-- Name: exam_items trg_exam_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_items_updated_at" BEFORE UPDATE ON "public"."exam_items" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: exam_passages trg_exam_passages_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_passages_updated_at" BEFORE UPDATE ON "public"."exam_passages" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: exam_questions trg_exam_question_integrity; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_question_integrity" BEFORE INSERT OR UPDATE ON "public"."exam_questions" FOR EACH ROW EXECUTE FUNCTION "public"."exam_question_integrity"();


--
-- Name: exam_questions trg_exam_questions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_questions_updated_at" BEFORE UPDATE ON "public"."exam_questions" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: exam_sets trg_exam_sets_published_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_sets_published_at" BEFORE INSERT OR UPDATE ON "public"."exam_sets" FOR EACH ROW EXECUTE FUNCTION "public"."exam_set_published_at"();


--
-- Name: exam_sets trg_exam_sets_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_exam_sets_updated_at" BEFORE UPDATE ON "public"."exam_sets" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: historical_events trg_historical_events_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_historical_events_updated_at" BEFORE UPDATE ON "public"."historical_events" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: learner_profiles trg_learner_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_learner_profiles_updated_at" BEFORE UPDATE ON "public"."learner_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: learner_progress trg_learner_progress_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_learner_progress_updated_at" BEFORE UPDATE ON "public"."learner_progress" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: orders trg_order_integrity; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_order_integrity" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."order_integrity"();


--
-- Name: orders trg_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: staff_profiles trg_prevent_last_admin_lockout; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_prevent_last_admin_lockout" BEFORE DELETE OR UPDATE ON "public"."staff_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_last_admin_lockout"();


--
-- Name: products trg_products_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: quiz_questions trg_quiz_question_integrity; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_quiz_question_integrity" BEFORE INSERT OR UPDATE ON "public"."quiz_questions" FOR EACH ROW EXECUTE FUNCTION "public"."quiz_question_integrity"();


--
-- Name: quiz_questions trg_quiz_questions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_quiz_questions_updated_at" BEFORE UPDATE ON "public"."quiz_questions" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: curriculum_topics trg_reviewer_status_only; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_reviewer_status_only" BEFORE UPDATE ON "public"."curriculum_topics" FOR EACH ROW EXECUTE FUNCTION "public"."reviewer_may_only_change_status"();


--
-- Name: historical_events trg_reviewer_status_only; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_reviewer_status_only" BEFORE UPDATE ON "public"."historical_events" FOR EACH ROW EXECUTE FUNCTION "public"."reviewer_may_only_change_status"();


--
-- Name: historical_figures trg_reviewer_status_only; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_reviewer_status_only" BEFORE UPDATE ON "public"."historical_figures" FOR EACH ROW EXECUTE FUNCTION "public"."reviewer_may_only_change_status"();


--
-- Name: historical_locations trg_reviewer_status_only; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_reviewer_status_only" BEFORE UPDATE ON "public"."historical_locations" FOR EACH ROW EXECUTE FUNCTION "public"."reviewer_may_only_change_status"();


--
-- Name: sgk_lesson_events trg_sgk_lesson_events_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_sgk_lesson_events_updated_at" BEFORE UPDATE ON "public"."sgk_lesson_events" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: staff_profiles trg_staff_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trg_staff_profiles_updated_at" BEFORE UPDATE ON "public"."staff_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: event_figures event_figures_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_figures"
    ADD CONSTRAINT "event_figures_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE CASCADE;


--
-- Name: event_figures event_figures_figure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_figures"
    ADD CONSTRAINT "event_figures_figure_id_fkey" FOREIGN KEY ("figure_id") REFERENCES "public"."historical_figures"("id");


--
-- Name: event_locations event_locations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE CASCADE;


--
-- Name: event_locations event_locations_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_locations"
    ADD CONSTRAINT "event_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."historical_locations"("id");


--
-- Name: event_sources event_sources_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_sources"
    ADD CONSTRAINT "event_sources_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE CASCADE;


--
-- Name: event_sources event_sources_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_sources"
    ADD CONSTRAINT "event_sources_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id");


--
-- Name: event_topics event_topics_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_topics"
    ADD CONSTRAINT "event_topics_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE CASCADE;


--
-- Name: event_topics event_topics_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."event_topics"
    ADD CONSTRAINT "event_topics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."curriculum_topics"("id") ON DELETE CASCADE;


--
-- Name: exam_attempts exam_attempts_license_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_attempts"
    ADD CONSTRAINT "exam_attempts_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE SET NULL;


--
-- Name: exam_attempts exam_attempts_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_attempts"
    ADD CONSTRAINT "exam_attempts_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."exam_sets"("id") ON DELETE SET NULL;


--
-- Name: exam_attempts exam_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_attempts"
    ADD CONSTRAINT "exam_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: exam_item_reports exam_item_reports_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_item_reports"
    ADD CONSTRAINT "exam_item_reports_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE SET NULL;


--
-- Name: exam_item_reports exam_item_reports_handled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_item_reports"
    ADD CONSTRAINT "exam_item_reports_handled_by_fkey" FOREIGN KEY ("handled_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;


--
-- Name: exam_item_reports exam_item_reports_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_item_reports"
    ADD CONSTRAINT "exam_item_reports_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."exam_items"("id") ON DELETE CASCADE;


--
-- Name: exam_item_reports exam_item_reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_item_reports"
    ADD CONSTRAINT "exam_item_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;


--
-- Name: exam_items exam_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_items"
    ADD CONSTRAINT "exam_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;


--
-- Name: exam_items exam_items_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_items"
    ADD CONSTRAINT "exam_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE SET NULL;


--
-- Name: exam_items exam_items_passage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_items"
    ADD CONSTRAINT "exam_items_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "public"."exam_passages"("id") ON DELETE RESTRICT;


--
-- Name: exam_passages exam_passages_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_passages"
    ADD CONSTRAINT "exam_passages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;


--
-- Name: exam_questions exam_questions_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_questions"
    ADD CONSTRAINT "exam_questions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE SET NULL;


--
-- Name: exam_questions exam_questions_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_questions"
    ADD CONSTRAINT "exam_questions_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."exam_sets"("id") ON DELETE CASCADE;


--
-- Name: exam_regrade_log exam_regrade_log_actor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_regrade_log"
    ADD CONSTRAINT "exam_regrade_log_actor_fkey" FOREIGN KEY ("actor") REFERENCES "auth"."users"("id") ON DELETE SET NULL;


--
-- Name: exam_regrade_log exam_regrade_log_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_regrade_log"
    ADD CONSTRAINT "exam_regrade_log_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE CASCADE;


--
-- Name: exam_regrade_log exam_regrade_log_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_regrade_log"
    ADD CONSTRAINT "exam_regrade_log_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."exam_items"("id") ON DELETE CASCADE;


--
-- Name: exam_set_items exam_set_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_set_items"
    ADD CONSTRAINT "exam_set_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."exam_items"("id") ON DELETE RESTRICT;


--
-- Name: exam_set_items exam_set_items_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_set_items"
    ADD CONSTRAINT "exam_set_items_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."exam_sets"("id") ON DELETE CASCADE;


--
-- Name: exam_sets exam_sets_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."exam_sets"
    ADD CONSTRAINT "exam_sets_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");


--
-- Name: historical_events historical_events_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."historical_events"
    ADD CONSTRAINT "historical_events_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."curriculum_topics"("id");


--
-- Name: learner_item_state learner_item_state_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."learner_item_state"
    ADD CONSTRAINT "learner_item_state_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."exam_items"("id") ON DELETE CASCADE;


--
-- Name: learner_item_state learner_item_state_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."learner_item_state"
    ADD CONSTRAINT "learner_item_state_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: learner_profiles learner_profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."learner_profiles"
    ADD CONSTRAINT "learner_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: learner_progress learner_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."learner_progress"
    ADD CONSTRAINT "learner_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: license_activations license_activations_license_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."license_activations"
    ADD CONSTRAINT "license_activations_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE CASCADE;


--
-- Name: licenses licenses_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."licenses"
    ADD CONSTRAINT "licenses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");


--
-- Name: licenses licenses_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."licenses"
    ADD CONSTRAINT "licenses_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");


--
-- Name: licenses licenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."licenses"
    ADD CONSTRAINT "licenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;


--
-- Name: media_assets media_assets_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE CASCADE;


--
-- Name: media_assets media_assets_figure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_figure_id_fkey" FOREIGN KEY ("figure_id") REFERENCES "public"."historical_figures"("id") ON DELETE CASCADE;


--
-- Name: media_assets media_assets_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."historical_locations"("id") ON DELETE CASCADE;


--
-- Name: media_assets media_assets_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."media_assets"
    ADD CONSTRAINT "media_assets_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE SET NULL;


--
-- Name: orders orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;


--
-- Name: products products_grants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_grants_product_id_fkey" FOREIGN KEY ("grants_product_id") REFERENCES "public"."products"("id");


--
-- Name: quiz_questions quiz_questions_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE SET NULL;


--
-- Name: sgk_lesson_events sgk_lesson_events_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."sgk_lesson_events"
    ADD CONSTRAINT "sgk_lesson_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE CASCADE;


--
-- Name: staff_profiles staff_profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."staff_profiles"
    ADD CONSTRAINT "staff_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: curriculum_topics admin_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_all" ON "public"."curriculum_topics" TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role")) WITH CHECK (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: historical_events admin_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_all" ON "public"."historical_events" TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role")) WITH CHECK (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: historical_figures admin_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_all" ON "public"."historical_figures" TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role")) WITH CHECK (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: historical_locations admin_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_all" ON "public"."historical_locations" TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role")) WITH CHECK (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: products admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_manage" ON "public"."products" TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role")) WITH CHECK (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: staff_profiles admin_manage_staff; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_manage_staff" ON "public"."staff_profiles" TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role")) WITH CHECK (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: exam_attempts admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_read" ON "public"."exam_attempts" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: exam_regrade_log admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_read" ON "public"."exam_regrade_log" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: learner_profiles admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_read" ON "public"."learner_profiles" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: license_activations admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_read" ON "public"."license_activations" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: licenses admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_read" ON "public"."licenses" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: orders admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_read" ON "public"."orders" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: payment_events admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_read" ON "public"."payment_events" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() = 'system_admin'::"public"."staff_role"));


--
-- Name: curriculum_topics; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."curriculum_topics" ENABLE ROW LEVEL SECURITY;

--
-- Name: sgk_lesson_events editor_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_admin_manage" ON "public"."sgk_lesson_events" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['editor'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['editor'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: sources editor_delete_unlinked; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_delete_unlinked" ON "public"."sources" FOR DELETE TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (NOT "public"."source_locked_for_editor"("id"))));


--
-- Name: sources editor_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_insert" ON "public"."sources" FOR INSERT TO "authenticated" WITH CHECK (("public"."current_staff_role"() = 'editor'::"public"."staff_role"));


--
-- Name: curriculum_topics editor_insert_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_insert_draft" ON "public"."curriculum_topics" FOR INSERT TO "authenticated" WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = 'draft'::"public"."content_workflow_status")));


--
-- Name: historical_events editor_insert_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_insert_draft" ON "public"."historical_events" FOR INSERT TO "authenticated" WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = 'draft'::"public"."content_workflow_status")));


--
-- Name: historical_figures editor_insert_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_insert_draft" ON "public"."historical_figures" FOR INSERT TO "authenticated" WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = 'draft'::"public"."content_workflow_status")));


--
-- Name: historical_locations editor_insert_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_insert_draft" ON "public"."historical_locations" FOR INSERT TO "authenticated" WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = 'draft'::"public"."content_workflow_status")));


--
-- Name: event_figures editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."event_figures" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_figures"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"]))))))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_figures"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))))));


--
-- Name: event_locations editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."event_locations" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_locations"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"]))))))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_locations"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))))));


--
-- Name: event_sources editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."event_sources" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_sources"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"]))))))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_sources"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))))));


--
-- Name: event_topics editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."event_topics" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_topics"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"]))))))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_topics"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))))));


--
-- Name: exam_items editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."exam_items" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status", 'pending_review'::"public"."content_workflow_status"]))));


--
-- Name: exam_passages editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."exam_passages" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status", 'pending_review'::"public"."content_workflow_status"]))));


--
-- Name: exam_questions editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."exam_questions" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."exam_sets" "s"
  WHERE (("s"."id" = "exam_questions"."set_id") AND ("s"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"]))))))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."exam_sets" "s"
  WHERE (("s"."id" = "exam_questions"."set_id") AND ("s"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))))));


--
-- Name: exam_set_items editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."exam_set_items" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."exam_sets" "s"
  WHERE (("s"."id" = "exam_set_items"."set_id") AND ("s"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"]))))))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."exam_sets" "s"
  WHERE (("s"."id" = "exam_set_items"."set_id") AND ("s"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))))));


--
-- Name: exam_sets editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."exam_sets" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status", 'pending_review'::"public"."content_workflow_status"]))));


--
-- Name: media_assets editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."media_assets" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("public"."media_owner_status"("event_id", "figure_id", "location_id") = ANY (ARRAY['draft'::"text", 'needs_revision'::"text"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("public"."media_owner_status"("event_id", "figure_id", "location_id") = ANY (ARRAY['draft'::"text", 'needs_revision'::"text"]))));


--
-- Name: quiz_questions editor_manage_editable; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_manage_editable" ON "public"."quiz_questions" TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "quiz_questions"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"]))))))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "quiz_questions"."event_id") AND ("e"."workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))))));


--
-- Name: curriculum_topics editor_update_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_update_draft" ON "public"."curriculum_topics" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status", 'pending_review'::"public"."content_workflow_status"]))));


--
-- Name: historical_events editor_update_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_update_draft" ON "public"."historical_events" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status", 'pending_review'::"public"."content_workflow_status"]))));


--
-- Name: historical_figures editor_update_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_update_draft" ON "public"."historical_figures" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status", 'pending_review'::"public"."content_workflow_status"]))));


--
-- Name: historical_locations editor_update_draft; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_update_draft" ON "public"."historical_locations" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['draft'::"public"."content_workflow_status", 'needs_revision'::"public"."content_workflow_status", 'pending_review'::"public"."content_workflow_status"]))));


--
-- Name: sources editor_update_unlinked; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "editor_update_unlinked" ON "public"."sources" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (NOT "public"."source_locked_for_editor"("id")))) WITH CHECK ((("public"."current_staff_role"() = 'editor'::"public"."staff_role") AND (NOT "public"."source_locked_for_editor"("id"))));


--
-- Name: event_figures; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."event_figures" ENABLE ROW LEVEL SECURITY;

--
-- Name: event_locations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."event_locations" ENABLE ROW LEVEL SECURITY;

--
-- Name: event_sources; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."event_sources" ENABLE ROW LEVEL SECURITY;

--
-- Name: event_topics; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."event_topics" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_attempts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_attempts" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_item_reports; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_item_reports" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_items" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_passages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_passages" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_questions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_questions" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_regrade_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_regrade_log" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_set_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_set_items" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_sets; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."exam_sets" ENABLE ROW LEVEL SECURITY;

--
-- Name: historical_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."historical_events" ENABLE ROW LEVEL SECURITY;

--
-- Name: historical_figures; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."historical_figures" ENABLE ROW LEVEL SECURITY;

--
-- Name: historical_locations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."historical_locations" ENABLE ROW LEVEL SECURITY;

--
-- Name: learner_item_state; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."learner_item_state" ENABLE ROW LEVEL SECURITY;

--
-- Name: learner_profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."learner_profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: learner_progress; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."learner_progress" ENABLE ROW LEVEL SECURITY;

--
-- Name: license_activations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."license_activations" ENABLE ROW LEVEL SECURITY;

--
-- Name: licenses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."licenses" ENABLE ROW LEVEL SECURITY;

--
-- Name: media_assets; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."media_assets" ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;

--
-- Name: learner_profiles own_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_insert" ON "public"."learner_profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: learner_progress own_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_insert" ON "public"."learner_progress" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: exam_attempts own_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_select" ON "public"."exam_attempts" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: learner_item_state own_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_select" ON "public"."learner_item_state" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: learner_profiles own_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_select" ON "public"."learner_profiles" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: learner_progress own_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_select" ON "public"."learner_progress" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: learner_profiles own_update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_update" ON "public"."learner_profiles" FOR UPDATE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: learner_progress own_update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own_update" ON "public"."learner_progress" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: payment_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."payment_events" ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

--
-- Name: products public_read_active; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_active" ON "public"."products" FOR SELECT TO "authenticated", "anon" USING ("is_active");


--
-- Name: curriculum_topics public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."curriculum_topics" FOR SELECT TO "authenticated", "anon" USING (("workflow_status" = 'published'::"public"."content_workflow_status"));


--
-- Name: event_figures public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."event_figures" FOR SELECT TO "authenticated", "anon" USING (((EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_figures"."event_id") AND ("e"."workflow_status" = 'published'::"public"."content_workflow_status")))) AND (EXISTS ( SELECT 1
   FROM "public"."historical_figures" "f"
  WHERE (("f"."id" = "event_figures"."figure_id") AND ("f"."workflow_status" = 'published'::"public"."content_workflow_status"))))));


--
-- Name: event_locations public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."event_locations" FOR SELECT TO "authenticated", "anon" USING (((EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_locations"."event_id") AND ("e"."workflow_status" = 'published'::"public"."content_workflow_status")))) AND (EXISTS ( SELECT 1
   FROM "public"."historical_locations" "l"
  WHERE (("l"."id" = "event_locations"."location_id") AND ("l"."workflow_status" = 'published'::"public"."content_workflow_status"))))));


--
-- Name: event_sources public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."event_sources" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_sources"."event_id") AND ("e"."workflow_status" = 'published'::"public"."content_workflow_status")))));


--
-- Name: event_topics public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."event_topics" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "event_topics"."event_id") AND ("e"."workflow_status" = 'published'::"public"."content_workflow_status")))));


--
-- Name: exam_sets public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."exam_sets" FOR SELECT TO "authenticated", "anon" USING (("workflow_status" = 'published'::"public"."content_workflow_status"));


--
-- Name: historical_events public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."historical_events" FOR SELECT TO "authenticated", "anon" USING (("workflow_status" = 'published'::"public"."content_workflow_status"));


--
-- Name: historical_figures public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."historical_figures" FOR SELECT TO "authenticated", "anon" USING (("workflow_status" = 'published'::"public"."content_workflow_status"));


--
-- Name: historical_locations public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."historical_locations" FOR SELECT TO "authenticated", "anon" USING (("workflow_status" = 'published'::"public"."content_workflow_status"));


--
-- Name: media_assets public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."media_assets" FOR SELECT TO "authenticated", "anon" USING (("public"."media_owner_status"("event_id", "figure_id", "location_id") = 'published'::"text"));


--
-- Name: quiz_questions public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."quiz_questions" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "quiz_questions"."event_id") AND ("e"."workflow_status" = 'published'::"public"."content_workflow_status")))));


--
-- Name: sgk_lesson_events public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."sgk_lesson_events" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."historical_events" "e"
  WHERE (("e"."id" = "sgk_lesson_events"."event_id") AND ("e"."workflow_status" = 'published'::"public"."content_workflow_status")))));


--
-- Name: sources public_read_published; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public_read_published" ON "public"."sources" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM ("public"."event_sources" "es"
     JOIN "public"."historical_events" "e" ON (("e"."id" = "es"."event_id")))
  WHERE (("es"."source_id" = "sources"."id") AND ("e"."workflow_status" = 'published'::"public"."content_workflow_status")))));


--
-- Name: quiz_questions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."quiz_questions" ENABLE ROW LEVEL SECURITY;

--
-- Name: rate_limit_hits; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."rate_limit_hits" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_item_reports reviewer_admin_handle; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_handle" ON "public"."exam_item_reports" FOR UPDATE TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: event_figures reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."event_figures" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: event_locations reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."event_locations" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: event_sources reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."event_sources" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: event_topics reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."event_topics" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: exam_items reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."exam_items" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: exam_passages reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."exam_passages" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: exam_questions reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."exam_questions" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: exam_set_items reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."exam_set_items" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: exam_sets reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."exam_sets" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: media_assets reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."media_assets" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: quiz_questions reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."quiz_questions" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: sources reviewer_admin_manage; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_admin_manage" ON "public"."sources" TO "authenticated" USING (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"]))) WITH CHECK (("public"."current_staff_role"() = ANY (ARRAY['reviewer'::"public"."staff_role", 'system_admin'::"public"."staff_role"])));


--
-- Name: curriculum_topics reviewer_update_status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_update_status" ON "public"."curriculum_topics" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['pending_review'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['needs_revision'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"]))));


--
-- Name: historical_events reviewer_update_status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_update_status" ON "public"."historical_events" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['pending_review'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['needs_revision'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"]))));


--
-- Name: historical_figures reviewer_update_status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_update_status" ON "public"."historical_figures" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['pending_review'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['needs_revision'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"]))));


--
-- Name: historical_locations reviewer_update_status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "reviewer_update_status" ON "public"."historical_locations" FOR UPDATE TO "authenticated" USING ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['pending_review'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"])))) WITH CHECK ((("public"."current_staff_role"() = 'reviewer'::"public"."staff_role") AND ("workflow_status" = ANY (ARRAY['needs_revision'::"public"."content_workflow_status", 'published'::"public"."content_workflow_status", 'hidden'::"public"."content_workflow_status"]))));


--
-- Name: sgk_lesson_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."sgk_lesson_events" ENABLE ROW LEVEL SECURITY;

--
-- Name: sources; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."sources" ENABLE ROW LEVEL SECURITY;

--
-- Name: staff_profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."staff_profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_item_reports staff_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read" ON "public"."exam_item_reports" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: curriculum_topics staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."curriculum_topics" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: event_figures staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."event_figures" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: event_locations staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."event_locations" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: event_sources staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."event_sources" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: event_topics staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."event_topics" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: exam_items staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."exam_items" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: exam_passages staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."exam_passages" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: exam_questions staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."exam_questions" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: exam_set_items staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."exam_set_items" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: exam_sets staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."exam_sets" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: historical_events staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."historical_events" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: historical_figures staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."historical_figures" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: historical_locations staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."historical_locations" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: media_assets staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."media_assets" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: quiz_questions staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."quiz_questions" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: sgk_lesson_events staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."sgk_lesson_events" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: sources staff_read_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_all" ON "public"."sources" FOR SELECT TO "authenticated" USING (("public"."current_staff_role"() IS NOT NULL));


--
-- Name: staff_profiles staff_read_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "staff_read_own" ON "public"."staff_profiles" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "activate_license"("p_code" "text", "p_device_hash" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."activate_license"("p_code" "text", "p_device_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."activate_license"("p_code" "text", "p_device_hash" "text") TO "service_role";


--
-- Name: FUNCTION "admin_resolve_late_payment"("p_order_code" bigint, "p_staff_id" "uuid", "p_note" "text", "p_license_code" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."admin_resolve_late_payment"("p_order_code" bigint, "p_staff_id" "uuid", "p_note" "text", "p_license_code" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_resolve_late_payment"("p_order_code" bigint, "p_staff_id" "uuid", "p_note" "text", "p_license_code" "text") TO "service_role";


--
-- Name: FUNCTION "check_attempt_item"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_item_id" "uuid", "p_answer" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."check_attempt_item"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_item_id" "uuid", "p_answer" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."check_attempt_item"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_item_id" "uuid", "p_answer" "jsonb") TO "service_role";


--
-- Name: FUNCTION "check_event_has_source"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."check_event_has_source"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_event_has_source"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_event_has_source"() TO "service_role";


--
-- Name: FUNCTION "claim_license"("p_code" "text", "p_user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."claim_license"("p_code" "text", "p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."claim_license"("p_code" "text", "p_user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "consume_rate_limit"("p_bucket" "text", "p_key_hash" "text", "p_window_seconds" integer, "p_max" integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."consume_rate_limit"("p_bucket" "text", "p_key_hash" "text", "p_window_seconds" integer, "p_max" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."consume_rate_limit"("p_bucket" "text", "p_key_hash" "text", "p_window_seconds" integer, "p_max" integer) TO "service_role";


--
-- Name: FUNCTION "current_staff_role"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."current_staff_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_staff_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_staff_role"() TO "service_role";


--
-- Name: FUNCTION "event_topics_not_primary"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."event_topics_not_primary"() TO "anon";
GRANT ALL ON FUNCTION "public"."event_topics_not_primary"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."event_topics_not_primary"() TO "service_role";


--
-- Name: FUNCTION "exam_access"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_access"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_access"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "exam_admin_overview"("p_days" integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_admin_overview"("p_days" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_admin_overview"("p_days" integer) TO "service_role";


--
-- Name: TABLE "exam_attempts"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_attempts" TO "service_role";
GRANT SELECT ON TABLE "public"."exam_attempts" TO "authenticated";


--
-- Name: FUNCTION "exam_attempt_owner_ok"("a" "public"."exam_attempts", "p_user_id" "uuid", "p_device_hash" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_attempt_owner_ok"("a" "public"."exam_attempts", "p_user_id" "uuid", "p_device_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_attempt_owner_ok"("a" "public"."exam_attempts", "p_user_id" "uuid", "p_device_hash" "text") TO "service_role";


--
-- Name: FUNCTION "exam_attempt_view"("a" "public"."exam_attempts", "p_reveal" boolean); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_attempt_view"("a" "public"."exam_attempts", "p_reveal" boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_attempt_view"("a" "public"."exam_attempts", "p_reveal" boolean) TO "service_role";


--
-- Name: FUNCTION "exam_clean_answers"("a" "public"."exam_attempts", "p_answers" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_clean_answers"("a" "public"."exam_attempts", "p_answers" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_clean_answers"("a" "public"."exam_attempts", "p_answers" "jsonb") TO "service_role";


--
-- Name: FUNCTION "exam_fold"("p_text" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."exam_fold"("p_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."exam_fold"("p_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."exam_fold"("p_text" "text") TO "service_role";


--
-- Name: FUNCTION "exam_grade_attempt"("p_attempt_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_grade_attempt"("p_attempt_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_grade_attempt"("p_attempt_id" "uuid") TO "service_role";


--
-- Name: TABLE "exam_items"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_items" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."exam_items" TO "authenticated";


--
-- Name: FUNCTION "exam_item_earned"("p_item" "public"."exam_items", "p_shift" smallint, "p_answer" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_item_earned"("p_item" "public"."exam_items", "p_shift" smallint, "p_answer" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_item_earned"("p_item" "public"."exam_items", "p_shift" smallint, "p_answer" "jsonb") TO "service_role";


--
-- Name: FUNCTION "exam_item_fingerprint"("p_kind" "public"."exam_item_kind", "p_stem" "text", "p_choices" "text"[], "p_statements" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."exam_item_fingerprint"("p_kind" "public"."exam_item_kind", "p_stem" "text", "p_choices" "text"[], "p_statements" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."exam_item_fingerprint"("p_kind" "public"."exam_item_kind", "p_stem" "text", "p_choices" "text"[], "p_statements" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."exam_item_fingerprint"("p_kind" "public"."exam_item_kind", "p_stem" "text", "p_choices" "text"[], "p_statements" "jsonb") TO "service_role";


--
-- Name: FUNCTION "exam_item_integrity"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."exam_item_integrity"() TO "anon";
GRANT ALL ON FUNCTION "public"."exam_item_integrity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."exam_item_integrity"() TO "service_role";


--
-- Name: FUNCTION "exam_item_stats"("p_item_ids" "uuid"[]); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_item_stats"("p_item_ids" "uuid"[]) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_item_stats"("p_item_ids" "uuid"[]) TO "service_role";


--
-- Name: FUNCTION "exam_leitner_apply"("p_user_id" "uuid", "p_item_id" "uuid", "p_right" boolean); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_leitner_apply"("p_user_id" "uuid", "p_item_id" "uuid", "p_right" boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_leitner_apply"("p_user_id" "uuid", "p_item_id" "uuid", "p_right" boolean) TO "service_role";


--
-- Name: FUNCTION "exam_open_attempt"("p_set_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_open_attempt"("p_set_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_open_attempt"("p_set_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") TO "service_role";


--
-- Name: FUNCTION "exam_open_generated"("p_blueprint" "text", "p_user_id" "uuid", "p_device_hash" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_open_generated"("p_blueprint" "text", "p_user_id" "uuid", "p_device_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_open_generated"("p_blueprint" "text", "p_user_id" "uuid", "p_device_hash" "text") TO "service_role";


--
-- Name: FUNCTION "exam_pack_license"("p_code" "text", "p_device_hash" "text", "p_user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_pack_license"("p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_pack_license"("p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "exam_question_integrity"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."exam_question_integrity"() TO "anon";
GRANT ALL ON FUNCTION "public"."exam_question_integrity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."exam_question_integrity"() TO "service_role";


--
-- Name: FUNCTION "exam_set_published_at"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."exam_set_published_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."exam_set_published_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."exam_set_published_at"() TO "service_role";


--
-- Name: FUNCTION "exam_vn_day"("p_days" integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."exam_vn_day"("p_days" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."exam_vn_day"("p_days" integer) TO "service_role";


--
-- Name: FUNCTION "expire_stale_orders"(); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."expire_stale_orders"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."expire_stale_orders"() TO "service_role";


--
-- Name: FUNCTION "find_auth_user_by_email"("p_email" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."find_auth_user_by_email"("p_email" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."find_auth_user_by_email"("p_email" "text") TO "service_role";


--
-- Name: FUNCTION "find_published_locations_within_radius"("center_lat" double precision, "center_lng" double precision, "radius_m" double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."find_published_locations_within_radius"("center_lat" double precision, "center_lng" double precision, "radius_m" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."find_published_locations_within_radius"("center_lat" double precision, "center_lng" double precision, "radius_m" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_published_locations_within_radius"("center_lat" double precision, "center_lng" double precision, "radius_m" double precision) TO "service_role";


--
-- Name: FUNCTION "get_attempt_result"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."get_attempt_result"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_attempt_result"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text") TO "service_role";


--
-- Name: FUNCTION "get_exam_intro"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."get_exam_intro"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_exam_intro"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "get_exam_set"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."get_exam_set"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_exam_set"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "get_generated_intro"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."get_generated_intro"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_generated_intro"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text") TO "service_role";


--
-- Name: FUNCTION "get_notebook"("p_user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."get_notebook"("p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_notebook"("p_user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "mark_order_paid"("p_order_code" bigint, "p_amount" integer, "p_provider" "text", "p_provider_ref" "text", "p_license_code" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."mark_order_paid"("p_order_code" bigint, "p_amount" integer, "p_provider" "text", "p_provider_ref" "text", "p_license_code" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."mark_order_paid"("p_order_code" bigint, "p_amount" integer, "p_provider" "text", "p_provider_ref" "text", "p_license_code" "text") TO "service_role";


--
-- Name: FUNCTION "media_owner_status"("p_event" "uuid", "p_figure" "uuid", "p_location" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."media_owner_status"("p_event" "uuid", "p_figure" "uuid", "p_location" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."media_owner_status"("p_event" "uuid", "p_figure" "uuid", "p_location" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."media_owner_status"("p_event" "uuid", "p_figure" "uuid", "p_location" "uuid") TO "service_role";


--
-- Name: FUNCTION "order_integrity"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."order_integrity"() TO "anon";
GRANT ALL ON FUNCTION "public"."order_integrity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."order_integrity"() TO "service_role";


--
-- Name: FUNCTION "prevent_last_admin_lockout"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."prevent_last_admin_lockout"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_last_admin_lockout"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_last_admin_lockout"() TO "service_role";


--
-- Name: FUNCTION "quiz_question_integrity"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."quiz_question_integrity"() TO "anon";
GRANT ALL ON FUNCTION "public"."quiz_question_integrity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."quiz_question_integrity"() TO "service_role";


--
-- Name: FUNCTION "regrade_item"("p_item_id" "uuid", "p_actor" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."regrade_item"("p_item_id" "uuid", "p_actor" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."regrade_item"("p_item_id" "uuid", "p_actor" "uuid") TO "service_role";


--
-- Name: FUNCTION "report_exam_item"("p_user_id" "uuid", "p_device_hash" "text", "p_attempt_id" "uuid", "p_item_id" "uuid", "p_reason" "text", "p_note" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."report_exam_item"("p_user_id" "uuid", "p_device_hash" "text", "p_attempt_id" "uuid", "p_item_id" "uuid", "p_reason" "text", "p_note" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."report_exam_item"("p_user_id" "uuid", "p_device_hash" "text", "p_attempt_id" "uuid", "p_item_id" "uuid", "p_reason" "text", "p_note" "text") TO "service_role";


--
-- Name: FUNCTION "reviewer_may_only_change_status"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."reviewer_may_only_change_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."reviewer_may_only_change_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reviewer_may_only_change_status"() TO "service_role";


--
-- Name: FUNCTION "save_attempt_answers"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."save_attempt_answers"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."save_attempt_answers"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") TO "service_role";


--
-- Name: FUNCTION "set_updated_at"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


--
-- Name: FUNCTION "source_locked_for_editor"("p_source" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."source_locked_for_editor"("p_source" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."source_locked_for_editor"("p_source" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."source_locked_for_editor"("p_source" "uuid") TO "service_role";


--
-- Name: FUNCTION "start_exam_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid", "p_mode" "text"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."start_exam_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid", "p_mode" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."start_exam_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid", "p_mode" "text") TO "service_role";


--
-- Name: FUNCTION "start_generated_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text", "p_item_ids" "uuid"[], "p_sections" smallint[], "p_shifts" smallint[], "p_duration_min" integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."start_generated_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text", "p_item_ids" "uuid"[], "p_sections" smallint[], "p_shifts" smallint[], "p_duration_min" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."start_generated_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_blueprint" "text", "p_item_ids" "uuid"[], "p_sections" smallint[], "p_shifts" smallint[], "p_duration_min" integer) TO "service_role";


--
-- Name: FUNCTION "start_paper_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."start_paper_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."start_paper_attempt"("p_slug" "text", "p_code" "text", "p_device_hash" "text", "p_user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "start_practice_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_options" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."start_practice_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_options" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."start_practice_attempt"("p_user_id" "uuid", "p_code" "text", "p_device_hash" "text", "p_options" "jsonb") TO "service_role";


--
-- Name: FUNCTION "submit_exam_attempt"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."submit_exam_attempt"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."submit_exam_attempt"("p_attempt_id" "uuid", "p_user_id" "uuid", "p_device_hash" "text", "p_answers" "jsonb") TO "service_role";


--
-- Name: TABLE "curriculum_topics"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."curriculum_topics" TO "anon";
GRANT ALL ON TABLE "public"."curriculum_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."curriculum_topics" TO "service_role";


--
-- Name: TABLE "orders"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."orders" TO "service_role";
GRANT SELECT ON TABLE "public"."orders" TO "authenticated";


--
-- Name: TABLE "products"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."products" TO "service_role";
GRANT SELECT ON TABLE "public"."products" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."products" TO "authenticated";


--
-- Name: TABLE "donation_wall"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."donation_wall" TO "service_role";
GRANT SELECT ON TABLE "public"."donation_wall" TO "anon";
GRANT SELECT ON TABLE "public"."donation_wall" TO "authenticated";


--
-- Name: TABLE "event_figures"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."event_figures" TO "anon";
GRANT ALL ON TABLE "public"."event_figures" TO "authenticated";
GRANT ALL ON TABLE "public"."event_figures" TO "service_role";


--
-- Name: TABLE "event_locations"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."event_locations" TO "anon";
GRANT ALL ON TABLE "public"."event_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."event_locations" TO "service_role";


--
-- Name: TABLE "event_sources"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."event_sources" TO "anon";
GRANT ALL ON TABLE "public"."event_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."event_sources" TO "service_role";


--
-- Name: TABLE "event_topics"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."event_topics" TO "anon";
GRANT ALL ON TABLE "public"."event_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."event_topics" TO "service_role";


--
-- Name: TABLE "exam_item_reports"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_item_reports" TO "service_role";
GRANT SELECT ON TABLE "public"."exam_item_reports" TO "authenticated";


--
-- Name: COLUMN "exam_item_reports"."status"; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE("status") ON TABLE "public"."exam_item_reports" TO "authenticated";


--
-- Name: COLUMN "exam_item_reports"."admin_note"; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE("admin_note") ON TABLE "public"."exam_item_reports" TO "authenticated";


--
-- Name: COLUMN "exam_item_reports"."handled_by"; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE("handled_by") ON TABLE "public"."exam_item_reports" TO "authenticated";


--
-- Name: COLUMN "exam_item_reports"."handled_at"; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE("handled_at") ON TABLE "public"."exam_item_reports" TO "authenticated";


--
-- Name: TABLE "exam_passages"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_passages" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."exam_passages" TO "authenticated";


--
-- Name: TABLE "exam_questions"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_questions" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."exam_questions" TO "authenticated";


--
-- Name: TABLE "exam_regrade_log"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_regrade_log" TO "service_role";
GRANT SELECT ON TABLE "public"."exam_regrade_log" TO "authenticated";


--
-- Name: SEQUENCE "exam_regrade_log_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."exam_regrade_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exam_regrade_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exam_regrade_log_id_seq" TO "service_role";


--
-- Name: TABLE "exam_set_items"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_set_items" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."exam_set_items" TO "authenticated";


--
-- Name: TABLE "exam_sets"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."exam_sets" TO "service_role";
GRANT SELECT ON TABLE "public"."exam_sets" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."exam_sets" TO "authenticated";


--
-- Name: TABLE "historical_events"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."historical_events" TO "anon";
GRANT ALL ON TABLE "public"."historical_events" TO "authenticated";
GRANT ALL ON TABLE "public"."historical_events" TO "service_role";


--
-- Name: TABLE "historical_figures"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."historical_figures" TO "anon";
GRANT ALL ON TABLE "public"."historical_figures" TO "authenticated";
GRANT ALL ON TABLE "public"."historical_figures" TO "service_role";


--
-- Name: TABLE "historical_locations"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."historical_locations" TO "anon";
GRANT ALL ON TABLE "public"."historical_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."historical_locations" TO "service_role";


--
-- Name: TABLE "learner_item_state"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."learner_item_state" TO "service_role";
GRANT SELECT ON TABLE "public"."learner_item_state" TO "authenticated";


--
-- Name: TABLE "learner_profiles"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."learner_profiles" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."learner_profiles" TO "authenticated";


--
-- Name: TABLE "learner_progress"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."learner_progress" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."learner_progress" TO "authenticated";


--
-- Name: TABLE "license_activations"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."license_activations" TO "service_role";
GRANT SELECT ON TABLE "public"."license_activations" TO "authenticated";


--
-- Name: TABLE "licenses"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."licenses" TO "service_role";
GRANT SELECT ON TABLE "public"."licenses" TO "authenticated";


--
-- Name: TABLE "media_assets"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."media_assets" TO "anon";
GRANT ALL ON TABLE "public"."media_assets" TO "authenticated";
GRANT ALL ON TABLE "public"."media_assets" TO "service_role";


--
-- Name: SEQUENCE "order_code_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."order_code_seq" TO "service_role";


--
-- Name: TABLE "payment_events"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."payment_events" TO "service_role";
GRANT SELECT ON TABLE "public"."payment_events" TO "authenticated";


--
-- Name: SEQUENCE "payment_events_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."payment_events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_events_id_seq" TO "service_role";


--
-- Name: TABLE "quiz_questions"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."quiz_questions" TO "anon";
GRANT ALL ON TABLE "public"."quiz_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_questions" TO "service_role";


--
-- Name: TABLE "rate_limit_hits"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."rate_limit_hits" TO "service_role";


--
-- Name: SEQUENCE "rate_limit_hits_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."rate_limit_hits_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rate_limit_hits_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rate_limit_hits_id_seq" TO "service_role";


--
-- Name: TABLE "sgk_lesson_events"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."sgk_lesson_events" TO "anon";
GRANT ALL ON TABLE "public"."sgk_lesson_events" TO "authenticated";
GRANT ALL ON TABLE "public"."sgk_lesson_events" TO "service_role";


--
-- Name: TABLE "sources"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."sources" TO "anon";
GRANT ALL ON TABLE "public"."sources" TO "authenticated";
GRANT ALL ON TABLE "public"."sources" TO "service_role";


--
-- Name: TABLE "staff_profiles"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."staff_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."staff_profiles" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- PostgreSQL database dump complete
--

-- \unrestrict 9CumgRBHUCE4aLQTMe9zAESIIi5dxUKKdPV7Cy1yJGcRw28cYvCueteobTeEKxB

