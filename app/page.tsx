'use client';
import { useState, useEffect, useMemo } from 'react';
import Pagination from '@/components/pagination';
import DummyData from '@/helpers/dummyData';
import ListContact from '@/components/listCard';
import { ApolloClient } from '@apollo/client';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';
import Header from '@/components/header';
import { gql } from '@apollo/client';
import DeletedModal from '@/components/modal';
import FavoriteModal from '@/components/favoriteModal';
import FormContact from '@/components/formContact';
import EditModal from '@/components/editModal';
import SearchInput from '@/components/searchInput';
import { useIndexStore } from '@/components/types/dataUser';
import { shallow } from 'zustand/shallow';
import { AllNumberValues, AllFormValues } from '@/types/formSchema';

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
interface indexStoreSchema {
  index: number;
  changeIndex: (id: number) => void;
  removeIndex: () => void;
  modalDelete: boolean;
  modalEdit: boolean;
  modalFavorite: boolean;
  changeModalDelete: (status: boolean) => void;
  changeModalEdit: (status: boolean) => void;
  changeModalFavorite: (status: boolean) => void;
  newContact: boolean;
  changeNewContact: (status: boolean) => void;
}

export default function Home() {
  // const { error, data } = useQuery(USER_DATA, { client });
  // if (data) console.log(data);
  const [changeModalDelete, changeModalFavorite, changeModalEdit, newContact, changeNewContact] = useIndexStore(
    (state) => [state.changeModalDelete, state.changeModalFavorite, state.changeModalEdit, state.newContact, state.changeNewContact],
    shallow
  );
  // const getData = JSON.parse(localStorage.getItem('phoneBook') || '');
  const [allContact, setAllContact] = useState<AllFormValues[]>([]);
  const [form, setForm] = useState<AllFormValues>({
    id: 0,
    first_name: '',
    last_name: '',
    phones: [],
    favorite: false,
  });
  const [searchResult, setSearchResult] = useState(''); // input yang dicari
  const [allNumber, setAllNumber] = useState<AllNumberValues[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // page
  const [totalPages, setTotalPages] = useState(1); // total page

  const sorting = (data: AllFormValues[]) => {
    return data.sort((a: AllFormValues, b: AllFormValues) => {
      if (a.favorite === b.favorite) {
        return 0;
      }
      if (a.favorite) {
        return -1;
      }
      return 1;
    });
  };
  useEffect(() => {
    // const rawData = DummyData();
    // const jsonData = JSON.stringify(rawData);
    // localStorage.setItem('phoneBook', jsonData);
    // localStorage.clear();
    const storedData = localStorage.getItem('phoneBook');
    const getData = storedData ? JSON.parse(storedData) : [];
    // const getData = JSON.parse(localStorage.getItem('phoneBook') || '');
    setAllContact(getData);
  }, []);
  const filteredResult = useMemo<AllFormValues[]>(() => {
    if (searchResult) {
      const newData = allContact.filter((item: AllFormValues) => {
        const fullName = (item.first_name || '') + (item.last_name || '');
        return fullName.toLowerCase().includes(searchResult.toLowerCase());
      });
      const sortingData = sorting(newData);
      setCurrentPage(1);
      return sortingData;
    } else {
      const newData = sorting(allContact);
      // console.log('masuk');
      return newData;
    }
  }, [allContact, setAllContact, searchResult, setSearchResult]);

  const handleDelete = (id: number) => {
    const newData = allContact.filter((data: AllFormValues) => data.id !== id);
    setAllContact(newData);
    localStorage.setItem('phoneBook', JSON.stringify(newData));
    changeModalDelete(false);
  };
  const handleFavorite = (id: number) => {
    const updatedData = allContact.map((item) => {
      if (item.id === id) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    });
    setAllContact(updatedData);
    changeModalFavorite(false);
  };
  const handleClearForm = () => {
    setForm({
      ...form,
      first_name: '',
      last_name: '',
    });
    allNumber.splice(0, allNumber.length);
    // console.log(allContact);
  };

  const PER_PAGE = 10;
  const startIndex = (currentPage - 1) * PER_PAGE;
  const endIndex = startIndex + PER_PAGE;
  const page = Math.ceil(filteredResult.length / PER_PAGE);
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < page) {
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
          {/* search */}
          <SearchInput searchResult={searchResult} setSearchResult={setSearchResult} />
          {/* form */}
          {newContact ? (
            <FormContact
              form={form}
              setForm={setForm}
              onClose={() => {
                changeNewContact(false);
                handleClearForm();
              }}
              allContact={allContact}
              setAllContact={setAllContact}
              allNumber={allNumber}
              setAllNumber={setAllNumber}
            />
          ) : (
            <button onClick={() => changeNewContact(true)} className="w-full cursor-pointer py-[8px] px-[12px] text-center border-2 border-solid bg-greyOne hover:shadow-sm ease-in-out duration-300">
              + add contact
            </button>
          )}
        </section>
        {/* list contact and pagination */}
        <section className="w-[80%] bg-white shadow-md flex flex-col gap-6 rounded-md py-5 justify-center items-center">
          <ListContact
            itemsToShow={itemsToShow}
            onModalOpen={() => changeModalDelete(true)}
            onModalEdit={() => changeModalEdit(true)}
            onModalFavorite={() => changeModalFavorite(true)}
            setForm={setForm}
            allContact={allContact}
            setAllNumber={setAllNumber}
          />
          <Pagination handlePrev={handlePrev} handleNext={handleNext} />
        </section>
        {/* modal */}
        <DeletedModal onClose={() => changeModalDelete(false)} onDeleted={handleDelete} />
        <FavoriteModal onClose={() => changeModalFavorite(false)} onFavorite={handleFavorite} data={allContact} />
        <EditModal allNumber={allNumber} setAllNumber={setAllNumber} form={form} setForm={setForm} allContact={allContact} setAllContact={setAllContact} handleClearForm={handleClearForm} />
      </main>
    </div>
  );
}
