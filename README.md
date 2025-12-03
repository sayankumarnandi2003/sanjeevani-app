🌿 Sanjeevani Bharat - AI-Powered Digital Health Companion

Sanjeevani Bharat is a comprehensive health and wellness web application designed to bridge the gap between patients and immediate medical assistance. Built with modern web technologies, it features an AI-powered health assistant, emergency SOS services, and medicine management tools.

🚀 Key Features

🤖 AI Health Chatbot

Powered by Google Gemini API (Model: gemini-pro).

Provides instant answers to general health queries, symptom analysis, and first-aid advice.

Context-aware responses for fever, headaches, and emergency situations.

🚨 Emergency SOS System

One-Tap Alert: Instantly retrieves the user's high-accuracy Geolocation (Latitude/Longitude).

Shareable Link: Generates a Google Maps link and attempts to share it via WhatsApp/SMS/Native Share options.

Direct Dialing: Quick access buttons for Ambulance (108) and Police (100).

💊 Medicine Management

Digital Pharmacy: A clean UI to browse medicines, view prices, and manage a shopping cart.

Pill Reminders: Localized reminder system to help patients track their medication schedules.

📊 Health Dashboard

Visualizes vital health metrics (Heart Rate, SpO2, Steps, Sleep).

Designed to integrate with smartwatch data APIs in future updates.

🛠️ Tech Stack

Frontend Framework: React.js (Vite)

Styling: Tailwind CSS

Icons: Lucide React

AI Integration: Google Generative AI SDK

State Management: React Hooks (useState, useEffect)

Deployment: Netlify / Vercel (Ready)

⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

1. Clone the Repository

git clone [https://github.com/sayankumarnandi2003/sanjeevani-app.git](https://github.com/sayankumarnandi2003/sanjeevani-app.git)
cd sanjeevani-app


2. Install Dependencies

npm install


3. Configure Environment Variables

To secure the API Key, this project uses environment variables.

Create a file named .env in the root directory.

Add your Google Gemini API Key:

VITE_GEMINI_API_KEY=your_actual_api_key_starting_with_AIza


4. Run the Development Server

npm run dev


Open your browser and navigate to http://localhost:5173.

📸 Screenshots

(You can upload screenshots of your app to your repo and link them here to make your README look amazing)

Dashboard

AI Chatbot





🔮 Future Roadmap

[ ] Smartwatch Integration: Connecting with Google Health Connect API / Apple HealthKit for real-time vitals.

[ ] Firebase Backend: User authentication and cloud database for persistent order history.

[ ] Payment Gateway: Razorpay/Stripe integration for real medicine payments.

[ ] Doctor Teleconsultation: Video calling feature using WebRTC.

⚠️ Disclaimer

Sanjeevani Bharat is an AI-assisted tool for informational purposes only. It is not a substitute for professional medical diagnosis or treatment. In case of a medical emergency, always contact local emergency services immediately.

🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

👨‍💻 Author

Sayan Kumar Nandi

GitHub: @sayankumarnandi2003
