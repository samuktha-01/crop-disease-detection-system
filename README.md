# 🌱 CropHealth AI

CropHealth AI is an AI-powered web application designed to help farmers identify **crop diseases, pest infestations, and nutrient deficiencies** using smartphone images. The system provides intelligent diagnosis along with treatment recommendations based on Indian agricultural practices, cost constraints, and sustainable farming methods.

---

##  Features

*  Upload crop images from a smartphone or computer
*  AI-powered crop disease detection
*  Pest identification
*  Nutrient deficiency analysis
*  Organic, chemical, and cultural treatment recommendations
*  Estimated treatment cost in Indian Rupees (₹)
*  India-specific farming recommendations
*  ICAR-based agricultural guidance
*  Responsive and mobile-friendly interface
*  Seasonal farming tips
*  Diagnosis history

---

##  Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS Modules

### AI

* Google Gemini API (Current Version)

### Future Enhancements

* TensorFlow / PyTorch Crop Disease Detection Model
* FastAPI Backend
* PostgreSQL Database
* User Authentication
* Weather Integration
* Admin Dashboard

---

##  Project Structure

```
crop-disease-detection-system/

├── agrilens ai/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
```

---

##  Installation

Clone the repository

```bash
git clone https://github.com/samuktha-01/crop-disease-detection-system.git
```

Navigate to the project

```bash
cd crop-disease-detection-system
cd "agrilens ai"
```

Install dependencies

```bash
npm install
```

---

##  Environment Variables

Create a `.env` file inside the project folder.

```
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Get a free API key from Google AI Studio.

---

##  Run the Project

Start the development server

```bash
npm run dev
```

Open your browser and visit

```
http://localhost:5173
```

---

##  How It Works

1. Upload an image of the affected crop.
2. Select the crop type, growth stage, region, and budget.
3. The AI analyzes the image.
4. The system identifies possible diseases, pests, or nutrient deficiencies.
5. Personalized treatment recommendations are generated.
6. Farmers receive prevention tips and ICAR-based guidance.

---

##  Future Scope

* Real-time disease detection using deep learning
* Multi-language support (Tamil, Hindi, Telugu, Kannada, Malayalam)
* Voice-based farmer assistant
* Weather-based disease prediction
* Soil health analysis
* Nearby agricultural support centers
* Government scheme recommendations
* Farmer login and personalized dashboard

---

##  Screenshots

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

---

##  Developer

**Samuktha**

GitHub: https://github.com/samuktha-01

---

##  License

This project is developed for educational and research purposes.
