import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet,  ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { Button } from "react-native-paper";

const BookDetail = ({ route, navigation }) => {
  const { bookId } = route.params; // Assuming you are passing the bookId via navigation
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch book details when component is mounted
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.166.27:4444/book/${bookId}`);
        if (response.data.status === "success") {
          setBook(response.data.data);  // Assuming response contains book details in 'data'
        } else {
          setError("Book not found");
        }
      } catch (err) {
        setError("Error fetching book details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return (
      <View style={styles.container}>
       
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <Text style={styles.price}>Price: ${book.price}</Text>
      <Text style={styles.stock}>Stock Quantity: {book.stock_quantity}</Text>
      
      <Button
        mode="contained"
        onPress={() => {
            Alert.alert("order successfully placed");
        }}
        style={styles.button}
      >
        order now
      </Button>
      
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fc",
  },
  bookImage: {
    width: 200,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    marginBottom: 10,
    color: "#6c757d",
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
    color: "#28a745",
  },
  stock: {
    fontSize: 18,
    marginBottom: 20,
    color: "#dc3545",
  },
  button: {
    marginVertical: 10,
    width: "80%",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default BookDetail;
