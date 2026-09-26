import os
import json
import cv2
import numpy as np

def main():
    video_path = "public/character.mp4"
    output_dir = "public/frames"
    os.makedirs(output_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open {video_path}")
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / fps if fps > 0 else 0
    
    print("=" * 60)
    print("VIDEO TIMELINE & FRAME ANALYSIS")
    print("=" * 60)
    print(f"File: {video_path}")
    print(f"Total Frames: {total_frames}")
    print(f"FPS: {fps}")
    print(f"Dimensions: {width}x{height}")
    print(f"Duration: {duration:.2f}s")
    
    # 8 Compass Directions & Center Frame Mapping
    compass_frames = {
        "RIGHT": 72,       # 0 deg / 0 rad
        "DOWN_RIGHT": 94,  # 45 deg / pi/4
        "DOWN": 116,       # 90 deg / pi/2
        "DOWN_LEFT": 138,  # 135 deg / 3pi/4
        "LEFT": 160,       # 180 deg / pi
        "UP_LEFT": 182,    # 225 deg / -135 deg
        "UP_SEAM_END": 194,# 270 deg / -90 deg (end of clockwise loop)
        "UP_SEAM_START": 18,# 270 deg / -90 deg (start of clockwise loop)
        "UP_RIGHT": 46,    # 315 deg / -45 deg
        "CENTER": 225      # Neutral pose looking straight at camera
    }
    
    print("\nIdentified Keyframes for 8 Compass Directions & Center:")
    for direction, fnum in compass_frames.items():
        print(f"  {direction:15s}: Frame {fnum}")
        
    # Read Center Frame & Sample Background Color
    cap.set(cv2.CAP_PROP_POS_FRAMES, compass_frames["CENTER"])
    ret_center, center_img = cap.read()
    if not ret_center:
        raise RuntimeError("Failed to read center frame")
        
    # Sample corner pixels for exact background color
    corners = [
        center_img[10, 10],
        center_img[10, width - 10],
        center_img[height - 10, 10],
        center_img[height - 10, width - 10],
        center_img[50, 50],
        center_img[50, width - 50],
    ]
    mean_corner_bgr = np.mean(corners, axis=0)
    bg_rgb = [int(round(c)) for c in mean_corner_bgr[::-1]]
    bg_hex = f"#{bg_rgb[0]:02x}{bg_rgb[1]:02x}{bg_rgb[2]:02x}".upper()
    print(f"\nDetected Background Color: RGB {bg_rgb} -> HEX {bg_hex}")
    
    # Save center.webp
    webp_quality = [cv2.IMWRITE_WEBP_QUALITY, 92]
    center_out_1 = os.path.join(output_dir, "center.webp")
    center_out_2 = "public/center.webp"
    cv2.imwrite(center_out_1, center_img, webp_quality)
    cv2.imwrite(center_out_2, center_img, webp_quality)
    print(f"Saved {center_out_1} and {center_out_2}")
    
    # Compute 64 angular trajectory frames (~5.625 deg apart)
    # Angle 0 = RIGHT (frame 72), going clockwise to DOWN, LEFT, UP, UP-RIGHT, RIGHT
    num_frames = 64
    frame_map = []
    
    # Pre-cache all frames from video into memory for fast interpolation/reading
    print(f"\nLoading video frames into buffer...")
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    all_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        all_frames.append(frame)
    cap.release()
    print(f"Loaded {len(all_frames)} frames.")
    
    print(f"\nExtracting {num_frames} WebP frames along 360° trajectory...")
    for i in range(num_frames):
        deg = i * (360.0 / num_frames)  # 0, 5.625, 11.25, ...
        rad = i * (2.0 * np.pi / num_frames)
        
        # Piecewise mapping along sectors
        if deg <= 45.0:
            # Sector 0..45: RIGHT (72) -> DOWN_RIGHT (94)
            t = deg / 45.0
            video_frame_num = 72.0 + t * (94.0 - 72.0)
        elif deg <= 90.0:
            # Sector 45..90: DOWN_RIGHT (94) -> DOWN (116)
            t = (deg - 45.0) / 45.0
            video_frame_num = 94.0 + t * (116.0 - 94.0)
        elif deg <= 135.0:
            # Sector 90..135: DOWN (116) -> DOWN_LEFT (138)
            t = (deg - 90.0) / 45.0
            video_frame_num = 116.0 + t * (138.0 - 116.0)
        elif deg <= 180.0:
            # Sector 135..180: DOWN_LEFT (138) -> LEFT (160)
            t = (deg - 135.0) / 45.0
            video_frame_num = 138.0 + t * (160.0 - 138.0)
        elif deg <= 225.0:
            # Sector 180..225: LEFT (160) -> UP_LEFT (182)
            t = (deg - 180.0) / 45.0
            video_frame_num = 160.0 + t * (182.0 - 160.0)
        elif deg <= 270.0:
            # Sector 225..270: UP_LEFT (182) -> UP (194)
            t = (deg - 225.0) / 45.0
            video_frame_num = 182.0 + t * (194.0 - 182.0)
        elif deg <= 315.0:
            # Sector 270..315: UP (18) -> UP_RIGHT (46)
            t = (deg - 270.0) / 45.0
            video_frame_num = 18.0 + t * (46.0 - 18.0)
        else:
            # Sector 315..360: UP_RIGHT (46) -> RIGHT (72)
            t = (deg - 315.0) / 45.0
            video_frame_num = 46.0 + t * (72.0 - 46.0)
            
        exact_frame = int(round(video_frame_num))
        exact_frame = max(0, min(exact_frame, len(all_frames) - 1))
        
        extracted_frame = all_frames[exact_frame]
        
        # Save as frame_XX.webp and XX.webp
        out_name_1 = f"frame_{i:02d}.webp"
        out_name_2 = f"{i}.webp"
        cv2.imwrite(os.path.join(output_dir, out_name_1), extracted_frame, webp_quality)
        cv2.imwrite(os.path.join(output_dir, out_name_2), extracted_frame, webp_quality)
        
        frame_map.append({
            "index": i,
            "angleDegrees": round(deg, 3),
            "angleRadians": round(rad, 4),
            "videoFrame": exact_frame,
            "filename": out_name_1
        })
        
    # Face center relative coordinates: in 1920x1080, face is center horizontally (~960), nose/eyes around y: 320
    metadata = {
        "numFrames": num_frames,
        "width": width,
        "height": height,
        "backgroundColor": bg_hex,
        "backgroundRgb": bg_rgb,
        "faceCenterNormalized": {
            "x": 0.50,
            "y": 0.32
        },
        "deadzoneRadiusNormalized": 0.12,
        "compassKeyframes": compass_frames,
        "frames": frame_map
    }
    
    with open(os.path.join(output_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"\nSuccessfully generated {num_frames} frames + center.webp in {output_dir}/")
    print(f"Saved metadata.json with complete configuration.")
    print("=" * 60)

if __name__ == "__main__":
    main()
