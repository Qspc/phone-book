'use client';
import { useState, useEffect, useMemo } from 'react';
import Pagination from '@/components/pagination';
import UsePagination from '@/components/usePagination';
import DummyData from '@/helpers/dummyData';

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
    const newData = { ...form, favorite: favorite, id: allContact.length + 1 };
    const storedData = JSON.parse(localStorage.getItem('phoneBook'));
    storedData.data.push(newData);
    setAllContact([...allContact, newData]);
    localStorage.setItem('phoneBook', JSON.stringify(storedData));
  };
  const handleDelete = (id: number) => {
    const storedData = JSON.parse(localStorage.getItem('phoneBook'));
    storedData.data = storedData.data.filter((data: any) => data.id !== id);
    const newData = allContact.filter((data) => data.id !== id);
    setAllContact(newData);
    localStorage.setItem('phoneBook', JSON.stringify(storedData));
  };
  const handlePick = (id: number) => {
    setIsChange(true);
    const newData = allContact.filter((data) => data.id === id);
    setChangeData(newData);
    setIndex(id);
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

  const PER_PAGE = 5;
  // Menghitung indeks item yang ditampilkan pada halaman ini
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Phone Booth
      <div>
        <div>
          <input onChange={(e) => setSearchResult(e.target.value)} value={searchResult} type="text" />
          <button>add contact</button>
        </div>
        <div>
          <input onChange={(e) => handleChange(e)} name="name" value={form.name} type="text" placeholder="name" />
          <input onChange={(e) => handleChange(e)} name="phone" value={form.phone} type="text" placeholder="phone" />
          <input type="checkbox" onChange={() => setFavorite(!favorite)} value="favorite" name="favorite" id="favorite" />
          <button onClick={() => handleCreate()}>Create</button>
        </div>
      </div>
      {isChange && (
        <>
          <div className="bg-blue-200">
            nama : {changeData[0].name}
            <button onClick={() => handleFavorite()}>ubah ke {changeData[0].favorite ? 'regular' : 'Favorit'}</button>
          </div>
        </>
      )}
      <div>
        {itemsToShow.map((data) => (
          <div className="flex" key={data.id}>
            <div className="flex" onClick={() => handlePick(data.id)}>
              <div>{data.id} </div>
              <div>{data.name} </div>
              <div> {data.phone} </div>
              <div> {data.favorite ? 'favorite' : 'regular'} </div>
            </div>
            <button onClick={() => handleDelete(data.id)} className="mx-2">
              delete
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={handlePrev}>prev</button>
        <button onClick={handleNext}>next</button>
      </div>
    </main>
  );
}
