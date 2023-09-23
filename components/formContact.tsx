import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useState, ChangeEvent } from 'react';
import { useIndexStore } from './types/dataUser';
import { AllFormValues, AllNumberValues } from '@/types/formSchema';
interface FormContactSchema {
  form: AllFormValues;
  setForm: React.Dispatch<React.SetStateAction<AllFormValues>>;
  onClose: () => void;
  allContact: AllFormValues[];
  setAllContact: React.Dispatch<React.SetStateAction<AllFormValues[]>>;
  getData: AllFormValues[];
  allNumber: AllNumberValues[];
  setAllNumber: React.Dispatch<React.SetStateAction<AllNumberValues[]>>;
}

export default function FormContact({ form, setForm, onClose, allContact, setAllContact, getData, allNumber, setAllNumber }: FormContactSchema) {
  const [index, newContact] = useIndexStore((state: any) => [state.index, state.newContact]);
  const [favorite, setFavorite] = useState(false);
  const [number, setNumber] = useState<string>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    const isConstantValid = form.first_name ? regexPattern.test(form.first_name) : false;
    const isNotUnique = allContact.some((item) => item.first_name === form.first_name);
    if (!isConstantValid || isNotUnique) return;
    const newData = { ...form, phones: [...allNumber], favorite: favorite, id: maxIdObject.id + 1 };
    // console.log(newData);
    // return;
    getData.push(newData);
    setAllContact([...allContact, newData]);
    localStorage.setItem('phoneBook', JSON.stringify(getData));
    onClose();
  };
  const handleUpdate = () => {
    const updatedData = allContact.map((item) => {
      if (item.id === index) {
        return { ...item, first_name: form.first_name, last_name: form.last_name, phones: [...allNumber] };
      }
      return item;
    });
    // console.log(updatedData);
    // return;
    setAllContact(updatedData);
    localStorage.setItem('phoneBook', JSON.stringify(updatedData));
    onClose();
  };

  return (
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
        <span className="text-[10px]">click number for remove</span>
        <div className="w-full flex gap-1 items-center align-middle ">
          <button onClick={handleAddNumber} className={` ${newContact ? 'w-[40%]' : 'w-[30%] text-[10px]'} px-1 py-1 text-white duration-300 ease-in-out bg-blue-500 rounded font-700`}>
            add number
          </button>
          <div className="w-full flex gap-1 items-center align-middle">
            {allNumber &&
              allNumber.map((data, index: number) => (
                <span
                  onClick={() => {
                    const newNumber = [...allNumber];
                    newNumber.splice(index, 1);
                    setAllNumber(newNumber);
                  }}
                  className="text-[10px] font-light p-1 bg-blueTwo"
                  key={index}
                >
                  {data.number}
                </span>
              ))}
          </div>
        </div>
        {newContact && (
          <div className="w-full flex items-center justify-start gap-6 pt-2 pb-4">
            <div className="flex gap-2">
              <input type="checkbox" onChange={() => setFavorite(!favorite)} value="favorite" name="favorite" id="favorite" />
              <label>Favorite Contact</label>
            </div>
          </div>
        )}
        {newContact ? (
          <button type="submit" onClick={() => handleCreate()} className={'w-full px-5 py-2 text-white duration-300 ease-in-out bg-blueOne border-2 rounded font-700 hover:bg-blue-500 hover:border-blue-500 hover:scale-90'}>
            Create
          </button>
        ) : (
          <div className="flex gap-2 justify-end px-4 py-3">
            <button onClick={() => onClose()} className="bg-greyTwo hover:bg-gray-400 text-white py-2 px-4 rounded">
              Cancel
            </button>
            <button onClick={() => handleUpdate()} className="bg-blueOne hover:bg-blue-500 text-white py-2 px-4 rounded mr-2">
              Update
            </button>
          </div>
        )}
      </div>
      <button onClick={() => onClose()} type="button" className="absolute w-5 h-5 text-xs duration-300 ease-in-out rounded-full shadow-md top-2 right-2 bg-greyOne hover:scale-90">
        <FontAwesomeIcon icon={faClose} className="w-4 h-4 text-black" />
      </button>
    </div>
  );
}
