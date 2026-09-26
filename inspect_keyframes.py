import cv2

def inspect_frames():
    # Let's save high-res cropped faces of key transition frames
    cap = cv2.VideoCapture("public/character.mp4")
    # Face bounding box roughly: y: 0 to 450, x: 800 to 1120
    frames_to_check = [
        20, 22, 24, 26, 28,  # UP
        44, 46, 48, 50, 52,  # UP-RIGHT
        68, 70, 72, 74, 76,  # RIGHT
        92, 94, 96, 98, 100, # DOWN-RIGHT
        110, 114, 116, 118, 122, # DOWN
        134, 136, 138, 140, 142, # DOWN-LEFT
        156, 158, 160, 162, 164, # LEFT
        180, 182, 184, 186, 188, # UP-LEFT
        192, 194, 196, 198, 200, # RETURN TO UP/CENTER
        215, 220, 225, 230, 235  # CENTER
    ]
    
    for f in frames_to_check:
        cap.set(cv2.CAP_PROP_POS_FRAMES, f)
        ret, frame = cap.read()
        if ret:
            cv2.imwrite(f"temp_frames/check_{f:03d}.jpg", frame)
    cap.release()
    print("Saved check frames")

if __name__ == "__main__":
    inspect_frames()
