"""Sprachsynthese für scripts/audio.mjs: liest Aufträge (JSON) und schreibt MP3-Dateien.

Benötigt pyopenjtalk-plus (enthält Open JTalk und die Stimme „Mei“, CC BY 3.0) sowie ffmpeg mit libmp3lame:
  python3 -m venv .venv && .venv/bin/pip install pyopenjtalk-plus
"""
import json
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np

try:
    import pyopenjtalk
except ImportError:
    sys.exit('pyopenjtalk fehlt: pip install pyopenjtalk-plus (oder PYTHON=<venv>/bin/python npm run audio)')

jobs_file, out_dir = sys.argv[1], Path(sys.argv[2])
force = '--force' in sys.argv[3:]

HAN_OR_LATIN = re.compile(r'[\u3400-\u9fff々〆A-Za-z0-9０-９Ａ-Ｚａ-ｚ]')
NOT_KANA = re.compile(r'[^ァ-ヴー]')


def katakana(s: str) -> str:
    return ''.join(chr(ord(c) + 0x60) if 'ぁ' <= c <= 'ゖ' else c for c in s)


def reading(text: str) -> str:
    return NOT_KANA.sub('', ''.join(f['read'] for f in pyopenjtalk.run_frontend(text)))


def choose_input(job):
    """Liest Open JTalk ein Kanji anders als die Furigana, wird mit den Furigana statt der Kanji synthetisiert."""
    text, segs = job['text'], job.get('segments')
    if not segs or not any(rt for _, rt in segs):
        return text, None
    expected = ''.join(rt or t for t, rt in segs)
    if HAN_OR_LATIN.search(expected):
        return text, None
    want = NOT_KANA.sub('', katakana(expected))
    got = reading(text)
    if got == want:
        return text, None
    if reading(expected) == want:
        return expected, f'Furigana statt Kanji ({got} → {want})'
    return text, f'Lesung weicht ab: {got} ≠ {want}'


def synthesize(text: str, speed: float) -> tuple[np.ndarray, int]:
    x, sr = pyopenjtalk.tts(text, speed=speed)
    x = x / max(np.abs(x).max(), 1) * 0.89
    # Stille am Anfang und Ende kürzen (40 ms davor, 120 ms danach stehen lassen)
    loud = np.flatnonzero(np.abs(x) > 0.02)
    if loud.size:
        x = x[max(loud[0] - sr * 40 // 1000, 0) : loud[-1] + sr * 120 // 1000]
    return (x * 32767).astype('<i2'), sr


def encode(pcm: np.ndarray, sr: int, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(sr), '-ac', '1', '-i', '-',
           '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '32k', '-map_metadata', '-1', str(path)]
    subprocess.run(cmd, input=pcm.tobytes(), check=True)


jobs = json.loads(Path(jobs_file).read_text(encoding='utf-8'))
todo = [j for j in jobs if force or not (out_dir / j['file']).exists()]
notes = []
with ThreadPoolExecutor(8) as pool:
    futures = []
    for i, job in enumerate(todo, 1):
        text, note = choose_input(job)
        if note:
            notes.append(f"{job['text']}: {note}")
        pcm, sr = synthesize(text, job.get('speed', 1.0))
        futures.append(pool.submit(encode, pcm, sr, out_dir / job['file']))
        if i % 100 == 0:
            print(f'{i}/{len(todo)}', flush=True)
    for f in futures:
        f.result()

print(f'{len(todo)} von {len(jobs)} Aufnahmen erzeugt')
for n in notes:
    print('  ' + n)
