# 🎬 CineScore

CineScore is a movie review and rating web application built using **React** and the **OMDb API**.  
Users can search for movies, explore trending titles, rate them with stars, and manage favorites — all in a modern, responsive UI.

---

## 🚀 Features

- 🔍 **Smart Search:** Search movies, series, or episodes using live OMDb API.
- 🧭 **Filters:** Filter results by type, year, rating, or genre.
- ⭐ **Rate & Review:** Add your personal ratings and see reviewed movies on the home page.
- ❤️ **Favorites:** Save your favorite movies and view them anytime.
- 🔥 **Trending Explore:** Discover trending titles with pagination and filters.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS (via CDN)
- **Icons:** Font Awesome
- **API:** [OMDb API](https://www.omdbapi.com/)
- **State Storage:** LocalStorage (for favorites and ratings)

---

## 📦 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/cinescore.git
   ```
2. Navigate to the project folder:
   ```bash
   cd cinescore
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 API Configuration

CineScore uses the **OMDb API** for fetching movie data.

You can get a free API key from [OMDb API](https://www.omdbapi.com/apikey.aspx).


```bash
VITE_OMDB_API_KEY=your_api_key_here
```

---

## 💡 Usage

- Use the **search bar** to find any movie or series.
- Click a **movie card** to view detailed information.
- Click the ⭐ icon to **rate** a movie.
- Click the ❤️ icon to **add/remove** a favorite.
- Use the **Trending Explore** page to browse trending movies with pagination.
- Your reviews and favorites are stored locally and persist between sessions.

---

## 📱 Responsive Design

CineScore is fully responsive and works smoothly on:
- 💻 Desktop  
- 📱 Mobile  
- 📟 Tablets

