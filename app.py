from flask import Flask, render_template, request, jsonify, redirect, url_for, send_file
import socket
import io
import os
import qrcode
import qrcode.constants
from db import init_db, create_session, get_latest_session, session_exists, \
               save_character, get_characters, get_character_count, get_session_mode

app = Flask(__name__)
PORT = int(os.environ.get('PORT', 8080))
init_db()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

def get_join_url(code):
    base = os.environ.get('BASE_URL')
    if base:
        return f'{base.rstrip("/")}/join/{code}'
    return f'http://{get_local_ip()}:{PORT}/join/{code}'

@app.route('/')
def trainer():
    code = get_latest_session()
    if not code:
        code = create_session()
    join_url = get_join_url(code)
    count = get_character_count(code)
    mode = get_session_mode(code)
    return render_template('trainer.html', code=code, join_url=join_url,
                           count=count, mode=mode)

@app.route('/new-session')
def new_session():
    mode = request.args.get('mode', 'kickoff')
    create_session(mode)
    return redirect(url_for('trainer'))

@app.route('/join/<code>')
def learner(code):
    if not session_exists(code):
        return "Session not found. Ask your trainer for the correct link.", 404
    mode = get_session_mode(code)
    return render_template('learner.html', code=code, midcheck=(mode == 'midcheck'))

@app.route('/save/<code>', methods=['POST'])
def save(code):
    if not session_exists(code):
        return jsonify({'error': 'Session not found'}), 404
    data = request.json
    save_character(
        code,
        data.get('char_name', ''),
        data.get('sprite_index', 0),
        data.get('intention_original', ''),
        data.get('intention_refined', ''),
        data.get('traits', [])
    )
    return jsonify({'ok': True})

@app.route('/api/session/<code>')
def api_session(code):
    characters = get_characters(code)
    return jsonify({'characters': characters, 'count': len(characters)})

@app.route('/stage/<code>')
def stage(code):
    if not session_exists(code):
        return "Session not found.", 404
    mode = get_session_mode(code)
    return render_template('stage.html', code=code, midcheck=(mode == 'midcheck'))

@app.route('/qr/<code>')
def qr_image(code):
    join_url = get_join_url(code)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=8,
        border=3
    )
    qr.add_data(join_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color='#1D3557', back_color='#F1FAEE')
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=PORT)
