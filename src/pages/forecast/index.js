import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import gradient from '~/assets/temp.jpg';
import progress_data from '~/assets/progress_data.png';
import { Header, Container } from './styles.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import LocalitySearch from '~/components/localitySearch';
import Modal from 'react-native-modal';
import population_data from '~/lib/population_data.json';
import general from '../../general.js';

function Forecast(props)
{
    const { t, i18n } = useTranslation();
    const [ menu_open, setMenuOpen ] = useState(false);
    const [ place_codigo_ibge, changeIbgeCode ] = useState('');

    const [ error_message, setErrorMessage ] = useState('');
    const [ result_message, setResultMessage ] = useState('');

    const [citySelected, setCitySelected] = useState('');
    const [input, setInput] = React.useState('');

    const predictCases = async() => {
        if( input.length > 0 && citySelected.length > 0 )
        {
            const pop = population_data[citySelected];
            const temp = input;

            const json_forecast = await general.forecast(temp, pop);
            const cases_result = json_forecast['values'][0][0];

            setErrorMessage("");
            setResultMessage(t('expected_cases')+" "+cases_result.toFixed(2));
        }else{
            setResultMessage("");
            setErrorMessage( t("error_fill_all") );
        }
    }

    const onTextChange = (text) => {
        var regex = /^[-+]?\d*\.?\d*$/;
        if( regex.test(text)) setInput(text);
    }

    const goback = () => {
        props.navigation.goBack();
    }

    return(
        <ImageBackground source={gradient} style={styles.image}>
            <Container>
            <Header>
                <TouchableOpacity onPress={goback}>
                    <Icon name={'chevron-left'} size={30} color="rgba(255,255,255,0.54)"/>
                </TouchableOpacity>
            </Header>
            <View style={{flex: 1, padding: 10}}>
                <View style={{marginTop: 50}}>
                    <Image source={progress_data} style={{height: 100, width: '100%'}} resizeMode="contain" />
                </View>
                <Text style={styles.title}>{t('forecast_page')}</Text>
                <Text style={styles.text}>{t('forecast_page_desc')}</Text>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.button}>
                        <Text style={{color: "#fff"}}>{citySelected.length > 0 ? citySelected : t('select_city')}</Text>
                    </TouchableOpacity>
                    <TextInput
                    style={styles.textInput}
                    value={input}
                    placeholder={'Average temperature'}
                    onChangeText={onTextChange}
                    keyboardType = 'numeric'
                    style={styles.input} />
                </View>
                <TouchableOpacity
                onPress={predictCases}
                style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: "orange"
                }}>
                    <Text style={{color: "#333", fontWeight: 'bold', textAlign: 'center'}}>{t('predict')}</Text>
                </TouchableOpacity>
                
                {error_message.length > 0 &&
                <Text style={styles.error}>{error_message}</Text>}
                
                {result_message.length > 0 &&
                <>
                    <Text style={{marginTop: 10, color: "#fff"}}>{t('result')}:</Text>
                    <Text style={styles.result}>{result_message}</Text>
                </>
                }
            </View>
            </Container>
            <Modal
            onRequestClose={() => setMenuOpen(false)}
            onBackdropPress={() => setMenuOpen(false)}
            isVisible={menu_open}>
                <View style={{flex: 1}}>
                    <LocalitySearch
                    close={() => setMenuOpen(false)}
                    selected={citySelected}
                    codigo_ibge={place_codigo_ibge}
                    changeIbgeCode={changeIbgeCode}
                    changeSelected={setCitySelected} />
                </View>
            </Modal>

        </ImageBackground>
    )
}

const styles = {
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    result: {
        marginTop: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: 8,
        color: '#fff'
    },
    error:{
        color: '#e8d42f',
        marginTop: 10
    },
    title: {
        color: "#fff",
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 15
    },
    text: {
        color: "#fff"
    },
    button:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: 10,
        flex: 1,
        marginRight: 5
    },
    input: {
        marginLeft: 5,
        flex: 1,
        backgroundColor: "#fff",
    }
}

export default Forecast;