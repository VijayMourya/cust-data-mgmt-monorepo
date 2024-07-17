import React, { useState } from 'react';
import { Alert, Button, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '@rneui/themed';
import DatePicker from 'react-native-modern-datepicker';
import { useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

interface Customer {
    id?: number;
    firstname: string;
    lastname: string;
    dob: string;
    phone: string;
}

interface CustomerDataProps {
    navigation: any;
}

const CustomerData: React.FC<CustomerDataProps> = ({ navigation }) => {
    const route = useRoute();
    const customer = route.params as Customer;
    console.log('customer: ', customer);
    const [show, setShow] = useState(false);

    const validationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required('First Name is required'),
        lastname: Yup.string()
            .required('Last Name is required'),
        phone: Yup.string()
            .matches(/^[0-9]+$/, 'Phone number is not valid')
            .required('Phone Number is required'),
        dob: Yup.string()
            .required('Date of Birth is required'),
    });

    const showDatepicker = () => {
        setShow(true);
    };

    const saveUserData = async (values: Customer) => {
        try {
            const response = await fetch('http://10.0.2.2:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const user = await response.json();
                Alert.alert('Save Customer Data', 'Customer saved successfully', [
                    { text: 'OK', onPress: () => navigation.navigate('CustomerList') },
                ]);
            } else {
                const error = await response.json();
                Alert.alert('Save Customer Data', 'There has been an error while trying to save the customer data. Please try again later', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            }
        } catch (error: any) {
            Alert.alert('Network Error', error.message, [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    }

    return (
        <Formik
            initialValues={{
                id: customer?.id || 0,
                firstname: customer?.firstname || '',
                lastname: customer?.lastname || '',
                phone: customer?.phone || '',
                dob: customer?.dob || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                saveUserData(values);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <View style={{ padding: 20 }}>
                    <Input
                        placeholder="First Name"
                        onChangeText={handleChange('firstname')}
                        onBlur={handleBlur('firstname')}
                        value={values.firstname}
                        errorMessage={touched.firstname && errors.firstname ? errors.firstname : ''}
                    />
                    <Input
                        placeholder="Last Name"
                        onChangeText={handleChange('lastname')}
                        onBlur={handleBlur('lastname')}
                        value={values.lastname}
                        errorMessage={touched.lastname && errors.lastname ? errors.lastname : ''}
                    />
                    <Input
                        placeholder="Phone Number"
                        keyboardType="numeric"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                        errorMessage={touched.phone && errors.phone ? errors.phone : ''}
                    />
                    <Text style={{ marginBottom: 10 }}>Date of Birth</Text>
                    <TouchableOpacity onPress={showDatepicker}>
                        <Input
                            placeholder="Date of Birth"
                            value={values.dob}
                            errorMessage={touched.dob && errors.dob ? errors.dob : ''}
                            disabled={true}
                        />
                    </TouchableOpacity>
                    {show &&
                        <DatePicker
                            mode="calendar"
                            maximumDate={moment().format("YYYY-MM-DD").toString()}
                            onSelectedChange={(date) => {
                                setShow(false);
                                setFieldValue('dob', moment(date, 'YYYY/MM/DD').format("DD/MM/YYYY").toString());
                            }}
                        />
                    }
                    <Button style={{ paddingTop: 20 }} onPress={handleSubmit} title={customer ? 'Update' : 'Save'} />
                </View>
            )}
        </Formik>
    );
};

export default CustomerData;
