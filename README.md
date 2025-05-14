# 📚 PubAnalyzer

**PubAnalyzer** is a web-based platform that makes reading and understanding scientific literature easier and more interactive. Users can upload their own PDFs or fetch open-access articles using a PMC ID, highlight and annotate sections, and receive AI-powered explanations on any part of the paper — including text, tables, and figures.

---

##  Features

### 🔍 User Features

- Create Account / Login system  
- Upload PDFs or fetch documents using a PMC ID  
- Highlight and manually annotate text  
- AI-powered help: summaries, explanations, etc
- Save and revisit documents and annotations  
- Share annotated documents with others   

### 🛠️ Admin Features

- Manage user accounts and moderate flagged content  
- View system metrics (uploads, active users, top papers)  
- Retrain or update AI models via backend interface  

---

## 🧱 Tech Stack

### Frontend

- **React**
- **Next.js**
- **Tailwind CSS**

### Backend

- **Django + Django REST Framework**
- **AWS S3** for file storage
- **DeepSeek API** for AI-powered explanations

---

## ✅ Requirements

### Functional - For MVP
- User Account Sign Up / Login
- Fetch PubMed Articles
- Annotate and save documents
- Generate AI summaries and questions

### Functional - Nice to haves:
- Annotated Document Export and Sharing
- Admin dashboard with AI model management

### Non-Functional

- **Performance**:  
  - AI responses within 5–10 seconds  
  - PMC ID docs cached and marked as “view-only”  

- **Security**:  
  - HTTPS for encrypted data transfer  
  - Passwords securely hashed  
  - Access limited to authenticated sessions  

- **Usability**:  
  - Beginner-friendly UI  

- **Scalability**:  
  - Supports 20+ concurrent users  
  - Each user can store at least 10 documents

---

## 📈 Diagrams

### Sequence - Functional Requirments
* [Login](./diagrams/sequence/loginsequence.md)
* [Sign Up](./diagrams/sequence/registersequence.md)
* [Fetch PubMed Articles](./diagrams/sequence/pdfRetrievalSequence.md)
* [Annotate and save documents](./diagrams/sequence/annotationSequence.md)
* [Generate AI summaries and questions](./diagrams/sequence/aiSummarySequence.md)
  
## 👥 Team 8

- Edmond Abraham  
- Bryan Valadez  
- Tim West
