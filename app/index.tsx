// import './gesture-handler'
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Signup from './Signup';

type DrawerParamList = {
  MainContent: undefined;
  Profile: undefined;
  Bookmarks: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const CustomDrawerContent = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  return (
    <View style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('../assets/images/profile.jpg')}
          style={styles.drawerProfileImage}
        />
        <Text style={styles.drawerName}>Your Name</Text>
        <Text style={styles.drawerEnrollment}>EN: 123456789</Text>
      </View>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color="#fff" />
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Bookmarks')}>
        <Ionicons name="bookmark-outline" size={24} color="#fff" />
        <Text style={styles.drawerItemText}>Bookmarks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings-outline" size={24} color="#fff" />
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const MainContent = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const renderPost = () => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.postUserImage}
          />
          <View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userStats}>200 followers • 150 following</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
      </View>
      
      <Image
        source={{ uri: 'https://via.placeholder.com/300' }}
        style={styles.postImage}
      />
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="person-add-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.profileSection}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Your Name</Text>
            <Text style={styles.enrollmentNo}>EN: 123456789</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderPost()}
        {renderPost()}
        {renderPost()}
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.text}>Profile Screen</Text>
  </SafeAreaView>
);

const BookmarksScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.text}>Bookmarks Screen</Text>
  </SafeAreaView>
);

const SettingsScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.text}>Settings Screen</Text>
  </SafeAreaView>
);

const HomeScreen = () => {
  return (
    <Drawer.Navigator
      backBehavior="history"
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#1a1a1a',
          width: 280,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="MainContent" component={MainContent} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Bookmarks" component={BookmarksScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  enrollmentNo: {
    color: '#666',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  postContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStats: {
    color: '#666',
    fontSize: 12,
  },
  helpButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  helpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionButton: {
    padding: 8,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  drawerHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  drawerProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  drawerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerEnrollment: {
    color: '#666',
    fontSize: 14,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  drawerItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 