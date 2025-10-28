
import { SCRIPT_BASE_URL } from '../constants';
import { MasterItem, RequestItem, SubmittedRequestItem, User } from '../types';

async function postData<T,>(action: string, data: object): Promise<T> {
    const response = await fetch(`${SCRIPT_BASE_URL}?action=${action}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "text/plain;charset=utf-8", // Required for Google Apps Script
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const api = {
    login: (storeCode: string, password: string):Promise<{ status: string; message: string } & User> => {
        return postData("login", { storeCode, password });
    },
    // FIX: Add explicit return type to ensure `response.message` is correctly typed in consumers.
    register: (storeCode: string, storeName: string, password: string, email: string): Promise<{ message: string }> => {
        return postData<{ message: string }>("register", { storeCode, storeName, password, email });
    },
    getMasterData: async (): Promise<{ items: MasterItem[] }> => {
        const response = await fetch(SCRIPT_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    // FIX: Changed parameter type from Omit<RequestItem, 'name'>[] to RequestItem[] to ensure the item name is available for the payload.
    submitRequest: (store: string, email: string, items: RequestItem[]): Promise<{ message: string }> => {
         const payload = {
            store,
            email,
            items: items.map(i => ({
                procode: i.code,
                prodesc: i.name, // This now works as `i` is of type RequestItem which includes `name`.
                qty: i.qty,
                reason: i.reason
            }))
        };
        // The submit action doesn't use an action parameter in the original script
        return fetch(SCRIPT_BASE_URL, { 
            method: "POST", 
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        }).then(res => res.json());
    },
    getRequests: (): Promise<{ data: SubmittedRequestItem[] }> => {
        // FIX: Add explicit generic type to postData call for type safety.
        return postData<{ data: SubmittedRequestItem[] }>("getRequests", {});
    },
    updateStatus: (row: number, status: string): Promise<any> => {
        // FIX: Add explicit generic type to postData call for type safety.
        return postData<any>("updateStatus", { row, status });
    }
};
