import { useState, useEffect } from 'react';
import './App.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'; // Import icons


// Fetch Pokémon list
const fetchPokemonList = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100'); // Limit to 100 Pokémon
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

// Fetch Pokémon details
const fetchPokemonDetails = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadPokemonList = async () => {
      try {
        const data = await fetchPokemonList();
        const sortedList = data.results.sort((a, b) => a.name.localeCompare(b.name));
        setPokemonList(sortedList);
        setFilteredList(sortedList);

        // Set default Pokémon to Charizard
        const charizard = sortedList.find(pokemon => pokemon.name === 'charizard');
        if (charizard) {
          const charizardDetails = await fetchPokemonDetails(charizard.url);
          setSelectedPokemon(charizardDetails);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadPokemonList();
  }, []);

  useEffect(() => {
    // Filter the list based on the search term
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchTerm, pokemonList]);

  const handlePokemonClick = async (url) => {
    setLoading(true);
    try {
      const data = await fetchPokemonDetails(url);
      setSelectedPokemon(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">popokémon</h1>
      <h1 className="text-lg font-bold text-center mb-4">
        Public API: <a href="https://pokeapi.co/">https://pokeapi.co/</a>
      </h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="flex flex-row">
        {/* Pokémon List */}
        <div className="pokemon-list-container lg:w-[150px] w-full backdrop-blur max-h-[450px] overflow-y-scroll">
          {filteredList.map((pokemon) => (
            <div
              key={pokemon.name}
              className="pokemon-item p-4 cursor-pointer hover:bg-gray-200"
              onClick={() => handlePokemonClick(pokemon.url)}
            >
              <h2 className="text-xl font-semibold text-center">{pokemon.name}</h2>
            </div>
          ))}
        </div>

        {/* Pokémon Detail */}
        <div className="pokemon-detail-container w-2/3 pl-4">
          {selectedPokemon && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2 text-center">{selectedPokemon.name}</h2>
              <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} className="mx-auto mb-4" />
              <div className="mb-4 text-center">
                <p className="text-lg">Height: {selectedPokemon.height / 10} m</p>
                <p className="text-lg">Weight: {selectedPokemon.weight / 10} kg</p>
                <p className="text-lg">Base Experience: {selectedPokemon.base_experience}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Abilities</h3>
                <ul className="list-disc pl-5">
                  {selectedPokemon.abilities.map((ability, index) => (
                    <li key={index} className="text-lg list-none">
                      {ability.ability.name} {ability.is_hidden && <span>(Hidden)</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedPokemon.cries && (
                <div className="text-center mt-4">
                  <audio controls>
                    <source src={selectedPokemon.cries.latest} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <footer className="footer mt-8 text-center py-4 bg-gray-100 border-t border-gray-300">
        <div className="flex justify-center gap-4">
          <a href="https://github.com/ifrzky" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
            <FaGithub size={24} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
