-- Add comment count helpers for posts
create or replace function public.increment_comment_count(p_post_id integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_post_id is null then
    return;
  end if;

  update public.posts
  set comment_count = coalesce(comment_count, 0) + 1
  where id = p_post_id;
end;
$$;

create or replace function public.decrement_comment_count(p_post_id integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_post_id is null then
    return;
  end if;

  update public.posts
  set comment_count = greatest(coalesce(comment_count, 0) - 1, 0)
  where id = p_post_id;
end;
$$;

grant execute on function public.increment_comment_count(integer) to anon, authenticated;
grant execute on function public.decrement_comment_count(integer) to anon, authenticated;
