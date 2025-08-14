# CERESAFE

**CERESAFE** is an integrated platform for stroke risk prediction and prediction history management, combining advanced machine learning models, a modern web portal, and a robust backend API. The system is designed for end-users to interact with predictive analytics, manage their predictions data, and visualize results in a secure, scalable, and user-friendly environment.

---

## 🌟 Features

- **User Authentication & Management**: Secure registration, login, and role-based access.
- **Personalized Dashboard**: View prediction history, results, and manage account settings.
- **Stroke Risk Prediction**: Upload health and demographic data and receive predictions for stroke and risk using state-of-the-art ML models.
- **Interactive Visualizations**: Explore results and trends with responsive charts and tables.
- **API Access**: RESTful endpoints for programmatic access to prediction services.
- **Audit & History**: Track all predictions and user actions for transparency.
- **Mobile-Ready UI**: Responsive design for seamless use on any device.
- **Data Privacy**: Built-in security and privacy best practices.

---

## 🛠️ Technology Stack

### **Web Portal**
- **Framework**: [Next.js](https://nextjs.org/) (React, App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules, PostCSS
- **State Management**: React Context, Custom Hooks
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)
- **Other Tools**: ESLint, Prettier

### **Backend API**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.12+
- **ML Serving**: scikit-learn, CatBoost, joblib
- **Data Processing**: pandas, numpy
- **Deployment**: Docker, Gunicorn/Uvicorn
- **Configuration**: YAML, environment variables

### **Machine Learning**
- **Model Training**: scikit-learn, CatBoost
- **Pipelines**: Custom preprocessing and postprocessing modules
- **Artifacts**: Models and pipelines serialized with joblib/pickle
- **Experiment Tracking**: YAML configs, artifact folders

---

## 📦 Repository Structure

```
.
├── backend/         # FastAPI backend for ML inference and API
├── ml/              # ML pipelines, training scripts, and artifacts
├── web-portal/      # Next.js web frontend
└── README.md        # Project documentation (this file)
```

---

## 🚀 Deployment Overview

### **Web Portal**
- **Recommended**: Deploy to [Vercel](https://vercel.com/) for instant CI/CD and global CDN.
- **Environment**: Configure `.env.local` with Supabase and API URLs.
- **Local Development**:  
	```bash
	cd web-portal
	npm install
	npm run dev
	```
	Visit [http://localhost:3000](http://localhost:3000).

### **Backend API**
- **Recommended**: Deploy with Docker (cloud VM, Azure, AWS, etc.).
- **Environment**: Set variables in `.env` and configure `config.yaml`.
- **Local Development**:  
	```bash
	cd backend
	pip install -r requirements.txt
    cd app
	uvicorn main:app --reload
	```
	API available at [http://localhost:8000](http://localhost:8000).

- **Docker Deployment**:  
	```bash
	cd backend
	docker build -t ceresafe-backend .
	docker run -p 8000:8000 --env-file .env ceresafe-backend
	```

### **Machine Learning**
- **Training**: Run scripts in `ml` to retrain or update models.
- **Artifacts**: Models and pipelines are stored in `ml/artifacts` and loaded by the backend.

---

## 🧑‍💻 Local Development

1. **Clone the repository**
	 ```bash
	 git clone https://github.com/your-org/ceresafe.git
	 cd ceresafe
	 ```

2. **Set up the backend**
	 - Install Python dependencies: `pip install -r backend/requirements.txt`
	 - Configure `.env` and `config.yaml` in `backend`
	 - Start the API: `uvicorn backend/app/main:app --reload`

3. **Set up the web portal**
	 - Install Node.js dependencies: `npm install` in `web-portal`
	 - Configure `.env.local` in `web-portal`
	 - Start the dev server: `npm run dev`

4. **(Optional) Retrain ML models**
 - Use scripts in `ml` for data processing and model training.

---

## 🤝 Contributing

We welcome contributions! To get started:

- Fork the repository and create a new branch.
- Follow code style guidelines (ESLint/Prettier for JS, Black for Python).
- Add tests or documentation as needed.
- Open a pull request with a clear description.

For major changes, please open an issue first to discuss your proposal.

---

## 🛡️ Security & Privacy

- All user data is securely stored and transmitted.
- Authentication and authorization are enforced via Supabase and backend checks.
- Please report vulnerabilities via issues or email.

---

## 📚 Documentation & Resources

- Web Portal README
- Backend README
- ML README
- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Supabase Docs](https://supabase.com/docs)

---

## 📝 License

This project is licensed under the MIT License.

---

**© 2025 Hussnain Ali. All rights reserved.**
