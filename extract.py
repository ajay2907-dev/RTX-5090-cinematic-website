import zipfile
import os
import re

zip_path = "rtx 5090 frames.zip"
target_dir = "public/frames"

os.makedirs(target_dir, exist_ok=True)

print(f"Opening {zip_path}...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    entries = zip_ref.namelist()
    jpg_entries = [e for e in entries if e.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    # Sort entries by extracting number from filename
    def extract_number(name):
        nums = re.findall(r'\d+', os.path.basename(name))
        return int(nums[-1]) if nums else 0
        
    sorted_entries = sorted(jpg_entries, key=extract_number)
    print(f"Found {len(sorted_entries)} frames.")
    
    for idx, entry in enumerate(sorted_entries, start=1):
        filename = f"frame_{idx:03d}.jpg"
        target_path = os.path.join(target_dir, filename)
        
        with zip_ref.open(entry) as source, open(target_path, "wb") as target:
            target.write(source.read())
            
print(f"Successfully extracted {len(sorted_entries)} frames into {target_dir}")
