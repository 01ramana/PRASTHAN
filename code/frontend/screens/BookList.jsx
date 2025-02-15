import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';

const BookList = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:4444/book/all');
      if (response.data.status === "success") {
        setBooks(response.data.data);  
      } else {
        setError("Failed to load books.");
      }
    } catch (err) {
      setError("Error fetching books");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookClick = (bookId) => {
   
    navigation.navigate('go-bookdetails', { bookId });
  };



  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by title"
        value={searchTerm}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.book_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBookClick(item.book_id)} style={styles.bookItem}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>by {item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f8fc',
  },
  searchInput: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  bookItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 1,  // Adds shadow to the book items
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default BookList;
