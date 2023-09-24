import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClose, faPenToSquare, faStar as solidStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons/faStar';
import { useIndexStore } from './types/dataUser';
import { shallow } from 'zustand/shallow';
import { AllFormValues, AllNumberValues } from '@/types/formSchema';
interface ListContactSchema {
  itemsToShow: AllFormValues[];
  onModalOpen: () => void;
  onModalFavorite: () => void;
  onModalEdit: () => void;
  allContact: AllFormValues[];
  setForm: React.Dispatch<React.SetStateAction<AllFormValues>>;
  setAllNumber: React.Dispatch<React.SetStateAction<AllNumberValues[]>>;
}

export default function ListContact({ itemsToShow, onModalOpen, onModalFavorite, onModalEdit, allContact, setForm, setAllNumber }: ListContactSchema) {
  const changeIndex = useIndexStore((state) => state.changeIndex, shallow);
  const handlePick = (id: number, change: string) => {
    changeIndex(id);
    change === 'favorite' ? onModalFavorite() : '';
    change === 'delete' ? onModalOpen() : '';
    if (change === 'edit') {
      const newData = allContact.find((data) => data.id === id);
      if (newData) {
        setAllNumber([...newData.phones]);
        setForm(newData);
        onModalEdit();
      }
    }
  };

  return (
    <div className="w-[90%] flex flex-col gap-2 justify-center items-center">
      {itemsToShow.map((data) => (
        <div className="w-full flex flex-row items-center justify-between px-4 py-2 border border-solid rounded-md shadow-md" key={data.id}>
          <div onClick={() => handlePick(data.id, 'favorite')}>
            <h1 className="font-bold text-[16px] text-bluOne">
              {data.first_name} {data.last_name + ' '}
              {data.favorite && <FontAwesomeIcon className="hover:text-greyOne w-4 h-4" icon={regularStar} />}
            </h1>
            <h3 className="text-[12px] text-greyTwo">
              {data.phones.map((res, index: number) => (
                <span key={index}>
                  {res.number}
                  {index !== data.phones.length - 1 ? ', ' : ''}
                </span>
              ))}
            </h3>
          </div>
          <div className="flex gap-2 text-greyTwo">
            <FontAwesomeIcon onClick={() => handlePick(data.id, 'delete')} className="hover:text-greyOne w-3 h-3" icon={faTrash} />
            <FontAwesomeIcon onClick={() => handlePick(data.id, 'edit')} className="hover:text-greyOne w-3 h-3" icon={faPenToSquare} />
          </div>
        </div>
      ))}
    </div>
  );
}
