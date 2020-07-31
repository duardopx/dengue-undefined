import React, { useState, useEffect } from 'react';
import { Linking, View, Text, TouchableOpacity, ImageBackground, PermissionsAndroid, Platform } from 'react-native';
import { Container, Header, Card } from "./styles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import gradient from '~/assets/temp.jpg';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import RNPickerSelect from 'react-native-picker-select';
import resources from "~/../languages_resources.js";
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import general from '~/general.js';
import countries_list from '~/lib/countries.json';

function Home(props) {

    const [menu_open, setMenuOpen] = useState( false );
    const [language_modal, setLanguageModal] = useState( false );
    const [weather_modal, setWeatherModal] = useState( false );
    const [dengue_modal, setDengueModal] = useState( false );

    const { t, i18n } = useTranslation();
    const [current_locale, setCurrentLocale] = useState('');
    const [weather_description, setWeatherDescription] = useState('');
    const [current_countrie, setCurrentCountrie] = useState('');
    const [language, setLanguage] = useState('');
    const [infected, setInfected] = useState('0');
    const [minTemp, setMinTemp] = useState('');
    const [currentTemp, setCurrentTemp] = useState('');
    const [currentHumidity, setCurrentHumidity] = useState('');

    useEffect(() => {

        loadConfig();
       
    }, []);

    const requestLocationPermission = async() => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
              'title': t('location_access'),
              'message': t('location_access_message')
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            callLocation();
          } else {
            setDefaultLocation();
          }
        } catch (err) {
            setDefaultLocation();
        }
    }

    const setDefaultLocation = async() => {
        const default_location = {
            'city': 'curitiba',
            'country': 'BR',
            'latitude': -25.4284,
            'longitude': -49.2733,
            'date': new Date().getTime()
        }
        await AsyncStorage.setItem('current_location', JSON.stringify(default_location));
    }

    const callLocation = async() => {
        const default_location = {
            'city': 'curitiba',
            'country': 'BR',
            'latitude': -25.4284,
            'longitude': -49.2733,
            'date': new Date().getTime()
        }

        await Geolocation.getCurrentPosition(
        (result)=>{
            if( 'coords' in result && 'latitude' in result['coords'] )
            {
                default_location['city'] = '';
                default_location['country'] = '';
                default_location['latitude'] = result['coords']['latitude'];
                default_location['longitude'] = result['coords']['longitude'];
                default_location['date'] = new Date().getTime();
                AsyncStorage.setItem('current_location', JSON.stringify(default_location));
            }
        }, 
        (e)=>{
            AsyncStorage.setItem('current_location', JSON.stringify(default_location));
        });
        
    }

    const loadConfig = async() => {
        var selected_language = await AsyncStorage.getItem('selected_language');
        var current_location = await AsyncStorage.getItem('current_location');
        
        setLanguage(selected_language);

        if( current_location == null )
        {
            if( Platform.OS === 'android' ) {            
                await requestLocationPermission();
            } else {
                await callLocation();
            }
        }
        
        var weather_data = await getWeatherData();
        var saved_date = weather_data['date'];
        const current_date = new Date().getTime()

        /* just reload after 30 min */
        if( saved_date == null || parseInt(saved_date)+(30*60*1000) <= current_date) {
            const update_wather_data = await loadWeatherData();
            setCurrentCountrie( getCountry(`${update_wather_data['locale_country']}`));
            setCurrentLocale(`${update_wather_data['locale_name']}`)
            setInfected(`${update_wather_data['cases']}`)
            setMinTemp(`${update_wather_data['tempmin']}`)
            setCurrentTemp(`${update_wather_data['temp']}`)
            setCurrentHumidity(`${update_wather_data['humidity']}`)
            setWeatherDescription(`${update_wather_data['weather_description']}`)
        } else {
            setCurrentCountrie( getCountry(`${weather_data['locale_country']}`));
            setCurrentLocale(`${weather_data['locale_name']}`)
            setInfected(`${weather_data['cases']}`)
            setMinTemp(`${weather_data['tempmin']}`)
            setCurrentTemp(`${weather_data['temp']}`)
            setCurrentHumidity(`${weather_data['humidity']}`)
            setWeatherDescription(`${weather_data['weather_description']}`)
        }
    }

    const getWeatherData = async() => {
        const data = await AsyncStorage.getItem('weather_data')
        if( data == null)
        {
            return await loadWeatherData();
        }
        else{
            return JSON.parse(data);
        }
    }

    const loadWeatherData = async() => {
        const data = JSON.parse(await AsyncStorage.getItem('current_location'));
        const weather_today = await general.getWeather(data['latitude'], data['longitude']);

        const place_name = weather_today['locale_name'];
        
        const dengue_data = await general.getInfoDengue( place_name );
        const weather_data = {
            'locale_name': weather_today['locale_name'],
            'locale_country': weather_today['locale_country'],
            'weather_description': weather_today['description'],
            'humidity': weather_today['humidity'],
            'temp': weather_today['temp'],
            'cases': dengue_data['cases'],
            'tempmin': dengue_data['tempmin'],
            'date': new Date().getTime()
        }
        await AsyncStorage.setItem('weather_data', JSON.stringify(weather_data));
        return weather_data;
    }
    
    const openChat = () => {
        props.navigation.navigate('Chat');
    }

    const openCityInfo = () => {
        props.navigation.navigate('CityInfo');
    }

    const openHints = () => {
        props.navigation.navigate('Hints');
    }

    const gotoForecast = () => {
        props.navigation.navigate('Forecast');
    }

    const menu_options = [
        {
            icon_name: "directions-car",
            title: t("will_travel"),
            description: t("will_travel_desc"),
            action: openCityInfo
        },
        {
            icon_name: "report",
            title: t("report_case"),
            description: t("report_case_desc"),
            action: openChat
        },
        {
            icon_name: "functions",
            title: t("forecast"),
            description: t("forecast_desc"),
            action: gotoForecast
        },
        {
            icon_name: "live-help",
            title: t("some_tips"),
            description: t("some_tips_desc"),
            action: openHints
        },
    ];

    const changeLanguage = async( value ) => {
        const languages_available = Object.keys(resources);
        if( languages_available.includes( value ) )
        {
            setLanguage(value)
            await AsyncStorage.setItem('selected_language', value);
            i18n.changeLanguage(value);
        }
    }

    const getCountry = (code) => {
        if(code.toUpperCase() in countries_list)
        {
            return countries_list[code.toUpperCase()];
        }
        return "Unknown";
    }

    const openWeatherMap = () => {
        Linking.openURL('https://openweathermap.org/api/')
    }

    const openDengueMap = () => {
        Linking.openURL('info.dengue.mat.br/')
    }

    const getWIcon = ( text_desc ) => {
        if( text_desc == "clear sky" )
        {
            return <Icon name={'wb-sunny'} size={50} color="#FFF503" style={{marginRight: 10}}/>;
        }
        else{
            return <Icon name={'cloud'} size={50} color="rgba(255,255,255,0.54)" style={{marginRight: 10}} />;
        }
    }

    return(
        <ImageBackground source={gradient} style={styles.image}>
            <Container>
                <Header>
                    <TouchableOpacity onPress={() => setMenuOpen(true)}>
                        <Icon name={'menu'} size={30} color="rgba(255,255,255,0.54)" />
                    </TouchableOpacity>
                </Header>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                        {getWIcon( weather_description )}
                        <View>
                            <Text style={styles.text}>{current_locale}</Text>
                            <Text style={styles.text}>{current_countrie}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5}}>
                            <View style={{marginRight: 20}}>
                                <Text style={{...styles.text, ...{textAlign: 'center'}}}>{currentTemp}º</Text>
                                <Text style={styles.text}>{t('temperature')}</Text>
                            </View>
                            <View>
                                <Text style={{...styles.text, ...{textAlign: 'center'}}}>{currentHumidity}%</Text>
                                <Text style={styles.text}>{t('humidity')}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <View style={{marginBottom: 10}}>
                            <Text style={styles.title}>{t('about_city')}</Text>
                            <Text style={styles.text}>{t('weeks_ago')}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Card>
                                <Text style={styles.number_highlight}>{infected}</Text>
                                <Text style={styles.text}>{t('infected')}</Text>
                            </Card>
                            <Card>
                                <Text style={styles.number_highlight}>{minTemp && minTemp!='undefined' ? minTemp+'º' : '0'}</Text>
                                <Text style={styles.text}>{t('min_temp')}</Text>
                            </Card>
                        </View>
                    </View>
                    <View >
                        {
                        menu_options.map((item, index) => {
                            return(
                                <TouchableOpacity 
                                onPress={item.action ? item.action : () => {}} 
                                style={{flexDirection: 'row'}}
                                key={index}>
                                    <View style={styles.menu_icon}>
                                        <Icon name={item.icon_name} size={35} color="#999" />
                                    </View>
                                    <View style={{paddingTop: 5}}>
                                        <Text style={styles.text}>{item.title}</Text>
                                        <Text style={styles.text}>{item.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                        }
                    </View>
                </View>
            </Container>
            <Modal
            onRequestClose={() => setMenuOpen(false)}
            onBackdropPress={() => setMenuOpen(false)}
            isVisible={menu_open}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity
                    style={styles.blockColor}
                    onPress={() => {
                        setLanguageModal(true);
                        setMenuOpen(false);
                    }}>
                        <Text>{t('change_language')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.blockColor}
                    onPress={() => {
                        setWeatherModal(true);
                        setMenuOpen(false);
                    }}>
                        <Text>{t('weather_info')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.blockColor}
                    onPress={() => {
                        setLanguageModal(true);
                        setMenuOpen(false);
                    }}>
                        <Text>{t('dengue_info')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
            onRequestClose={() => setLanguageModal(false)}
            onBackdropPress={() => setLanguageModal(false)}
            isVisible={language_modal}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{padding: 10, backgroundColor: '#fff'}}>
                        <Text>{t('change_language')}</Text>
                            <RNPickerSelect
                            placeholder={{label:t('placeholder_option'), value:null, disabled: true}}
                            onValueChange={(value) => changeLanguage( value )}
                            value={language}
                            items={[
                                { label: t('pt_br'), value: 'pt_br' },
                                { label: t('en_us'), value: 'en_us' },
                            ]}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
            onRequestClose={() => setWeatherModal(false)}
            onBackdropPress={() => setWeatherModal(false)}
            isVisible={weather_modal}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={{backgroundColor: '#fff', padding: 10}}>
                        <Text style={styles.title_modal}>{t('weather')}</Text>
                        <Text>{t('weather_desc')}</Text>
                        <Text onPress={openWeatherMap} style={styles.link}>{t('click_see_more')}</Text>
                    </View>
                </View>
            </Modal>

            <Modal
            onRequestClose={() => setDengueModal(false)}
            onBackdropPress={() => setDengueModal(false)}
            isVisible={dengue_modal}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.title_modal}>{t('dengue')}</Text>
                    <Text>{t('dengue_desc')}</Text>
                    <Text onPress={openDengueMap} style={styles.link}>{t('click_see_more')}</Text>
                </View>
            </Modal>
        </ImageBackground>  
    );
}

const styles = {
    title:{
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 10,
        color: '#999',
    },
    text: {
        color: '#fff',
    },
    menu_icon: {
        backgroundColor: '#C4C4C4',
        borderRadius: 3,
        marginRight: 10,
        padding: 8,
        marginBottom: 10,
    },
    number_highlight: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 25
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    blockColor:{
        backgroundColor: '#fff',
        padding: 13,
        borderBottomWidth: 1,
        borderColor: '#dfdfdf'
    },
    title_modal:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    }
}

export default Home;