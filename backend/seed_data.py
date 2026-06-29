import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            return json.loads(res_data) if res_data else None
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        print(f"HTTP Error {e.code} for {method} {path}: {err_msg}")
        raise e

def seed():
    print("Starting database seeding...")
    
    # 1. Register first user (should automatically be admin)
    print("\n1. Registering Admin user...")
    admin_info = make_request("/auth/register", "POST", {
        "name": "Admin User",
        "email": "admin@example.com",
        "password": "password123"
    })
    print(f"Admin registered. is_admin status: {admin_info.get('is_admin')}")
    
    # 2. Login Admin
    print("\n2. Logging in Admin...")
    admin_token_res = make_request("/auth/login", "POST", {
        "email": "admin@example.com",
        "password": "password123"
    })
    admin_token = admin_token_res.get("access_token")
    print("Admin logged in successfully.")
    
    # 3. Create products
    print("\n3. Creating products as Admin...")
    product1 = make_request("/products", "POST", {
        "title": "EliteBook Gaming Laptop",
        "description": "High performance gaming laptop featuring an RTX 4070 graphics card, 32GB DDR5 RAM, and a superfast 1TB NVMe SSD. Perfect for developers, gamers, and creators.",
        "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500"
      }, token=admin_token)
    print(f"Created Product: {product1.get('title')} (ID: {product1.get('id')})")
    
    product2 = make_request("/products", "POST", {
        "title": "AcousticNoise Wireless Headphones",
        "description": "Over-ear wireless headphones with industry-leading hybrid active noise cancellation, high-fidelity sound quality, and up to 40 hours of continuous battery life.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
      }, token=admin_token)
    print(f"Created Product: {product2.get('title')} (ID: {product2.get('id')})")

    product3 = make_request("/products", "POST", {
        "title": "AuraSmart Watch Series 5",
        "description": "Smart watch with custom AMOLED display, continuous heart rate tracking, oxygen saturation monitor, sleep tracking, and built-in GPS with 7 days battery backup.",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
      }, token=admin_token)
    print(f"Created Product: {product3.get('title')} (ID: {product3.get('id')})")
    
    # 4. Register regular user
    print("\n4. Registering regular user...")
    user_info = make_request("/auth/register", "POST", {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    })
    print(f"User registered. is_admin status: {user_info.get('is_admin')}")
    
    # 5. Login regular user
    print("\n5. Logging in regular user...")
    user_token_res = make_request("/auth/login", "POST", {
        "email": "john@example.com",
        "password": "password123"
    })
    user_token = user_token_res.get("access_token")
    print("User logged in successfully.")
    
    # 6. Create reviews
    print("\n6. Creating reviews as regular user...")
    review1 = make_request("/reviews", "POST", {
        "product_id": product1.get("id"),
        "rating": 5,
        "comment": "Absolutely incredible performance! Handles heavy ML compiling workloads and AAA games like a breeze. Battery life is okay, but performance makes up for it."
    }, token=user_token)
    print("Submitted review 1.")
    
    review2 = make_request("/reviews", "POST", {
        "product_id": product2.get("id"),
        "rating": 4,
        "comment": "Excellent sound clarity and noise cancelation! They are very comfortable, though the clamping force is a little tight during the first week of use."
    }, token=user_token)
    print("Submitted review 2.")

    # 7. Create review as admin user
    print("\n7. Creating reviews as Admin user...")
    review3 = make_request("/reviews", "POST", {
        "product_id": product1.get("id"),
        "rating": 4,
        "comment": "Solid workstation laptop. A bit heavy to carry around, but the build quality is top-notch."
    }, token=admin_token)
    print("Submitted review 3.")

    # 8. Query products to verify average ratings
    print("\n8. Verifying product averages...")
    products = make_request("/products")
    for p in products:
        print(f"Product: {p.get('title')} | Rating: {p.get('average_rating')} | Reviews: {p.get('review_count')}")

    print("\nDatabase seeded successfully!")

if __name__ == "__main__":
    seed()
