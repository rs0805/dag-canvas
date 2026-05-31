A visual node-based workflow editor that enables users to build and manage graph-based pipelines through an interactive drag-and-drop canvas.

To Run the Project locally follow the following steps:

(Backend)
1. cd backend
2. py -3.11 -m venv venv
3. venv\Scripts\activate (cmd)
4. pip install -r requirements.txt 
5. uvicorn main:app --reload --port 8000

(Frontend)
1. In frontend create a .env file
2. In .env write, REACT_APP_API_URL=http://localhost:8000
3. cd frontend
4. npm i
5. npm start