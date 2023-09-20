import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClose, faPenToSquare, faStar as solidStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons/faStar';

export default function ListContact({ allContact, setAllContact, setIsChange, setChangeData, setIndex, itemsToShow }: any) {
  const handleDelete = (id: number) => {
    const storedData = JSON.parse(localStorage.getItem('phoneBook'));
    storedData.data = storedData.data.filter((data: any) => data.id !== id);
    const newData = allContact.filter((data: any) => data.id !== id);
    setAllContact(newData);
    localStorage.setItem('phoneBook', JSON.stringify(storedData));
  };
  const handlePick = (id: number) => {
    setIsChange(true);
    const newData = allContact.filter((data: any) => data.id === id);
    setChangeData(newData);
    setIndex(id);
  };

  return (
    <div className="w-[90%] flex flex-col gap-2 justify-center items-center">
      {itemsToShow.map((data: any) => (
        <div className="w-full flex flex-row items-center justify-between px-4 py-2 border border-solid rounded-md shadow-md" key={data.id}>
          <div>
            <h1 className="font-bold text-[16px] text-bluOne">{data.name} </h1>
            <h3 className="text-[12px] text-greyTwo"> {data.phone} </h3>
          </div>
          <div className="flex gap-2 text-greyTwo">
            <FontAwesomeIcon onClick={() => handlePick(data.id)} className="hover:text-greyOne w-4 h-4" icon={data.favorite ? solidStar : regularStar} />
            <FontAwesomeIcon onClick={() => handleDelete(data.id)} className="hover:text-greyOne w-3 h-3" icon={faTrash} />
            <FontAwesomeIcon className="hover:text-greyOne w-3 h-3" icon={faPenToSquare} />
          </div>
        </div>
      ))}
    </div>
  );
}
