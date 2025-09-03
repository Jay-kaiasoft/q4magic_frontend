import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Components from '../components/muiComponents/components';
import Button from '../components/common/buttons/button';
import { Controller, useForm } from 'react-hook-form';
import Input from '../components/common/input/input';
import { connect } from 'react-redux';
import { setAlert } from '../redux/commonReducers/commonReducers';
import CustomIcons from '../components/common/icons/CustomIcons';
import Select from '../components/common/select/select';
import { getAllOpportunities } from '../service/opportunities/opportunitiesService';
import { createContact, getContactDetails, updateContact } from '../service/contact/contactService';

const BootstrapDialog = styled(Components.Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function ContactModel({ setAlert, open, handleClose, contactId, handleGetAllContacts, handleGetAllSyncRecords }) {
    const theme = useTheme()

    const [loading, setLoading] = useState(false);
    const [opportunities, setOpportunities] = useState([]);

    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            id: null,
            opportunityId: null,
            salesforceContactId: null,
            firstName: null,
            middleName: null,
            lastName: null,
            linkedinProfile: null,
            title: null,
            emailAddress: null,
            role: null,
            notes: null,
            keyContact: null,
            recordStatus: null,
        },
    });

    const onClose = () => {
        setLoading(false);
        reset({
            id: null,
            opportunityId: null,
            salesforceContactId: null,
            firstName: null,
            middleName: null,
            lastName: null,
            linkedinProfile: null,
            title: null,
            emailAddress: null,
            role: null,
            notes: null,
            keyContact: null,
            recordStatus: null,
        });
        handleClose();
    };

    const handleGetAllOpportunities = async () => {
        if (open) {
            const res = await getAllOpportunities()
            const data = res?.result?.map((item) => {
                return {
                    id: item.id,
                    title: item.opportunity
                }
            })
            setOpportunities(data)
        }
    }

    const handleGetContactDetails = async () => {
        if (contactId && open) {
            const res = await getContactDetails(contactId);
            if (res?.status === 200) {
                reset(res?.result);
            }
        }
    }

    useEffect(() => {
        handleGetAllOpportunities()
        handleGetContactDetails()
    }, [open])

    const submit = async (data) => {
        setLoading(true);
        try {
            if (contactId) {
                const res = await updateContact(contactId, data);
                if (res?.status === 200) {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: "Contact updated successfully",
                        type: "success"
                    });
                    handleGetAllContacts();
                    handleGetAllSyncRecords();
                    onClose();
                } else {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: res?.message || "Failed to update contact",
                        type: "error"
                    });
                }
            } else {
                const res = await createContact(data);
                if (res?.status === 201) {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: "Contact created successfully",
                        type: "success"
                    });
                    handleGetAllContacts();
                    handleGetAllSyncRecords();
                    onClose();
                } else {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: res?.message || "Failed to create contact",
                        type: "error"
                    });
                }
            }
        } catch (err) {
            setLoading(false);
            setAlert({
                open: true,
                message: err.message || "Something went wrong",
                type: "error"
            })
        }
    }

    return (
        <React.Fragment>
            <BootstrapDialog
                open={open}
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth='sm'
            >
                <Components.DialogTitle sx={{ m: 0, p: 2, color: theme.palette.primary.text.main }} id="customized-dialog-title">
                    {contactId ? "Update" : "Add New"} Contact
                </Components.DialogTitle>

                <Components.IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.primary.icon,
                    })}
                >
                    <CustomIcons iconName={'fa-solid fa-xmark'} css='cursor-pointer text-black w-5 h-5' />
                </Components.IconButton>

                <form noValidate onSubmit={handleSubmit(submit)}>
                    <Components.DialogContent dividers>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Controller
                                    name="opportunityId"
                                    control={control}                                  
                                    render={({ field }) => (
                                        <Select
                                            options={opportunities}
                                            label={"Opportunity"}
                                            placeholder="Select Opportunity"
                                            value={parseInt(watch("opportunityId")) || null}
                                            onChange={(_, newValue) => {
                                                if (newValue?.id) {
                                                    field.onChange(newValue.id);
                                                } else {
                                                    setValue("opportunityId", null);
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{
                                    required: "First name is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="First Name"
                                        type={`text`}
                                        error={errors.firstName}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{
                                    required: "Last name is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Last Name"
                                        type={`text`}
                                        error={errors.lastName}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="title"
                                control={control}
                                rules={{
                                    required: "Title is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Title"
                                        type={`text`}
                                        error={errors.title}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="emailAddress"
                                control={control}
                                rules={{
                                    required: "Email address is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Email address is invalid",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Email Address"
                                        type={`text`}
                                        error={errors.emailAddress}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </Components.DialogContent>

                    <Components.DialogActions>
                        <div className='flex justify-end'>
                            <Button type={`submit`} text={contactId ? "Update" : "Submit"} isLoading={loading} />
                        </div>
                    </Components.DialogActions>
                </form>
            </BootstrapDialog>
        </React.Fragment>
    );
}

const mapDispatchToProps = {
    setAlert,
};

export default connect(null, mapDispatchToProps)(ContactModel)
