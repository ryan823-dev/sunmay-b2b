-- Sunmay B2B Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image TEXT,
  "order" INTEGER DEFAULT 0
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  gender VARCHAR(20) DEFAULT 'unisex' CHECK (gender IN ('men', 'women', 'kids', 'unisex')),
  featured BOOLEAN DEFAULT FALSE,
  moq INTEGER DEFAULT 200,
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  sizes TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived'))
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  country VARCHAR(100),
  address JSONB DEFAULT '{}'
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(12,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(20) CHECK (payment_method IN ('paypal', 'stripe', 'tt', 'bank')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  shipping_address JSONB NOT NULL DEFAULT '{}',
  notes TEXT
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100) NOT NULL,
  products JSONB DEFAULT '[]',
  quantity VARCHAR(100),
  message TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  files TEXT[] DEFAULT '{}'
);

-- Cart Sessions (for guest carts)
CREATE TABLE IF NOT EXISTS cart_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- Insert default categories
INSERT INTO categories (name, slug, description, "order") VALUES
  ('Ski & Snowboard', 'ski-snowboard', 'Ski jackets, snowboard pants, and winter sports apparel', 1),
  ('Hunting & Outdoor', 'hunting-outdoor', 'Hunting jackets, camouflage gear, and outdoor apparel', 2),
  ('Tactical & Workwear', 'tactical-workwear', 'Tactical jackets, workwear, and utility apparel', 3),
  ('Down & Insulated', 'down-insulated', 'Down jackets, padded jackets, and insulated wear', 4),
  ('Pants & Bibs', 'pants-bibs', 'Snow pants, bib overalls, and outdoor pants', 5),
  ('Accessories', 'accessories', 'Gaiters, hoods, and other accessories', 6)
ON CONFLICT (slug) DO NOTHING;

-- Create a function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
  new_number VARCHAR;
BEGIN
  new_number := 'SM' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(nextval('order_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_session_updated_at
  BEFORE UPDATE ON cart_session
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_session ENABLE ROW LEVEL SECURITY;

-- Public read access for products and categories
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (TRUE);

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role has full access on products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access on orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access on inquiries" ON inquiries
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Customers can read their own orders
CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (customer_id = auth.uid());

-- Allow anonymous inquiry submissions
CREATE POLICY "Anyone can insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (TRUE);
