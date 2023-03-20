import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import CustomListItem from '../components/CustomListItem';
import { Avatar } from '@rneui/themed';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { getDocs, collection } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
	const [chats, setChats] = useState([]);

	const signOutUser = () => {
		signOut(auth)
			.then(() => {
				navigation.replace('Login');
			})
			.catch((error) => alert(error));
	};

	useEffect(() => {
		async function fetchData() {
			let arr = [];
			const unsubscribe = await getDocs(collection(db, 'chats'));
			unsubscribe?.forEach((doc) => {
				arr.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setChats(arr);
		}

		fetchData();
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Gossip',
			headerStyle: { backgroundColor: '#fff' },
			headerTitleStyle: { color: 'black' },
			headerTintColor: 'black',
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
						<Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
					</TouchableOpacity>
				</View>
			),
			headerRight: () => (
				<View
					style={{
						width: 80,
						marginRight: 20,
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<TouchableOpacity activeOpacity={0.5}>
						<AntDesign name="camerao" size={24} color="black" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate('AddChat')}
						activeOpacity={0.5}
					>
						<SimpleLineIcons name="pencil" size={24} color="black" />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);

	const enterChat = (id, chatName) => {
		navigation.navigate('Chat', {
			id,
			chatName,
		});
	};

	return (
		<SafeAreaView>
			<ScrollView style={styles.container}>
				{chats?.map(({ id, data: { chatName } }) => (
					<CustomListItem
						key={id}
						id={id}
						chatName={chatName}
						enterChat={enterChat}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		height: '100%',
	},
});
