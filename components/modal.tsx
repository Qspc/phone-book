import { useIndexStore } from './types/dataUser';
import { shallow } from 'zustand/shallow';
interface DeletedModalSchema {
  onClose: () => void;
  onDeleted: (index: number) => void;
}
export default function DeletedModal({ onClose, onDeleted }: DeletedModalSchema) {
  const [index, modalDelete] = useIndexStore((state: any) => [state.index, state.modalDelete, state.changeModalDelete], shallow);
  const handleDelete = () => {
    onDeleted(index);
  };
  if (!modalDelete) {
    return null;
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className=" flex items-center justify-center min-h-screen">
        <div className="modal-container">
          <div className="w-full bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-gray-100 px-4 py-6 border border-gray-200">
              <h2 className="text-[18px] font-semibold text-gray-800">are you sure you want deleted? </h2>
            </div>
            <div className="flex gap-2 justify-end px-4 py-3">
              <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
                Batal
              </button>
              <button onClick={() => handleDelete()} className="bg-red-500 hover:bg-red-600 text-black py-2 px-4 rounded mr-2">
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
