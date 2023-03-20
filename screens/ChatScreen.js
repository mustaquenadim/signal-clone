import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Avatar } from '@rneui/themed';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../firebaseConfig';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	onSnapshot,
} from 'firebase/firestore';

const ChatScreen = ({ navigation, route }) => {
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([]);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Chat',
			headerBackTitleVisible: false,
			headerTitleAlign: 'Left',
			headerTitle: () => (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Avatar
						source={{
							uri:
								messages[0]?.data?.photoURL ||
								'https://i.pinimg.com/originals/b3/88/aa/b388aa2b20cd1b6c9510a5d894b88a70.png',
						}}
						rounded
					/>
					<Text style={{ color: 'white', marginLeft: 10, fontWeight: '700' }}>
						{route.params.chatName}
					</Text>
				</View>
			),
			// headerLeft: () => (
			// 	<TouchableOpacity
			// 		style={{ marginLeft: 10 }}
			// 		onPress={navigation.goBack}
			// 	>
			// 		<AntDesign name="arrowleft" size={24} color={'white'} />
			// 	</TouchableOpacity>
			// ),
			headerRight: () => (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: 64,
						marginRight: 10,
					}}
				>
					<TouchableOpacity>
						<FontAwesome name="video-camera" size={24} color={'white'} />
					</TouchableOpacity>
					<TouchableOpacity>
						<Ionicons name="call" size={24} color={'white'} />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation, messages]);

	const sendMessage = async () => {
		Keyboard.dismiss();

		await addDoc(collection(db, 'chats', route.params.id, 'messages'), {
			timestamp: serverTimestamp(),
			message: input,
			displayName: auth.currentUser.displayName,
			email: auth.currentUser.email,
			photoURL: auth.currentUser.photoURL,
		});

		setInput('');
	};

	useLayoutEffect(() => {
		const q = query(
			collection(db, 'chats', route.params.id, 'messages'),
			orderBy('timestamp', 'desc')
		);

		const unsubscribe = onSnapshot(q, (snapshot) =>
			setMessages(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			)
		);
	}, [route]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar style="light" />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
				keyboardVerticalOffset={90}
			>
				{/* <TouchableWithoutFeedback onPress={Keyboard.dismiss()}> */}
				<>
					<ScrollView contentContainerStyle={{ paddingTop: 15 }}>
						{messages?.map(({ id, data }) =>
							data?.email === auth?.currentUser?.email ? (
								<View key={id} style={styles.receiver}>
									<Avatar
										position="absolute"
										bottom={-15}
										right={-5}
										rounded
										size={30}
										// web
										containerStyle={{
											position: 'absolute',
											bottom: -15,
											right: -5,
										}}
										source={{
											uri: data.photoURL,
										}}
									/>
									<Text style={styles.receiverText}>{data?.message}</Text>
								</View>
							) : (
								<View key={id} style={styles.sender}>
									<Avatar
										// web
										containerStyle={{
											position: 'absolute',
											bottom: -15,
											left: -5,
										}}
										position="absolute"
										bottom={-15}
										left={-5}
										rounded
										size={30}
										source={{
											uri: data.photoURL,
										}}
									/>
									<Text style={styles.senderText}>{data?.message}</Text>
									<Text style={styles.senderName}>{data?.displayName}</Text>
								</View>
							)
						)}
					</ScrollView>
					<View style={styles.footer}>
						<TextInput
							style={styles.textInput}
							placeholder="Message"
							value={input}
							onChangeText={(text) => setInput(text)}
							onSubmitEditing={sendMessage}
						/>
						<TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
							<Ionicons name="send" size={24} color={'#2B68E6'} />
						</TouchableOpacity>
					</View>
				</>
				{/* </TouchableWithoutFeedback> */}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	receiver: {
		padding: 15,
		backgroundColor: '#ECECEC',
		alignSelf: 'flex-end',
		borderRadius: 20,
		marginRight: 15,
		marginBottom: 20,
		maxWidth: '80%',
		position: 'relative',
	},
	receiverText: {
		color: 'black',
		fontWeight: '500',
		marginLeft: 10,
	},
	receiverName: {},
	sender: {
		padding: 15,
		backgroundColor: '#2B68E6',
		alignSelf: 'flex-start',
		borderRadius: 20,
		marginRight: 15,
		marginBottom: 20,
		maxWidth: '80%',
		position: 'relative',
	},
	senderText: {
		color: 'white',
		fontWeight: '500',
		marginLeft: 10,
		marginBottom: 15,
	},
	senderName: {
		left: 10,
		paddingRight: 10,
		fontSize: 10,
		color: '#fff',
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 15,
	},
	textInput: {
		bottom: 0,
		height: 40,
		flex: 1,
		marginRight: 15,
		backgroundColor: '#ECECEC',
		padding: 10,
		color: 'grey',
		borderRadius: 30,
	},
});
