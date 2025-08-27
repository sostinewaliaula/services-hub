# Services Hub Dashboard

A beautiful, modern dashboard for monitoring and managing enterprise services, grouped by server and category, with real-time status, search, and notifications.

## ✨ Features
- **Live Service Status**: Checks and displays online/offline status for all configured services.
- **Powerful Search**: Instantly filter services by name, URL, or category. Results auto-scroll into view.
- **Category Grouping**: Services are grouped by server/IP (e.g., WebLogic Server (VM 97)), with each group having a unique color and badge.
- **Distinct Colors**: Each category and service icon overlay uses a unique, vibrant color for easy visual distinction.
- **Port Display**: Service cards show the port number extracted from the URL.
- **Responsive Design**: Works beautifully on desktop and mobile.
- **Notification Panel**: Click the bell icon to see the latest 3 offline services.
- **Glassmorphism & Animations**: Modern UI with glass effects, gradients, and smooth transitions.
- **Friendly URLs**: Where available, cards display a friendly DNS name instead of a raw IP/port.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. Open your browser to the local address shown in the terminal (e.g., http://localhost:5173 or similar).

## 🛠️ Adding & Editing Services
- All services are defined in `src/services.json`.
- Each service entry includes:
  - `name`: Display name
  - `url`: Service URL (used for status check and navigation)
  - `category`: Grouping (e.g., `IP-097`)
  - `ip`: Server IP
  - `icon`: (optional) Custom icon URL
  - `displayUrl`: (optional) Friendly DNS name to display on the card
- To add a new service, add a new object to the JSON array.
- To group by a new server, use a new `category` value (e.g., `IP-150`).

## 🎨 Customization
- **Category Colors**: Each server/category (e.g., WebLogic Server (VM 97)) has a unique color. To change, edit the color mapping in `src/components/ServiceCard.tsx`.
- **Friendly URLs**: Add a `displayUrl` field to any service in `services.json` to show a custom DNS name.
- **Animations & Styles**: Tweak global styles in `src/index.css` and component styles as desired.

## 🧑‍💻 Tech Stack
- **React** (with hooks)
- **Vite** (for fast dev/build)
- **Tailwind CSS** (utility-first styling)
- **Lucide React** (icon set)
- **TypeScript**

---

For questions or further customization, edit the code or reach out to your development team.
