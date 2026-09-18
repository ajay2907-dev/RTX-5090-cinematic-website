import urllib.request
from unittest.mock import patch

urls = [
    "http://localhost:8000/",
    "http://localhost:8000/index.html",
    "http://localhost:8000/styles.css",
    "http://localhost:8000/main.js",
    "http://localhost:8000/public/frames/frame_001.jpg",
    "http://localhost:8000/public/frames/frame_120.jpg",
    "http://localhost:8000/public/frames/frame_240.jpg"
]

def check_urls(url_list):
    for url in url_list:
        try:
            res = urllib.request.urlopen(url)
            print(f"[OK 200] {url} (size: {len(res.read())} bytes)")
        except Exception as e:
            print(f"[FAIL] {url}: {e}")

print("--- Testing HTTP Server Responses ---")
check_urls(urls)

print("--- Testing Error Handling ---")
with patch('urllib.request.urlopen') as mock_urlopen:
    mock_urlopen.side_effect = Exception("Simulated connection error")
    check_urls(["http://localhost:8000/error_test"])
