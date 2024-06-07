import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Scrollbar } from 'react-scrollbars-custom';

export default function Events({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState([]); 
  const [participationStatus, setParticipationStatus] = useState({}); 

  useEffect(() => {
    if (route && route.params && route.params.email) {
      setEmail(route.params.email);
      teste = route.params.email;
    } else {
      console.error('Email não encontrado em route.params:', route);
    }
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/events');
        const data = await response.json();
        setEvents(data);


        const participationStatuses = {};
        for (const event of data) {
          const isParticipant = await checkParticipant(event.evento_id,teste);
          participationStatuses[event.evento_id] = isParticipant;
        }
        setParticipationStatus(participationStatuses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); 
  }, []);

  const checkParticipant = async (eventoID,teste) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/check-participant?eventoID=${eventoID}&email=${teste}`);
      if (response.status === 200) {
        return true;
      } else {
        const addParticipantResponse = await fetch('http://127.0.0.1:5000/add-participant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventoID, email }),
        });
        if (addParticipantResponse.status === 201) {
          alert("Presença confirmada com sucesso, será enviado um email com mais informações!")
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  const deleteParticipant = async (eventoID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-participant`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventoID, email }),
      });
      if (response.status === 200) {
        alert("Evento desistido com sucesso!")
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const renderItem = (item) => {
    const isParticipant = participationStatus[item.evento_id];
    return (
      <View style={styles.itemContainer} key={item.evento_id}>
        <Image
          source={{ uri: `../API/uploads/${item.caminho_imagem.replace(/\s/g, '_')}` }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>Nome: {item.nome}</Text>
          <Text style={styles.location}>Local: {item.local}</Text>
          <Text style={styles.pollutionLevel}>Nível de sujeira: {item.nivel_sujeira}</Text>
          <Text style={styles.pollutionLevel}>Participantes confirmados: {item.numero_de_emails}</Text>
          <Button
            title={isParticipant ? 'Desistir' : 'Quero Participar'}
            onPress={async () => {
              if (isParticipant) {
                const success = await deleteParticipant(item.evento_id);
                if (success) {
                  setParticipationStatus({ ...participationStatus, [item.evento_id]: false });
                 
                }
              } else {
                const participantAdded = await checkParticipant(item.evento_id);
                if (participantAdded) {
                  setParticipationStatus({ ...participationStatus, [item.evento_id]: true });
                }
              }
            }}
            color={isParticipant ? "#FF6347" : "#1E90FF"}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <Scrollbar style={styles.scrollbar}>
        {events.map(event => renderItem(event))}
      </Scrollbar>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  scrollbar: {
    width: '100%',
    height: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 360,
    height: 360,
    marginRight: 20,
    borderRadius: 10,
    objectFit: 'cover',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    marginBottom: 5,
  },
  pollutionLevel: {
    fontSize: 16,
    marginBottom: 15,
  },
});
