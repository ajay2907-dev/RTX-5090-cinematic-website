import urllib.request

urls = [
    "http://localhost:8000/",
    "http://localhost:8000/index.html",
    "http://localhost:8000/styles.css",
    "http://localhost:8000/main.js",
    "http://localhost:8000/public/frames/frame_001.jpg",
    "http://localhost:8000/public/frames/frame_120.jpg",
    "http://localhost:8000/public/frames/frame_240.jpg"
]

print("--- Testing HTTP Server Responses ---")
for url in urls:
    try:
        res = urllib.request.urlopen(url)
        print(f"[OK 200] {url} (size: {len(res.read())} bytes)")
    except Exception as e:
        print(f"[FAIL] {url}: {e}")
