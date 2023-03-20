import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, Input, Button } from '@rneui/themed';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Back to Login',
		});
	}, [navigation]);

	const register = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				if (userCredential) {
					updateProfile(auth.currentUser, {
						displayName: name,
						photoURL:
							imageUrl ||
							'https://www.disneyplusinformer.com/wp-content/uploads/2021/06/Luca-Profile-Avatars-3.png',
					});
				}
			})
			.catch((error) => alert(error));
	};

	return (
		<KeyboardAvoidingView behavior="padding" style={styles.container}>
			<StatusBar style="light" />
			<Text h3 style={{ marginBottom: 50 }}>
				Create an Account
			</Text>
			<View style={styles.inputContainer}>
				<Input
					type="text"
					placeholder="Full Name"
					autoFocus
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<Input
					type="email"
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				<Input
					type="password"
					placeholder="Password"
					secureTextEntry
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>
				<Input
					type="text"
					placeholder="Profile Picture URL (optional)"
					autoFocus
					value={imageUrl}
					onChangeText={(text) => setImageUrl(text)}
					onSubmitEditing={register}
				/>
			</View>
			<Button
				containerStyle={styles.button}
				title={'Register'}
				onPress={register}
				raised
			/>
		</KeyboardAvoidingView>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		backgroundColor: '#fff',
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
	},
});
