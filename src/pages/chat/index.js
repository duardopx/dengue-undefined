import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Container, Header } from "./styles";
import Icon from 'react-native-vector-icons/MaterialIcons';

function Chat(){
    return(
        <Container>
            <Header>
                <Icon name={'chevron-left'} size={35} color="rgba(255,255,255,0.54)" />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.text}>Helper Bot</Text>
                </View>
                <Icon name={'more-vert'} size={35} color="rgba(255,255,255,0.54)" />
            </Header>
            <View style={{flex: 1, backgroundColor: '#E7E3E3'}}>
                
            </View>
            <View style={{backgroundColor: '#D2CFCF', flexDirection: 'row', padding: 2}}>
                <TextInput 
                style={styles.textInput}
                placeholder={'Say something...'}
                />
                <Icon name={'send'} size={30} color="#999" style={{marginTop: 8, marginRight: 10}} />
            </View>
        </Container>
    )
}

const styles = {
    text: {
        color: "#fff"
    },
    textInput: {
        paddingLeft: 10,
        flex: 1,
    }
}

export default Chat;