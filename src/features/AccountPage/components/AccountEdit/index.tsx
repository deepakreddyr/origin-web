import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Select,
    Typography,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import { useAtom } from 'jotai'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import AccountSidebarLayout from '@/components/AccountLayout/AccountSidebarLayout'
import Edit from '../../assets/edit.svg'
import {
    activeAccountsPageAtom,
    isAccountIsOpen,
    profileAtom,
} from '../../context/atoms'
import ActiveSidebar from '../../enums/ActiveSidebar'
import { setProfile } from '../../services/editProfile'
import SelectDropdown from '@/components/Login/components/SignUp/Select'
import PhoneNumbers from './PhoneNumbers'

const genderList = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' },
    { id: 4, name: "Don't wish to specify" },
]

const AccountEdit = () => {
    const [isOpen, setIsOpen] = useAtom(isAccountIsOpen)
    const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom)
    const [profile, setProfileAtom] = useAtom(profileAtom)
    const [showDropdown, setShowDropdown] = useState(false)
    const [variable, setVariables] = useState({
        name: '',
        phone: '',
        email: '',
        gender: '',
    })

    const [editField, setEditField] = useState<string | null>(null)
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        email: '',
    })

    useEffect(() => {
        setVariables({
            name: profile.data?.name || '',
            phone: profile.data?.phone || '',
            email: profile.data?.email || '',
            gender: profile.data?.profile?.gender || '',
        })
    }, [profile])

    const validate = (key: 'email' | 'name' | 'phone' | 'gender') => {
        let isValid = true
        const newErrors = { name: '', phone: '', email: '' }
        switch (key) {
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!variable.email.trim()) {
                    newErrors.email = 'Email is required'
                    isValid = false
                } else if (!emailRegex.test(variable.email)) {
                    newErrors.email = 'Email is invalid'
                    isValid = false
                }
                break
            }

            case 'name': {
                if (!variable.name.trim()) {
                    newErrors.name = 'Name is required'
                    isValid = false
                }
                break
            }

            case 'phone': {
                const phoneRegex = /^\+?[0-9]{10,13}$/

                if (!variable.phone.trim()) {
                    newErrors.phone = 'Phone number is required'
                    isValid = false
                } else if (!phoneRegex.test(variable.phone)) {
                    newErrors.phone = 'Phone number is invalid'
                    isValid = false
                }
                break
            }

            default:
                break
        }

        setErrors(newErrors)
        return isValid
    }

    const resetErrors = () => {
        setErrors({ name: '', phone: '', email: '' })
    }

    const onSubmit =
        (key: 'email' | 'name' | 'phone' | 'gender') => async () => {
            if (!validate(key)) {
                return
            }
            resetErrors()
            try {
                const response: any = await setProfile(variable)
                setProfileAtom((prevState) => ({
                    ...prevState,
                    data: response.data,
                }))
                setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN)
                setEditField(null)
            } catch (e) {
                // Handle error
            }
        }

    const onChangeVariable = (key: string) => (event: any) => {
        const { value } = event.target

        if (['phone', 'name', 'email', 'gender'].includes(key)) {
            setVariables((prevState) => ({ ...prevState, [key]: value }))
            resetErrors()
        }
    }

    const handleEditClick = (field: string) => {
        setEditField(field)
    }

    const handleCancelClick = () => {
        setEditField(null)
        resetErrors()
    }

    const sxStyle = {
        cancelButtonStyle: {
            backgroundColor: 'none',
            border: '2px solid #231F20',
            color: '#231F20',
            padding: '0.6rem 4.5rem',
            borderRadius: '25px',
            fontFamily: 'SofiaPro',
            textTransform: 'capitalize',
        },
        updateButtonStyle: {
            backgroundColor: 'none',
            border: '2px solid #25874D',
            color: '#25874D',
            padding: '0.6rem 4.5rem',
            borderRadius: '25px',
            fontFamily: 'SofiaPro',
            textTransform: 'capitalize',
        },
    }

    const handleValueChange = async (name: string, value: any) => {
        setVariables({
            ...variable,
            [name]: value,
        })
    }

    const renderName = () => (
        <Box className="single-field">
            <InputLabel
                className="font-[SofiaPro] input-label"
                shrink
                htmlFor="Name"
            >
                Name
            </InputLabel>
            <Box className="font-[SofiaPro] input-button">
                <Input
                    id="Name"
                    className="font-[SofiaPro] input-field"
                    value={variable.name}
                    onChange={onChangeVariable('name')}
                    disabled={editField !== 'name'}
                    placeholder="Enter your Name"
                />
                {editField !== 'name' && (
                    <IconButton
                        sx={{
                            mr: '1rem',
                        }}
                        onClick={() => handleEditClick('name')}
                    >
                        <Image src={Edit} alt="edit" />
                    </IconButton>
                )}
            </Box>
            {errors.name && (
                <Typography
                    sx={{ fontFamily: 'SofiaPro' }}
                    color="red"
                    variant="caption"
                >
                    {errors.name}
                </Typography>
            )}
            {editField === 'name' && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        sx={sxStyle.updateButtonStyle}
                        onClick={onSubmit('name')}
                    >
                        Update
                    </Button>
                    <Button
                        sx={sxStyle.cancelButtonStyle}
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    )

    const renderPhoneNumber = () => (
        <Box className="single-field">
            <InputLabel className="input-label" shrink htmlFor="phoneNumber">
                Phone Number
            </InputLabel>
            <Box className="input-button">
                <Input
                    id="phoneNumber"
                    className="input-field"
                    value={variable.phone}
                    onChange={onChangeVariable('phone')}
                    disabled={editField !== 'phone'}
                />
                {editField !== 'phone' && (
                    <IconButton
                        sx={{
                            mr: '1rem',
                        }}
                        onClick={() => handleEditClick('phone')}
                    >
                        <Image src={Edit} alt="edit" />
                    </IconButton>
                )}
            </Box>
            {errors.phone && (
                <Typography
                    sx={{ fontFamily: 'SofiaPro' }}
                    color="red"
                    variant="caption"
                >
                    {errors.phone}
                </Typography>
            )}
            {editField === 'phone' && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        className="capitalize font-semibold"
                        sx={sxStyle.updateButtonStyle}
                        onClick={onSubmit('phone')}
                    >
                        Update
                    </Button>
                    <Button
                        className="capitalize font-semibold"
                        sx={sxStyle.cancelButtonStyle}
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    )

    const renderGender = () => {
        return (
            <>
                <Typography sx={{ fontFamily: 'SofiaPro', fontWeight: '600' }}>
                    Gender
                </Typography>

                <div>
                    <div
                        style={{ paddingLeft: '24px' }} //this is kept intentionally as we are not able to override mui css
                        onClick={() => {
                            handleEditClick('gender')
                            setShowDropdown(!showDropdown)
                        }}
                        className="bg-primary-100 min-h-[48px] flex justify-between items-center gap-[5px] rounded-full"
                    >
                        {variable.gender === '' ? (
                            <p
                                style={{ color: '#a1a1a0ee' }}
                                className="font-[SofiaPro]  text-[16px]"
                            >
                                Select gender
                            </p>
                        ) : (
                            <p className="font-[SofiaPro] text-[14px]  ">
                                {variable.gender}
                            </p>
                        )}
                        <IconButton
                            sx={{
                                mr: '1rem',
                            }}
                            onClick={() => handleEditClick('name')}
                        >
                            <Image src={Edit} alt="edit" />
                        </IconButton>
                    </div>
                    {showDropdown && (
                        <div className="bg-[#000] z-[10] rounded-[10px] p-[16px] min-w-[15vw] absolute mt-[.8vw] right-0">
                            <ul className="ps-0">
                                {genderList.map((data) => (
                                    <li
                                        onClick={() => {
                                            setShowDropdown(false)
                                            handleValueChange(
                                                'gender',
                                                data.name
                                            )
                                        }}
                                        className="list-none cursor-pointer pl-0 flex items-center py-[.97vw] first:pt-0 last:pb-0 gap-[5px] border-b border-b-[#545458A6] last:border-none "
                                        key={data.id}
                                    >
                                        <p
                                            className={` ${variable.gender === data.name ? 'text-[#FFA500]' : 'text-[#000]'}`}
                                        >
                                            ✓
                                        </p>

                                        <button className="font-[SofiaPro]  text-white">
                                            {data.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {editField === 'gender' && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mt: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            className="capitalize font-semibold"
                            sx={sxStyle.updateButtonStyle}
                            onClick={onSubmit('gender')}
                        >
                            Update
                        </Button>
                        <Button
                            className="capitalize font-semibold"
                            sx={sxStyle.cancelButtonStyle}
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
                {/* <FormControl>
          <Select
            sx={{
              backgroundColor: "#F8F4E9",
              borderRadius: "50px",
              border: "px solid #F8F4E9",
              fontFamily: "SofiaPro",
              outline: "none",
              borderColor: "transparent",
            }}
            color="primary"
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            value={variable.gender}
            onChange={onChangeVariable("gender")}
            IconComponent={() => (
              <IconButton
                sx={{ mr: "1rem" }}
                onClick={() => handleEditClick("gender")}
              >
                <Image src={Edit} alt="edit" />
              </IconButton>
            )}
          >
            <MenuItem value={""}>Select Gender</MenuItem>
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
            <MenuItem value={`Don't wish to specify`}>
              {`Don't wish to specify`}
            </MenuItem>
          </Select>

          {editField === "gender" && (
            <Box
              sx={{ display: "flex", gap: 2, mt: 1, justifyContent: "center" }}
            >
              <Button
                sx={{
                  backgroundColor: "none",
                  border: "2px solid #25874D",
                  color: "#25874D",
                  padding: "0.4rem 1.5rem",
                  borderRadius: "25px",
                }}
                onClick={onSubmit("gender")}
              >
                Update
              </Button>
              <Button
                sx={sxStyle.cancelButtonStyle}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </Box>
          )}
        </FormControl> */}
            </>
        )
    }

    const renderEmail = () => (
        <Box className=" single-field">
            <InputLabel className="input-label" shrink htmlFor="email">
                E-mail
            </InputLabel>
            <Box className="input-button">
                <Input
                    id="email"
                    className="input-field "
                    value={variable.email}
                    onChange={onChangeVariable('email')}
                    disabled={editField !== 'email'}
                    placeholder="Enter your email"
                />
                {editField !== 'email' && (
                    <IconButton
                        sx={{ mr: '1rem' }}
                        onClick={() => handleEditClick('email')}
                    >
                        <Image src={Edit} alt="edit" />
                    </IconButton>
                )}
            </Box>
            {errors.email && (
                <Typography
                    sx={{ fontFamily: 'SofiaPro' }}
                    color="red"
                    variant="caption"
                >
                    {errors.email}
                </Typography>
            )}
            {editField === 'email' && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        className="font-[SofiaPro] font-semibold capitalize"
                        sx={sxStyle.updateButtonStyle}
                        onClick={onSubmit('email')}
                    >
                        Update
                    </Button>
                    <Button
                        className="font-[SofiaPro] font-semibold capitalize"
                        sx={sxStyle.cancelButtonStyle}
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    )

    return (
        <>
            <FormControl
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    '.single-field': {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        '.input-label': {
                            width: '100%',
                            position: 'relative',
                            maxWidth: '100%',
                            transform: 'none',
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'black',
                            fontFamily: 'SofiaPro',
                        },
                        '.input-button': {
                            position: 'relative',
                            button: {
                                fontSize: 12,
                                fontWeight: 500,
                                position: 'absolute',
                                right: 2,
                                transform: 'translateY(-50%)',
                                top: '50%',
                            },
                            '.input-field': {
                                width: '100%',
                                height: 48,
                                backgroundColor: '#F8F4E9',
                                borderRadius: '48px',
                                paddingLeft: 3,
                                paddingRight: 10,
                                fontFamily: 'SofiaPro',
                                fontWeight: '400',

                                '&:before, &:after': {
                                    display: 'none',
                                },
                            },
                        },
                    },
                }}
            >
                {renderEmail()}
                {renderName()}
                {renderGender()}
                <PhoneNumbers
                    errors={errors}
                    variable={variable}
                    editField={editField}
                    onChangeVariable={onChangeVariable}
                    handleEditClick={handleEditClick}
                    handleCancelClick={handleCancelClick}
                    onSubmit={onSubmit}
                    sxStyle={sxStyle}
                />
            </FormControl>
        </>
    )

    // return (
    //     <AccountSidebarLayout
    //         isOpen={true}
    //         title="My Account"
    //         onClose={() => {
    //             setIsOpen(false)
    //         }}
    //         onBack={() => {
    //             setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN)
    //         }}
    //     >
    //         <Box
    //             className="edit-profile"
    //             sx={{
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //                 flexGrow: 1,
    //                 gap: 2,
    //                 paddingTop: '20px',
    //                 paddingBottom: '20px',
    //             }}
    //         >
    //             <FormControl
    //                 sx={{
    //                     display: 'flex',
    //                     flexDirection: 'column',
    //                     gap: 2,
    //                     '.single-field': {
    //                         display: 'flex',
    //                         flexDirection: 'column',
    //                         gap: 1,
    //                         '.input-label': {
    //                             width: '100%',
    //                             position: 'relative',
    //                             maxWidth: '100%',
    //                             transform: 'none',
    //                             fontSize: 16,
    //                             fontWeight: '600',
    //                             color: 'black',
    //                             fontFamily: 'SofiaPro',
    //                         },
    //                         '.input-button': {
    //                             position: 'relative',
    //                             button: {
    //                                 fontSize: 12,
    //                                 fontWeight: 500,
    //                                 position: 'absolute',
    //                                 right: 2,
    //                                 transform: 'translateY(-50%)',
    //                                 top: '50%',
    //                             },
    //                             '.input-field': {
    //                                 width: '100%',
    //                                 height: 48,
    //                                 backgroundColor: '#F8F4E9',
    //                                 borderRadius: '48px',
    //                                 paddingLeft: 3,
    //                                 paddingRight: 10,
    //                                 fontFamily: 'SofiaPro',
    //                                 fontWeight: '400',

    //                                 '&:before, &:after': {
    //                                     display: 'none',
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 }}
    //             >
    //                 {renderEmail()}
    //                 {renderName()}
    //                 {renderGender()}
    //                 <PhoneNumbers
    //                     errors={errors}
    //                     variable={variable}
    //                     editField={editField}
    //                     onChangeVariable={onChangeVariable}
    //                     handleEditClick={handleEditClick}
    //                     handleCancelClick={handleCancelClick}
    //                     onSubmit={onSubmit}
    //                     sxStyle={sxStyle}
    //                 />
    //             </FormControl>
    //         </Box>
    //     </AccountSidebarLayout>
    // )
}

export default AccountEdit
