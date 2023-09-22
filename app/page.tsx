'use client';
import { useState, useEffect, useMemo } from 'react';
import Pagination from '@/components/pagination';
import UsePagination from '@/components/usePagination';
import DummyData from '@/helpers/dummyData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClose, faPenToSquare, faStar as solidStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons/faStar';
import ListContact from '@/components/listCard';
import { ApolloClient } from '@apollo/client';
import client from '@/lib/apolloClient';
import Header from '@/components/header';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import DeletedModal from '@/components/modal';
import FavoriteModal from '@/components/favoriteModal';
interface formType {
  id: number;
  first_name: string;
  last_name: string;
  phones: string[];
  favorite: boolean;
}
const USER_DATA = gql`
  query GetContactList($distinct_on: [contact_select_column!], $limit: Int, $offset: Int, $order_by: [contact_order_by!], $where: contact_bool_exp) {
    contact(distinct_on: $distinct_on, limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

export default function Home() {
  // const { error, data } = useQuery(USER_DATA, { client });
  // if (data) console.log(data);
  const getData = JSON.parse(localStorage.getItem('phoneBook') || '');
  const [allContact, setAllContact] = useState<formType[]>(getData);
  const [form, setForm] = useState<formType>({
    id: 0,
    first_name: '',
    last_name: '',
    phones: [],
    favorite: false,
  });
  const [favorite, setFavorite] = useState(false);
  const [searchResult, setSearchResult] = useState(''); // input yang dicari
  const [index, setIndex] = useState(0); // for delete and change favorite
  const [currentPage, setCurrentPage] = useState(1); // page
  const [totalPages, setTotalPages] = useState(0); // total page
  const [isNewContact, setIsNewContact] = useState<boolean>(false);
  const [allNumber, setAllNumber] = useState<any[]>([]);
  const [number, setNumber] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFavorite, setIsModalFavorite] = useState(false);

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
      const newData = allContact.filter((item) => Object.values(item.first_name).join('').toLowerCase().includes(searchResult.toLowerCase()));
      const sortingData = sorting(newData);
      setCurrentPage(1);
      return sortingData;
    } else {
      const newData = sorting(allContact);
      return newData;
    }
  }, [allContact, setAllContact, searchResult, setSearchResult]);
  useEffect(() => {
    // const rawData = DummyData();
    // const jsonData = JSON.stringify(rawData);
    // localStorage.setItem('phoneBook', jsonData);
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
  const handleAddNumber = () => {
    if (!number) return;
    const newData = { number: number };
    setAllNumber([...allNumber, newData]);
    setNumber('');
  };
  const handleCreate = () => {
    const regexPattern = /^[A-Za-z0-9]+$/;
    const maxIdObject = allContact.reduce((max, current) => (current.id > max.id ? current : max), allContact[0]);
    const isConstantValid = regexPattern.test(form.first_name);
    const isNotUnique = allContact.some((item) => item.first_name === form.first_name);
    if (!isConstantValid || isNotUnique) return;
    const newData = { ...form, phones: [...allNumber], favorite: favorite, id: maxIdObject.id + 1 };
    // const storedData = JSON.parse(localStorage.getItem('phoneBook'));
    getData.push(newData);
    setAllContact([...allContact, newData]);
    localStorage.setItem('phoneBook', JSON.stringify(getData));

    setIsNewContact(false);
  };
  const handleDelete = (id: number) => {
    // console.log(id);
    // return;
    const newData = allContact.filter((data: any) => data.id !== id);
    setAllContact(newData);
    localStorage.setItem('phoneBook', JSON.stringify(newData));
    setIsModalOpen(false);
  };
  const handleFavorite = (id: number) => {
    const updatedData = allContact.map((item) => {
      if (item.id === id) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    });
    setAllContact(updatedData);
    setIsModalFavorite(false);
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
                <div className="w-full flex gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <input
                      onChange={(e) => handleChange(e)}
                      name="first_name"
                      value={form.first_name}
                      className="w-full px-3 py-2 text-gray-700 border border-blue-100 rounded shadow appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      type="text"
                      placeholder="first name"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <input
                      onChange={(e) => handleChange(e)}
                      name="last_name"
                      value={form.last_name}
                      className="w-full px-3 py-2 text-gray-700 border border-blue-100 rounded shadow appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      type="text"
                      placeholder="last name"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-1">
                  <input
                    onChange={(e) => setNumber(e.target.value)}
                    name="phone"
                    value={number}
                    type="text"
                    placeholder="phone"
                    className="w-full px-3 py-2 text-gray-700 border border-blue-100 rounded shadow appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full flex gap-1 items-center align-middle ">
                  <button onClick={handleAddNumber} className="w-[40%] px-1 py-1 text-white duration-300 ease-in-out bg-blue-500 rounded font-700">
                    add number
                  </button>
                  <div className="w-full flex gap-1 items-center align-middle">
                    {allNumber &&
                      allNumber.map((data, index) => (
                        <span className="text-[10px] font-light p-1 bg-blueTwo" key={index}>
                          {data.number}
                        </span>
                      ))}
                  </div>
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
        {/* list contact */}
        <section className="w-[80%] bg-white shadow-md flex flex-col gap-6 rounded-md py-5 justify-center items-center">
          <ListContact setIndex={setIndex} itemsToShow={itemsToShow} onModalOpen={() => setIsModalOpen(true)} onModalFavorite={() => setIsModalFavorite(true)} />
          <Pagination handlePrev={handlePrev} handleNext={handleNext} />
        </section>
        {/* modal */}
        <DeletedModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} id={index} onDeleted={handleDelete} />
        <FavoriteModal onFavorite={handleFavorite} onClose={() => setIsModalFavorite(false)} isModalFavorite={isModalFavorite} data={allContact} id={index} />
      </main>
    </div>
  );
}
