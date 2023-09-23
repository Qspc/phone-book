export interface AllNumberValues {
  number: string;
}

export interface AllFormValues {
  id: number;
  first_name?: string;
  last_name?: string;
  phones: AllNumberValues[];
  favorite: boolean;
}
