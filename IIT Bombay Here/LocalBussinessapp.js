import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';

const LocalBusinessApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://places.ls.hereapi.com/places/v1/discover/search?at=37.7749,-122.4194&q=${query}&apiKey=ABW-c3t9gCx42-l_RbvLkw`
      );

      setResults(response.data.results.items);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, paddingLeft: 8 }}
        placeholder="Search for local businesses"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <Button title="Search" onPress={handleSearch} />
      
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text>{item.title}</Text>
            <Text>Category: {item.category.title}</Text>
            <Text>Address: {item.address.label}</Text>
            <Text>Rating: {item.averageRating}</Text>
            <Button
              title="View on Map"
              onPress={() => setSelectedPlace(item)}
            />
          </View>
        )}
      />

      {selectedPlace && (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: selectedPlace.position[0],
              longitude: selectedPlace.position[1],
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedPlace.position[0],
                longitude: selectedPlace.position[1],
              }}
              title={selectedPlace.title}
              description={selectedPlace.address.label}
            />
          </MapView>
        </View>
      )}
    </View>
  );
};

export default LocalBusinessApp;
