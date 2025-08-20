import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Components from '../components/muiComponents/components';
import Button from '../components/common/buttons/button';
import { Controller, useForm } from 'react-hook-form';
import Input from '../components/common/input/input';
import { connect } from 'react-redux';
import { setAlert } from '../redux/commonReducers/commonReducers';
import CustomIcons from '../components/common/icons/CustomIcons';
import { getAllCRM } from '../service/crm/crmService';
import Select from '../components/common/select/select';
import { createAccount, getAccountDetails, updateAccount } from '../service/account/accountService';

const BootstrapDialog = styled(Components.Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function AccountModel({ setAlert, open, handleClose, accountId, handleGetAllAccounts }) {
    const theme = useTheme()

    const [loading, setLoading] = useState(false);
    const [crm, setCrm] = useState([]);

    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            crmId: null,
            companyName: null,
            link: null,
            recordStatus: null,
            logo: null,
            salesforceAccountId: null,
            accountName: null,
            phone: null
        },
    });

    const onClose = () => {
        setLoading(false);
        reset({
            crmId: null,
            companyName: null,
            link: null,
            recordStatus: null,
            logo: null,
            salesforceAccountId: null,
            accountName: null,
            phone: null
        });
        handleClose();
    };

    const handleGetAllCrm = async () => {
        if (open) {
            const res = await getAllCRM()
            const data = res?.result?.map((item) => {
                return {
                    id: item.crmId,
                    title: item.name
                }
            })
            setCrm(data)
        }
    }

    const handleGetAccountDetails = async () => {
        if (accountId && open) {
            const res = await getAccountDetails(accountId);
            if (res?.status === 200) {
                reset(res?.result);
            }
        }
    }

    useEffect(() => {
        handleGetAllCrm()
        handleGetAccountDetails()
    }, [open])

    const submit = async (data) => {
        setLoading(true);
        try {
            if (accountId) {
                const res = await updateAccount(accountId, data);
                if (res?.status === 200) {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: "Account updated successfully",
                        type: "success"
                    });
                    handleGetAllAccounts();
                    onClose();
                } else {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: res?.message || "Failed to update account",
                        type: "error"
                    });
                }
            } else {
                const res = await createAccount(data);
                if (res?.status === 201) {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: "Account created successfully",
                        type: "success"
                    });
                    handleGetAllAccounts();
                    onClose();
                } else {
                    setLoading(false);
                    setAlert({
                        open: true,
                        message: res?.message || "Failed to create account",
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
                    {accountId ? "Update" : "Add New"} Account
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
                            <Controller
                                name="accountName"
                                control={control}
                                rules={{
                                    required: "Account name is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Account Name"
                                        type={`text`}
                                        error={errors.accountName}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    />
                                )}
                            />
                            <div>
                                <Controller
                                    name="crmId"
                                    control={control}
                                    rules={{
                                        required: "CRM is required"
                                    }}
                                    render={({ field }) => (
                                        <Select
                                            options={crm}
                                            label={"CRM"}
                                            placeholder="Select CRM"
                                            value={parseInt(watch("crmId")) || null}
                                            onChange={(_, newValue) => {
                                                if (newValue?.id) {
                                                    field.onChange(newValue.id);
                                                } else {
                                                    setValue("crmId", null);
                                                }
                                            }}
                                            error={errors?.crmId}
                                        />
                                    )}
                                />
                            </div>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: "Phone number is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Phone Number"
                                        type={`text`}
                                        error={errors.phone}
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
                            <Button type={`submit`} text={accountId ? "Update" : "Submit"} isLoading={loading} />
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

export default connect(null, mapDispatchToProps)(AccountModel)
