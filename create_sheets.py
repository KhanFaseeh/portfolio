import cv2
import glob
import numpy as np

def create_sheets():
    frames = sorted(glob.glob("temp_frames/frame_*.jpg"))
    # Create contact sheets of 24 frames each (10 sheets total)
    for sheet_idx in range(10):
        start_f = sheet_idx * 24
        end_f = min(start_f + 24, len(frames))
        sheet_frames = frames[start_f:end_f]
        
        rows = []
        for r in range(4):
            row_imgs = []
            for c in range(6):
                idx = r * 6 + c
                if idx < len(sheet_frames):
                    fpath = sheet_frames[idx]
                    fnum = start_f + idx
                    img = cv2.imread(fpath)
                    # Add frame number text
                    cv2.putText(img, f"F:{fnum}", (15, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                    row_imgs.append(img)
                else:
                    row_imgs.append(np.zeros((360, 640, 3), dtype=np.uint8))
            rows.append(np.hstack(row_imgs))
        grid = np.vstack(rows)
        # resize grid to manageable size
        grid_small = cv2.resize(grid, (1920, 720))
        cv2.imwrite(f"temp_frames/sheet_{sheet_idx:02d}.jpg", grid_small)
    print("Created 10 contact sheets")

if __name__ == "__main__":
    create_sheets()
