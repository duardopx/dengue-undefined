import Config from "react-native-config";
import list_geocode from '~/lib/municipios.json';

let serverUrl = Config.SERVER_URL || "localhost:3000";

class General {

    forecast = async(temp, population) => {
        let result = {};
        await fetch(`${serverUrl}/forecast?temp=${temp}&population=${population}`)
        .then((res) => result = res.json());
        return result;
    }

    getWeather = async(lat, lng) => {
        let result = {};
        await fetch(`${serverUrl}/weather?lat=${lat}&lng=${lng}`)
        .then((res) => result = res.json());
        return result;
    };

    getDengueList = async( ibge_code ) => {
        if( ibge_code != null)
        {
            const res = await fetch(`${serverUrl}/dengue?geocode=${ibge_code}`).then((res) => res.json());
            if(res && res.length > 0)
            {
                return res;
            }
            else{
                return [];
            } 
        } else{
            return [];
        }
    }

    getInfoDengue = async( place_target ) => {
        const geocode = this.getGeocode( place_target );
        const default_cases = {
            'cases': '0',
            'tempmin': ''
        }
        if( geocode != null)
        {
            const res = await fetch(`${serverUrl}/dengue?geocode=${geocode}`).then((res) => res.json());
            if(res && res.length > 0)
            {
                return {
                    'cases': res[res.length-1]['cases'],
                    'tempmin': res[res.length-1]['tempmin']
                }
            }
            else{
                return default_cases;
            } 
        }
        else{
            return default_cases;
        }
    }

    getGeocode = ( name ) => {
        const target_name = name.toLowerCase();
        for( var i = 0; i < list_geocode.length; i++)
        {
            if( target_name === list_geocode[i]['nome'].toLowerCase())
            {
                return list_geocode[i]['codigo_ibge'];
            }
        }
        return null;
    }
}

class AuxGeneral {
    static general_config = null;

    static Config(){
        if( AuxGeneral.general_config == null)
        {
            AuxGeneral.general_config = new General();
        }
        return AuxGeneral.general_config;
    }
}

export default AuxGeneral.Config();