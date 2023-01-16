import cv2
import numpy as np
import pyautogui

# Set the threshold for the non-white color
lower_bound = np.array([1,1,1])
upper_bound = np.array([254,254,254])

# Create a list to store the positions of the candidate boxes
candidate_boxes = []

# Have the user select the region of the screen to capture, show the screenshot at 50% scale
region = cv2.selectROI("Select the region to capture", cv2.resize(np.array(pyautogui.screenshot()), (0,0), fx=0.5, fy=0.5))
cv2.destroyAllWindows()

# Account for the scale of the screenshot
region = (region[0] * 2, region[1] * 2, region[2] * 2, region[3] * 2)

times_clicked = 0

while True:
    # Capture the screen
    screen = np.array(pyautogui.screenshot(region=region))

    # Threshold the screen to only select non-white color
    mask = cv2.inRange(screen, lower_bound, upper_bound)

    # Find the contours of the non-white color in the image
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    for contour in contours:
        # Find the center of the contour
        M = cv2.moments(contour)
        if M["m00"] > 0:
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])

        # Check if the contour is already in the list of candidate boxes
        found = False
        for i, candidate in enumerate(candidate_boxes):
            if abs(candidate[0] - cX) <= 5 and abs(candidate[1] - cY) <= 5:
                found = True
                candidate_boxes[i] = (cX, cY, candidate[2] + 1)
                break

        if not found:
            candidate_boxes.append((cX, cY, 1))

    # Track if the user has clicked at least once box this iteration
    clicked = False
    for candidate in candidate_boxes:
        if candidate[2] >= 5:
            # Adjust the position of the candidate box to the center of the box accounting for the selected region
            candidate_click = (candidate[0] + region[0], candidate[1] + region[1])
            pyautogui.click(candidate_click[0], candidate_click[1])
            # remove the stationary box from the list of candidate boxes
            candidate_boxes.remove(candidate)
            clicked = True

    if clicked:
        times_clicked += 1
    # Reset the list of candidate boxes if the user has clicked 10 times
    if times_clicked >= 10:
        candidate_boxes.clear()
        times_clicked = 0
