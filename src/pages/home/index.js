import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Container, Header, Card } from "./styles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import gradient from '~/assets/temp.jpg';

function Home(props) {

    const menu_options = [
        {
            icon_name: "directions-car",
            title: "Will you travel?",
            description: "check the numbers of dengue cases",
        },
        {
            icon_name: "report",
            title: "Report a case",
            description: "Sick or found a place that needs attention?",
        },
        {
            icon_name: "location-city",
            title: "Precipitation Rank",
            description: "Check the regions classificed by precipitation",
        },
        {
            icon_name: "live-help",
            title: "Some tips",
            description: "Check out some tips and curiosities.",
        },
    ];

    return(
        <ImageBackground source={gradient} style={styles.image}>
            <Container>
                <Header>
                    <TouchableOpacity>
                        <Icon name={'menu'} size={30} color="rgba(255,255,255,0.54)"/>
                    </TouchableOpacity>
                </Header>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                        <Icon name={"wb-sunny"} size={50} color="#FFF503" style={{marginRight: 10}} />
                        <View>
                            <Text style={styles.text}>Natal - RN</Text>
                            <Text style={styles.text}>Brazil</Text>
                        </View>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <View style={{marginBottom: 10}}>
                            <Text style={styles.title}>About your city</Text>
                            <Text style={styles.text}>Last 30 days</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Card>
                                <Text style={styles.number_highlight}>25</Text>
                                <Text style={styles.text}>Infected</Text>
                            </Card>
                            <Card>
                                <Text style={styles.number_highlight}>40</Text>
                                <Text style={styles.text}>Focus</Text>
                            </Card>
                        </View>
                    </View>
                    <View >
                        {
                        menu_options.map((item, index) => {
                            return(
                                <TouchableOpacity style={{flexDirection: 'row'}} key={index}>
                                    <View style={styles.menu_icon}>
                                        <Icon name={item.icon_name} size={35} color="#999" />
                                    </View>
                                    <View>
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
        </ImageBackground>  
    );
}

const styles = {
    title:{
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
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
    }
}

export default Home;