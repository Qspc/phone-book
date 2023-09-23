import { shallow } from 'zustand/shallow';
import FormContact from './formContact';
import { useIndexStore } from './types/dataUser';

export default function EditModal({ allNumber, setAllNumber, form, setForm, allContact, setAllContact, getData, handleClearForm }: any) {
  const [modalEdit, changemodalEdit] = useIndexStore((state: any) => [state.modalFavorite, state.changeModalEdit], shallow);
  if (!modalEdit) {
    return null;
  }

  return (
    <>
      <div className="fixed  z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="modal-container">
            <div className="w-[350px] bg-white rounded-lg overflow-hidden shadow-xl transform transition-all">
              <FormContact
                allNumber={allNumber}
                setAllNumber={setAllNumber}
                form={form}
                setForm={setForm}
                allContact={allContact}
                setAllContact={setAllContact}
                getData={getData}
                onClose={() => {
                  changemodalEdit();
                  handleClearForm();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
