import { create } from 'zustand';

export const useIndexStore = create((set) => ({
  index: 0,
  changeIndex: (id: number) => {
    set({ index: id });
  },
  removeIndex: () => set({ bears: 0 }),
  modalDelete: false,
  modalEdit: false,
  modalFavorite: false,
  changeModalDelete: () => set((state: any) => ({ modalDelete: !state.modalDelete })),
  changeModalEdit: () => set((state: any) => ({ modalEdit: !state.modalEdit })),
  changeModalFavorite: () => set((state: any) => ({ modalFavorite: !state.modalFavorite })),
}));
