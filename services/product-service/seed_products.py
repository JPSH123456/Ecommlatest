import random
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Seed Data (User's specific 8 videos)
USER_VIDEOS = [
    {"name": "Radha Hi Bawari", "category": "Trending Now", "youtube_id": "YyepU5ztLf4", "image_url": "https://img.youtube.com/vi/YyepU5ztLf4/hqdefault.jpg", "description": "A soulful Marathi melody celebrating the love of Radha.", "price": 19.99, "stock": 100},
    {"name": "Balma (Khiladi 786)", "category": "Action & Adventure", "youtube_id": "F2m4HPLvj-4", "image_url": "https://img.youtube.com/vi/F2m4HPLvj-4/hqdefault.jpg", "description": "The high-energy dance anthem featuring Akshay Kumar.", "price": 14.99, "stock": 100},
    {"name": "Radha (SOTY)", "category": "Trending Now", "youtube_id": "IAONd2d_PDU", "image_url": "https://img.youtube.com/vi/IAONd2d_PDU/hqdefault.jpg", "description": "A vibrant celebration of friendship, competition, and youth.", "price": 9.99, "stock": 100},
    {"name": "Dhurandhara (Kabzaa)", "category": "Action & Adventure", "youtube_id": "jo3p7O8n6is", "image_url": "https://img.youtube.com/vi/jo3p7O8n6is/hqdefault.jpg", "description": "The ultimate action saga of a hero who never bows down.", "price": 24.99, "stock": 100},
    {"name": "Baby Shark Dance", "category": "Kids Fun", "youtube_id": "IzC6Cgqcup0", "image_url": "https://img.youtube.com/vi/IzC6Cgqcup0/hqdefault.jpg", "description": "The world-famous baby shark dance for the little ones.", "price": 4.99, "stock": 100},
    {"name": "Cocomelon Bath Song", "category": "Kids Fun", "youtube_id": "lZQ5XzKrUFM", "image_url": "https://img.youtube.com/vi/lZQ5XzKrUFM/hqdefault.jpg", "description": "It's time to take a bath with everyone's favorite characters.", "price": 4.99, "stock": 100},
    {"name": "Radha Krishn (Tum Prem Ho)", "category": "Devotional", "youtube_id": "6ZwwapPikyQ", "image_url": "https://img.youtube.com/vi/6ZwwapPikyQ/hqdefault.jpg", "description": "A beautiful lofi version of the divine love story.", "price": 0.99, "stock": 100},
    {"name": "Cocomelon Wheels on the Bus", "category": "Kids Fun", "youtube_id": "zdVpB9m9GqI", "image_url": "https://img.youtube.com/vi/zdVpB9m9GqI/hqdefault.jpg", "description": "Round and round we go in this classic nursery rhyme.", "price": 4.99, "stock": 100}
]

def seed_db():
    db: Session = SessionLocal()
    try:
        # Clear existing products
        db.query(models.Product).delete()
        
        # Add new products
        for v in USER_VIDEOS:
            product = models.Product(**v)
            db.add(product)
        
        db.commit()
        print(f"Successfully seeded {len(USER_VIDEOS)} products to the database.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
