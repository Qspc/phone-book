export default function Pagination({ handlePrev, handleNext }: any) {
  return (
    <div className="flex gap-4">
      <button
        className="cursor-pointer text-center px-6 py-2 border-solid text-white font-bold hover:shadow-sm ease-in-out duration-300  font-700 hover:bg-blue-500 bg-blueOne border-2 rounded font-700 hover:border-blue-500 hover:scale-90"
        onClick={handlePrev}
      >
        Prev
      </button>
      <button
        className="cursor-pointer text-center px-6 py-2 border-solid text-white font-bold hover:shadow-sm ease-in-out duration-300  font-700 hover:bg-blue-500 bg-blueOne border-2 rounded font-700 hover:border-blue-500 hover:scale-90"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
