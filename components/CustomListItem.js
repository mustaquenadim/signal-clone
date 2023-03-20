import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar, ListItem } from '@rneui/themed';
import { db } from '../firebaseConfig';
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from 'firebase/firestore';

const CustomListItem = ({ id, chatName, enterChat }) => {
	const [chatMessages, setChatMessages] = useState([]);

	useEffect(() => {
		// const unsubscribe = db
		// 	.collection('chats')
		// 	.doc(id)
		// 	.collection('messages')
		// 	.orderBy('timestamp', 'desc')
		// 	.onSnapshot((snapshot) =>
		// 		setChatMessages(snapshot.docs.map((doc) => doc.data()))
		// 	);

		// return unsubscribe;

		const messagesRef = collection(doc(db, 'chats', id), 'messages');
		const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));

		const unsubscribe = onSnapshot(messagesQuery, (snapshot) =>
			setChatMessages(snapshot.docs.map((doc) => doc.data()))
		);

		return unsubscribe;
	}, []);

	return (
		<ListItem key={id} onPress={() => enterChat(id, chatName)} bottomDivider>
			<Avatar
				rounded
				source={{
					uri:
						chatMessages?.[0]?.photoURL ||
						'https://i.pinimg.com/originals/b3/88/aa/b388aa2b20cd1b6c9510a5d894b88a70.png',
				}}
			/>
			<ListItem.Content>
				<ListItem.Title style={{ fontWeight: 800 }}>{chatName}</ListItem.Title>
				<ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
					{chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
				</ListItem.Subtitle>
			</ListItem.Content>
		</ListItem>
	);
};

export default CustomListItem;

const styles = StyleSheet.create({});
