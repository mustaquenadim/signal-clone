import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Image, Input } from '@rneui/themed';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;
				navigation.replace('Home');
			} else {
				// User is signed out
			}
		});

		return unsubscribe;
	}, []);

	const signIn = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {})
			.catch((error) => {
				alert(error);
			});
	};

	return (
		<KeyboardAvoidingView style={styles.container}>
			<StatusBar style="light" />
			<Image
				source={{
					uri: 'https://docs.smooch.io/images/channel-header-logos/logo_whatsapp.png',
				}}
				style={{ width: 200, height: 200 }}
			/>
			<View style={styles.inputContainer}>
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
					onSubmitEditing={signIn}
				/>
			</View>
			<Button containerStyle={styles.button} onPress={signIn} title="Login" />
			<Button
				onPress={() => navigation.navigate('Register')}
				containerStyle={styles.button}
				type="outline"
				title="Register"
			/>
			<View style={{ height: 100 }} />
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		backgroundColor: '#fff',
	},
	inputContainer: {
		width: 300,
	},
	button: {
		width: 200,
		marginTop: 10,
	},
});
