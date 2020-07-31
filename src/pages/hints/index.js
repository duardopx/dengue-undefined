import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Container, Header, Card } from "./styles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import gradient from '~/assets/temp.jpg';
import healthy_lifestyle from '~/assets/healthy_lifestyle.png';
import Collapsible from 'react-native-collapsible';
import { useTranslation } from 'react-i18next';

function Hints(props) {

    const { t, i18n } = useTranslation();

    const options = [
    {
        id: "quest1",
        title: t("quest1"),
        description: t("quest1_resp"),
    },
    {
        id: "quest2",
        title: t("quest2"),
        description: t("quest2_resp"),
    },
    {
        id: "quest3",
        title: t("quest3"),
        description: t("quest3_resp"),
    },
    {
        id: "quest4",
        title: t("quest4"),
        description: t("quest4_resp"),
    },
    ];

    const [collapsed, setCollapsed] = useState({
        quest1: true,
        quest2: true,
        quest3: true,
        quest4: true,
    });

    const goback = () => {
        props.navigation.goBack();
    }

    const toggleExpanded = prop => {
        setCollapsed({
            ...collapsed,
            [prop]: !collapsed[prop]
        })
    }

    return(
        <ImageBackground source={gradient} style={styles.image}>
            <Container>
                <Header>
                    <TouchableOpacity onPress={goback}>
                        <Icon name={'chevron-left'} size={30} color="rgba(255,255,255,0.54)"/>
                    </TouchableOpacity>
                </Header>
                <View style={{padding: 10}}>
                    <Image source={healthy_lifestyle} style={styles.image_feature} resizeMode="contain" />
                    <Text style={{color: '#FFF', fontSize: 20, fontWeight: 'bold', display: 'flex', textAlign: 'center', marginBottom: 15}}>{t('hints')}</Text>
                    {options.map((item, index) => {
                        return(
                            <View style={{marginBottom: 10}} key={index}>
                                <View style={{borderColor: "rgba(255,255,255, 0.08)", borderWidth: 1, padding: 11}}>
                                    <TouchableOpacity onPress={() => toggleExpanded(item.id)} style={{flexDirection: 'row'}}>
                                        <Icon style={{marginRight: 10}} name={collapsed[ item.id ] ? 'chevron-right': 'keyboard-arrow-up'} size={30} color="rgba(255,255,255,0.54)"/>
                                        <Text style={{color: "#b2b1b7", fontSize: 12, marginRight: 30}}>{item.title}</Text>
                                    </TouchableOpacity>
                                    <Collapsible collapsed={collapsed[ item.id ]}>
                                        <Text style={{marginLeft: 37, marginRight: 30, marginTop: 15, color: '#b4e3e6', fontSize: 12}}>{item.description}</Text>
                                    </Collapsible>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </Container>
        </ImageBackground>  
    );
}

const styles = {
    title:{
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    image_feature: {
        width: '100%',
        height: 150,
        marginBottom: 20
    }
}

export default Hints;