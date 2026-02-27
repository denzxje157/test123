  -- 1. Enable UUID extension
  create extension if not exists "uuid-ossp";

  -- 2. Create PROFILES table (Linked to auth.users)
  create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    full_name text,
    avatar_url text,
    role text default 'user', -- 'admin' or 'user'
    updated_at timestamp with time zone,
    
    constraint username_length check (char_length(full_name) >= 3)
  );

  -- Set up Row Level Security (RLS) for profiles
  alter table public.profiles enable row level security;

  create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

  create policy "Users can insert their own profile."
    on profiles for insert
    with check ( auth.uid() = id );

  create policy "Users can update own profile."
    on profiles for update
    using ( auth.uid() = id );

  -- Trigger to create profile on signup
  create or replace function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public.profiles (id, full_name, avatar_url, role)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', coalesce(new.raw_user_meta_data->>'role', 'user'));
    return new;
  end;
  $$ language plpgsql security definer;

  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


  -- 3. Create PRODUCTS table
  create table public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    ethnic text not null,
    price numeric not null,
    price_display text,
    description text,
    image text,
    category text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- RLS for products
  alter table public.products enable row level security;

  create policy "Products are viewable by everyone."
    on products for select
    using ( true );

  create policy "Admins can insert products."
    on products for insert
    with check ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

  create policy "Admins can update products."
    on products for update
    using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

  create policy "Admins can delete products."
    on products for delete
    using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );


  -- 4. Create ORDERS table
  create table public.orders (
    id uuid default uuid_generate_v4() primary key,
    order_id text not null, -- Mã đơn hàng hiển thị (VD: DH-123456)
    user_id uuid references auth.users, -- Có thể null nếu mua không cần đăng nhập (tùy logic)
    customer_info jsonb not null, -- { name, phone, address, note }
    payment_method text not null,
    total numeric not null,
    items jsonb not null, -- Danh sách sản phẩm trong giỏ
    status text default 'pending', -- pending, processing, shipping, completed, cancelled
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- RLS for orders
  alter table public.orders enable row level security;

  create policy "Users can view their own orders."
    on orders for select
    using ( auth.uid() = user_id );

  create policy "Admins can view all orders."
    on orders for select
    using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

  create policy "Users can insert their own orders."
    on orders for insert
    with check ( auth.uid() = user_id );
    
  -- Allow anonymous inserts if guest checkout is supported (optional, careful with spam)
  -- create policy "Anyone can create order" on orders for insert with check (true);


  -- 5. Create LIBRARY table
  create table public.library (
    id uuid default uuid_generate_v4() primary key,
    category text not null, -- architecture, ritual, festival
    ethnic text not null,
    title text not null,
    desc_text text, -- 'desc' is a reserved keyword in SQL, using 'desc_text' or just 'description'
    content text,
    image text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- RLS for library
  alter table public.library enable row level security;

  create policy "Library items are viewable by everyone."
    on library for select
    using ( true );

  create policy "Admins can manage library."
    on library for all
    using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );
