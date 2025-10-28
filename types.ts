
export interface User {
  role: 'user' | 'admin';
  storeCode: string;
  storeName: string;
  email: string;
}

export interface MasterItem {
  code: string;
  desc: string;
}

export interface RequestItem {
  code: string;
  name: string;
  qty: string;
  reason: string;
}

export interface SubmittedRequestItem {
  id: string;
  date: string;
  store: string;
  procode: string;
  prodesc: string;
  qty: number;
  reason: string;
  status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected';
  email: string;
  row: number;
}

export interface GroupedRequest {
    id: string;
    date: string;
    store: string;
    email: string;
    items: SubmittedRequestItem[];
    status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected';
}
