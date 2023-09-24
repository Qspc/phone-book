import { create } from 'zustand';
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
export const useIndexStore = create<indexStoreSchema>((set) => ({
  index: 0,
  changeIndex: (id: number) => {
    set({ index: id });
  },
  removeIndex: () => set({ index: 0 }),
  modalDelete: false,
  modalEdit: false,
  modalFavorite: false,
  changeModalDelete: (status: boolean) => {
    set({ modalDelete: status });
  },
  changeModalEdit: (status: boolean) => {
    set({ modalEdit: status });
  },
  changeModalFavorite: (status: boolean) => {
    set({ modalFavorite: status });
  },
  newContact: false,
  changeNewContact: (status: boolean) => {
    set({ newContact: status });
  },
}));
