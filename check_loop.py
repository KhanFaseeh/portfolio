import cv2

cap = cv2.VideoCapture("public/character.mp4")
for f in range(180, 215):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if ret:
        # crop face area: y 0 to 540, x 700 to 1220
        face = frame[50:500, 750:1170]
        cv2.putText(face, f"F:{f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.imwrite(f"temp_frames/face_{f:03d}.jpg", face)
cap.release()
print("Saved faces 180 to 214")
