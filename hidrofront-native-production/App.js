import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './routes/HomeScreen';
import InfoScreen from './routes/InfoScreen';
import MarkEntryScreen from './routes/MarkEntryScreen';
import NewEntryScreen from './routes/NewEntryScreen';
import QrGenerationScreen from './routes/QrGenerationScreen';

const stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{ animation: 'simple_push', headerTitleAlign: 'center', headerShown: false }} initialRouteName="Home">
        <stack.Screen name="Home" component={HomeScreen} />
        <stack.Screen name="NewEntry" component={NewEntryScreen} options={{ headerTitle: 'Registrar item' }} />
        <stack.Screen name="MarkEntry" component={MarkEntryScreen} options={{ headerTitle: 'Marcar item' }} />
        <stack.Screen name="QrGenerator" component={QrGenerationScreen} options={{ headerTitle: 'Generar Qr' }} />
        <stack.Screen name="InfoScreen" component={InfoScreen} options={{ headerTitle: 'Informacion' }} />
      </stack.Navigator>
    </NavigationContainer>
  );
}