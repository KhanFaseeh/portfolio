import cv2
import numpy as np

img = cv2.imread("temp_frames/check_225.jpg")
h, w, _ = img.shape

# Sample top edge, left edge, right edge, bottom edge
top_edge = img[0:15, :, :]
bottom_edge = img[h-15:h, :, :]
left_edge = img[:, 0:15, :]
right_edge = img[:, w-15:w, :]

print("Top edge mean BGR:", np.mean(top_edge, axis=(0,1)))
print("Bottom edge mean BGR:", np.mean(bottom_edge, axis=(0,1)))
print("Left edge mean BGR:", np.mean(left_edge, axis=(0,1)))
print("Right edge mean BGR:", np.mean(right_edge, axis=(0,1)))

corners = [
    img[5, 5],
    img[5, w-5],
    img[h-5, 5],
    img[h-5, w-5]
]
mean_corner_bgr = np.mean(corners, axis=0)
mean_corner_rgb = [int(c) for c in mean_corner_bgr[::-1]]
print("Corner mean RGB:", mean_corner_rgb, "-> Hex:", f"#{mean_corner_rgb[0]:02x}{mean_corner_rgb[1]:02x}{mean_corner_rgb[2]:02x}")
