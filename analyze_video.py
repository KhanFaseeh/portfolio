import cv2
import os
import numpy as np

def main():
    video_path = "public/character.mp4"
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error opening video {video_path}")
        return
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / fps if fps > 0 else 0
    
    print(f"Video Stats:")
    print(f"  Total Frames: {total_frames}")
    print(f"  FPS: {fps}")
    print(f"  Resolution: {width}x{height}")
    print(f"  Duration: {duration:.2f}s")
    
    # Read first frame and check background color
    ret, frame = cap.read()
    if ret:
        # Sample corners: top-left, top-right, bottom-left, bottom-right
        corners = [
            frame[20, 20],
            frame[20, width - 20],
            frame[height - 20, 20],
            frame[height - 20, width - 20],
            frame[100, 50],
            frame[100, width - 50]
        ]
        # BGR to RGB
        mean_bgr = np.mean(corners, axis=0)
        mean_rgb = [int(round(c)) for c in mean_bgr[::-1]]
        hex_color = f"#{mean_rgb[0]:02x}{mean_rgb[1]:02x}{mean_rgb[2]:02x}".upper()
        print(f"  Detected Background RGB: {mean_rgb} -> HEX: {hex_color}")
        
    cap.release()

if __name__ == "__main__":
    main()
