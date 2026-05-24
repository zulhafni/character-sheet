import sqlite3
import json
import random
import string
from datetime import datetime

DB_PATH = 'character_sheet.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS sessions (
        code TEXT PRIMARY KEY,
        created_at TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_code TEXT,
        char_name TEXT,
        sprite_index INTEGER,
        intention_original TEXT,
        intention_refined TEXT,
        traits TEXT,
        created_at TEXT,
        FOREIGN KEY (session_code) REFERENCES sessions(code)
    )''')
    conn.commit()
    conn.close()

def create_session():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO sessions (code, created_at) VALUES (?, ?)',
              (code, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return code

def get_latest_session():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT code FROM sessions ORDER BY created_at DESC LIMIT 1')
    row = c.fetchone()
    conn.close()
    return row[0] if row else None

def session_exists(code):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT code FROM sessions WHERE code = ?', (code,))
    row = c.fetchone()
    conn.close()
    return row is not None

def save_character(session_code, char_name, sprite_index, intention_original, intention_refined, traits):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''INSERT INTO characters
                 (session_code, char_name, sprite_index, intention_original, intention_refined, traits, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)''',
              (session_code, char_name, sprite_index, intention_original,
               intention_refined, json.dumps(traits), datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_characters(session_code):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM characters WHERE session_code = ? ORDER BY created_at ASC',
              (session_code,))
    rows = c.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        if isinstance(d['traits'], str):
            d['traits'] = json.loads(d['traits'])
        result.append(d)
    return result

def get_character_count(session_code):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT COUNT(*) FROM characters WHERE session_code = ?', (session_code,))
    count = c.fetchone()[0]
    conn.close()
    return count
