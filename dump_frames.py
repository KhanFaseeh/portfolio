import cv2
import os

def dump_all():
    os.makedirs("temp_frames", exist_ok=True)
    cap = cv2.VideoCapture("public/character.mp4")
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Dumping {total_frames} frames...")
    
    idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        # Save every 2nd or every frame? Let's save all frames scaled to 640x360 for fast inspection
        small = cv2.resize(frame, (640, 360), interpolation=cv2.INTER_AREA)
        cv2.imwrite(f"temp_frames/frame_{idx:04d}.jpg", small)
        idx += 1
        
    cap.release()
    print(f"Dumped {idx} frames to temp_frames/")

if __name__ == "__main__":
    dump_all()
