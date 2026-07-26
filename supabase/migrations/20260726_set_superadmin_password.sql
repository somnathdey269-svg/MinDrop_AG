-- Migration: Reset password specifically for superadmin user somnathdey269@gmail.com
UPDATE auth.users
SET encrypted_password = crypt('Deevarsh@190521', gen_salt('bf'))
WHERE email = 'somnathdey269@gmail.com';
