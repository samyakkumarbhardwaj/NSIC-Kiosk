👤 Author
Samyak Kumar Bhardwaj
Intern at National Small Industries Corporation (NSIC)

NSIC Kiosk – Student Course Registration System

This project is a self-service kiosk application built for the National Small Industries Corporation (NSIC) to streamline student registration for training courses.

It was developed by Samyak Kumar Bhardwaj, an intern at NSIC, as part of a hands-on project to modernize student enrollment workflows.

🚀 Project Overview

The kiosk provides students with an easy-to-use interface where they can:

Browse and search available NSIC training courses.

Get AI-powered smart recommendations for suitable courses.

Fill out an application form with their details.

Capture or upload their photograph.

Submit their application and receive a unique registration number.

Choose a payment method and finalize enrollment.

🖥️ Frontend – React Kiosk

Built with React.js and TailwindCSS for a modern, responsive interface.

Multi-step workflow guiding students from welcome screen → course selection → form → photo → payment.

Includes search functionality and smart course recommender (based on interests, background, duration, fee).

Camera integration to capture student photographs (with file upload fallback).

Final screen shows a unique NSIC registration number.

⚙️ Backend – Express

Developed using Node.js (Express.js)

Provides REST APIs for:

Submitting applications (student details, course, photo).

Generating a unique registration number.

Saving payment method for each application.

Fetching applications (for admin/staff use).