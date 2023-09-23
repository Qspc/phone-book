import { create } from 'zustand';

export const useIndexStore = create((set) => ({
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
