-- Force delete specific user and all associations
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user ID in auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = '2748779648@qq.com';
  
  IF target_user_id IS NOT NULL THEN
    -- 1. Delete from public tables (Cascading usually handles this, but being explicit for "Physical Delete" requirement)
    DELETE FROM public.user_progress WHERE user_id = target_user_id;
    DELETE FROM public.user_achievements WHERE user_id = target_user_id;
    DELETE FROM public.profiles WHERE id = target_user_id;
    
    -- 2. Delete from auth schema (Requires service_role/superuser, migration runner usually has this)
    DELETE FROM auth.identities WHERE user_id = target_user_id;
    DELETE FROM auth.sessions WHERE user_id = target_user_id;
    DELETE FROM auth.users WHERE id = target_user_id;
    
    RAISE NOTICE 'User % deleted successfully', target_user_id;
  ELSE
    RAISE NOTICE 'User 2748779648@qq.com not found';
  END IF;
END $$;
