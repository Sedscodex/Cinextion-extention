document.addEventListener('DOMContentLoaded', () => {
    const movieContainer = document.getElementById('movie-container');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const refreshBtn = document.getElementById('refreshBtn');

    // IMPORTANT: You need to get your own API key from TMDb.
    // 1. Go to https://www.themoviedb.org/signup
    // 2. Sign up and verify your email.
    // 3. Go to your account settings -> API -> Create and get your key.
    const apiKey = 'YOUR_TMDB_API_KEY_HERE'; // <-- PASTE YOUR API KEY HERE

    const fetchMovies = async () => {
        // Clear previous content and show loader
        movieContainer.innerHTML = '';
        loader.style.display = 'flex';
        movieContainer.appendChild(loader);
        errorMessage.classList.add('hidden');

        // Check if the API key has been replaced
        if (apiKey === 'YOUR_TMDB_API_KEY_HERE' || !apiKey) {
            showError('Please add your TMDb API key in popup.js');
            return;
        }

        // Fetch a different page of popular movies each time for variety
        const randomPage = Math.floor(Math.random() * 50) + 1;
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${randomPage}&include_adult=false`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error fetching movies:', error);
            showError('Could not fetch movie suggestions. Please check your connection or API key.');
        } finally {
            loader.style.display = 'none';
        }
    };

    const displayMovies = (movies) => {
        movieContainer.innerHTML = ''; // Clear loader
        if (!movies || movies.length === 0) {
            showError('No movies found.');
            return;
        }

        movies.forEach(movie => {
            if (!movie.poster_path) return; // Skip movies without a poster

            const movieCard = document.createElement('div');
            movieCard.className = 'flex bg-gray-700 rounded-lg shadow-lg overflow-hidden';

            const posterUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

            movieCard.innerHTML = `
                <img src="${posterUrl}" alt="${movie.title} Poster" class="w-24 h-36 object-cover">
                <div class="p-3 flex flex-col justify-between">
                    <div>
                        <h2 class="font-bold text-md">${movie.title}</h2>
                        <p class="text-xs text-gray-400 mt-1">${movie.overview.substring(0, 80)}...</p>
                    </div>
                    <div class="flex items-center mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-yellow-400 mr-1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <span class="font-semibold text-sm">${movie.vote_average.toFixed(1)}</span>
                        <span class="text-gray-400 text-xs ml-2">(${movie.release_date.split('-')[0]})</span>
                    </div>
                </div>
            `;
            movieContainer.appendChild(movieCard);
        });
    };
    
    const showError = (message) => {
        loader.style.display = 'none';
        movieContainer.innerHTML = '';
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        movieContainer.appendChild(errorMessage);
    }

    // Event Listeners
    refreshBtn.addEventListener('click', fetchMovies);

    // Initial fetch
    fetchMovies();
});