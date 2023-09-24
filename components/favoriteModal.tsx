import { shallow } from 'zustand/shallow';
import { useIndexStore } from './types/dataUser';
import { AllFormValues } from '@/types/formSchema';
interface FavoriteModalSchema {
  onClose: () => void;
  data: AllFormValues[];
  onFavorite: (index: number) => void;
}

export default function FavoriteModal({ onClose, data, onFavorite }: FavoriteModalSchema) {
  const [index, modalFavorite] = useIndexStore((state) => [state.index, state.modalFavorite], shallow);
  const userData = data ? data.find((data) => data.id === index) : null;
  const handleFavorite = () => {
    onFavorite(index);
  };
  if (!modalFavorite) {
    return null;
  }

  return (
    <>
      <div className="fixed  z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="modal-container">
            <div className="w-[350px] bg-white rounded-lg overflow-hidden shadow-xl transform transition-all">
              <div className="bg-gray-100 px-4 py-6 border border-gray-200">
                <h2 className="text-[18px] font-semibold text-gray-800">
                  Change {userData ? userData.first_name + ' ' + userData.last_name : ''} contact to {userData ? (userData.favorite ? 'regular?' : 'favorite?') : ''}
                </h2>
              </div>
              <div className="flex gap-2 justify-end px-4 py-3">
                <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
                  Cancel
                </button>
                <button onClick={handleFavorite} className="bg-blueOne hover:bg-blue-500 text-black py-2 px-4 rounded mr-2">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
