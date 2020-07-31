import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts';
import moment from 'moment';
import LocalitySearch from '~/components/localitySearch';
import { Container, Header, Card } from "./styles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import gradient from '~/assets/temp.jpg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import general from "~/general";
import { useTranslation } from 'react-i18next';

function CityInfo(props){

    const { t, i18n } = useTranslation();
    const [ menu_open, setMenuOpen ] = useState(false);
    const [ place_selected, changeSelected ] = useState('');
    const [ place_codigo_ibge, changeIbgeCode ] = useState('');
    const [ cases_list, setCasesList ] = useState([]);

    useEffect(() => {
        loadConf();
    },[])

    useEffect(() => {
        if( place_codigo_ibge.length > 0 ){
            general.getDengueList( place_codigo_ibge ).then((res) => {
                const updated_cases = res.slice(Math.max(res.length - 5, 0)).map((item) => {
                    const d = new Date(parseInt(item['date']));
                    item['date'] = moment(d).format("DD-MM");
                    return item;
                });
                console.log( updated_cases )
                setCasesList( updated_cases );
            });
        }
    }, [place_codigo_ibge])

    const loadConf = async() => {
        const data = JSON.parse(await AsyncStorage.getItem('weather_data'));
        changeSelected( data['locale_name'] );
        changeIbgeCode( general.getGeocode( data['locale_name'] )+"" );
    }
    
    const goback = () => {
        props.navigation.goBack();
    }

    const custom_info = ( val1, val2 ) => {
        const result = parseInt(val1) - parseInt(val2);
        if( result == undefined ) return 0;
        else if( result < 0 ) return `-${result}`;
        else return `+${result}`;
    }

    const contentInset = { top: 20, bottom: 20 };
    
    return(
        <ImageBackground source={gradient} style={styles.image}>
            <Container>
                <Header>
                    <TouchableOpacity onPress={goback}>
                        <Icon name={'chevron-left'} size={35} color="rgba(255,255,255,0.54)" />
                    </TouchableOpacity>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 35}}>
                        <Text style={styles.text}>{t('city_info')}</Text>
                    </View>
                </Header>
                <View style={{padding: 10}}>
                    <Text style={styles.text}>{t('select_city')}</Text>
                    <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.picker}>
                        <Text style={{color: '#c4c4c4', marginLeft: 5, fontWeight: 'bold'}}>{place_selected}</Text>
                    </TouchableOpacity>
                    <Text style={{marginTop: 15, color: '#D4D4D4'}}>{t('last_updates')}</Text>
                    { cases_list.length > 0 &&
                        <View style={{flexDirection: 'column'}}>
                        <View style={{ height: 150, flexDirection: 'row' }}>
                            <YAxis
                                data={cases_list.map((item) => item.cases)}
                                contentInset={contentInset}
                                svg={{
                                    fill: 'grey',
                                    fontSize: 10,
                                }}
                                numberOfTicks={cases_list.length}
                                formatLabel={(item) => `${item}`}
                            />
                            <LineChart
                                style={{ flex: 1, marginLeft: 16 }}
                                data={cases_list.map((item) => item.cases)}
                                numberOfTicks={cases_list.length}
                                svg={{ stroke: 'rgb(134, 65, 244)' }}
                                contentInset={contentInset}
                            >
                                <Grid />
                            </LineChart>
                        </View>
                        <XAxis
                            style={{marginHorizontal: -10}}
                            data={cases_list.map((item) => item.date)}
                            formatLabel={item => cases_list[item].date}
                            numberOfTicks={cases_list.length}
                            contentInset={{left: 40, right: 20}}
                            svg={{
                                fontSize: 10,
                                fill: '#b4b4b4',
                                fontWeight: 'bold',
                                rotation: 0,
                            }}
                            />
                    </View>
                    }
                    <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Card>
                            <Text style={styles.number_highlight}>{cases_list.length > 0 ? cases_list[cases_list.length-1]['cases'] : 0}</Text>
                            <Text style={styles.text}>{t('infected')}</Text>
                        </Card>
                        <Card>
                            <Text style={styles.number_highlight}>{(cases_list.length > 0 && cases_list[cases_list.length-1]['tempmin']) ? cases_list[cases_list.length-1]['tempmin']+"º" : 0}</Text>
                            <Text style={styles.text}>{t('min_temp')}</Text>
                        </Card>
                    </View>
                    <Text style={{flex: 1,marginTop: 10, color: "#fff"}}>{t('prev_compared')}</Text>
                    <View style={{marginTop: 10}}>
                        <View style={{backgroundColor: 'rgba(196,196,196, 0.04)', padding: 5}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon
                                name={'arrow-back'}
                                style={{transform: [{ rotate: "90deg" }] }}
                                size={22}
                                color="rgba(255,255,255,0.54)" />
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{marginLeft: 10, color: '#fff'}}>{cases_list.length > 1 ? custom_info(cases_list[cases_list.length-1]['cases'],cases_list[cases_list.length-2]['cases']) : 0}</Text>
                                    <Text style={{marginLeft: 10, color: '#fff'}}>{t('infected')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Container>
            <Modal
            onRequestClose={() => setMenuOpen(false)}
            onBackdropPress={() => setMenuOpen(false)}
            isVisible={menu_open}>
                <View style={{flex: 1}}>
                    <LocalitySearch
                    close={() => setMenuOpen(false)}
                    selected={place_selected}
                    codigo_ibge={place_codigo_ibge}
                    changeIbgeCode={changeIbgeCode}
                    changeSelected={changeSelected} />
                </View>
            </Modal>
        </ImageBackground>
    )
}

const styles = {
    text: {
        color: "#fff"
    },
    textInput: {
        paddingLeft: 10,
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    picker: {
        padding: 13,
        marginTop: 5,
        paddingLeft: 5,
        backgroundColor: 'rgba(164,162,162, 0.05)'
    },
    number_highlight: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 25
    },
}

export default CityInfo;