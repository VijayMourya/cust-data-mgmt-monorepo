import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Alert } from 'react-native';
import { ListItem, Avatar, FAB } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';

interface Customer {
    id: number;
    firstname: string;
    lastname: string;
    dob: string;
    phone: string;
}

interface CustomerListProps {
    navigation: any;
}

const CustomerList: React.FC<CustomerListProps> = ({ navigation }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isRefreshing, setRefreshing] = useState(false);

    const fetchCustomers = async () => {
        setRefreshing(true);
        try {
            const response = await fetch('http://10.0.2.2:3000/users');
            if (!response.ok) {
                throw new Error(`Error fetching customers: ${response.statusText}`);
            }
            const data = await response.json();
            setCustomers(data);
            setRefreshing(false);
        } catch (error) {
            Alert.alert('Network Error', 'Unable to fetch customers. Please try again later', [
                { text: 'OK', onPress: () => setRefreshing(false) },
            ]);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCustomers();
        }, [])
    );

    const handleManageCustomer = (customer?: Customer) => {
        navigation.navigate('CustomerData', customer);
    };

    const randomColor = (): string => {
        let hex: number = Math.floor(Math.random() * 0xFFFFFF);
        let color: string = "#" + hex.toString(16);

        return color;
    };

    const renderItem = ({ item }: { item: Customer }) => (
        <ListItem
            style={{
                padding: 10,
                paddingBottom: 0
            }}
            onPress={() => handleManageCustomer(item)}
        >
            <Avatar
                size={52}
                rounded
                title={item.firstname.substring(0, 1) + item.lastname.substring(0, 1)}
                containerStyle={{ backgroundColor: randomColor() }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontSize: 24, color: "black", fontWeight: "bold" }}>
                    {item.firstname}
                </ListItem.Title>
                <ListItem.Subtitle style={{ fontSize: 20, color: "black" }}>
                    {item.lastname}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="#B5B5B3" size={48} />
        </ListItem>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={customers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onRefresh={fetchCustomers}
                refreshing={isRefreshing}
            />
            <FAB
                style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                }}
                icon={{ name: 'add', color: 'white' }}
                onPress={() => handleManageCustomer()}
            />
        </View>
    );
};

export default CustomerList;
