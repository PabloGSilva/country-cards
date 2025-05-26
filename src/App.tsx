import { useEffect, useState } from "react";

type Country = {
  name: {
    common: string;
  };
  cca2: string;
  capital?: string[];
  region: string;
  population: number;
};

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/independent?status=true")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Couldn't get countries.", err);
        setError(`${err.stack}`)
        setLoading(false)
      });
  }, []);

  if (loading) {
    return <div
      className="min-h-screen bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('loading.gif')" }}
    />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="font-serif md:max-w-3xl sm:max-w-md bg-white p-6 rounded-xl shadow  text-red-600 font-semibold text-sm">
          <p className="font-serif text-2xl text-gray-600 pb-2">Seems like there was an error loading the page :/</p>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-5xl font-serif font-bold text-center mb-6">Country Cards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 px-4 sm:px-6 md:px-10 lg:px-20 2xl:px-40">
        {countries.map((country) => (
          <div key={country.cca2} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <img
              src={`https://flagsapi.com/${country.cca2}/flat/64.png`}
              alt={`Bandeira de ${country.name.common}`}
              className="mb-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
            <h2 className="font-serif text-lg font-semibold text-center">{country.name.common}</h2>
            <p className="font-serif text-sm text-gray-600">🌆 {country.capital?.[0] || "No capital"}</p>
            <p className="font-serif text-sm text-gray-600">🌐 {country.region}</p>
            <p className="font-serif text-sm text-gray-600">👥 {country.population.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
