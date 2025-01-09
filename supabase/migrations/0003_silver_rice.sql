/*
  # Add handwritten testimonials table
  
  1. New Tables
    - handwritten_testimonials
      - id (text, primary key) 
      - user_id (uuid, references users)
      - content (text)
      - author_name (text)
      - product_info (text)
      - tone (text)
      - font (text)
      - background_style (text)
      - background_color (text)
      - text_color (text) 
      - text_size (integer)
      - line_height (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create handwritten testimonials table
create table if not exists public.handwritten_testimonials (
    id text primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now(),
    user_id uuid references public.users(id) on delete cascade,
    content text not null,
    author_name text not null,
    product_info text not null,
    tone text not null check (tone in ('enthusiastic', 'professional', 'casual', 'grateful')),
    font text not null,
    background_style text not null check (background_style in ('classic', 'notepad', 'journal', 'custom')),
    background_color text not null,
    text_color text not null,
    text_size integer not null,
    line_height numeric not null
);

-- Enable RLS
alter table public.handwritten_testimonials enable row level security;

-- Create RLS policies
create policy "Users can view their own handwritten testimonials"
    on public.handwritten_testimonials for select
    using (user_id = auth.uid());

create policy "Users can insert their own handwritten testimonials"
    on public.handwritten_testimonials for insert
    with check (user_id = auth.uid());

create policy "Users can update their own handwritten testimonials"
    on public.handwritten_testimonials for update
    using (user_id = auth.uid());

create policy "Users can delete their own handwritten testimonials"
    on public.handwritten_testimonials for delete
    using (user_id = auth.uid());

-- Create indexes
create index handwritten_testimonials_user_id_idx on public.handwritten_testimonials(user_id);
create index handwritten_testimonials_created_at_idx on public.handwritten_testimonials(created_at desc);