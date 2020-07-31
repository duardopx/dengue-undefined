import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules }from "react-native";

import { createStackNavigator } from '@react-navigation/stack';
import Home from "./src/pages/home";
import Chat from "./src/pages/chat";
import Hints from "./src/pages/hints";
import CityInfo from "./src/pages/city-info";
import Forecast from "./src/pages/forecast";
import resources from "./languages_resources.js";
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();

function App() {

  const { t, i18n } = useTranslation();

  useEffect(() => {
    loadDefaultLanguage();
  }, [])

  const loadDefaultLanguage = async() => {
    
    var selected_language = await AsyncStorage.getItem('selected_language');

    if( selected_language == null)
    {
      var current_language = NativeModules.I18nManager.localeIdentifier.toLowerCase();
      var general_resources = Object.keys(resources).map((item) => item.split("_")[0]);

      if( Object.keys(resources).includes( current_language ) )
      {
        selected_language = current_language;
      }
      else if( general_resources.includes( current_language.split("_")[0] ))
      {
        selected_language = Object.keys(resources)[ general_resources.indexOf( current_language.split("_")[0] ) ];
      }
      else{ selected_language = "en_us"; }

      await AsyncStorage.setItem('selected_language', selected_language);
    }

    i18n.changeLanguage(selected_language);
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="CityInfo" component={CityInfo} />
          <Stack.Screen name="Hints" component={Hints} />
          <Stack.Screen name="Forecast" component={Forecast} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;