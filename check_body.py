import cv2
import numpy as np

f24 = cv2.imread("temp_frames/check_024.jpg")
f72 = cv2.imread("temp_frames/check_072.jpg")
f116 = cv2.imread("temp_frames/check_116.jpg")
f160 = cv2.imread("temp_frames/check_160.jpg")
f225 = cv2.imread("temp_frames/check_225.jpg")

# Lower body region: y: 600 to 1080
diff_72 = np.mean(cv2.absdiff(f24[600:1080, :], f72[600:1080, :]))
diff_116 = np.mean(cv2.absdiff(f24[600:1080, :], f116[600:1080, :]))
diff_160 = np.mean(cv2.absdiff(f24[600:1080, :], f160[600:1080, :]))
diff_225 = np.mean(cv2.absdiff(f24[600:1080, :], f225[600:1080, :]))

print("Body region mean differences:")
print(f"  F24 vs F72:  {diff_72:.2f}")
print(f"  F24 vs F116: {diff_116:.2f}")
print(f"  F24 vs F160: {diff_160:.2f}")
print(f"  F24 vs F225: {diff_225:.2f}")
