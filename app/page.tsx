'use client';
import { useState, useEffect, useMemo } from 'react';
import Pagination from '@/components/pagination';
import UsePagination from '@/components/usePagination';
import DummyData from '@/helpers/dummyData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClose, faPenToSquare, faStar as solidStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons/faStar';
import ListContact from '@/components/ListCard';
import Header from '@/components/header';
interface formType {
  id: number;
  name: string;
  phone: string;
  favorite: boolean;
}

export default function Home() {
  const rawData = JSON.parse(localStorage.getItem('phoneBook'));
  const [allContact, setAllContact] = useState<formType[]>(rawData.data);
  const [form, setForm] = useState<formType>({
    id: 0,
    name: '',
    phone: '',
    favorite: false,
  });
  const [favorite, setFavorite] = useState(false);
  // const [filteredResult, setFilteredResult] = useState<formType[]>([]);
  const [searchResult, setSearchResult] = useState(''); //input yang dicari
  const [isChange, setIsChange] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [changeData, setChangeData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isNewContact, setIsNewContact] = useState<boolean>(false);

  const sorting = (data: any) => {
    return data.sort((a: any, b: any) => {
      if (a.favorite === b.favorite) {
        return 0;
      }
      if (a.favorite) {
        return -1; // Akan diurutkan di atas jika favorite true
      }
      return 1; // Akan diurutkan di bawah jika favorite false
    });
  };
  const filteredResult = useMemo<formType[]>(() => {
    if (searchResult) {
      const newData = allContact.filter((item) => Object.values(item.name).join('').toLowerCase().includes(searchResult.toLowerCase()));
      const sortingData = sorting(newData);
      setCurrentPage(1);
      return sortingData;
    } else {
      const newData = sorting(allContact);
      return newData;
    }
  }, [allContact, setAllContact, searchResult, setSearchResult]);

  useEffect(() => {
    const page = Math.ceil(filteredResult.length / PER_PAGE);
    setTotalPages(page);
    if (currentPage > page) setCurrentPage(page);
  }, [filteredResult]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleCreate = () => {
    const regexPattern = /^[A-Za-z0-9]+$/;
    const isConstantValid = regexPattern.test(form.name);
    const isNotUnique = allContact.some((item) => item.name === form.name);
    if (!isConstantValid || isNotUnique) return;

    const newData = { ...form, favorite: favorite, id: allContact.length + 1 };
    const storedData = JSON.parse(localStorage.getItem('phoneBook'));
    storedData.data.push(newData);
    setAllContact([...allContact, newData]);
    localStorage.setItem('phoneBook', JSON.stringify(storedData));

    setIsNewContact(false);
  };

  const handleFavorite = () => {
    const updatedData = allContact.map((item) => {
      if (item.id === index) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    });
    setAllContact(updatedData);
    setIsChange(false);
    setIndex(0);
  };

  const PER_PAGE = 10;
  const startIndex = (currentPage - 1) * PER_PAGE;
  const endIndex = startIndex + PER_PAGE;
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Menghasilkan daftar item untuk halaman ini
  const itemsToShow = filteredResult.slice(startIndex, endIndex);

  return (
    <div className="bg-blueTwo min-h-screen flex flex-col items-center justify-between">
      <main className="flex w-full md:w-[50%] flex-col gap-10 items-center justify-between py-12 ">
        {/* header */}
        <Header />
        {/* input search and form */}
        <section className="w-[80%] flex flex-col gap-[10px]">
          <input
            onChange={(e) => setSearchResult(e.target.value)}
            value={searchResult}
            className="w-full px-1 py-2 text-gray-700 border border-blue-100 rounded shadow appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="text"
            placeholder="nama kontak"
          />
          {isNewContact ? (
            <div className="relative bg-greyOne shadow-md rounded-md flex justify-center">
              <div className="flex flex-col w-[90%] pt-[30px] pb-[10px] gap-1 content-center item-middle ">
                <div className="w-full flex flex-col gap-1">
                  <label />
                  <input
                    onChange={(e) => handleChange(e)}
                    name="name"
                    value={form.name}
                    className="w-full px-3 py-2 text-gray-700 border border-blue-100 rounded shadow appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    type="text"
                    placeholder="name"
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label />
                  <input
                    onChange={(e) => handleChange(e)}
                    name="phone"
                    value={form.phone}
                    type="text"
                    placeholder="phone"
                    className="w-full px-3 py-2 text-gray-700 border border-blue-100 rounded shadow appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full flex items-center justify-start gap-6 pt-2 pb-4">
                  <div className="flex gap-2">
                    <input type="checkbox" onChange={() => setFavorite(!favorite)} value="favorite" name="favorite" id="favorite" />
                    <label>Favorite Contact</label>
                  </div>
                </div>
                <button type="submit" onClick={() => handleCreate()} className={'w-full px-5 py-2 text-white duration-300 ease-in-out bg-blueOne border-2 rounded font-700 hover:bg-blue-500 hover:border-blue-500 hover:scale-90'}>
                  Create
                </button>
              </div>
              <button onClick={() => setIsNewContact(!isNewContact)} type="button" className="absolute w-5 h-5 text-xs duration-300 ease-in-out rounded-full shadow-md top-2 right-2 bg-greyOne hover:scale-90">
                <FontAwesomeIcon icon={faClose} className="w-4 h-4 text-black" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsNewContact(!isNewContact)} className="w-full cursor-pointer py-[8px] px-[12px] text-center border-2 border-solid bg-greyOne hover:shadow-sm ease-in-out duration-300">
              + add contact
            </button>
          )}
        </section>
        {isChange && (
          <>
            <div className="bg-blue-200">
              nama : {changeData[0].name}
              <button onClick={() => handleFavorite()}>ubah ke {changeData[0].favorite ? 'regular' : 'Favorit'}</button>
            </div>
          </>
        )}
        {/* list contact */}
        <section className="w-[80%] bg-white shadow-md flex flex-col gap-6 rounded-md py-5 justify-center items-center">
          <ListContact allContact={allContact} setAllContact={setAllContact} setIsChange={setIsChange} setChangeData={setChangeData} setIndex={setIndex} itemsToShow={itemsToShow} />
          <Pagination handlePrev={handlePrev} handleNext={handleNext} />
        </section>
      </main>
    </div>
  );
}
