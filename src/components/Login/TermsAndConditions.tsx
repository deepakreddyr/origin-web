import { Typography } from '@mui/material'
import React from 'react'
import NextLink from 'next/link'
import { useDispatch } from 'react-redux'
import { setLoginDetails } from '@/store/slice/loginSlice'

const TermsAndConditions = () => {
    const dispatch = useDispatch()
    return (
        <Typography
            variant="body2"
            sx={{
                textAlign: 'center',
                color: '#919191',
                fontSize: '12px',
                paddingTop: '.75rem',
                fontWeight: '400',
                fontFamily: 'SofiaPro',
                a: {
                    fontSize: '12px',
                    textDecoration: 'underline',
                    fontWeight: '500',
                },
            }}
        >
            By clicking, I accept the{' '}
            <NextLink href="/terms-condition" passHref>
                <Typography
                    sx={{ fontFamily: 'SofiaPro', fontWeight: '600' }}
                    component="a"
                    onClick={() =>
                        dispatch(
                            setLoginDetails((prevDetails: any) => ({
                                ...prevDetails,
                                isLoginSidebarOpen: false,
                            }))
                        )
                    }
                >
                    Terms & Conditions
                </Typography>
            </NextLink>{' '}
            &{' '}
            <NextLink href="/privacy-policy" passHref>
                <Typography
                    component="a"
                    sx={{ fontFamily: 'SofiaPro', fontWeight: '600' }}
                    onClick={() =>
                        dispatch(
                            setLoginDetails((prevDetails: any) => ({
                                ...prevDetails,
                                isLoginSidebarOpen: false,
                            }))
                        )
                    }
                >
                    Privacy Policy
                </Typography>
            </NextLink>
        </Typography>
    )
}

export default TermsAndConditions
