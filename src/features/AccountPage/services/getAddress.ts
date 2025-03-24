import { header, request } from '@/utilities/request'
import type AddressAtom from '../types/AddressAtom'

export const getAddress = async (set: any) => {
    try {
        set((prevState: AddressAtom) => ({
            ...prevState,
            loading: true,
            success: false,
            error: false,
        }))

        const requestURL = `/api/v1/user/address`

        const response: any = await request(requestURL, {
            method: 'GET',
            headers: {
                Authorization: header(),
                Accept: 'application/json',
            },
        })

        set((prevState: AddressAtom) => ({
            ...prevState,
            loading: false,
            success: true,
            error: false,
            data: response.data,
        }))
    } catch (error) {
        set((prevState: AddressAtom) => ({
            ...prevState,
            loading: false,
            success: false,
            error: true,
        }))
    }
}
