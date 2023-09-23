import { shallow } from 'zustand/shallow';
import { useIndexStore } from './types/dataUser';

export default function FavoriteModal({ onClose, data, onFavorite }: any) {
  const [index, modalFavorite] = useIndexStore((state: any) => [state.index, state.modalFavorite], shallow);
  const userData = data.find((data: any) => data.id === index);
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
                  Change {userData.first_name + ' ' + userData.last_name} contact to {userData.favorite ? 'regular?' : 'favorite?'}
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
