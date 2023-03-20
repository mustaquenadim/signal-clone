import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDyshJ_KBO_TomrnLiUXXlXZgfa9HUIu0E',
	authDomain: 'chat-mustaquenadim.firebaseapp.com',
	projectId: 'chat-mustaquenadim',
	storageBucket: 'chat-mustaquenadim.appspot.com',
	messagingSenderId: '236439994392',
	appId: '1:236439994392:web:b13e29a0fa27c863b7036d',
	measurementId: 'G-FS9BW2EZ0Q',
};

let app;
if (!firebaseConfig?.apps?.length) {
	app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
