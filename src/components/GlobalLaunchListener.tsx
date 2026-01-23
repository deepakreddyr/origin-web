import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAtom } from 'jotai';
import { request, header } from '@/utilities/request';
import { mainApiUrl } from '@/url';
import { handleLaunchResponse } from '@/utilities/launchHelper';
import { addressAtom } from '@/features/Address/context/atoms';
import { profileAtom } from '@/features/AccountPage/context/atoms';

const GlobalLaunchListener = () => {
    const dispatch = useDispatch();
    const [, setAddress] = useAtom(addressAtom);
    const [, setProfile] = useAtom(profileAtom);

    useEffect(() => {
        const token = localStorage.getItem('user_token');

        if (token) {
            const fetchLaunch = async () => {
                try {
                    const authHeader = header();
                    if (!authHeader) return; // Should match token check

                    const response: any = await request(mainApiUrl.launch, {
                        method: 'GET',
                        headers: { Authorization: authHeader }
                    });
                    handleLaunchResponse(response, dispatch, setAddress, setProfile, token, false);
                } catch (e) {
                    console.error("Launch API failed", e);
                }
            }
            fetchLaunch();
        }
    }, []); // Run once on mount

    return null;
}

export default GlobalLaunchListener;
