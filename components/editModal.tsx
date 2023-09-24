import { shallow } from 'zustand/shallow';
import FormContact from './formContact';
import { useIndexStore } from './types/dataUser';
import { AllFormValues, AllNumberValues } from '@/types/formSchema';

interface EditModalSchema {
  allNumber: AllNumberValues[];
  setAllNumber: React.Dispatch<React.SetStateAction<AllNumberValues[]>>;
  form: AllFormValues;
  setForm: React.Dispatch<React.SetStateAction<AllFormValues>>;
  allContact: AllFormValues[];
  setAllContact: React.Dispatch<React.SetStateAction<AllFormValues[]>>;
  handleClearForm: () => void;
}

export default function EditModal({ allNumber, setAllNumber, form, setForm, allContact, setAllContact, handleClearForm }: EditModalSchema) {
  const [modalEdit, changeModalEdit] = useIndexStore((state) => [state.modalEdit, state.changeModalEdit], shallow);
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
                onClose={() => {
                  changeModalEdit(false);
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
