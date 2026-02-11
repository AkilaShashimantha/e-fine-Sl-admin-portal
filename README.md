# 🚦 e-Fine SL Admin Portal

> A comprehensive Traffic Management System Admin Portal for Sri Lanka, streamlining fine management, officer administration, and reporting.

![e-Fine SL Banner](public/banner.png)
*(Note: This image is located in the `public` folder)*

## 🌐 Live Demo

🚀 **Hosted on Vercel:** [https://e-fine-sl-admin-portal.vercel.app/](https://e-fine-sl-admin-portal.vercel.app/)

## 📖 Introduction

The **e-Fine SL Admin Portal** is the central command center for the e-Fine traffic management ecosystem. It empowers administrators to manage traffic officers, monitor fine issuance, oversee driver records, and generate detailed reports. Built with modern web technologies, it ensures security, speed, and a seamless user experience.

## ✨ Key Features

- **👮 Officer Management**: Add, update, and manage traffic police officer profiles and credentials.
- **📝 Fine Management**: View and audit fines issued by officers in real-time.
- **📊 Dashboard Analytics**: Visual insights into traffic violations, revenue, and officer performance.
- **🔐 Secure Authentication**: Robust login system with role-based access control.
- **📱 Responsive Design**: Fully optimized for desktop and tablet interfaces.

## 🛠️ Tech Stack

This project is built using the latest web development technologies:

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/AkilaShashimantha/e-fine-Sl-admin-portal.git
    cd e-fine-Sl-admin-portal/admin-portal
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    NEXT_PUBLIC_API_URL=https://e-fine-sl-traffic-management-1.onrender.com
    NEXT_PUBLIC_APP_NAME=e-Fine SL Admin Portal
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with by [Akila Shashimantha](https://github.com/AkilaShashimantha)
