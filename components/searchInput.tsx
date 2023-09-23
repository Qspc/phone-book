export default function SearchInput({ searchResult, setSearchResult }: any) {
  return (
    <>
      <input
        onChange={(e) => setSearchResult(e.target.value)}
        value={searchResult}
        className="w-full px-1 py-2 text-gray-700 border border-blue-100 rounded shadow appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        type="text"
        placeholder="nama kontak"
      />
    </>
  );
}
