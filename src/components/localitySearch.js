import React, { useState } from 'react';
import all_locations from '~/lib/municipios.json';
import { FlatList, View, TextInput, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function LocalitySearch(props){

    const { t, i18n } = useTranslation();

    const [inputSearch, setInputSearch] = useState(props.selected);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
        onPress={() => {
            props.changeSelected(item.nome);
            props.changeIbgeCode(item.codigo_ibge+"");
            props.close();
        }}
        style={props.codigo_ibge==item.codigo_ibge ? styles.selected : styles.button}>
            <Text style={props.codigo_ibge==item.codigo_ibge ? styles.text_selected : {color: '#555'}}>{item.nome}</Text>
        </TouchableOpacity>
    );

    const filtered_data = all_locations.filter((item) => item.nome.length > 0 && item.nome.toLowerCase().includes(inputSearch.toLowerCase()));
    
    return(
        <View style={styles.container}>
            <View style={{margin: 5}}>
                <Text style={{color: "#333", marginBottom: 5, marginTop: 5}}>{t('search_city')}</Text>
                <TextInput
                    style={{ paddingLeft: 10,height: 40, backgroundColor: '#cac5c5', marginBottom: 5}}
                    onChangeText={text => setInputSearch(text)}
                    value={inputSearch}
                    />
            </View>
            <View>
                {filtered_data.length > 0 ?
                <FlatList
                    data={filtered_data}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.codigo_ibge}`}
                />
                :
                <View>

                </View>
                }
            </View>
        </View>
    )
}

const styles = {
    container: {
        backgroundColor: '#fff'
    },
    selected: {
        backgroundColor: "#314277",
        padding: 10,
        borderColor: '#e3e2e24f',
        borderWidth: 1
    },
    button: {
        padding: 10,
        borderColor: '#e3e2e24f',
        borderWidth: 1
    },
    text_selected:{
        color: "#fff"
    }
}

LocalitySearch.propTypes = {
    selected: PropTypes.string,
    changeSelected: PropTypes.func,
};

export default LocalitySearch;