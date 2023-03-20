import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Button, Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddChatScreen = ({ navigation }) => {
	const [input, setInput] = useState('');

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Add a New Chat',
			headerBackTitle: 'Chats',
		});
	}, [navigation]);

	const createChat = async () => {
		try {
			const docRef = await addDoc(collection(db, 'chats'), {
				chatName: input,
			});
			navigation.goBack();
		} catch (error) {
			alert(error);
		}
	};

	return (
		<View style={styles.container}>
			<Input
				type="text"
				placeholder="Enter a chat name"
				value={input}
				onChangeText={(text) => setInput(text)}
				onSubmitEditing={createChat}
				leftIcon={
					<Icon name="wechat" type="antdesign" size={24} color="black" />
				}
			/>
			<Button onPress={createChat} title="Create new Chat" />
		</View>
	);
};

export default AddChatScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		padding: 30,
		height: '100%',
	},
});
