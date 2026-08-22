const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'ecommerceDB';

const products = [
  // ========== ELECTRONICS ==========
  { name: 'iPhone 15 Pro Max', price: 159900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', description: 'Apple iPhone 15 Pro Max, 256GB, A17 Pro chip, Titanium', avgRating: 4.8, reviewCount: 1243 },
  { name: 'Samsung Galaxy S24 Ultra', price: 134999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop', description: 'Samsung Galaxy S24 Ultra with AI features, 256GB', avgRating: 4.6, reviewCount: 892 },
  { name: 'OnePlus 12', price: 64999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop', description: 'OnePlus 12 5G, Snapdragon 8 Gen 3, 16GB RAM', avgRating: 4.5, reviewCount: 567 },
  { name: 'Sony WH-1000XM5', price: 29990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop', description: 'Premium noise cancelling wireless headphones', avgRating: 4.7, reviewCount: 2341 },
  { name: 'MacBook Air M3', price: 114900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', description: 'Apple MacBook Air 15" with M3 chip, 16GB RAM', avgRating: 4.8, reviewCount: 756 },
  { name: 'HP Victus Gaming Laptop', price: 62990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1603302576839-3773cc2ac716?w=400&h=400&fit=crop', description: 'HP Victus 15, RTX 4050, 16GB RAM, 512GB SSD', avgRating: 4.3, reviewCount: 345 },
  { name: 'iPad Air M2', price: 59900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', description: 'Apple iPad Air M2, 11-inch, 128GB', avgRating: 4.7, reviewCount: 534 },
  { name: 'Sony PS5 Console', price: 54990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', description: 'Sony PlayStation 5 Disc Edition', avgRating: 4.9, reviewCount: 3456 },
  { name: 'Samsung 55" 4K Smart TV', price: 44990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', description: 'Samsung 55 inch Crystal 4K UHD Smart TV', avgRating: 4.4, reviewCount: 678 },
  { name: 'JBL Flip 6 Speaker', price: 11999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', description: 'JBL Flip 6 Portable Bluetooth Speaker, IP67', avgRating: 4.5, reviewCount: 1234 },
  { name: 'Canon EOS R50', price: 82995, category: 'Electronics', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', description: 'Mirrorless camera with 4K video, 24.2MP', avgRating: 4.6, reviewCount: 234 },
  { name: 'Kindle Paperwhite', price: 14999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop', description: 'Waterproof e-reader with warm light, 6.8"', avgRating: 4.6, reviewCount: 890 },
  { name: 'Apple Watch Series 9', price: 44900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop', description: 'Apple Watch Series 9, GPS, 45mm', avgRating: 4.7, reviewCount: 567 },
  { name: 'Boat Airdopes 141', price: 1299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop', description: 'boAt Airdopes 141 TWS Earbuds, 42H Playback', avgRating: 4.2, reviewCount: 5678 },
  { name: 'Realme Narzo 70 Turbo', price: 15999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', description: 'Realme Narzo 70 Turbo 5G, Dimensity 7300', avgRating: 4.3, reviewCount: 456 },

  // ========== WOMEN FASHION - DRESSES ==========
  { name: 'Women Floral Maxi Dress', price: 1299, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop', description: 'Beautiful floral print maxi dress, comfortable fabric', avgRating: 4.4, reviewCount: 234 },
  { name: 'Women A-Line Kurti Set', price: 899, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop', description: 'A-Line kurti with palazzo set, cotton blend', avgRating: 4.3, reviewCount: 567 },
  { name: 'Women Silk Saree - Banarasi', price: 2499, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1610258916323-40b7e8d0f0e9?w=400&h=400&fit=crop', description: 'Pure Banarasi silk saree with golden border', avgRating: 4.6, reviewCount: 345 },
  { name: 'Women Bodycon Midi Dress', price: 999, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', description: 'Solid color bodycon midi dress, stretchable', avgRating: 4.2, reviewCount: 123 },
  { name: 'Women Anarkali Suit', price: 1799, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', description: 'Designer Anarkali suit with dupatta, rayon', avgRating: 4.5, reviewCount: 456 },
  { name: 'Women Palazzo Pants Set', price: 799, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aff0?w=400&h=400&fit=crop', description: 'Top with palazzo pants co-ord set, linen look', avgRating: 4.1, reviewCount: 234 },
  { name: 'Women Lehenga Choli', price: 3499, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aff0?w=400&h=400&fit=crop&q=80', description: 'Semi-stitched lehenga choli with heavy work', avgRating: 4.7, reviewCount: 189 },
  { name: 'Women Party Wear Gown', price: 1999, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop', description: 'Floor length party wear gown with sequin work', avgRating: 4.4, reviewCount: 267 },
  { name: 'Women Denim Jacket', price: 1499, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', description: 'Classic blue denim jacket for women, slim fit', avgRating: 4.3, reviewCount: 345 },
  { name: 'Women Crop Top & Skirt Set', price: 699, category: 'Women Fashion', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop', description: 'Trendy crop top with flared skirt set', avgRating: 4.0, reviewCount: 178 },

  // ========== MEN FASHION ==========
  { name: "Levi's 501 Original Jeans", price: 3999, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', description: "Classic straight fit jeans, 100% cotton", avgRating: 4.5, reviewCount: 1234 },
  { name: 'Polo Ralph Lauren Shirt', price: 5499, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', description: 'Premium cotton polo shirt, classic fit', avgRating: 4.4, reviewCount: 567 },
  { name: 'Men Formal Blazer', price: 3299, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&q=80', description: 'Slim fit formal blazer, premium polyester', avgRating: 4.3, reviewCount: 234 },
  { name: 'Allen Solly Men Chinos', price: 1799, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop', description: 'Regular fit cotton chinos, stretchable', avgRating: 4.2, reviewCount: 678 },
  { name: 'Men Linen Kurta Pajama', price: 1299, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&q=90', description: 'Pure cotton kurta pajama set, festive wear', avgRating: 4.4, reviewCount: 456 },
  { name: 'Men Oxford Formal Shoes', price: 2499, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop', description: 'Premium leather oxford shoes, lace-up', avgRating: 4.1, reviewCount: 345 },
  { name: 'Men Puffer Jacket', price: 2199, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1544923246-77307dd270b3?w=400&h=400&fit=crop', description: 'Winter puffer jacket, water resistant', avgRating: 4.5, reviewCount: 567 },
  { name: 'Men Track Suit', price: 999, category: 'Men Fashion', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&q=80', description: 'Sports track suit set, full zip jacket', avgRating: 4.2, reviewCount: 345 },

  // ========== FOOTWEAR ==========
  { name: 'Nike Air Max 270', price: 12995, category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', description: 'Classic Nike Air Max sneakers, lightweight', avgRating: 4.6, reviewCount: 890 },
  { name: 'Adidas Ultraboost', price: 16999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop', description: 'Running shoes with Boost cushioning', avgRating: 4.7, reviewCount: 678 },
  { name: 'Puma Running Shoes', price: 4999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop', description: 'Puma Sofride Enzo Evo Running Shoes', avgRating: 4.3, reviewCount: 456 },
  { name: 'Crocs Classic Clog', price: 3495, category: 'Footwear', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop', description: 'Unisex Classic Clog, lightweight comfort', avgRating: 4.4, reviewCount: 1234 },
  { name: 'Woodland Men Boots', price: 3299, category: 'Footwear', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&h=400&fit=crop', description: 'Leather ankle boots, rugged outdoor', avgRating: 4.5, reviewCount: 567 },
  { name: 'Bata Women Heels', price: 1499, category: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop', description: 'Block heel sandals, comfortable party wear', avgRating: 4.1, reviewCount: 345 },
  { name: 'Nike Jordan Sneakers', price: 14995, category: 'Footwear', image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&h=400&fit=crop', description: 'Air Jordan 1 Mid sneakers, iconic style', avgRating: 4.8, reviewCount: 2345 },
  { name: 'Sparx Sports Shoes', price: 1299, category: 'Footwear', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', description: 'Lightweight running shoes for men', avgRating: 4.2, reviewCount: 3456 },

  // ========== BEAUTY & PERSONAL CARE ==========
  { name: 'Lakme Absolute Foundation', price: 825, category: 'Beauty', image: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=400&h=400&fit=crop', description: 'Lakme Absolute Skin Dew Serum Foundation', avgRating: 4.3, reviewCount: 567 },
  { name: 'Maybelline Lipstick Set', price: 699, category: 'Beauty', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', description: 'Superstay Matte Ink liquid lipstick, 6 pack', avgRating: 4.5, reviewCount: 890 },
  { name: 'Forest Essentials Gift Set', price: 2999, category: 'Beauty', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', description: 'Luxury skincare gift set, Ayurvedic', avgRating: 4.7, reviewCount: 234 },
  { name: 'Mamaearth Vitamin C Serum', price: 499, category: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', description: 'Vitamin C face serum with turmeric', avgRating: 4.2, reviewCount: 2345 },
  { name: 'MAC Matte Lipstick', price: 1950, category: 'Beauty', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&q=80', description: 'MAC Retro Matte Lipstick, long lasting', avgRating: 4.8, reviewCount: 1234 },
  { name: 'Neutrogena Sunscreen SPF50', price: 599, category: 'Beauty', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', description: 'Ultra sheer dry touch sunscreen SPF 50+', avgRating: 4.4, reviewCount: 1567 },
  { name: 'Olay Night Cream', price: 899, category: 'Beauty', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4c4e9b4?w=400&h=400&fit=crop', description: 'Olay Regenerist retinol 24 night cream', avgRating: 4.3, reviewCount: 678 },
  { name: 'The Man Company Beard Kit', price: 1199, category: 'Beauty', image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&h=400&fit=crop', description: 'Complete beard care kit - oil, wash, balm', avgRating: 4.5, reviewCount: 456 },

  // ========== HOME & KITCHEN ==========
  { name: 'Dyson V15 Vacuum', price: 58900, category: 'Home', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', description: 'Cordless stick vacuum, laser detect', avgRating: 4.7, reviewCount: 345 },
  { name: 'Instant Pot Duo 7-in-1', price: 8999, category: 'Home', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop', description: 'Multi-use programmable pressure cooker', avgRating: 4.5, reviewCount: 1234 },
  { name: 'Prestige Induction Cooktop', price: 2499, category: 'Home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', description: '1900W induction cooktop with timer', avgRating: 4.3, reviewCount: 2345 },
  { name: 'Philips Air Fryer XXL', price: 14995, category: 'Home', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=400&fit=crop', description: 'Premium air fryer with rapid air technology', avgRating: 4.6, reviewCount: 678 },
  { name: 'IKEA Bookshelf 5-Tier', price: 4999, category: 'Home', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=400&fit=crop', description: 'Modern 5-tier bookshelf, solid wood', avgRating: 4.4, reviewCount: 345 },
  { name: 'Prestige Pressure Cooker 5L', price: 2199, category: 'Home', image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=400&fit=crop', description: 'Alpha stainless steel pressure cooker', avgRating: 4.5, reviewCount: 3456 },
  { name: 'Kent RO Water Purifier', price: 17999, category: 'Home', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop', description: 'Kent Supreme Plus RO water purifier 8L', avgRating: 4.4, reviewCount: 567 },
  { name: 'Milton Thermosteel Bottle', price: 799, category: 'Home', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', description: 'Thermosteel bottle 1L, 24hr hot/cold', avgRating: 4.3, reviewCount: 4567 },
  { name: 'Butterfly Mixer Grinder', price: 3499, category: 'Home', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop', description: '3 jar mixer grinder, 750W motor', avgRating: 4.2, reviewCount: 890 },
  { name: 'Wakefit Memory Foam Mattress', price: 8999, category: 'Home', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop', description: 'Queen size memory foam mattress, 6 inch', avgRating: 4.6, reviewCount: 2345 },
  { name: 'Solimo Bedsheet Set', price: 499, category: 'Home', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', description: 'Double bedsheet with 2 pillow covers, cotton', avgRating: 4.1, reviewCount: 5678 },
  { name: 'Havells Ceiling Fan', price: 1899, category: 'Home', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', description: 'Energy saving ceiling fan, 1200mm', avgRating: 4.3, reviewCount: 3456 },

  // ========== SPORTS & FITNESS ==========
  { name: 'Yoga Mat Premium 6mm', price: 799, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', description: 'Extra thick yoga mat with carrying strap', avgRating: 4.4, reviewCount: 1234 },
  { name: 'Boldfit Dumbbell Set', price: 1999, category: 'Sports', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', description: 'Vinyl coated dumbbell set, pair 5kg each', avgRating: 4.3, reviewCount: 567 },
  { name: 'Nivia Football Size 5', price: 699, category: 'Sports', image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400&h=400&fit=crop', description: 'FIFA approved football, machine stitched', avgRating: 4.5, reviewCount: 2345 },
  { name: 'Yonex Badminton Racket', price: 2499, category: 'Sports', image: 'https://images.unsplash.com/photo-1626224583712-a47d34f4049b?w=400&h=400&fit=crop', description: 'Yonex Nanoray Light 18i badminton racket', avgRating: 4.6, reviewCount: 345 },
  { name: 'HRX Fitness Tracker', price: 1999, category: 'Sports', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop', description: 'HRX fitness band with heart rate monitor', avgRating: 4.1, reviewCount: 678 },
  { name: 'SG Cricket Bat', price: 1599, category: 'Sports', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop', description: 'SG Optimus Kashmir willow cricket bat', avgRating: 4.4, reviewCount: 456 },
  { name: 'Kookaburra Hockey Stick', price: 999, category: 'Sports', image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=400&fit=crop', description: 'Kookaburra Beast Hockey stick, fiberglass', avgRating: 4.2, reviewCount: 234 },
  { name: 'Resistance Bands Set', price: 599, category: 'Sports', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop', description: '5 level resistance loop bands set', avgRating: 4.3, reviewCount: 890 },

  // ========== BABY & KIDS ==========
  { name: 'Baby Cotton Romper Set', price: 499, category: 'Kids', image: 'https://images.unsplash.com/photo-1522771930-78fce4b48e89?w=400&h=400&fit=crop', description: 'Pack of 3 cotton romper suits, 0-6 months', avgRating: 4.5, reviewCount: 567 },
  { name: 'Kids LED School Backpack', price: 899, category: 'Kids', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop', description: 'LED light up school backpack, waterproof', avgRating: 4.4, reviewCount: 345 },
  { name: 'LEGO Classic Building Set', price: 2499, category: 'Kids', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop', description: 'LEGO Classic 10696 medium creative box', avgRating: 4.8, reviewCount: 1234 },
  { name: 'Hot Wheels Track Set', price: 1299, category: 'Kids', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop', description: 'Hot Wheels ultimate turbo track set', avgRating: 4.6, reviewCount: 678 },
  { name: 'Kids Denim Overalls', price: 599, category: 'Kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop', description: 'Cute denim overalls for toddlers, 2-5 years', avgRating: 4.2, reviewCount: 234 },
  { name: 'Barbie Dreamhouse Doll', price: 3499, category: 'Kids', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop', description: 'Barbie doll with accessories, fashion set', avgRating: 4.7, reviewCount: 456 },
  { name: 'Baby Stroller Lightweight', price: 4999, category: 'Kids', image: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&h=400&fit=crop', description: 'Foldable lightweight baby stroller', avgRating: 4.3, reviewCount: 345 },
  { name: 'Kids Cotton Dress Set', price: 799, category: 'Kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop&q=80', description: 'Printed cotton frock set with hairband', avgRating: 4.4, reviewCount: 123 },

  // ========== ACCESSORIES ==========
  { name: 'Ray-Ban Aviator Sunglasses', price: 8990, category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop', description: 'Classic aviator sunglasses, UV protection', avgRating: 4.7, reviewCount: 567 },
  { name: 'Fossil Analog Watch', price: 7995, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', description: 'Men analog watch, stainless steel', avgRating: 4.5, reviewCount: 345 },
  { name: 'Wildcraft Backpack 46L', price: 2999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', description: 'Trekking backpack 46L, waterproof', avgRating: 4.6, reviewCount: 678 },
  { name: 'Casio Digital Watch', price: 3495, category: 'Accessories', image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop&q=80', description: 'Casio Vintage digital watch, unisex', avgRating: 4.4, reviewCount: 890 },
  { name: 'Skinn By Titan Perfume', price: 1295, category: 'Accessories', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', description: 'Skinn Verbe by Titan, 100ml EDP', avgRating: 4.3, reviewCount: 456 },
  { name: 'Hidesign Leather Wallet', price: 1895, category: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop', description: 'Genuine leather bi-fold wallet for men', avgRating: 4.5, reviewCount: 345 },
  { name: 'Fastrack Bagpack', price: 1495, category: 'Accessories', image: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&h=400&fit=crop', description: 'College bagpack, multiple compartments', avgRating: 4.2, reviewCount: 567 },
  { name: 'Noise Fitness Band Pro', price: 2999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop', description: 'ColorFit Pro 4 Max, 1.8" display', avgRating: 4.3, reviewCount: 1234 },

  // ========== BOOKS ==========
  { name: 'Atomic Habits - James Clear', price: 399, category: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', description: 'An Easy & Proven Way to Build Good Habits', avgRating: 4.8, reviewCount: 5678 },
  { name: 'Rich Dad Poor Dad', price: 299, category: 'Books', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop', description: 'Robert Kiyosaki, Financial literacy classic', avgRating: 4.7, reviewCount: 3456 },
  { name: 'The Psychology of Money', price: 349, category: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', description: 'Morgan Housel, Lessons on wealth', avgRating: 4.6, reviewCount: 2345 },
  { name: 'Ikigai - Japanese Secret', price: 250, category: 'Books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', description: 'The Japanese Secret to a Long & Happy Life', avgRating: 4.5, reviewCount: 4567 },
  { name: 'Sapiens - Yuval Noah Harari', price: 499, category: 'Books', image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=400&fit=crop', description: 'A Brief History of Humankind', avgRating: 4.7, reviewCount: 1234 },
  { name: 'Think and Grow Rich', price: 199, category: 'Books', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=400&fit=crop', description: 'Napoleon Hill, Classic success book', avgRating: 4.4, reviewCount: 2345 },

  // ========== GROCERY ==========
  { name: 'Organic Almonds 500g', price: 599, category: 'Grocery', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=400&fit=crop', description: 'Premium California almonds, raw & organic', avgRating: 4.5, reviewCount: 3456 },
  { name: 'Tata Sampann Turmeric Powder', price: 149, category: 'Grocery', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop', description: 'Turmeric powder 500g, pure & fresh', avgRating: 4.3, reviewCount: 5678 },
  { name: 'Nescafe Classic Coffee', price: 425, category: 'Grocery', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop', description: 'Nescafe Classic 200g instant coffee', avgRating: 4.4, reviewCount: 4567 },
  { name: 'Quaker Oats 1kg', price: 199, category: 'Grocery', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=400&fit=crop', description: 'Quaker whole oats, heart healthy', avgRating: 4.3, reviewCount: 2345 },
  { name: 'Licious Chicken Breast', price: 349, category: 'Grocery', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop', description: 'Fresh boneless chicken breast 500g', avgRating: 4.5, reviewCount: 1234 },
  { name: 'Amul Butter 500g', price: 265, category: 'Grocery', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb1358982?w=400&h=400&fit=crop', description: 'Amul pasteurised butter, fresh', avgRating: 4.6, reviewCount: 6789 },
  { name: 'Basmati Rice 5kg', price: 649, category: 'Grocery', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', description: 'India Gate Basmati Rice, premium quality', avgRating: 4.4, reviewCount: 3456 },
  { name: 'Red Label Tea 1kg', price: 399, category: 'Grocery', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop', description: 'Brooke Bond Red Label natural care tea', avgRating: 4.3, reviewCount: 5678 }
];

const coupons = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 500, maxDiscount: 2000, active: true, expiry: '2026-12-31' },
  { code: 'SAVE500', type: 'flat', value: 500, minOrder: 3000, maxDiscount: 500, active: true, expiry: '2026-12-31' },
  { code: 'MEGA20', type: 'percentage', value: 20, minOrder: 10000, maxDiscount: 5000, active: true, expiry: '2026-12-31' },
  { code: 'FLAT1000', type: 'flat', value: 1000, minOrder: 15000, maxDiscount: 1000, active: true, expiry: '2026-12-31' },
  { code: 'FREESHIP', type: 'flat', value: 99, minOrder: 499, maxDiscount: 99, active: true, expiry: '2026-12-31' },
  { code: 'BEAUTY25', type: 'percentage', value: 25, minOrder: 500, maxDiscount: 1000, active: true, expiry: '2026-12-31' },
  { code: 'NEWUSER', type: 'percentage', value: 15, minOrder: 300, maxDiscount: 3000, active: true, expiry: '2026-12-31' },
  { code: 'FESTIVE500', type: 'flat', value: 500, minOrder: 2000, maxDiscount: 500, active: true, expiry: '2026-12-31' }
];

const sampleOrders = [
  { userId: 'seed_user1', items: [{ productId: 'x', name: 'iPhone 15 Pro Max', price: 159900, quantity: 1 }], totalAmount: 159900, finalAmount: 147910, discount: 11990, couponCode: 'MEGA20', address: 'Andheri West, Mumbai', phone: '9876543210', status: 'delivered', createdAt: new Date('2025-01-15') },
  { userId: 'seed_user1', items: [{ productId: 'x', name: 'Women Floral Maxi Dress', price: 1299, quantity: 2 }, { productId: 'x', name: 'Maybelline Lipstick Set', price: 699, quantity: 1 }], totalAmount: 3297, finalAmount: 2797, discount: 500, couponCode: 'SAVE500', address: 'Andheri West, Mumbai', phone: '9876543210', status: 'delivered', createdAt: new Date('2025-02-10') },
  { userId: 'seed_user2', items: [{ productId: 'x', name: 'Samsung Galaxy S24 Ultra', price: 134999, quantity: 1 }], totalAmount: 134999, finalAmount: 134999, address: 'Connaught Place, Delhi', phone: '9123456780', status: 'delivered', createdAt: new Date('2025-03-05') },
  { userId: 'seed_user2', items: [{ productId: 'x', name: 'Nike Air Max 270', price: 12995, quantity: 2 }, { productId: 'x', name: 'Ray-Ban Aviator Sunglasses', price: 8990, quantity: 1 }], totalAmount: 34980, finalAmount: 34980, address: 'Connaught Place, Delhi', phone: '9123456780', status: 'delivered', createdAt: new Date('2025-03-20') },
  { userId: 'seed_user3', items: [{ productId: 'x', name: 'MacBook Air M3', price: 114900, quantity: 1 }, { productId: 'x', name: 'Apple Watch Series 9', price: 44900, quantity: 1 }], totalAmount: 159800, finalAmount: 149800, discount: 10000, couponCode: 'MEGA20', address: 'Koramangala, Bangalore', phone: '9988776655', status: 'delivered', createdAt: new Date('2025-04-01') },
  { userId: 'seed_user3', items: [{ productId: 'x', name: 'Philips Air Fryer XXL', price: 14995, quantity: 1 }, { productId: 'x', name: 'Wakefit Memory Foam Mattress', price: 8999, quantity: 1 }], totalAmount: 23994, finalAmount: 23994, address: 'Koramangala, Bangalore', phone: '9988776655', status: 'delivered', createdAt: new Date('2025-04-15') },
  { userId: 'seed_user1', items: [{ productId: 'x', name: "Levi's 501 Original Jeans", price: 3999, quantity: 2 }, { productId: 'x', name: 'Polo Ralph Lauren Shirt', price: 5499, quantity: 1 }], totalAmount: 13497, finalAmount: 12997, discount: 500, couponCode: 'FESTIVE500', address: 'Andheri West, Mumbai', phone: '9876543210', status: 'delivered', createdAt: new Date('2025-05-10') },
  { userId: 'seed_user4', items: [{ productId: 'x', name: 'Sony PS5 Console', price: 54990, quantity: 1 }, { productId: 'x', name: 'JBL Flip 6 Speaker', price: 11999, quantity: 1 }], totalAmount: 66989, finalAmount: 66989, address: 'T. Nagar, Chennai', phone: '9001234567', status: 'delivered', createdAt: new Date('2025-05-25') },
  { userId: 'seed_user4', items: [{ productId: 'x', name: 'Atomic Habits', price: 399, quantity: 3 }, { productId: 'x', name: 'Rich Dad Poor Dad', price: 299, quantity: 2 }], totalAmount: 1795, finalAmount: 1295, discount: 500, couponCode: 'SAVE500', address: 'T. Nagar, Chennai', phone: '9001234567', status: 'delivered', createdAt: new Date('2025-06-01') },
  { userId: 'seed_user5', items: [{ productId: 'x', name: 'Adidas Ultraboost', price: 16999, quantity: 1 }, { productId: 'x', name: 'Fossil Analog Watch', price: 7995, quantity: 1 }, { productId: 'x', name: 'Wildcraft Backpack 46L', price: 2999, quantity: 1 }], totalAmount: 27993, finalAmount: 25993, discount: 2000, couponCode: 'MEGA20', address: 'Kothrud, Pune', phone: '9765432109', status: 'delivered', createdAt: new Date('2025-06-15') }
];

async function seed() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);

  await db.collection('products').deleteMany({});
  await db.collection('orders').deleteMany({});
  await db.collection('carts').deleteMany({});
  await db.collection('reviews').deleteMany({});
  await db.collection('wishlists').deleteMany({});
  await db.collection('coupons').deleteMany({});

  await db.collection('products').insertMany(products);
  await db.collection('coupons').insertMany(coupons);
  await db.collection('orders').insertMany(sampleOrders);

  console.log(`Seeded: ${products.length} products, ${coupons.length} coupons, ${sampleOrders.length} orders`);
  await client.close();
}

seed();
