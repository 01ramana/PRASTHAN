import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import BookList from "./BookList";
import Register from "./Register";
import BookDetail from "./BookDetails";
// import LoginScreen from "./Login";

function Launcher(){
    var Stack = createNativeStackNavigator()
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="go-login" component={Login} />  
                <Stack.Screen name="go-booklist" component={BookList} />  
                <Stack.Screen name="go-register" component={Register} />  
                <Stack.Screen name="go-bookdetails" component={BookDetail} />  
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Launcher;